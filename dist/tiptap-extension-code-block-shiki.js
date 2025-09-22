import { Plugin as $, PluginKey as I, Selection as j, TextSelection as v, NodeSelection as fe, AllSelection as Ee } from "@tiptap/pm/state";
import { DecorationSet as Oe, Decoration as ne } from "@tiptap/pm/view";
import "@tiptap/pm/keymap";
import { Fragment as L, Slice as $e, Node as Ie, Schema as Ne, DOMParser as J } from "@tiptap/pm/model";
import { canSplit as H, joinPoint as pe, liftTarget as Pe, canJoin as me, ReplaceStep as Be, ReplaceAroundStep as je } from "@tiptap/pm/transform";
import { wrapIn as Le, setBlockType as oe, selectTextblockStart as Fe, selectTextblockEnd as Re, selectParentNode as De, selectNodeForward as _e, selectNodeBackward as ze, newlineInCode as He, liftEmptyBlock as We, lift as Ke, joinUp as Ve, joinTextblockForward as Je, joinTextblockBackward as Ue, joinForward as Ge, joinDown as qe, joinBackward as Qe, exitCode as Xe, deleteSelection as Ye, createParagraphNear as Ze } from "@tiptap/pm/commands";
import { wrapInList as et, sinkListItem as tt, liftListItem as nt } from "@tiptap/pm/schema-list";
import { bundledThemes as he, bundledLanguages as ge, createHighlighter as ot, codeToHast as rt } from "shiki";
function ye(e) {
  const { state: t, transaction: n } = e;
  let { selection: o } = n, { doc: r } = n, { storedMarks: s } = n;
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
      return o;
    },
    get doc() {
      return r;
    },
    get tr() {
      return o = n.selection, r = n.doc, s = n.storedMarks, n;
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
    const { rawCommands: t, editor: n, state: o } = this, { view: r } = n, { tr: s } = o, i = this.buildProps(s);
    return Object.fromEntries(Object.entries(t).map(([a, c]) => [a, (...d) => {
      const u = c(...d)(i);
      return !s.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(s), u;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(t, n = !0) {
    const { rawCommands: o, editor: r, state: s } = this, { view: i } = r, a = [], c = !!t, l = t || s.tr, d = () => (!c && n && !l.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(l), a.every((f) => f === !0)), u = {
      ...Object.fromEntries(Object.entries(o).map(([f, p]) => [f, (...m) => {
        const h = this.buildProps(l, n), y = p(...m)(h);
        return a.push(y), u;
      }])),
      run: d
    };
    return u;
  }
  createCan(t) {
    const { rawCommands: n, state: o } = this, r = !1, s = t || o.tr, i = this.buildProps(s, r);
    return {
      ...Object.fromEntries(Object.entries(n).map(([c, l]) => [c, (...d) => l(...d)({ ...i, dispatch: void 0 })])),
      chain: () => this.createChain(s, r)
    };
  }
  buildProps(t, n = !0) {
    const { rawCommands: o, editor: r, state: s } = this, { view: i } = r, a = {
      tr: t,
      editor: r,
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
        return Object.fromEntries(Object.entries(o).map(([c, l]) => [c, (...d) => l(...d)(a)]));
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
  const t = e.filter((r) => r.type === "extension"), n = e.filter((r) => r.type === "node"), o = e.filter((r) => r.type === "mark");
  return {
    baseExtensions: t,
    nodeExtensions: n,
    markExtensions: o
  };
}
function x(e, t) {
  if (typeof e == "string") {
    if (!t.nodes[e])
      throw Error(`There is no node type named '${e}'. Maybe you forgot to add the extension?`);
    return t.nodes[e];
  }
  return e;
}
function at(...e) {
  return e.filter((t) => !!t).reduce((t, n) => {
    const o = { ...t };
    return Object.entries(n).forEach(([r, s]) => {
      if (!o[r]) {
        o[r] = s;
        return;
      }
      if (r === "class") {
        const a = s ? String(s).split(" ") : [], c = o[r] ? o[r].split(" ") : [], l = a.filter((d) => !c.includes(d));
        o[r] = [...c, ...l].join(" ");
      } else if (r === "style") {
        const a = s ? s.split(";").map((d) => d.trim()).filter(Boolean) : [], c = o[r] ? o[r].split(";").map((d) => d.trim()).filter(Boolean) : [], l = /* @__PURE__ */ new Map();
        c.forEach((d) => {
          const [u, f] = d.split(":").map((p) => p.trim());
          l.set(u, f);
        }), a.forEach((d) => {
          const [u, f] = d.split(":").map((p) => p.trim());
          l.set(u, f);
        }), o[r] = Array.from(l.entries()).map(([d, u]) => `${d}: ${u}`).join("; ");
      } else
        o[r] = s;
    }), o;
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
  return _(e) && _(t) && Object.keys(t).forEach((o) => {
    _(t[o]) && _(e[o]) ? n[o] = Y(e[o], t[o]) : n[o] = t[o];
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
  const { from: o, to: r } = t, { blockSeparator: s = `

`, textSerializers: i = {} } = n || {};
  let a = "";
  return e.nodesBetween(o, r, (c, l, d, u) => {
    var f;
    c.isBlock && l > o && (a += s);
    const p = i == null ? void 0 : i[c.type.name];
    if (p)
      return d && (a += p({
        node: c,
        pos: l,
        parent: d,
        index: u,
        range: t
      })), !1;
    c.isText && (a += (f = c == null ? void 0 : c.text) === null || f === void 0 ? void 0 : f.slice(Math.max(o, l) - l, r - l));
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
            const { editor: e } = this, { state: t, schema: n } = e, { doc: o, selection: r } = t, { ranges: s } = r, i = Math.min(...s.map((d) => d.$from.pos)), a = Math.max(...s.map((d) => d.$to.pos)), c = pt(n);
            return ft(o, { from: i, to: a }, {
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
  const { selection: o } = t, { ranges: r } = o;
  return n && r.forEach(({ $from: s, $to: i }) => {
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
}, yt = (e) => (t) => e(t), kt = () => ({ state: e, dispatch: t }) => Ze(e, t), xt = (e, t) => ({ editor: n, tr: o }) => {
  const { state: r } = n, s = r.doc.slice(e.from, e.to);
  o.deleteRange(e.from, e.to);
  const i = o.mapping.map(t);
  return o.insert(i, s.content), o.setSelection(new v(o.doc.resolve(Math.max(i - 1, 0)))), !0;
}, wt = () => ({ tr: e, dispatch: t }) => {
  const { selection: n } = e, o = n.$anchor.node();
  if (o.content.size > 0)
    return !1;
  const r = e.selection.$anchor;
  for (let s = r.depth; s > 0; s -= 1)
    if (r.node(s).type === o.type) {
      if (t) {
        const a = r.before(s), c = r.after(s);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, St = (e) => ({ tr: t, state: n, dispatch: o }) => {
  const r = x(e, n.schema), s = t.selection.$anchor;
  for (let i = s.depth; i > 0; i -= 1)
    if (s.node(i).type === r) {
      if (o) {
        const c = s.before(i), l = s.after(i);
        t.delete(c, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Mt = (e) => ({ tr: t, dispatch: n }) => {
  const { from: o, to: r } = e;
  return n && t.delete(o, r), !0;
}, Ct = () => ({ state: e, dispatch: t }) => Ye(e, t), bt = () => ({ commands: e }) => e.keyboardShortcut("Enter"), vt = () => ({ state: e, dispatch: t }) => Xe(e, t);
function K(e, t, n = { strict: !0 }) {
  const o = Object.keys(t);
  return o.length ? o.every((r) => n.strict ? t[r] === e[r] : lt(t[r]) ? t[r].test(e[r]) : t[r] === e[r]) : !0;
}
function ke(e, t, n = {}) {
  return e.find((o) => o.type === t && K(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(n).map((r) => [r, o.attrs[r]])),
    n
  ));
}
function re(e, t, n = {}) {
  return !!ke(e, t, n);
}
function xe(e, t, n) {
  var o;
  if (!e || !t)
    return;
  let r = e.parent.childAfter(e.parentOffset);
  if ((!r.node || !r.node.marks.some((d) => d.type === t)) && (r = e.parent.childBefore(e.parentOffset)), !r.node || !r.node.marks.some((d) => d.type === t) || (n = n || ((o = r.node.marks[0]) === null || o === void 0 ? void 0 : o.attrs), !ke([...r.node.marks], t, n)))
    return;
  let i = r.index, a = e.start() + r.offset, c = i + 1, l = a + r.node.nodeSize;
  for (; i > 0 && re([...e.parent.child(i - 1).marks], t, n); )
    i -= 1, a -= e.parent.child(i).nodeSize;
  for (; c < e.parent.childCount && re([...e.parent.child(c).marks], t, n); )
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
const Tt = (e, t = {}) => ({ tr: n, state: o, dispatch: r }) => {
  const s = P(e, o.schema), { doc: i, selection: a } = n, { $from: c, from: l, to: d } = a;
  if (r) {
    const u = xe(c, s, t);
    if (u && u.from <= l && u.to >= d) {
      const f = v.create(i, u.from, u.to);
      n.setSelection(f);
    }
  }
  return !0;
}, At = (e) => (t) => {
  const n = typeof e == "function" ? e(t) : e;
  for (let o = 0; o < n.length; o += 1)
    if (n[o](t))
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
  const n = j.atStart(e), o = j.atEnd(e);
  if (t === "start" || t === !0)
    return n;
  if (t === "end")
    return o;
  const r = n.from, s = o.to;
  return t === "all" ? v.create(e, B(0, r, s), B(e.content.size, r, s)) : v.create(e, B(t, r, s), B(t, r, s));
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
const $t = (e = null, t = {}) => ({ editor: n, view: o, tr: r, dispatch: s }) => {
  t = {
    scrollIntoView: !0,
    ...t
  };
  const i = () => {
    (Z() || Ot()) && o.dom.focus(), requestAnimationFrame(() => {
      n.isDestroyed || (o.focus(), t != null && t.scrollIntoView && n.commands.scrollIntoView());
    });
  };
  if (o.hasFocus() && e === null || e === !1)
    return !0;
  if (s && e === null && !we(n.state.selection))
    return i(), !0;
  const a = Et(r.doc, e) || n.state.selection, c = n.state.selection.eq(a);
  return s && (c || r.setSelection(a), c && r.storedMarks && r.setStoredMarks(r.storedMarks), i()), !0;
}, It = (e, t) => (n) => e.every((o, r) => t(o, { ...n, index: r })), Nt = (e, t) => ({ tr: n, commands: o }) => o.insertContentAt({ from: n.selection.from, to: n.selection.to }, e, t), Se = (e) => {
  const t = e.childNodes;
  for (let n = t.length - 1; n >= 0; n -= 1) {
    const o = t[n];
    o.nodeType === 3 && o.nodeValue && /^(\n\s\s|\n)$/.test(o.nodeValue) ? e.removeChild(o) : o.nodeType === 1 && Se(o);
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
  const o = typeof e == "object" && e !== null, r = typeof e == "string";
  if (o)
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
  if (r) {
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
  const o = e.steps.length - 1;
  if (o < t)
    return;
  const r = e.steps[o];
  if (!(r instanceof Be || r instanceof je))
    return;
  const s = e.mapping.maps[o];
  let i = 0;
  s.forEach((a, c, l, d) => {
    i === 0 && (i = d);
  }), e.setSelection(j.near(e.doc.resolve(i), n));
}
const Bt = (e) => !("type" in e), jt = (e, t, n) => ({ tr: o, dispatch: r, editor: s }) => {
  var i;
  if (r) {
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
      const { parent: h } = o.doc.resolve(d);
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
      o.insertText(m, d, u);
    } else
      m = a, o.replaceWith(d, u, m);
    n.updateSelection && Pt(o, o.steps.length - 1, -1), n.applyInputRules && o.setMeta("applyInputRules", { from: d, text: m }), n.applyPasteRules && o.setMeta("applyPasteRules", { from: d, text: m });
  }
  return !0;
}, Lt = () => ({ state: e, dispatch: t }) => Ve(e, t), Ft = () => ({ state: e, dispatch: t }) => qe(e, t), Rt = () => ({ state: e, dispatch: t }) => Qe(e, t), Dt = () => ({ state: e, dispatch: t }) => Ge(e, t), _t = () => ({ state: e, dispatch: t, tr: n }) => {
  try {
    const o = pe(e.doc, e.selection.$from.pos, -1);
    return o == null ? !1 : (n.join(o, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, zt = () => ({ state: e, dispatch: t, tr: n }) => {
  try {
    const o = pe(e.doc, e.selection.$from.pos, 1);
    return o == null ? !1 : (n.join(o, 2), t && t(n), !0);
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
  let o, r, s, i;
  for (let a = 0; a < t.length - 1; a += 1) {
    const c = t[a];
    if (/^(cmd|meta|m)$/i.test(c))
      i = !0;
    else if (/^a(lt)?$/i.test(c))
      o = !0;
    else if (/^(c|ctrl|control)$/i.test(c))
      r = !0;
    else if (/^s(hift)?$/i.test(c))
      s = !0;
    else if (/^mod$/i.test(c))
      Z() || Me() ? i = !0 : r = !0;
    else
      throw new Error(`Unrecognized modifier name: ${c}`);
  }
  return o && (n = `Alt-${n}`), r && (n = `Ctrl-${n}`), i && (n = `Meta-${n}`), s && (n = `Shift-${n}`), n;
}
const Vt = (e) => ({ editor: t, view: n, tr: o, dispatch: r }) => {
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
    const d = l.map(o.mapping);
    d && r && o.maybeStep(d);
  }), !0;
};
function ee(e, t, n = {}) {
  const { from: o, to: r, empty: s } = e.selection, i = t ? x(t, e.schema) : null, a = [];
  e.doc.nodesBetween(o, r, (u, f) => {
    if (u.isText)
      return;
    const p = Math.max(o, f), g = Math.min(r, f + u.nodeSize);
    a.push({
      node: u,
      from: p,
      to: g
    });
  });
  const c = r - o, l = a.filter((u) => i ? i.name === u.node.type.name : !0).filter((u) => K(u.node.attrs, n, { strict: !1 }));
  return s ? !!l.length : l.reduce((u, f) => u + f.to - f.from, 0) >= c;
}
const Jt = (e, t = {}) => ({ state: n, dispatch: o }) => {
  const r = x(e, n.schema);
  return ee(n, r, t) ? Ke(n, o) : !1;
}, Ut = () => ({ state: e, dispatch: t }) => We(e, t), Gt = (e) => ({ state: t, dispatch: n }) => {
  const o = x(e, t.schema);
  return nt(o)(t, n);
}, qt = () => ({ state: e, dispatch: t }) => He(e, t);
function Ce(e, t) {
  return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function se(e, t) {
  const n = typeof t == "string" ? [t] : t;
  return Object.keys(e).reduce((o, r) => (n.includes(r) || (o[r] = e[r]), o), {});
}
const Qt = (e, t) => ({ tr: n, state: o, dispatch: r }) => {
  let s = null, i = null;
  const a = Ce(typeof e == "string" ? e : e.name, o.schema);
  return a ? (a === "node" && (s = x(e, o.schema)), a === "mark" && (i = P(e, o.schema)), r && n.selection.ranges.forEach((c) => {
    o.doc.nodesBetween(c.$from.pos, c.$to.pos, (l, d) => {
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
}, Zt = () => ({ state: e, dispatch: t }) => ze(e, t), en = () => ({ state: e, dispatch: t }) => _e(e, t), tn = () => ({ state: e, dispatch: t }) => De(e, t), nn = () => ({ state: e, dispatch: t }) => Re(e, t), on = () => ({ state: e, dispatch: t }) => Fe(e, t);
function rn(e, t, n = {}, o = {}) {
  return D(e, t, {
    slice: !1,
    parseOptions: n,
    errorOnInvalidContent: o.errorOnInvalidContent
  });
}
const sn = (e, t = !1, n = {}, o = {}) => ({ editor: r, tr: s, dispatch: i, commands: a }) => {
  var c, l;
  const { doc: d } = s;
  if (n.preserveWhitespace !== "full") {
    const u = rn(e, r.schema, n, {
      errorOnInvalidContent: (c = o.errorOnInvalidContent) !== null && c !== void 0 ? c : r.options.enableContentCheck
    });
    return i && s.replaceWith(0, d.content.size, u).setMeta("preventUpdate", !t), !0;
  }
  return i && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: d.content.size }, e, {
    parseOptions: n,
    errorOnInvalidContent: (l = o.errorOnInvalidContent) !== null && l !== void 0 ? l : r.options.enableContentCheck
  });
};
function an(e, t) {
  const n = P(t, e.schema), { from: o, to: r, empty: s } = e.selection, i = [];
  s ? (e.storedMarks && i.push(...e.storedMarks), i.push(...e.selection.$head.marks())) : e.doc.nodesBetween(o, r, (c) => {
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
  return e.descendants((o, r) => {
    t(o) && n.push({
      node: o,
      pos: r
    });
  }), n;
}
function ln(e, t) {
  for (let n = e.depth; n > 0; n -= 1) {
    const o = e.node(n);
    if (t(o))
      return {
        pos: n > 0 ? e.before(n) : 0,
        start: e.start(n),
        depth: n,
        node: o
      };
  }
}
function te(e) {
  return (t) => ln(t.$from, e);
}
function W(e, t, n) {
  return Object.fromEntries(Object.entries(n).filter(([o]) => {
    const r = e.find((s) => s.type === t && s.name === o);
    return r ? r.attribute.keepOnSplit : !1;
  }));
}
function dn(e, t, n = {}) {
  const { empty: o, ranges: r } = e.selection, s = t ? P(t, e.schema) : null;
  if (o)
    return !!(e.storedMarks || e.selection.$from.marks()).filter((u) => s ? s.name === u.type.name : !0).find((u) => K(u.attrs, n, { strict: !1 }));
  let i = 0;
  const a = [];
  if (r.forEach(({ $from: u, $to: f }) => {
    const p = u.pos, g = f.pos;
    e.doc.nodesBetween(p, g, (m, h) => {
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(p, h), w = Math.min(g, h + m.nodeSize), M = w - y;
      i += M, a.push(...m.marks.map((k) => ({
        mark: k,
        from: y,
        to: w
      })));
    });
  }), i === 0)
    return !1;
  const c = a.filter((u) => s ? s.name === u.mark.type.name : !0).filter((u) => K(u.mark.attrs, n, { strict: !1 })).reduce((u, f) => u + f.to - f.from, 0), l = a.filter((u) => s ? u.mark.type !== s && u.mark.type.excludes(s) : !0).reduce((u, f) => u + f.to - f.from, 0);
  return (c > 0 ? c + l : c) >= i;
}
function ie(e, t) {
  const { nodeExtensions: n } = it(t), o = n.find((i) => i.name === e);
  if (!o)
    return !1;
  const r = {
    name: o.name,
    options: o.options,
    storage: o.storage
  }, s = E(b(o, "group", r));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function be(e, { checkChildren: t = !0, ignoreWhitespace: n = !1 } = {}) {
  var o;
  if (n) {
    if (e.type.name === "hardBreak")
      return !0;
    if (e.isText)
      return /^\s*$/m.test((o = e.text) !== null && o !== void 0 ? o : "");
  }
  if (e.isText)
    return !e.text;
  if (e.isAtom || e.isLeaf)
    return !1;
  if (e.content.childCount === 0)
    return !0;
  if (t) {
    let r = !0;
    return e.content.forEach((s) => {
      r !== !1 && (be(s, { ignoreWhitespace: n, checkChildren: t }) || (r = !1));
    }), r;
  }
  return !1;
}
function un(e, t, n) {
  var o;
  const { selection: r } = t;
  let s = null;
  if (we(r) && (s = r.$cursor), s) {
    const a = (o = e.storedMarks) !== null && o !== void 0 ? o : s.marks();
    return !!n.isInSet(a) || !a.some((c) => c.type.excludes(n));
  }
  const { ranges: i } = r;
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
const fn = (e, t = {}) => ({ tr: n, state: o, dispatch: r }) => {
  const { selection: s } = n, { empty: i, ranges: a } = s, c = P(e, o.schema);
  if (r)
    if (i) {
      const l = an(o, c);
      n.addStoredMark(c.create({
        ...l,
        ...t
      }));
    } else
      a.forEach((l) => {
        const d = l.$from.pos, u = l.$to.pos;
        o.doc.nodesBetween(d, u, (f, p) => {
          const g = Math.max(p, d), m = Math.min(p + f.nodeSize, u);
          f.marks.find((y) => y.type === c) ? f.marks.forEach((y) => {
            c === y.type && n.addMark(g, m, c.create({
              ...y.attrs,
              ...t
            }));
          }) : n.addMark(g, m, c.create(t));
        });
      });
  return un(o, n, c);
}, pn = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), mn = (e, t = {}) => ({ state: n, dispatch: o, chain: r }) => {
  const s = x(e, n.schema);
  let i;
  return n.selection.$anchor.sameParent(n.selection.$head) && (i = n.selection.$anchor.parent.attrs), s.isTextblock ? r().command(({ commands: a }) => oe(s, { ...i, ...t })(n) ? !0 : a.clearNodes()).command(({ state: a }) => oe(s, { ...i, ...t })(a, o)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, hn = (e) => ({ tr: t, dispatch: n }) => {
  if (n) {
    const { doc: o } = t, r = B(e, 0, o.content.size), s = fe.create(o, r);
    t.setSelection(s);
  }
  return !0;
}, gn = (e) => ({ tr: t, dispatch: n }) => {
  if (n) {
    const { doc: o } = t, { from: r, to: s } = typeof e == "number" ? { from: e, to: e } : e, i = v.atStart(o).from, a = v.atEnd(o).to, c = B(r, i, a), l = B(s, i, a), d = v.create(o, c, l);
    t.setSelection(d);
  }
  return !0;
}, yn = (e) => ({ state: t, dispatch: n }) => {
  const o = x(e, t.schema);
  return tt(o)(t, n);
};
function ae(e, t) {
  const n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
  if (n) {
    const o = n.filter((r) => t == null ? void 0 : t.includes(r.type.name));
    e.tr.ensureMarks(o);
  }
}
const kn = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: o, editor: r }) => {
  const { selection: s, doc: i } = t, { $from: a, $to: c } = s, l = r.extensionManager.attributes, d = W(l, a.node().type.name, a.node().attrs);
  if (s instanceof fe && s.node.isBlock)
    return !a.parentOffset || !H(i, a.pos) ? !1 : (o && (e && ae(n, r.extensionManager.splittableMarks), t.split(a.pos).scrollIntoView()), !0);
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
  ] : void 0), o) {
    if (g && (s instanceof v && t.deleteSelection(), t.split(t.mapping.map(a.pos), 1, p), f && !u && !a.parentOffset && a.parent.type !== f)) {
      const m = t.mapping.map(a.before()), h = t.doc.resolve(m);
      a.node(-1).canReplaceWith(h.index(), h.index() + 1, f) && t.setNodeMarkup(t.mapping.map(a.before()), f);
    }
    e && ae(n, r.extensionManager.splittableMarks), t.scrollIntoView();
  }
  return g;
}, xn = (e, t = {}) => ({ tr: n, state: o, dispatch: r, editor: s }) => {
  var i;
  const a = x(e, o.schema), { $from: c, $to: l } = o.selection, d = o.selection.node;
  if (d && d.isBlock || c.depth < 2 || !c.sameParent(l))
    return !1;
  const u = c.node(-1);
  if (u.type !== a)
    return !1;
  const f = s.extensionManager.attributes;
  if (c.parent.content.size === 0 && c.node(-1).childCount === c.indexAfter(-1)) {
    if (c.depth === 2 || c.node(-3).type !== a || c.index(-2) !== c.node(-2).childCount - 1)
      return !1;
    if (r) {
      let y = L.empty;
      const w = c.index(-1) ? 1 : c.index(-2) ? 2 : 3;
      for (let N = c.depth - w; N >= c.depth - 3; N -= 1)
        y = L.from(c.node(N).copy(y));
      const M = c.indexAfter(-1) < c.node(-2).childCount ? 1 : c.indexAfter(-2) < c.node(-3).childCount ? 2 : 3, k = {
        ...W(f, c.node().type.name, c.node().attrs),
        ...t
      }, S = ((i = a.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(k)) || void 0;
      y = y.append(L.from(a.createAndFill(null, S) || void 0));
      const C = c.before(c.depth - (w - 1));
      n.replace(C, c.after(-M), new $e(y, 4 - w, 0));
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
  if (r) {
    const { selection: y, storedMarks: w } = o, { splittableMarks: M } = s.extensionManager, k = w || y.$to.parentOffset && y.$from.marks();
    if (n.split(c.pos, 2, h).scrollIntoView(), !k || !r)
      return !0;
    const S = k.filter((C) => M.includes(C.type.name));
    n.ensureMarks(S);
  }
  return !0;
}, U = (e, t) => {
  const n = te((i) => i.type === t)(e.selection);
  if (!n)
    return !0;
  const o = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
  if (o === void 0)
    return !0;
  const r = e.doc.nodeAt(o);
  return n.node.type === (r == null ? void 0 : r.type) && me(e.doc, n.pos) && e.join(n.pos), !0;
}, G = (e, t) => {
  const n = te((i) => i.type === t)(e.selection);
  if (!n)
    return !0;
  const o = e.doc.resolve(n.start).after(n.depth);
  if (o === void 0)
    return !0;
  const r = e.doc.nodeAt(o);
  return n.node.type === (r == null ? void 0 : r.type) && me(e.doc, o) && e.join(o), !0;
}, wn = (e, t, n, o = {}) => ({ editor: r, tr: s, state: i, dispatch: a, chain: c, commands: l, can: d }) => {
  const { extensions: u, splittableMarks: f } = r.extensionManager, p = x(e, i.schema), g = x(t, i.schema), { selection: m, storedMarks: h } = i, { $from: y, $to: w } = m, M = y.blockRange(w), k = h || m.$to.parentOffset && m.$from.marks();
  if (!M)
    return !1;
  const S = te((C) => ie(C.type.name, u))(m);
  if (M.depth >= 1 && S && M.depth - S.depth <= 1) {
    if (S.node.type === p)
      return l.liftListItem(g);
    if (ie(S.node.type.name, u) && p.validContent(S.node.content) && a)
      return c().command(() => (s.setNodeMarkup(S.pos, p), !0)).command(() => U(s, p)).command(() => G(s, p)).run();
  }
  return !n || !k || !a ? c().command(() => d().wrapInList(p, o) ? !0 : l.clearNodes()).wrapInList(p, o).command(() => U(s, p)).command(() => G(s, p)).run() : c().command(() => {
    const C = d().wrapInList(p, o), O = k.filter((N) => f.includes(N.type.name));
    return s.ensureMarks(O), C ? !0 : l.clearNodes();
  }).wrapInList(p, o).command(() => U(s, p)).command(() => G(s, p)).run();
}, Sn = (e, t = {}, n = {}) => ({ state: o, commands: r }) => {
  const { extendEmptyMarkRange: s = !1 } = n, i = P(e, o.schema);
  return dn(o, i, t) ? r.unsetMark(i, { extendEmptyMarkRange: s }) : r.setMark(i, t);
}, Mn = (e, t, n = {}) => ({ state: o, commands: r }) => {
  const s = x(e, o.schema), i = x(t, o.schema), a = ee(o, s, n);
  let c;
  return o.selection.$anchor.sameParent(o.selection.$head) && (c = o.selection.$anchor.parent.attrs), a ? r.setNode(i, c) : r.setNode(s, { ...c, ...n });
}, Cn = (e, t = {}) => ({ state: n, commands: o }) => {
  const r = x(e, n.schema);
  return ee(n, r, t) ? o.lift(r) : o.wrapIn(r, t);
}, bn = () => ({ state: e, dispatch: t }) => {
  const n = e.plugins;
  for (let o = 0; o < n.length; o += 1) {
    const r = n[o];
    let s;
    if (r.spec.isInputRules && (s = r.getState(e))) {
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
  const { selection: n } = e, { empty: o, ranges: r } = n;
  return o || t && r.forEach((s) => {
    e.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, Tn = (e, t = {}) => ({ tr: n, state: o, dispatch: r }) => {
  var s;
  const { extendEmptyMarkRange: i = !1 } = t, { selection: a } = n, c = P(e, o.schema), { $from: l, empty: d, ranges: u } = a;
  if (!r)
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
}, An = (e, t = {}) => ({ tr: n, state: o, dispatch: r }) => {
  let s = null, i = null;
  const a = Ce(typeof e == "string" ? e : e.name, o.schema);
  return a ? (a === "node" && (s = x(e, o.schema)), a === "mark" && (i = P(e, o.schema)), r && n.selection.ranges.forEach((c) => {
    const l = c.$from.pos, d = c.$to.pos;
    let u, f, p, g;
    n.selection.empty ? o.doc.nodesBetween(l, d, (m, h) => {
      s && s === m.type && (p = Math.max(h, l), g = Math.min(h + m.nodeSize, d), u = h, f = m);
    }) : o.doc.nodesBetween(l, d, (m, h) => {
      h < l && s && s === m.type && (p = Math.max(h, l), g = Math.min(h + m.nodeSize, d), u = h, f = m), h >= l && h <= d && (s && s === m.type && n.setNodeMarkup(h, void 0, {
        ...m.attrs,
        ...t
      }), i && m.marks.length && m.marks.forEach((y) => {
        if (i === y.type) {
          const w = Math.max(h, l), M = Math.min(h + m.nodeSize, d);
          n.addMark(w, M, i.create({
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
}, En = (e, t = {}) => ({ state: n, dispatch: o }) => {
  const r = x(e, n.schema);
  return Le(r, t)(n, o);
}, On = (e, t = {}) => ({ state: n, dispatch: o }) => {
  const r = x(e, n.schema);
  return et(r, t)(n, o);
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
  selectTextblockStart: on,
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
          handleDrop: (e, t, n, o) => {
            this.editor.emit("drop", {
              editor: this.editor,
              event: t,
              slice: n,
              moved: o
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
              const o = e.state.tr.setMeta("focus", { event: n }).setMeta("addToHistory", !1);
              return t.dispatch(o), !1;
            },
            blur: (t, n) => {
              e.isFocused = !1;
              const o = e.state.tr.setMeta("blur", { event: n }).setMeta("addToHistory", !1);
              return t.dispatch(o), !1;
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
    ]), o = {
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
    }, r = {
      ...o
    }, s = {
      ...o,
      "Ctrl-h": e,
      "Alt-Backspace": e,
      "Ctrl-d": t,
      "Ctrl-Alt-Backspace": t,
      "Alt-Delete": t,
      "Alt-d": t,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Z() || Me() ? s : r;
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
          const o = e.some((m) => m.docChanged) && !t.doc.eq(n.doc), r = e.some((m) => m.getMeta("preventClearDocument"));
          if (!o || r)
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
    handler: ({ state: t, range: n, match: o }) => {
      const r = t.doc.resolve(n.from), s = E(e.getAttributes, void 0, o) || {};
      if (!r.node(-1).canReplaceWith(r.index(-1), r.indexAfter(-1), e.type))
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
        const { state: t } = e, { selection: n } = t, { $from: o, empty: r } = n;
        if (!r || o.parent.type !== this.type)
          return !1;
        const s = o.parentOffset === o.parent.nodeSize - 2, i = o.parent.textContent.endsWith(`

`);
        return !s || !i ? !1 : e.chain().command(({ tr: a }) => (a.delete(o.pos - 2, o.pos), !0)).exitCode().run();
      },
      // exit node on arrow down
      ArrowDown: ({ editor: e }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: t } = e, { selection: n, doc: o } = t, { $from: r, empty: s } = n;
        if (!s || r.parent.type !== this.type || !(r.parentOffset === r.parent.nodeSize - 2))
          return !1;
        const a = r.after();
        return a === void 0 ? !1 : o.nodeAt(a) ? e.commands.command(({ tr: l }) => (l.setSelection(j.near(o.resolve(a))), !0)) : e.commands.exitCode();
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
            const n = t.clipboardData.getData("text/plain"), o = t.clipboardData.getData("vscode-editor-data"), r = o ? JSON.parse(o) : void 0, s = r == null ? void 0 : r.mode;
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
  const o = [];
  for (const r of e) {
    if (n === "v3") {
      const a = r.children.flatMap((c, l) => {
        if (c.type !== "element")
          return c;
        const d = c.children[0];
        if (d.type !== "text")
          return c;
        const u = l === r.children.length - 1;
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
      a.length !== r.children.length && (r.children = a);
    }
    const s = r.children;
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
          o.push({
            info: u,
            line: r,
            token: c,
            isLineCommentOnly: s.length === 3 && c.children.length === 1,
            isJsxStyle: f
          });
        } else
          o.push({
            info: u,
            line: r,
            token: c,
            isLineCommentOnly: s.length === 1 && c.children.length === 1,
            isJsxStyle: !1
          });
    }
  }
  return o;
}
function le(e, t) {
  if (e.type !== "element")
    return !1;
  const n = e.children[0];
  return n.type !== "text" ? !1 : n.value.trim() === t;
}
function de(e, t) {
  let n = e.trimStart();
  const o = e.length - n.length;
  n = n.trimEnd();
  const r = e.length - n.length - o;
  for (const [s, i] of jn) {
    if (i && !t)
      continue;
    const a = s.exec(n);
    if (a)
      return [
        " ".repeat(o) + a[1],
        a[2],
        a[3] ? a[3] + " ".repeat(r) : void 0
      ];
  }
}
function Fn(e) {
  const t = e.match(/(?:\/\/|["'#]|;{1,2}|%{1,2}|--)(\s*)$/);
  return t && t[1].trim().length === 0 ? e.slice(0, t.index) : e;
}
function Rn(e, t, n, o) {
  return o == null && (o = "v3"), {
    name: e,
    code(r) {
      const s = r.children.filter((l) => l.type === "element"), i = [];
      r.data ?? (r.data = {});
      const a = r.data;
      a._shiki_notation ?? (a._shiki_notation = Ln(s, ["jsx", "tsx"].includes(this.options.lang), o));
      const c = a._shiki_notation;
      for (const l of c) {
        if (l.info[1].length === 0)
          continue;
        let d = s.indexOf(l.line);
        l.isLineCommentOnly && o !== "v1" && d++;
        let u = !1;
        if (l.info[1] = l.info[1].replace(t, (...p) => n.call(this, p, l.line, l.token, s, d) ? (u = !0, "") : p[0]), !u)
          continue;
        o === "v1" && (l.info[1] = Fn(l.info[1]));
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
        const d = r.children.indexOf(l), u = r.children[d + 1];
        let f = 1;
        (u == null ? void 0 : u.type) === "text" && (u == null ? void 0 : u.value) === `
` && (f = 2), r.children.splice(d, f);
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
    classActivePre: o = void 0
  } = e;
  return Rn(
    t,
    new RegExp(`\\s*\\[!code (${Object.keys(n).map(Dn).join("|")})(:\\d+)?\\]`),
    function([r, s, i = ":1"], a, c, l, d) {
      const u = Number.parseInt(i.slice(1), 10);
      for (let f = d; f < Math.min(d + u, l.length); f++)
        this.addClassToHast(l[f], n[s]);
      return o && this.addClassToHast(this.pre, o), !0;
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
      (o) => !!o && o in he
    ), n = e.languages.filter(
      (o) => !!o && o in ge
    );
    return console.log("loadHighlighter langs", n), F = ot({
      themes: t,
      langs: n
    }).then((o) => {
      T = o, console.log("loadHighlighter highlighter", T);
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
  defaultLanguage: o
}) {
  const r = R(e, (a) => a.type.name === t), s = [
    ...r.map((a) => a.node.attrs.theme),
    n
  ], i = [
    ...r.map((a) => a.node.attrs.language),
    o
  ];
  if (console.log("initHighlighter codeBlocks", r), console.log("initHighlighter themes", s), console.log("initHighlighter languages", i), T)
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
  defaultLanguage: o
}) {
  let r = [];
  const s = R(e, (i) => i.type.name === t);
  return console.log("children", s), s.forEach((i) => {
    var h, y, w, M;
    let a = i.node.attrs.language || o, c = i.node.attrs.theme || n;
    const l = zn();
    if (!l) return;
    l.getLoadedLanguages().includes(a) || (a = "plaintext");
    const d = l.getLoadedThemes().includes(c) ? c : l.getLoadedThemes()[0], u = l.getTheme(d);
    console.log("block.node.textContent", i.node.textContent), rt(i.node.textContent, {
      theme: "github-light",
      lang: "javascript",
      transformers: [q()]
    }).then((k) => {
      console.log("cooooode to hast", k), console.log("lang", i.node.attrs.language), console.log("theme", u);
    }).catch((k) => {
      console.error("cooooode to hast error", k);
    }), console.log("bagel");
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
    r.push(
      ne.node(i.pos, i.pos + i.node.nodeSize, {
        class: `${(h = p.properties) == null ? void 0 : h.class} node-editor__code-block-shiki`,
        style: (y = p.properties) == null ? void 0 : y.style
      })
    );
    let g = i.pos + 1;
    const m = p.children[0].children;
    console.log("lines", m);
    for (const k of m)
      if ((w = k.children) != null && w.length) {
        let S = g;
        (M = k.children) == null || M.forEach((C) => {
          const O = C.children[0].value.length;
          r.push(
            ne.inline(
              S,
              S + O,
              C.properties
            )
          ), S += O;
        }), g = S;
      } else k.type === "text" && (g += k.value.length);
  }), console.log("decorations", r), r = r.filter((i) => !!i), Oe.create(e, r);
}
function Kn({
  name: e,
  defaultLanguage: t,
  defaultTheme: n
}) {
  const o = new $({
    key: new I("shiki"),
    view(r) {
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
          const a = r.state.doc;
          console.log("initDecorations doc", a), await Wn({ doc: a, name: e, defaultLanguage: t, defaultTheme: n });
          const c = r.state.tr.setMeta("shikiPluginForceDecoration", !0);
          r.dispatch(c);
        }
        // When new codeblocks were added and they have missing themes or
        // languages, load those and then add code decorations once again.
        async checkUndecoratedBlocks() {
          const a = R(
            r.state.doc,
            (d) => d.type.name === e
          );
          if ((await Promise.all(
            a.flatMap((d) => [
              ve(d.node.attrs.theme),
              Te(d.node.attrs.language)
            ])
          )).includes(!0)) {
            const d = r.state.tr.setMeta("shikiPluginForceDecoration", !0);
            r.dispatch(d);
          }
        }
      }
      return new s();
    },
    state: {
      init: (r, { doc: s }) => (console.log("initdd", s), ue({
        doc: s,
        name: e,
        defaultLanguage: t,
        defaultTheme: n
      })),
      apply: (r, s, i, a) => {
        const c = i.selection.$head.parent.type.name, l = a.selection.$head.parent.type.name, d = R(
          i.doc,
          (p) => p.type.name === e
        ), u = R(
          a.doc,
          (p) => p.type.name === e
        );
        console.log("oldNodes", d), console.log("newNodes", u), console.log("apply");
        const f = r.docChanged && // Apply decorations if:
        // selection includes named node,
        ([c, l].includes(e) || // OR transaction adds/removes named node,
        u.length !== d.length || // OR transaction has changes that completely encapsulte a node
        // (for example, a transaction that affects the entire document).
        // Such transactions can happen during collab syncing via y-prosemirror, for example.
        r.steps.some((p) => (
          // @ts-ignore
          p.from !== void 0 && // @ts-ignore
          p.to !== void 0 && d.some((g) => (
            // @ts-ignore
            g.pos >= p.from && // @ts-ignore
            g.pos + g.node.nodeSize <= p.to
          ))
        )));
        return r.getMeta("shikiPluginForceDecoration") || f ? ue({
          doc: r.doc,
          name: e,
          defaultLanguage: t,
          defaultTheme: n
        }) : s.map(r.mapping, r.doc);
      }
    },
    props: {
      decorations(r) {
        return console.log("decorations", r), console.log("shikiPlugin.getState(state)", o.getState(r)), o.getState(r);
      }
    }
  });
  return o;
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
