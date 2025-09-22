import { Plugin as $, PluginKey as I, Selection as j, TextSelection as v, NodeSelection as fe, AllSelection as Ee } from "@tiptap/pm/state";
import { DecorationSet as Oe, Decoration as ne } from "@tiptap/pm/view";
import "@tiptap/pm/keymap";
import { Fragment as L, Slice as $e, Node as Ie, Schema as Ne, DOMParser as J } from "@tiptap/pm/model";
import { canSplit as H, joinPoint as pe, liftTarget as Pe, canJoin as me, ReplaceStep as Be, ReplaceAroundStep as je } from "@tiptap/pm/transform";
import { wrapIn as Le, setBlockType as re, selectTextblockStart as Fe, selectTextblockEnd as Re, selectParentNode as De, selectNodeForward as _e, selectNodeBackward as ze, newlineInCode as He, liftEmptyBlock as We, lift as Ke, joinUp as Ve, joinTextblockForward as Je, joinTextblockBackward as Ue, joinForward as Ge, joinDown as qe, joinBackward as Qe, exitCode as Xe, deleteSelection as Ye, createParagraphNear as Ze } from "@tiptap/pm/commands";
import { wrapInList as et, sinkListItem as tt, liftListItem as nt } from "@tiptap/pm/schema-list";
import { bundledThemes as he, bundledLanguages as ge, createHighlighter as rt, codeToHast as ot } from "shiki";
function ye(e) {
  const { state: t, transaction: n } = e;
  let { selection: r } = n, { doc: o } = n, { storedMarks: s } = n;
  return {
    ...t,
    apply: t.apply.bind(t),
    applyTransaction: t.applyTransaction.bind(t),
    plugins: t.plugins,
    schema: t.schema,
    reconfigure: t.reconfigure.bind(t),
    toJSON: t.toJSON.bind(t),
    get storedMarks() {
      return s;
    },
    get selection() {
      return r;
    },
    get doc() {
      return o;
    },
    get tr() {
      return r = n.selection, o = n.doc, s = n.storedMarks, n;
    }
  };
}
class st {
  constructor(t) {
    this.editor = t.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = t.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: t, editor: n, state: r } = this, { view: o } = n, { tr: s } = r, i = this.buildProps(s);
    return Object.fromEntries(Object.entries(t).map(([a, c]) => [a, (...d) => {
      const u = c(...d)(i);
      return !s.getMeta("preventDispatch") && !this.hasCustomState && o.dispatch(s), u;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(t, n = !0) {
    const { rawCommands: r, editor: o, state: s } = this, { view: i } = o, a = [], c = !!t, l = t || s.tr, d = () => (!c && n && !l.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(l), a.every((f) => f === !0)), u = {
      ...Object.fromEntries(Object.entries(r).map(([f, p]) => [f, (...m) => {
        const h = this.buildProps(l, n), y = p(...m)(h);
        return a.push(y), u;
      }])),
      run: d
    };
    return u;
  }
  createCan(t) {
    const { rawCommands: n, state: r } = this, o = !1, s = t || r.tr, i = this.buildProps(s, o);
    return {
      ...Object.fromEntries(Object.entries(n).map(([c, l]) => [c, (...d) => l(...d)({ ...i, dispatch: void 0 })])),
      chain: () => this.createChain(s, o)
    };
  }
  buildProps(t, n = !0) {
    const { rawCommands: r, editor: o, state: s } = this, { view: i } = o, a = {
      tr: t,
      editor: o,
      view: i,
      state: ye({
        state: s,
        transaction: t
      }),
      dispatch: n ? () => {
      } : void 0,
      chain: () => this.createChain(t, n),
      can: () => this.createCan(t),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([c, l]) => [c, (...d) => l(...d)(a)]));
      }
    };
    return a;
  }
}
function b(e, t, n) {
  return e.config[t] === void 0 && e.parent ? b(e.parent, t, n) : typeof e.config[t] == "function" ? e.config[t].bind({
    ...n,
    parent: e.parent ? b(e.parent, t, n) : null
  }) : e.config[t];
}
function it(e) {
  const t = e.filter((o) => o.type === "extension"), n = e.filter((o) => o.type === "node"), r = e.filter((o) => o.type === "mark");
  return {
    baseExtensions: t,
    nodeExtensions: n,
    markExtensions: r
  };
}
function k(e, t) {
  if (typeof e == "string") {
    if (!t.nodes[e])
      throw Error(`There is no node type named '${e}'. Maybe you forgot to add the extension?`);
    return t.nodes[e];
  }
  return e;
}
function at(...e) {
  return e.filter((t) => !!t).reduce((t, n) => {
    const r = { ...t };
    return Object.entries(n).forEach(([o, s]) => {
      if (!r[o]) {
        r[o] = s;
        return;
      }
      if (o === "class") {
        const a = s ? String(s).split(" ") : [], c = r[o] ? r[o].split(" ") : [], l = a.filter((d) => !c.includes(d));
        r[o] = [...c, ...l].join(" ");
      } else if (o === "style") {
        const a = s ? s.split(";").map((d) => d.trim()).filter(Boolean) : [], c = r[o] ? r[o].split(";").map((d) => d.trim()).filter(Boolean) : [], l = /* @__PURE__ */ new Map();
        c.forEach((d) => {
          const [u, f] = d.split(":").map((p) => p.trim());
          l.set(u, f);
        }), a.forEach((d) => {
          const [u, f] = d.split(":").map((p) => p.trim());
          l.set(u, f);
        }), r[o] = Array.from(l.entries()).map(([d, u]) => `${d}: ${u}`).join("; ");
      } else
        r[o] = s;
    }), r;
  }, {});
}
function ct(e) {
  return typeof e == "function";
}
function E(e, t = void 0, ...n) {
  return ct(e) ? t ? e.bind(t)(...n) : e(...n) : e;
}
function lt(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}
class dt {
  constructor(t) {
    this.find = t.find, this.handler = t.handler;
  }
}
function ut(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function _(e) {
  return ut(e) !== "Object" ? !1 : e.constructor === Object && Object.getPrototypeOf(e) === Object.prototype;
}
function Y(e, t) {
  const n = { ...e };
  return _(e) && _(t) && Object.keys(t).forEach((r) => {
    _(t[r]) && _(e[r]) ? n[r] = Y(e[r], t[r]) : n[r] = t[r];
  }), n;
}
class A {
  constructor(t = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...t
    }, this.name = this.config.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = E(b(this, "addOptions", {
      name: this.name
    }))), this.storage = E(b(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(t = {}) {
    return new A(t);
  }
  configure(t = {}) {
    const n = this.extend({
      ...this.config,
      addOptions: () => Y(this.options, t)
    });
    return n.name = this.name, n.parent = this.parent, n;
  }
  extend(t = {}) {
    const n = new A({ ...this.config, ...t });
    return n.parent = this, this.child = n, n.name = t.name ? t.name : n.parent.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = E(b(n, "addOptions", {
      name: n.name
    })), n.storage = E(b(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function ft(e, t, n) {
  const { from: r, to: o } = t, { blockSeparator: s = `

`, textSerializers: i = {} } = n || {};
  let a = "";
  return e.nodesBetween(r, o, (c, l, d, u) => {
    var f;
    c.isBlock && l > r && (a += s);
    const p = i == null ? void 0 : i[c.type.name];
    if (p)
      return d && (a += p({
        node: c,
        pos: l,
        parent: d,
        index: u,
        range: t
      })), !1;
    c.isText && (a += (f = c == null ? void 0 : c.text) === null || f === void 0 ? void 0 : f.slice(Math.max(r, l) - l, o - l));
  }), a;
}
function pt(e) {
  return Object.fromEntries(Object.entries(e.nodes).filter(([, t]) => t.spec.toText).map(([t, n]) => [t, n.spec.toText]));
}
A.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new $({
        key: new I("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: e } = this, { state: t, schema: n } = e, { doc: r, selection: o } = t, { ranges: s } = o, i = Math.min(...s.map((d) => d.$from.pos)), a = Math.max(...s.map((d) => d.$to.pos)), c = pt(n);
            return ft(r, { from: i, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: c
            });
          }
        }
      })
    ];
  }
});
const mt = () => ({ editor: e, view: t }) => (requestAnimationFrame(() => {
  var n;
  e.isDestroyed || (t.dom.blur(), (n = window == null ? void 0 : window.getSelection()) === null || n === void 0 || n.removeAllRanges());
}), !0), ht = (e = !1) => ({ commands: t }) => t.setContent("", e), gt = () => ({ state: e, tr: t, dispatch: n }) => {
  const { selection: r } = t, { ranges: o } = r;
  return n && o.forEach(({ $from: s, $to: i }) => {
    e.doc.nodesBetween(s.pos, i.pos, (a, c) => {
      if (a.type.isText)
        return;
      const { doc: l, mapping: d } = t, u = l.resolve(d.map(c)), f = l.resolve(d.map(c + a.nodeSize)), p = u.blockRange(f);
      if (!p)
        return;
      const g = Pe(p);
      if (a.type.isTextblock) {
        const { defaultType: m } = u.parent.contentMatchAt(u.index());
        t.setNodeMarkup(p.start, m);
      }
      (g || g === 0) && t.lift(p, g);
    });
  }), !0;
}, yt = (e) => (t) => e(t), kt = () => ({ state: e, dispatch: t }) => Ze(e, t), xt = (e, t) => ({ editor: n, tr: r }) => {
  const { state: o } = n, s = o.doc.slice(e.from, e.to);
  r.deleteRange(e.from, e.to);
  const i = r.mapping.map(t);
  return r.insert(i, s.content), r.setSelection(new v(r.doc.resolve(Math.max(i - 1, 0)))), !0;
}, wt = () => ({ tr: e, dispatch: t }) => {
  const { selection: n } = e, r = n.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const o = e.selection.$anchor;
  for (let s = o.depth; s > 0; s -= 1)
    if (o.node(s).type === r.type) {
      if (t) {
        const a = o.before(s), c = o.after(s);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, St = (e) => ({ tr: t, state: n, dispatch: r }) => {
  const o = k(e, n.schema), s = t.selection.$anchor;
  for (let i = s.depth; i > 0; i -= 1)
    if (s.node(i).type === o) {
      if (r) {
        const c = s.before(i), l = s.after(i);
        t.delete(c, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Mt = (e) => ({ tr: t, dispatch: n }) => {
  const { from: r, to: o } = e;
  return n && t.delete(r, o), !0;
}, Ct = () => ({ state: e, dispatch: t }) => Ye(e, t), bt = () => ({ commands: e }) => e.keyboardShortcut("Enter"), vt = () => ({ state: e, dispatch: t }) => Xe(e, t);
function K(e, t, n = { strict: !0 }) {
  const r = Object.keys(t);
  return r.length ? r.every((o) => n.strict ? t[o] === e[o] : lt(t[o]) ? t[o].test(e[o]) : t[o] === e[o]) : !0;
}
function ke(e, t, n = {}) {
  return e.find((r) => r.type === t && K(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(n).map((o) => [o, r.attrs[o]])),
    n
  ));
}
function oe(e, t, n = {}) {
  return !!ke(e, t, n);
}
function xe(e, t, n) {
  var r;
  if (!e || !t)
    return;
  let o = e.parent.childAfter(e.parentOffset);
  if ((!o.node || !o.node.marks.some((d) => d.type === t)) && (o = e.parent.childBefore(e.parentOffset)), !o.node || !o.node.marks.some((d) => d.type === t) || (n = n || ((r = o.node.marks[0]) === null || r === void 0 ? void 0 : r.attrs), !ke([...o.node.marks], t, n)))
    return;
  let i = o.index, a = e.start() + o.offset, c = i + 1, l = a + o.node.nodeSize;
  for (; i > 0 && oe([...e.parent.child(i - 1).marks], t, n); )
    i -= 1, a -= e.parent.child(i).nodeSize;
  for (; c < e.parent.childCount && oe([...e.parent.child(c).marks], t, n); )
    l += e.parent.child(c).nodeSize, c += 1;
  return {
    from: a,
    to: l
  };
}
function P(e, t) {
  if (typeof e == "string") {
    if (!t.marks[e])
      throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);
    return t.marks[e];
  }
  return e;
}
const Tt = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  const s = P(e, r.schema), { doc: i, selection: a } = n, { $from: c, from: l, to: d } = a;
  if (o) {
    const u = xe(c, s, t);
    if (u && u.from <= l && u.to >= d) {
      const f = v.create(i, u.from, u.to);
      n.setSelection(f);
    }
  }
  return !0;
}, At = (e) => (t) => {
  const n = typeof e == "function" ? e(t) : e;
  for (let r = 0; r < n.length; r += 1)
    if (n[r](t))
      return !0;
  return !1;
};
function we(e) {
  return e instanceof v;
}
function B(e = 0, t = 0, n = 0) {
  return Math.min(Math.max(e, t), n);
}
function Et(e, t = null) {
  if (!t)
    return null;
  const n = j.atStart(e), r = j.atEnd(e);
  if (t === "start" || t === !0)
    return n;
  if (t === "end")
    return r;
  const o = n.from, s = r.to;
  return t === "all" ? v.create(e, B(0, o, s), B(e.content.size, o, s)) : v.create(e, B(t, o, s), B(t, o, s));
}
function Ot() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Z() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const $t = (e = null, t = {}) => ({ editor: n, view: r, tr: o, dispatch: s }) => {
  t = {
    scrollIntoView: !0,
    ...t
  };
  const i = () => {
    (Z() || Ot()) && r.dom.focus(), requestAnimationFrame(() => {
      n.isDestroyed || (r.focus(), t != null && t.scrollIntoView && n.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && e === null || e === !1)
    return !0;
  if (s && e === null && !we(n.state.selection))
    return i(), !0;
  const a = Et(o.doc, e) || n.state.selection, c = n.state.selection.eq(a);
  return s && (c || o.setSelection(a), c && o.storedMarks && o.setStoredMarks(o.storedMarks), i()), !0;
}, It = (e, t) => (n) => e.every((r, o) => t(r, { ...n, index: o })), Nt = (e, t) => ({ tr: n, commands: r }) => r.insertContentAt({ from: n.selection.from, to: n.selection.to }, e, t), Se = (e) => {
  const t = e.childNodes;
  for (let n = t.length - 1; n >= 0; n -= 1) {
    const r = t[n];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? e.removeChild(r) : r.nodeType === 1 && Se(r);
  }
  return e;
};
function z(e) {
  const t = `<body>${e}</body>`, n = new window.DOMParser().parseFromString(t, "text/html").body;
  return Se(n);
}
function D(e, t, n) {
  if (e instanceof Ie || e instanceof L)
    return e;
  n = {
    slice: !0,
    parseOptions: {},
    ...n
  };
  const r = typeof e == "object" && e !== null, o = typeof e == "string";
  if (r)
    try {
      if (Array.isArray(e) && e.length > 0)
        return L.fromArray(e.map((a) => t.nodeFromJSON(a)));
      const i = t.nodeFromJSON(e);
      return n.errorOnInvalidContent && i.check(), i;
    } catch (s) {
      if (n.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: s });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", e, "Error:", s), D("", t, n);
    }
  if (o) {
    if (n.errorOnInvalidContent) {
      let i = !1, a = "";
      const c = new Ne({
        topNode: t.spec.topNode,
        marks: t.spec.marks,
        // Prosemirror's schemas are executed such that: the last to execute, matches last
        // This means that we can add a catch-all node at the end of the schema to catch any content that we don't know how to handle
        nodes: t.spec.nodes.append({
          __tiptap__private__unknown__catch__all__node: {
            content: "inline*",
            group: "block",
            parseDOM: [
              {
                tag: "*",
                getAttrs: (l) => (i = !0, a = typeof l == "string" ? l : l.outerHTML, null)
              }
            ]
          }
        })
      });
      if (n.slice ? J.fromSchema(c).parseSlice(z(e), n.parseOptions) : J.fromSchema(c).parse(z(e), n.parseOptions), n.errorOnInvalidContent && i)
        throw new Error("[tiptap error]: Invalid HTML content", { cause: new Error(`Invalid element found: ${a}`) });
    }
    const s = J.fromSchema(t);
    return n.slice ? s.parseSlice(z(e), n.parseOptions).content : s.parse(z(e), n.parseOptions);
  }
  return D("", t, n);
}
function Pt(e, t, n) {
  const r = e.steps.length - 1;
  if (r < t)
    return;
  const o = e.steps[r];
  if (!(o instanceof Be || o instanceof je))
    return;
  const s = e.mapping.maps[r];
  let i = 0;
  s.forEach((a, c, l, d) => {
    i === 0 && (i = d);
  }), e.setSelection(j.near(e.doc.resolve(i), n));
}
const Bt = (e) => !("type" in e), jt = (e, t, n) => ({ tr: r, dispatch: o, editor: s }) => {
  var i;
  if (o) {
    n = {
      parseOptions: s.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...n
    };
    let a;
    const c = (h) => {
      s.emit("contentError", {
        editor: s,
        error: h,
        disableCollaboration: () => {
          s.storage.collaboration && (s.storage.collaboration.isDisabled = !0);
        }
      });
    }, l = {
      preserveWhitespace: "full",
      ...n.parseOptions
    };
    if (!n.errorOnInvalidContent && !s.options.enableContentCheck && s.options.emitContentError)
      try {
        D(t, s.schema, {
          parseOptions: l,
          errorOnInvalidContent: !0
        });
      } catch (h) {
        c(h);
      }
    try {
      a = D(t, s.schema, {
        parseOptions: l,
        errorOnInvalidContent: (i = n.errorOnInvalidContent) !== null && i !== void 0 ? i : s.options.enableContentCheck
      });
    } catch (h) {
      return c(h), !1;
    }
    let { from: d, to: u } = typeof e == "number" ? { from: e, to: e } : { from: e.from, to: e.to }, f = !0, p = !0;
    if ((Bt(a) ? a : [a]).forEach((h) => {
      h.check(), f = f ? h.isText && h.marks.length === 0 : !1, p = p ? h.isBlock : !1;
    }), d === u && p) {
      const { parent: h } = r.doc.resolve(d);
      h.isTextblock && !h.type.spec.code && !h.childCount && (d -= 1, u += 1);
    }
    let m;
    if (f) {
      if (Array.isArray(t))
        m = t.map((h) => h.text || "").join("");
      else if (t instanceof L) {
        let h = "";
        t.forEach((y) => {
          y.text && (h += y.text);
        }), m = h;
      } else typeof t == "object" && t && t.text ? m = t.text : m = t;
      r.insertText(m, d, u);
    } else
      m = a, r.replaceWith(d, u, m);
    n.updateSelection && Pt(r, r.steps.length - 1, -1), n.applyInputRules && r.setMeta("applyInputRules", { from: d, text: m }), n.applyPasteRules && r.setMeta("applyPasteRules", { from: d, text: m });
  }
  return !0;
}, Lt = () => ({ state: e, dispatch: t }) => Ve(e, t), Ft = () => ({ state: e, dispatch: t }) => qe(e, t), Rt = () => ({ state: e, dispatch: t }) => Qe(e, t), Dt = () => ({ state: e, dispatch: t }) => Ge(e, t), _t = () => ({ state: e, dispatch: t, tr: n }) => {
  try {
    const r = pe(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, zt = () => ({ state: e, dispatch: t, tr: n }) => {
  try {
    const r = pe(e.doc, e.selection.$from.pos, 1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, Ht = () => ({ state: e, dispatch: t }) => Ue(e, t), Wt = () => ({ state: e, dispatch: t }) => Je(e, t);
function Me() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Kt(e) {
  const t = e.split(/-(?!$)/);
  let n = t[t.length - 1];
  n === "Space" && (n = " ");
  let r, o, s, i;
  for (let a = 0; a < t.length - 1; a += 1) {
    const c = t[a];
    if (/^(cmd|meta|m)$/i.test(c))
      i = !0;
    else if (/^a(lt)?$/i.test(c))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(c))
      o = !0;
    else if (/^s(hift)?$/i.test(c))
      s = !0;
    else if (/^mod$/i.test(c))
      Z() || Me() ? i = !0 : o = !0;
    else
      throw new Error(`Unrecognized modifier name: ${c}`);
  }
  return r && (n = `Alt-${n}`), o && (n = `Ctrl-${n}`), i && (n = `Meta-${n}`), s && (n = `Shift-${n}`), n;
}
const Vt = (e) => ({ editor: t, view: n, tr: r, dispatch: o }) => {
  const s = Kt(e).split(/-(?!$)/), i = s.find((l) => !["Alt", "Ctrl", "Meta", "Shift"].includes(l)), a = new KeyboardEvent("keydown", {
    key: i === "Space" ? " " : i,
    altKey: s.includes("Alt"),
    ctrlKey: s.includes("Ctrl"),
    metaKey: s.includes("Meta"),
    shiftKey: s.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), c = t.captureTransaction(() => {
    n.someProp("handleKeyDown", (l) => l(n, a));
  });
  return c == null || c.steps.forEach((l) => {
    const d = l.map(r.mapping);
    d && o && r.maybeStep(d);
  }), !0;
};
function ee(e, t, n = {}) {
  const { from: r, to: o, empty: s } = e.selection, i = t ? k(t, e.schema) : null, a = [];
  e.doc.nodesBetween(r, o, (u, f) => {
    if (u.isText)
      return;
    const p = Math.max(r, f), g = Math.min(o, f + u.nodeSize);
    a.push({
      node: u,
      from: p,
      to: g
    });
  });
  const c = o - r, l = a.filter((u) => i ? i.name === u.node.type.name : !0).filter((u) => K(u.node.attrs, n, { strict: !1 }));
  return s ? !!l.length : l.reduce((u, f) => u + f.to - f.from, 0) >= c;
}
const Jt = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = k(e, n.schema);
  return ee(n, o, t) ? Ke(n, r) : !1;
}, Ut = () => ({ state: e, dispatch: t }) => We(e, t), Gt = (e) => ({ state: t, dispatch: n }) => {
  const r = k(e, t.schema);
  return nt(r)(t, n);
}, qt = () => ({ state: e, dispatch: t }) => He(e, t);
function Ce(e, t) {
  return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function se(e, t) {
  const n = typeof t == "string" ? [t] : t;
  return Object.keys(e).reduce((r, o) => (n.includes(o) || (r[o] = e[o]), r), {});
}
const Qt = (e, t) => ({ tr: n, state: r, dispatch: o }) => {
  let s = null, i = null;
  const a = Ce(typeof e == "string" ? e : e.name, r.schema);
  return a ? (a === "node" && (s = k(e, r.schema)), a === "mark" && (i = P(e, r.schema)), o && n.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (l, d) => {
      s && s === l.type && n.setNodeMarkup(d, void 0, se(l.attrs, t)), i && l.marks.length && l.marks.forEach((u) => {
        i === u.type && n.addMark(d, d + l.nodeSize, i.create(se(u.attrs, t)));
      });
    });
  }), !0) : !1;
}, Xt = () => ({ tr: e, dispatch: t }) => (t && e.scrollIntoView(), !0), Yt = () => ({ tr: e, dispatch: t }) => {
  if (t) {
    const n = new Ee(e.doc);
    e.setSelection(n);
  }
  return !0;
}, Zt = () => ({ state: e, dispatch: t }) => ze(e, t), en = () => ({ state: e, dispatch: t }) => _e(e, t), tn = () => ({ state: e, dispatch: t }) => De(e, t), nn = () => ({ state: e, dispatch: t }) => Re(e, t), rn = () => ({ state: e, dispatch: t }) => Fe(e, t);
function on(e, t, n = {}, r = {}) {
  return D(e, t, {
    slice: !1,
    parseOptions: n,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
const sn = (e, t = !1, n = {}, r = {}) => ({ editor: o, tr: s, dispatch: i, commands: a }) => {
  var c, l;
  const { doc: d } = s;
  if (n.preserveWhitespace !== "full") {
    const u = on(e, o.schema, n, {
      errorOnInvalidContent: (c = r.errorOnInvalidContent) !== null && c !== void 0 ? c : o.options.enableContentCheck
    });
    return i && s.replaceWith(0, d.content.size, u).setMeta("preventUpdate", !t), !0;
  }
  return i && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: d.content.size }, e, {
    parseOptions: n,
    errorOnInvalidContent: (l = r.errorOnInvalidContent) !== null && l !== void 0 ? l : o.options.enableContentCheck
  });
};
function an(e, t) {
  const n = P(t, e.schema), { from: r, to: o, empty: s } = e.selection, i = [];
  s ? (e.storedMarks && i.push(...e.storedMarks), i.push(...e.selection.$head.marks())) : e.doc.nodesBetween(r, o, (c) => {
    i.push(...c.marks);
  });
  const a = i.find((c) => c.type.name === n.name);
  return a ? { ...a.attrs } : {};
}
function cn(e) {
  for (let t = 0; t < e.edgeCount; t += 1) {
    const { type: n } = e.edge(t);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
function R(e, t) {
  const n = [];
  return e.descendants((r, o) => {
    t(r) && n.push({
      node: r,
      pos: o
    });
  }), n;
}
function ln(e, t) {
  for (let n = e.depth; n > 0; n -= 1) {
    const r = e.node(n);
    if (t(r))
      return {
        pos: n > 0 ? e.before(n) : 0,
        start: e.start(n),
        depth: n,
        node: r
      };
  }
}
function te(e) {
  return (t) => ln(t.$from, e);
}
function W(e, t, n) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => {
    const o = e.find((s) => s.type === t && s.name === r);
    return o ? o.attribute.keepOnSplit : !1;
  }));
}
function dn(e, t, n = {}) {
  const { empty: r, ranges: o } = e.selection, s = t ? P(t, e.schema) : null;
  if (r)
    return !!(e.storedMarks || e.selection.$from.marks()).filter((u) => s ? s.name === u.type.name : !0).find((u) => K(u.attrs, n, { strict: !1 }));
  let i = 0;
  const a = [];
  if (o.forEach(({ $from: u, $to: f }) => {
    const p = u.pos, g = f.pos;
    e.doc.nodesBetween(p, g, (m, h) => {
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(p, h), x = Math.min(g, h + m.nodeSize), S = x - y;
      i += S, a.push(...m.marks.map((M) => ({
        mark: M,
        from: y,
        to: x
      })));
    });
  }), i === 0)
    return !1;
  const c = a.filter((u) => s ? s.name === u.mark.type.name : !0).filter((u) => K(u.mark.attrs, n, { strict: !1 })).reduce((u, f) => u + f.to - f.from, 0), l = a.filter((u) => s ? u.mark.type !== s && u.mark.type.excludes(s) : !0).reduce((u, f) => u + f.to - f.from, 0);
  return (c > 0 ? c + l : c) >= i;
}
function ie(e, t) {
  const { nodeExtensions: n } = it(t), r = n.find((i) => i.name === e);
  if (!r)
    return !1;
  const o = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = E(b(r, "group", o));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function be(e, { checkChildren: t = !0, ignoreWhitespace: n = !1 } = {}) {
  var r;
  if (n) {
    if (e.type.name === "hardBreak")
      return !0;
    if (e.isText)
      return /^\s*$/m.test((r = e.text) !== null && r !== void 0 ? r : "");
  }
  if (e.isText)
    return !e.text;
  if (e.isAtom || e.isLeaf)
    return !1;
  if (e.content.childCount === 0)
    return !0;
  if (t) {
    let o = !0;
    return e.content.forEach((s) => {
      o !== !1 && (be(s, { ignoreWhitespace: n, checkChildren: t }) || (o = !1));
    }), o;
  }
  return !1;
}
function un(e, t, n) {
  var r;
  const { selection: o } = t;
  let s = null;
  if (we(o) && (s = o.$cursor), s) {
    const a = (r = e.storedMarks) !== null && r !== void 0 ? r : s.marks();
    return !!n.isInSet(a) || !a.some((c) => c.type.excludes(n));
  }
  const { ranges: i } = o;
  return i.some(({ $from: a, $to: c }) => {
    let l = a.depth === 0 ? e.doc.inlineContent && e.doc.type.allowsMarkType(n) : !1;
    return e.doc.nodesBetween(a.pos, c.pos, (d, u, f) => {
      if (l)
        return !1;
      if (d.isInline) {
        const p = !f || f.type.allowsMarkType(n), g = !!n.isInSet(d.marks) || !d.marks.some((m) => m.type.excludes(n));
        l = p && g;
      }
      return !l;
    }), l;
  });
}
const fn = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  const { selection: s } = n, { empty: i, ranges: a } = s, c = P(e, r.schema);
  if (o)
    if (i) {
      const l = an(r, c);
      n.addStoredMark(c.create({
        ...l,
        ...t
      }));
    } else
      a.forEach((l) => {
        const d = l.$from.pos, u = l.$to.pos;
        r.doc.nodesBetween(d, u, (f, p) => {
          const g = Math.max(p, d), m = Math.min(p + f.nodeSize, u);
          f.marks.find((y) => y.type === c) ? f.marks.forEach((y) => {
            c === y.type && n.addMark(g, m, c.create({
              ...y.attrs,
              ...t
            }));
          }) : n.addMark(g, m, c.create(t));
        });
      });
  return un(r, n, c);
}, pn = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), mn = (e, t = {}) => ({ state: n, dispatch: r, chain: o }) => {
  const s = k(e, n.schema);
  let i;
  return n.selection.$anchor.sameParent(n.selection.$head) && (i = n.selection.$anchor.parent.attrs), s.isTextblock ? o().command(({ commands: a }) => re(s, { ...i, ...t })(n) ? !0 : a.clearNodes()).command(({ state: a }) => re(s, { ...i, ...t })(a, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, hn = (e) => ({ tr: t, dispatch: n }) => {
  if (n) {
    const { doc: r } = t, o = B(e, 0, r.content.size), s = fe.create(r, o);
    t.setSelection(s);
  }
  return !0;
}, gn = (e) => ({ tr: t, dispatch: n }) => {
  if (n) {
    const { doc: r } = t, { from: o, to: s } = typeof e == "number" ? { from: e, to: e } : e, i = v.atStart(r).from, a = v.atEnd(r).to, c = B(o, i, a), l = B(s, i, a), d = v.create(r, c, l);
    t.setSelection(d);
  }
  return !0;
}, yn = (e) => ({ state: t, dispatch: n }) => {
  const r = k(e, t.schema);
  return tt(r)(t, n);
};
function ae(e, t) {
  const n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
  if (n) {
    const r = n.filter((o) => t == null ? void 0 : t.includes(o.type.name));
    e.tr.ensureMarks(r);
  }
}
const kn = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: r, editor: o }) => {
  const { selection: s, doc: i } = t, { $from: a, $to: c } = s, l = o.extensionManager.attributes, d = W(l, a.node().type.name, a.node().attrs);
  if (s instanceof fe && s.node.isBlock)
    return !a.parentOffset || !H(i, a.pos) ? !1 : (r && (e && ae(n, o.extensionManager.splittableMarks), t.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const u = c.parentOffset === c.parent.content.size, f = a.depth === 0 ? void 0 : cn(a.node(-1).contentMatchAt(a.indexAfter(-1)));
  let p = u && f ? [
    {
      type: f,
      attrs: d
    }
  ] : void 0, g = H(t.doc, t.mapping.map(a.pos), 1, p);
  if (!p && !g && H(t.doc, t.mapping.map(a.pos), 1, f ? [{ type: f }] : void 0) && (g = !0, p = f ? [
    {
      type: f,
      attrs: d
    }
  ] : void 0), r) {
    if (g && (s instanceof v && t.deleteSelection(), t.split(t.mapping.map(a.pos), 1, p), f && !u && !a.parentOffset && a.parent.type !== f)) {
      const m = t.mapping.map(a.before()), h = t.doc.resolve(m);
      a.node(-1).canReplaceWith(h.index(), h.index() + 1, f) && t.setNodeMarkup(t.mapping.map(a.before()), f);
    }
    e && ae(n, o.extensionManager.splittableMarks), t.scrollIntoView();
  }
  return g;
}, xn = (e, t = {}) => ({ tr: n, state: r, dispatch: o, editor: s }) => {
  var i;
  const a = k(e, r.schema), { $from: c, $to: l } = r.selection, d = r.selection.node;
  if (d && d.isBlock || c.depth < 2 || !c.sameParent(l))
    return !1;
  const u = c.node(-1);
  if (u.type !== a)
    return !1;
  const f = s.extensionManager.attributes;
  if (c.parent.content.size === 0 && c.node(-1).childCount === c.indexAfter(-1)) {
    if (c.depth === 2 || c.node(-3).type !== a || c.index(-2) !== c.node(-2).childCount - 1)
      return !1;
    if (o) {
      let y = L.empty;
      const x = c.index(-1) ? 1 : c.index(-2) ? 2 : 3;
      for (let N = c.depth - x; N >= c.depth - 3; N -= 1)
        y = L.from(c.node(N).copy(y));
      const S = c.indexAfter(-1) < c.node(-2).childCount ? 1 : c.indexAfter(-2) < c.node(-3).childCount ? 2 : 3, M = {
        ...W(f, c.node().type.name, c.node().attrs),
        ...t
      }, w = ((i = a.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(M)) || void 0;
      y = y.append(L.from(a.createAndFill(null, w) || void 0));
      const C = c.before(c.depth - (x - 1));
      n.replace(C, c.after(-S), new $e(y, 4 - x, 0));
      let O = -1;
      n.doc.nodesBetween(C, n.doc.content.size, (N, Ae) => {
        if (O > -1)
          return !1;
        N.isTextblock && N.content.size === 0 && (O = Ae + 1);
      }), O > -1 && n.setSelection(v.near(n.doc.resolve(O))), n.scrollIntoView();
    }
    return !0;
  }
  const p = l.pos === c.end() ? u.contentMatchAt(0).defaultType : null, g = {
    ...W(f, u.type.name, u.attrs),
    ...t
  }, m = {
    ...W(f, c.node().type.name, c.node().attrs),
    ...t
  };
  n.delete(c.pos, l.pos);
  const h = p ? [
    { type: a, attrs: g },
    { type: p, attrs: m }
  ] : [{ type: a, attrs: g }];
  if (!H(n.doc, c.pos, 2))
    return !1;
  if (o) {
    const { selection: y, storedMarks: x } = r, { splittableMarks: S } = s.extensionManager, M = x || y.$to.parentOffset && y.$from.marks();
    if (n.split(c.pos, 2, h).scrollIntoView(), !M || !o)
      return !0;
    const w = M.filter((C) => S.includes(C.type.name));
    n.ensureMarks(w);
  }
  return !0;
}, U = (e, t) => {
  const n = te((i) => i.type === t)(e.selection);
  if (!n)
    return !0;
  const r = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
  if (r === void 0)
    return !0;
  const o = e.doc.nodeAt(r);
  return n.node.type === (o == null ? void 0 : o.type) && me(e.doc, n.pos) && e.join(n.pos), !0;
}, G = (e, t) => {
  const n = te((i) => i.type === t)(e.selection);
  if (!n)
    return !0;
  const r = e.doc.resolve(n.start).after(n.depth);
  if (r === void 0)
    return !0;
  const o = e.doc.nodeAt(r);
  return n.node.type === (o == null ? void 0 : o.type) && me(e.doc, r) && e.join(r), !0;
}, wn = (e, t, n, r = {}) => ({ editor: o, tr: s, state: i, dispatch: a, chain: c, commands: l, can: d }) => {
  const { extensions: u, splittableMarks: f } = o.extensionManager, p = k(e, i.schema), g = k(t, i.schema), { selection: m, storedMarks: h } = i, { $from: y, $to: x } = m, S = y.blockRange(x), M = h || m.$to.parentOffset && m.$from.marks();
  if (!S)
    return !1;
  const w = te((C) => ie(C.type.name, u))(m);
  if (S.depth >= 1 && w && S.depth - w.depth <= 1) {
    if (w.node.type === p)
      return l.liftListItem(g);
    if (ie(w.node.type.name, u) && p.validContent(w.node.content) && a)
      return c().command(() => (s.setNodeMarkup(w.pos, p), !0)).command(() => U(s, p)).command(() => G(s, p)).run();
  }
  return !n || !M || !a ? c().command(() => d().wrapInList(p, r) ? !0 : l.clearNodes()).wrapInList(p, r).command(() => U(s, p)).command(() => G(s, p)).run() : c().command(() => {
    const C = d().wrapInList(p, r), O = M.filter((N) => f.includes(N.type.name));
    return s.ensureMarks(O), C ? !0 : l.clearNodes();
  }).wrapInList(p, r).command(() => U(s, p)).command(() => G(s, p)).run();
}, Sn = (e, t = {}, n = {}) => ({ state: r, commands: o }) => {
  const { extendEmptyMarkRange: s = !1 } = n, i = P(e, r.schema);
  return dn(r, i, t) ? o.unsetMark(i, { extendEmptyMarkRange: s }) : o.setMark(i, t);
}, Mn = (e, t, n = {}) => ({ state: r, commands: o }) => {
  const s = k(e, r.schema), i = k(t, r.schema), a = ee(r, s, n);
  let c;
  return r.selection.$anchor.sameParent(r.selection.$head) && (c = r.selection.$anchor.parent.attrs), a ? o.setNode(i, c) : o.setNode(s, { ...c, ...n });
}, Cn = (e, t = {}) => ({ state: n, commands: r }) => {
  const o = k(e, n.schema);
  return ee(n, o, t) ? r.lift(o) : r.wrapIn(o, t);
}, bn = () => ({ state: e, dispatch: t }) => {
  const n = e.plugins;
  for (let r = 0; r < n.length; r += 1) {
    const o = n[r];
    let s;
    if (o.spec.isInputRules && (s = o.getState(e))) {
      if (t) {
        const i = e.tr, a = s.transform;
        for (let c = a.steps.length - 1; c >= 0; c -= 1)
          i.step(a.steps[c].invert(a.docs[c]));
        if (s.text) {
          const c = i.doc.resolve(s.from).marks();
          i.replaceWith(s.from, s.to, e.schema.text(s.text, c));
        } else
          i.delete(s.from, s.to);
      }
      return !0;
    }
  }
  return !1;
}, vn = () => ({ tr: e, dispatch: t }) => {
  const { selection: n } = e, { empty: r, ranges: o } = n;
  return r || t && o.forEach((s) => {
    e.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, Tn = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  var s;
  const { extendEmptyMarkRange: i = !1 } = t, { selection: a } = n, c = P(e, r.schema), { $from: l, empty: d, ranges: u } = a;
  if (!o)
    return !0;
  if (d && i) {
    let { from: f, to: p } = a;
    const g = (s = l.marks().find((h) => h.type === c)) === null || s === void 0 ? void 0 : s.attrs, m = xe(l, c, g);
    m && (f = m.from, p = m.to), n.removeMark(f, p, c);
  } else
    u.forEach((f) => {
      n.removeMark(f.$from.pos, f.$to.pos, c);
    });
  return n.removeStoredMark(c), !0;
}, An = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  let s = null, i = null;
  const a = Ce(typeof e == "string" ? e : e.name, r.schema);
  return a ? (a === "node" && (s = k(e, r.schema)), a === "mark" && (i = P(e, r.schema)), o && n.selection.ranges.forEach((c) => {
    const l = c.$from.pos, d = c.$to.pos;
    let u, f, p, g;
    n.selection.empty ? r.doc.nodesBetween(l, d, (m, h) => {
      s && s === m.type && (p = Math.max(h, l), g = Math.min(h + m.nodeSize, d), u = h, f = m);
    }) : r.doc.nodesBetween(l, d, (m, h) => {
      h < l && s && s === m.type && (p = Math.max(h, l), g = Math.min(h + m.nodeSize, d), u = h, f = m), h >= l && h <= d && (s && s === m.type && n.setNodeMarkup(h, void 0, {
        ...m.attrs,
        ...t
      }), i && m.marks.length && m.marks.forEach((y) => {
        if (i === y.type) {
          const x = Math.max(h, l), S = Math.min(h + m.nodeSize, d);
          n.addMark(x, S, i.create({
            ...y.attrs,
            ...t
          }));
        }
      }));
    }), f && (u !== void 0 && n.setNodeMarkup(u, void 0, {
      ...f.attrs,
      ...t
    }), i && f.marks.length && f.marks.forEach((m) => {
      i === m.type && n.addMark(p, g, i.create({
        ...m.attrs,
        ...t
      }));
    }));
  }), !0) : !1;
}, En = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = k(e, n.schema);
  return Le(o, t)(n, r);
}, On = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = k(e, n.schema);
  return et(o, t)(n, r);
};
var $n = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: mt,
  clearContent: ht,
  clearNodes: gt,
  command: yt,
  createParagraphNear: kt,
  cut: xt,
  deleteCurrentNode: wt,
  deleteNode: St,
  deleteRange: Mt,
  deleteSelection: Ct,
  enter: bt,
  exitCode: vt,
  extendMarkRange: Tt,
  first: At,
  focus: $t,
  forEach: It,
  insertContent: Nt,
  insertContentAt: jt,
  joinBackward: Rt,
  joinDown: Ft,
  joinForward: Dt,
  joinItemBackward: _t,
  joinItemForward: zt,
  joinTextblockBackward: Ht,
  joinTextblockForward: Wt,
  joinUp: Lt,
  keyboardShortcut: Vt,
  lift: Jt,
  liftEmptyBlock: Ut,
  liftListItem: Gt,
  newlineInCode: qt,
  resetAttributes: Qt,
  scrollIntoView: Xt,
  selectAll: Yt,
  selectNodeBackward: Zt,
  selectNodeForward: en,
  selectParentNode: tn,
  selectTextblockEnd: nn,
  selectTextblockStart: rn,
  setContent: sn,
  setMark: fn,
  setMeta: pn,
  setNode: mn,
  setNodeSelection: hn,
  setTextSelection: gn,
  sinkListItem: yn,
  splitBlock: kn,
  splitListItem: xn,
  toggleList: wn,
  toggleMark: Sn,
  toggleNode: Mn,
  toggleWrap: Cn,
  undoInputRule: bn,
  unsetAllMarks: vn,
  unsetMark: Tn,
  updateAttributes: An,
  wrapIn: En,
  wrapInList: On
});
A.create({
  name: "commands",
  addCommands() {
    return {
      ...$n
    };
  }
});
A.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new $({
        key: new I("tiptapDrop"),
        props: {
          handleDrop: (e, t, n, r) => {
            this.editor.emit("drop", {
              editor: this.editor,
              event: t,
              slice: n,
              moved: r
            });
          }
        }
      })
    ];
  }
});
A.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new $({
        key: new I("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
const In = new I("focusEvents");
A.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: e } = this;
    return [
      new $({
        key: In,
        props: {
          handleDOMEvents: {
            focus: (t, n) => {
              e.isFocused = !0;
              const r = e.state.tr.setMeta("focus", { event: n }).setMeta("addToHistory", !1);
              return t.dispatch(r), !1;
            },
            blur: (t, n) => {
              e.isFocused = !1;
              const r = e.state.tr.setMeta("blur", { event: n }).setMeta("addToHistory", !1);
              return t.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
});
A.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const e = () => this.editor.commands.first(({ commands: i }) => [
      () => i.undoInputRule(),
      // maybe convert first text block node to default node
      () => i.command(({ tr: a }) => {
        const { selection: c, doc: l } = a, { empty: d, $anchor: u } = c, { pos: f, parent: p } = u, g = u.parent.isTextblock && f > 0 ? a.doc.resolve(f - 1) : u, m = g.parent.type.spec.isolating, h = u.pos - u.parentOffset, y = m && g.parent.childCount === 1 ? h === u.pos : j.atStart(l).from === f;
        return !d || !p.type.isTextblock || p.textContent.length || !y || y && u.parent.type.name === "paragraph" ? !1 : i.clearNodes();
      }),
      () => i.deleteSelection(),
      () => i.joinBackward(),
      () => i.selectNodeBackward()
    ]), t = () => this.editor.commands.first(({ commands: i }) => [
      () => i.deleteSelection(),
      () => i.deleteCurrentNode(),
      () => i.joinForward(),
      () => i.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: i }) => [
        () => i.newlineInCode(),
        () => i.createParagraphNear(),
        () => i.liftEmptyBlock(),
        () => i.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: e,
      "Mod-Backspace": e,
      "Shift-Backspace": e,
      Delete: t,
      "Mod-Delete": t,
      "Mod-a": () => this.editor.commands.selectAll()
    }, o = {
      ...r
    }, s = {
      ...r,
      "Ctrl-h": e,
      "Alt-Backspace": e,
      "Ctrl-d": t,
      "Ctrl-Alt-Backspace": t,
      "Alt-Delete": t,
      "Alt-d": t,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Z() || Me() ? s : o;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new $({
        key: new I("clearDocument"),
        appendTransaction: (e, t, n) => {
          if (e.some((m) => m.getMeta("composition")))
            return;
          const r = e.some((m) => m.docChanged) && !t.doc.eq(n.doc), o = e.some((m) => m.getMeta("preventClearDocument"));
          if (!r || o)
            return;
          const { empty: s, from: i, to: a } = t.selection, c = j.atStart(t.doc).from, l = j.atEnd(t.doc).to;
          if (s || !(i === c && a === l) || !be(n.doc))
            return;
          const f = n.tr, p = ye({
            state: n,
            transaction: f
          }), { commands: g } = new st({
            editor: this.editor,
            state: p
          });
          if (g.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
});
A.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new $({
        key: new I("tiptapPaste"),
        props: {
          handlePaste: (e, t, n) => {
            this.editor.emit("paste", {
              editor: this.editor,
              event: t,
              slice: n
            });
          }
        }
      })
    ];
  }
});
A.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new $({
        key: new I("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
function ce(e) {
  return new dt({
    find: e.find,
    handler: ({ state: t, range: n, match: r }) => {
      const o = t.doc.resolve(n.from), s = E(e.getAttributes, void 0, r) || {};
      if (!o.node(-1).canReplaceWith(o.index(-1), o.indexAfter(-1), e.type))
        return null;
      t.tr.delete(n.from, n.to).setBlockType(n.from, n.from, e.type, s);
    }
  });
}
class V {
  constructor(t = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...t
    }, this.name = this.config.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = E(b(this, "addOptions", {
      name: this.name
    }))), this.storage = E(b(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(t = {}) {
    return new V(t);
  }
  configure(t = {}) {
    const n = this.extend({
      ...this.config,
      addOptions: () => Y(this.options, t)
    });
    return n.name = this.name, n.parent = this.parent, n;
  }
  extend(t = {}) {
    const n = new V(t);
    return n.parent = this, this.child = n, n.name = t.name ? t.name : n.parent.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = E(b(n, "addOptions", {
      name: n.name
    })), n.storage = E(b(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
const Nn = /^```([a-z]+)?[\s\n]$/, Pn = /^~~~([a-z]+)?[\s\n]$/, Bn = V.create({
  name: "codeBlock",
  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: !0,
      exitOnArrowDown: !0,
      defaultLanguage: null,
      HTMLAttributes: {}
    };
  },
  content: "text*",
  marks: "",
  group: "block",
  code: !0,
  defining: !0,
  addAttributes() {
    return {
      language: {
        default: this.options.defaultLanguage,
        parseHTML: (e) => {
          var t;
          const { languageClassPrefix: n } = this.options, s = [...((t = e.firstElementChild) === null || t === void 0 ? void 0 : t.classList) || []].filter((i) => i.startsWith(n)).map((i) => i.replace(n, ""))[0];
          return s || null;
        },
        rendered: !1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full"
      }
    ];
  },
  renderHTML({ node: e, HTMLAttributes: t }) {
    return [
      "pre",
      at(this.options.HTMLAttributes, t),
      [
        "code",
        {
          class: e.attrs.language ? this.options.languageClassPrefix + e.attrs.language : null
        },
        0
      ]
    ];
  },
  addCommands() {
    return {
      setCodeBlock: (e) => ({ commands: t }) => t.setNode(this.name, e),
      toggleCodeBlock: (e) => ({ commands: t }) => t.toggleNode(this.name, "paragraph", e)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      // remove code block when at start of document or code block is empty
      Backspace: () => {
        const { empty: e, $anchor: t } = this.editor.state.selection, n = t.pos === 1;
        return !e || t.parent.type.name !== this.name ? !1 : n || !t.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
      },
      // exit node on triple enter
      Enter: ({ editor: e }) => {
        if (!this.options.exitOnTripleEnter)
          return !1;
        const { state: t } = e, { selection: n } = t, { $from: r, empty: o } = n;
        if (!o || r.parent.type !== this.type)
          return !1;
        const s = r.parentOffset === r.parent.nodeSize - 2, i = r.parent.textContent.endsWith(`

`);
        return !s || !i ? !1 : e.chain().command(({ tr: a }) => (a.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      // exit node on arrow down
      ArrowDown: ({ editor: e }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: t } = e, { selection: n, doc: r } = t, { $from: o, empty: s } = n;
        if (!s || o.parent.type !== this.type || !(o.parentOffset === o.parent.nodeSize - 2))
          return !1;
        const a = o.after();
        return a === void 0 ? !1 : r.nodeAt(a) ? e.commands.command(({ tr: l }) => (l.setSelection(j.near(r.resolve(a))), !0)) : e.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      ce({
        find: Nn,
        type: this.type,
        getAttributes: (e) => ({
          language: e[1]
        })
      }),
      ce({
        find: Pn,
        type: this.type,
        getAttributes: (e) => ({
          language: e[1]
        })
      })
    ];
  },
  addProseMirrorPlugins() {
    return [
      // this plugin creates a code block for pasted content from VS Code
      // we can also detect the copied code language
      new $({
        key: new I("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (e, t) => {
            if (!t.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const n = t.clipboardData.getData("text/plain"), r = t.clipboardData.getData("vscode-editor-data"), o = r ? JSON.parse(r) : void 0, s = o == null ? void 0 : o.mode;
            if (!n || !s)
              return !1;
            const { tr: i, schema: a } = e.state, c = a.text(n.replace(/\r\n?/g, `
`));
            return i.replaceSelectionWith(this.type.create({ language: s }, c)), i.selection.$from.parent.type !== this.type && i.setSelection(v.near(i.doc.resolve(Math.max(0, i.selection.from - 2)))), i.setMeta("paste", !0), e.dispatch(i), !0;
          }
        }
      })
    ];
  }
}), jn = [
  [/^(<!--)(.+)(-->)$/, !1],
  [/^(\/\*)(.+)(\*\/)$/, !1],
  [/^(\/\/|["'#]|;{1,2}|%{1,2}|--)(.*)$/, !0],
  /**
   * for multi-line comments like this
   */
  [/^(\*)(.+)$/, !0]
];
function Ln(e, t, n) {
  const r = [];
  for (const o of e) {
    if (n === "v3") {
      const a = o.children.flatMap((c, l) => {
        if (c.type !== "element")
          return c;
        const d = c.children[0];
        if (d.type !== "text")
          return c;
        const u = l === o.children.length - 1;
        if (!de(d.value, u))
          return c;
        const p = d.value.split(/(\s+\/\/)/);
        if (p.length <= 1)
          return c;
        let g = [p[0]];
        for (let m = 1; m < p.length; m += 2)
          g.push(p[m] + (p[m + 1] || ""));
        return g = g.filter(Boolean), g.length <= 1 ? c : g.map((m) => ({
          ...c,
          children: [
            {
              type: "text",
              value: m
            }
          ]
        }));
      });
      a.length !== o.children.length && (o.children = a);
    }
    const s = o.children;
    let i = s.length - 1;
    n === "v1" ? i = 0 : t && (i = s.length - 2);
    for (let a = Math.max(i, 0); a < s.length; a++) {
      const c = s[a];
      if (c.type !== "element")
        continue;
      const l = c.children.at(0);
      if ((l == null ? void 0 : l.type) !== "text")
        continue;
      const d = a === s.length - 1, u = de(l.value, d);
      if (u)
        if (t && !d && a !== 0) {
          const f = le(s[a - 1], "{") && le(s[a + 1], "}");
          r.push({
            info: u,
            line: o,
            token: c,
            isLineCommentOnly: s.length === 3 && c.children.length === 1,
            isJsxStyle: f
          });
        } else
          r.push({
            info: u,
            line: o,
            token: c,
            isLineCommentOnly: s.length === 1 && c.children.length === 1,
            isJsxStyle: !1
          });
    }
  }
  return r;
}
function le(e, t) {
  if (e.type !== "element")
    return !1;
  const n = e.children[0];
  return n.type !== "text" ? !1 : n.value.trim() === t;
}
function de(e, t) {
  let n = e.trimStart();
  const r = e.length - n.length;
  n = n.trimEnd();
  const o = e.length - n.length - r;
  for (const [s, i] of jn) {
    if (i && !t)
      continue;
    const a = s.exec(n);
    if (a)
      return [
        " ".repeat(r) + a[1],
        a[2],
        a[3] ? a[3] + " ".repeat(o) : void 0
      ];
  }
}
function Fn(e) {
  const t = e.match(/(?:\/\/|["'#]|;{1,2}|%{1,2}|--)(\s*)$/);
  return t && t[1].trim().length === 0 ? e.slice(0, t.index) : e;
}
function Rn(e, t, n, r) {
  return r == null && (r = "v3"), {
    name: e,
    code(o) {
      const s = o.children.filter((l) => l.type === "element"), i = [];
      o.data ?? (o.data = {});
      const a = o.data;
      a._shiki_notation ?? (a._shiki_notation = Ln(s, ["jsx", "tsx"].includes(this.options.lang), r));
      const c = a._shiki_notation;
      for (const l of c) {
        if (l.info[1].length === 0)
          continue;
        let d = s.indexOf(l.line);
        l.isLineCommentOnly && r !== "v1" && d++;
        let u = !1;
        if (l.info[1] = l.info[1].replace(t, (...p) => n.call(this, p, l.line, l.token, s, d) ? (u = !0, "") : p[0]), !u)
          continue;
        r === "v1" && (l.info[1] = Fn(l.info[1]));
        const f = l.info[1].trim().length === 0;
        if (f && (l.info[1] = ""), f && l.isLineCommentOnly)
          i.push(l.line);
        else if (f && l.isJsxStyle)
          l.line.children.splice(l.line.children.indexOf(l.token) - 1, 3);
        else if (f)
          l.line.children.splice(l.line.children.indexOf(l.token), 1);
        else {
          const p = l.token.children[0];
          p.type === "text" && (p.value = l.info.join(""));
        }
      }
      for (const l of i) {
        const d = o.children.indexOf(l), u = o.children[d + 1];
        let f = 1;
        (u == null ? void 0 : u.type) === "text" && (u == null ? void 0 : u.value) === `
` && (f = 2), o.children.splice(d, f);
      }
    }
  };
}
function Dn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function _n(e = {}, t = "@shikijs/transformers:notation-map") {
  const {
    classMap: n = {},
    classActivePre: r = void 0
  } = e;
  return Rn(
    t,
    new RegExp(`\\s*\\[!code (${Object.keys(n).map(Dn).join("|")})(:\\d+)?\\]`),
    function([o, s, i = ":1"], a, c, l, d) {
      const u = Number.parseInt(i.slice(1), 10);
      for (let f = d; f < Math.min(d + u, l.length); f++)
        this.addClassToHast(l[f], n[s]);
      return r && this.addClassToHast(this.pre, r), !0;
    },
    e.matchAlgorithm
  );
}
function q(e = {}) {
  const {
    classActiveLine: t = "highlighted",
    classActivePre: n = "has-highlighted"
  } = e;
  return _n(
    {
      classMap: {
        highlight: t,
        hl: t
      },
      classActivePre: n,
      matchAlgorithm: e.matchAlgorithm
    },
    "@shikijs/transformers:notation-highlight"
  );
}
let T, F;
const Q = /* @__PURE__ */ new Set(), X = /* @__PURE__ */ new Set();
function zn() {
  return T;
}
function Hn(e) {
  if (!T && !F) {
    const t = e.themes.filter(
      (r) => !!r && r in he
    ), n = e.languages.filter(
      (r) => !!r && r in ge
    );
    return console.log("loadHighlighter langs", n), F = rt({
      themes: t,
      langs: n
    }).then((r) => {
      T = r, console.log("loadHighlighter highlighter", T);
    }), F;
  }
  if (F)
    return F;
}
async function ve(e) {
  return T && !T.getLoadedThemes().includes(e) && !X.has(e) && e in he ? (X.add(e), await T.loadTheme(e), X.delete(e), !0) : !1;
}
async function Te(e) {
  return T && !T.getLoadedLanguages().includes(e) && !Q.has(e) && e in ge ? (Q.add(e), await T.loadLanguage(e), Q.delete(e), !0) : !1;
}
async function Wn({
  doc: e,
  name: t,
  defaultTheme: n,
  defaultLanguage: r
}) {
  const o = R(e, (a) => a.type.name === t), s = [
    ...o.map((a) => a.node.attrs.theme),
    n
  ], i = [
    ...o.map((a) => a.node.attrs.language),
    r
  ];
  if (console.log("initHighlighter codeBlocks", o), console.log("initHighlighter themes", s), console.log("initHighlighter languages", i), T)
    console.log("mapping"), await Promise.all([
      ...s.flatMap((a) => ve(a)),
      ...i.flatMap((a) => !!a && Te(a))
    ]);
  else {
    const a = Hn({ languages: i, themes: s });
    console.log("initHighlighter loader", a), await a;
  }
}
function ue({
  doc: e,
  name: t,
  defaultTheme: n,
  defaultLanguage: r
}) {
  let o = [];
  const s = R(e, (i) => i.type.name === t);
  return console.log("children", s), s.forEach((i) => {
    var h, y, x, S;
    let a = i.node.attrs.language || r, c = i.node.attrs.theme || n;
    const l = zn();
    if (!l) return;
    l.getLoadedLanguages().includes(a) || (a = "plaintext");
    const d = l.getLoadedThemes().includes(c) ? c : l.getLoadedThemes()[0], u = l.getTheme(d);
    console.log("block.node.textContent", i.node.textContent), console.log(
      "cooooode to hast",
      ot(i.node.textContent, {
        theme: u,
        lang: i.node.attrs.language,
        transformers: [q()]
      })
    ), console.log("bagel");
    const f = l.codeToHast(i.node.textContent, {
      theme: u,
      lang: i.node.attrs.language,
      transformers: [q()]
    });
    console.log("result codeToHast", f);
    const p = l.codeToHast(i.node.textContent, {
      theme: u,
      lang: i.node.attrs.language,
      transformers: [q()]
    }).children[0];
    o.push(
      ne.node(i.pos, i.pos + i.node.nodeSize, {
        class: `${(h = p.properties) == null ? void 0 : h.class} node-editor__code-block-shiki`,
        style: (y = p.properties) == null ? void 0 : y.style
      })
    );
    let g = i.pos + 1;
    const m = p.children[0].children;
    console.log("lines", m);
    for (const M of m)
      if ((x = M.children) != null && x.length) {
        let w = g;
        (S = M.children) == null || S.forEach((C) => {
          const O = C.children[0].value.length;
          o.push(
            ne.inline(
              w,
              w + O,
              C.properties
            )
          ), w += O;
        }), g = w;
      } else M.type === "text" && (g += M.value.length);
  }), console.log("decorations", o), o = o.filter((i) => !!i), Oe.create(e, o);
}
function Kn({
  name: e,
  defaultLanguage: t,
  defaultTheme: n
}) {
  const r = new $({
    key: new I("shiki"),
    view(o) {
      class s {
        constructor() {
          this.initDecorations();
        }
        update() {
          this.checkUndecoratedBlocks();
        }
        destroy() {
        }
        // Initialize shiki async, and then highlight initial document
        async initDecorations() {
          const a = o.state.doc;
          console.log("initDecorations doc", a), await Wn({ doc: a, name: e, defaultLanguage: t, defaultTheme: n });
          const c = o.state.tr.setMeta("shikiPluginForceDecoration", !0);
          o.dispatch(c);
        }
        // When new codeblocks were added and they have missing themes or
        // languages, load those and then add code decorations once again.
        async checkUndecoratedBlocks() {
          const a = R(
            o.state.doc,
            (d) => d.type.name === e
          );
          if ((await Promise.all(
            a.flatMap((d) => [
              ve(d.node.attrs.theme),
              Te(d.node.attrs.language)
            ])
          )).includes(!0)) {
            const d = o.state.tr.setMeta("shikiPluginForceDecoration", !0);
            o.dispatch(d);
          }
        }
      }
      return new s();
    },
    state: {
      init: (o, { doc: s }) => (console.log("initdd", s), ue({
        doc: s,
        name: e,
        defaultLanguage: t,
        defaultTheme: n
      })),
      apply: (o, s, i, a) => {
        const c = i.selection.$head.parent.type.name, l = a.selection.$head.parent.type.name, d = R(
          i.doc,
          (p) => p.type.name === e
        ), u = R(
          a.doc,
          (p) => p.type.name === e
        );
        console.log("oldNodes", d), console.log("newNodes", u), console.log("apply");
        const f = o.docChanged && // Apply decorations if:
        // selection includes named node,
        ([c, l].includes(e) || // OR transaction adds/removes named node,
        u.length !== d.length || // OR transaction has changes that completely encapsulte a node
        // (for example, a transaction that affects the entire document).
        // Such transactions can happen during collab syncing via y-prosemirror, for example.
        o.steps.some((p) => (
          // @ts-ignore
          p.from !== void 0 && // @ts-ignore
          p.to !== void 0 && d.some((g) => (
            // @ts-ignore
            g.pos >= p.from && // @ts-ignore
            g.pos + g.node.nodeSize <= p.to
          ))
        )));
        return o.getMeta("shikiPluginForceDecoration") || f ? ue({
          doc: o.doc,
          name: e,
          defaultLanguage: t,
          defaultTheme: n
        }) : s.map(o.mapping, o.doc);
      }
    },
    props: {
      decorations(o) {
        return console.log("decorations", o), console.log("shikiPlugin.getState(state)", r.getState(o)), r.getState(o);
      }
    }
  });
  return r;
}
const Zn = Bn.extend({
  addOptions() {
    var e;
    return {
      ...(e = this.parent) == null ? void 0 : e.call(this),
      defaultLanguage: null,
      defaultTheme: "github-dark"
    };
  },
  addProseMirrorPlugins() {
    var e;
    return [
      ...((e = this.parent) == null ? void 0 : e.call(this)) || [],
      Kn({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage,
        defaultTheme: this.options.defaultTheme
      })
    ];
  }
});
export {
  Zn as CodeBlockShiki,
  Zn as default
};
