import { transformerNotationHighlight } from '@shikijs/transformers'
import { findChildren } from '@tiptap/core'
import { Node as ProsemirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey, PluginView } from '@tiptap/pm/state'
import type { DecorationAttrs } from '@tiptap/pm/view'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import type { Element } from 'hast'
import { BundledLanguage, BundledTheme, codeToHast } from 'shiki'
import {
  getShiki,
  initHighlighter,
  loadLanguage,
  loadTheme,
} from './highlighter'

/** Create code decorations for the current document */
function getDecorations({
  doc,
  name,
  defaultTheme,
  defaultLanguage,
}: {
  doc: ProsemirrorNode
  name: string
  defaultLanguage: BundledLanguage | null | undefined
  defaultTheme: BundledTheme
}) {
  let decorations: Decoration[] = []
  const children = findChildren(doc, (node) => node.type.name === name)
  console.log('children', children)
  children.forEach((block) => {
    let language = block.node.attrs.language || defaultLanguage
    let theme = block.node.attrs.theme || defaultTheme

    const highlighter = getShiki()

    if (!highlighter) return

    if (!highlighter.getLoadedLanguages().includes(language)) {
      language = 'plaintext'
    }

    const themeToApply = highlighter.getLoadedThemes().includes(theme)
      ? theme
      : highlighter.getLoadedThemes()[0]

    const themeResolved = highlighter.getTheme(themeToApply)

    console.log('block.node.textContent', block.node.textContent)
    console.log(
      'cooooode to hast',
      codeToHast(block.node.textContent, {
        theme: themeResolved,
        lang: block.node.attrs.language,
        transformers: [transformerNotationHighlight()],
      }),
    )
    const result = highlighter!.codeToHast(block.node.textContent, {
      theme: themeResolved,
      lang: block.node.attrs.language,
      transformers: [transformerNotationHighlight()],
    })
    console.log('result codeToHast', result)
    const preNode = highlighter!.codeToHast(block.node.textContent, {
      theme: themeResolved,
      lang: block.node.attrs.language,
      transformers: [transformerNotationHighlight()],
    }).children[0] as Element

    decorations.push(
      Decoration.node(block.pos, block.pos + block.node.nodeSize, {
        class: `${preNode.properties?.class} node-editor__code-block-shiki`,
        style: preNode.properties?.style,
      } as DecorationAttrs),
    )

    let from = block.pos + 1
    const lines = (preNode.children[0] as Element).children
    console.log('lines', lines)
    for (const line of lines) {
      if ((line as Element).children?.length) {
        let lineFrom = from
        // @ts-expect-error line type
        line.children?.forEach((node) => {
          const nodeLen = node.children[0].value.length
          decorations.push(
            Decoration.inline(
              lineFrom,
              lineFrom + nodeLen,
              (node as Element).properties as DecorationAttrs,
            ),
          )
          lineFrom += nodeLen
        })

        // prosemirror do not support add wrap for line
        // decorations.push(Decoration.inline(from, lineFrom, line.properties as DecorationAttrs))
        from = lineFrom
      } else if (line.type === 'text') {
        from += line.value.length
      }
    }
  })

  console.log('decorations', decorations)

  decorations = decorations.filter((item) => !!item)

  return DecorationSet.create(doc, decorations)
}

export function ShikiPlugin({
  name,
  defaultLanguage,
  defaultTheme,
}: {
  name: string
  defaultLanguage: BundledLanguage | null | undefined
  defaultTheme: BundledTheme
}) {
  const shikiPlugin: Plugin<any> = new Plugin({
    key: new PluginKey('shiki'),

    view(view) {
      // This small view is just for initial async handling
      class ShikiPluginView implements PluginView {
        constructor() {
          this.initDecorations()
        }

        update() {
          this.checkUndecoratedBlocks()
        }
        destroy() {}

        // Initialize shiki async, and then highlight initial document
        async initDecorations() {
          const doc = view.state.doc
          console.log('initDecorations doc', doc)
          await initHighlighter({ doc, name, defaultLanguage, defaultTheme })
          const tr = view.state.tr.setMeta('shikiPluginForceDecoration', true)
          view.dispatch(tr)
        }

        // When new codeblocks were added and they have missing themes or
        // languages, load those and then add code decorations once again.
        async checkUndecoratedBlocks() {
          const codeBlocks = findChildren(
            view.state.doc,
            (node) => node.type.name === name,
          )

          // Load missing themes or languages when necessary.
          // loadStates is an array with booleans depending on if a theme/lang
          // got loaded.
          const loadStates = await Promise.all(
            codeBlocks.flatMap((block) => [
              loadTheme(block.node.attrs.theme),
              loadLanguage(block.node.attrs.language),
            ]),
          )
          const didLoadSomething = loadStates.includes(true)

          // The asynchronous nature of this is potentially prone to
          // race conditions. Imma just hope it's fine lol

          if (didLoadSomething) {
            const tr = view.state.tr.setMeta('shikiPluginForceDecoration', true)
            view.dispatch(tr)
          }
        }
      }

      return new ShikiPluginView()
    },

    state: {
      init: (_, { doc }) => {
        console.log('initdd', doc)
        return getDecorations({
          doc,
          name,
          defaultLanguage,
          defaultTheme,
        })
      },
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name
        const newNodeName = newState.selection.$head.parent.type.name
        const oldNodes = findChildren(
          oldState.doc,
          (node) => node.type.name === name,
        )
        const newNodes = findChildren(
          newState.doc,
          (node) => node.type.name === name,
        )
        console.log('oldNodes', oldNodes)
        console.log('newNodes', newNodes)
        console.log('apply')

        const didChangeSomeCodeBlock =
          transaction.docChanged &&
          // Apply decorations if:
          // selection includes named node,
          ([oldNodeName, newNodeName].includes(name) ||
            // OR transaction adds/removes named node,
            newNodes.length !== oldNodes.length ||
            // OR transaction has changes that completely encapsulte a node
            // (for example, a transaction that affects the entire document).
            // Such transactions can happen during collab syncing via y-prosemirror, for example.
            transaction.steps.some((step) => {
              return (
                // @ts-ignore
                step.from !== undefined &&
                // @ts-ignore
                step.to !== undefined &&
                oldNodes.some((node) => {
                  // @ts-ignore
                  return (
                    // @ts-ignore
                    node.pos >= step.from &&
                    // @ts-ignore
                    node.pos + node.node.nodeSize <= step.to
                  )
                })
              )
            }))

        // only create code decoration when it's necessary to do so
        if (
          transaction.getMeta('shikiPluginForceDecoration') ||
          didChangeSomeCodeBlock
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage,
            defaultTheme,
          })
        }

        return decorationSet.map(transaction.mapping, transaction.doc)
      },
    },

    props: {
      decorations(state) {
        console.log('decorations', state)
        console.log('shikiPlugin.getState(state)', shikiPlugin.getState(state))
        return shikiPlugin.getState(state)
      },
    },
  })

  return shikiPlugin
}
