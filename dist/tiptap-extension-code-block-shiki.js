import { Plugin as O, PluginKey as $, Selection as B, TextSelection as v, NodeSelection as ue, AllSelection as Ae } from "@tiptap/pm/state";
import { DecorationSet as Ee, Decoration as te } from "@tiptap/pm/view";
import "@tiptap/pm/keymap";
import { Fragment as L, Slice as Oe, Node as $e, Schema as Ie, DOMParser as J } from "@tiptap/pm/model";
import { canSplit as H, joinPoint as fe, liftTarget as Ne, canJoin as pe, ReplaceStep as Pe, ReplaceAroundStep as Be } from "@tiptap/pm/transform";
import { wrapIn as je, setBlockType as ne, selectTextblockStart as Le, selectTextblockEnd as Fe, selectParentNode as Re, selectNodeForward as De, selectNodeBackward as _e, newlineInCode as ze, liftEmptyBlock as He, lift as We, joinUp as Ke, joinTextblockForward as Ve, joinTextblockBackward as Je, joinForward as Ue, joinDown as Ge, joinBackward as qe, exitCode as Qe, deleteSelection as Xe, createParagraphNear as Ye } from "@tiptap/pm/commands";
import { wrapInList as Ze, sinkListItem as et, liftListItem as tt } from "@tiptap/pm/schema-list";
import { bundledThemes as me, bundledLanguages as he, createHighlighter as nt } from "shiki";
function ge(e) {
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
class rt {
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
      state: ge({
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
function C(e, t, n) {
  return e.config[t] === void 0 && e.parent ? C(e.parent, t, n) : typeof e.config[t] == "function" ? e.config[t].bind({
    ...n,
    parent: e.parent ? C(e.parent, t, n) : null
  }) : e.config[t];
}
function ot(e) {
  const t = e.filter((o) => o.type === "extension"), n = e.filter((o) => o.type === "node"), r = e.filter((o) => o.type === "mark");
  return {
    baseExtensions: t,
    nodeExtensions: n,
    markExtensions: r
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
function st(...e) {
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
function it(e) {
  return typeof e == "function";
}
function A(e, t = void 0, ...n) {
  return it(e) ? t ? e.bind(t)(...n) : e(...n) : e;
}
function at(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}
class ct {
  constructor(t) {
    this.find = t.find, this.handler = t.handler;
  }
}
function lt(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function _(e) {
  return lt(e) !== "Object" ? !1 : e.constructor === Object && Object.getPrototypeOf(e) === Object.prototype;
}
function X(e, t) {
  const n = { ...e };
  return _(e) && _(t) && Object.keys(t).forEach((r) => {
    _(t[r]) && _(e[r]) ? n[r] = X(e[r], t[r]) : n[r] = t[r];
  }), n;
}
class T {
  constructor(t = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...t
    }, this.name = this.config.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = A(C(this, "addOptions", {
      name: this.name
    }))), this.storage = A(C(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(t = {}) {
    return new T(t);
  }
  configure(t = {}) {
    const n = this.extend({
      ...this.config,
      addOptions: () => X(this.options, t)
    });
    return n.name = this.name, n.parent = this.parent, n;
  }
  extend(t = {}) {
    const n = new T({ ...this.config, ...t });
    return n.parent = this, this.child = n, n.name = t.name ? t.name : n.parent.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = A(C(n, "addOptions", {
      name: n.name
    })), n.storage = A(C(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function dt(e, t, n) {
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
function ut(e) {
  return Object.fromEntries(Object.entries(e.nodes).filter(([, t]) => t.spec.toText).map(([t, n]) => [t, n.spec.toText]));
}
T.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new O({
        key: new $("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: e } = this, { state: t, schema: n } = e, { doc: r, selection: o } = t, { ranges: s } = o, i = Math.min(...s.map((d) => d.$from.pos)), a = Math.max(...s.map((d) => d.$to.pos)), c = ut(n);
            return dt(r, { from: i, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: c
            });
          }
        }
      })
    ];
  }
});
const ft = () => ({ editor: e, view: t }) => (requestAnimationFrame(() => {
  var n;
  e.isDestroyed || (t.dom.blur(), (n = window == null ? void 0 : window.getSelection()) === null || n === void 0 || n.removeAllRanges());
}), !0), pt = (e = !1) => ({ commands: t }) => t.setContent("", e), mt = () => ({ state: e, tr: t, dispatch: n }) => {
  const { selection: r } = t, { ranges: o } = r;
  return n && o.forEach(({ $from: s, $to: i }) => {
    e.doc.nodesBetween(s.pos, i.pos, (a, c) => {
      if (a.type.isText)
        return;
      const { doc: l, mapping: d } = t, u = l.resolve(d.map(c)), f = l.resolve(d.map(c + a.nodeSize)), p = u.blockRange(f);
      if (!p)
        return;
      const g = Ne(p);
      if (a.type.isTextblock) {
        const { defaultType: m } = u.parent.contentMatchAt(u.index());
        t.setNodeMarkup(p.start, m);
      }
      (g || g === 0) && t.lift(p, g);
    });
  }), !0;
}, ht = (e) => (t) => e(t), gt = () => ({ state: e, dispatch: t }) => Ye(e, t), yt = (e, t) => ({ editor: n, tr: r }) => {
  const { state: o } = n, s = o.doc.slice(e.from, e.to);
  r.deleteRange(e.from, e.to);
  const i = r.mapping.map(t);
  return r.insert(i, s.content), r.setSelection(new v(r.doc.resolve(Math.max(i - 1, 0)))), !0;
}, kt = () => ({ tr: e, dispatch: t }) => {
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
}, xt = (e) => ({ tr: t, state: n, dispatch: r }) => {
  const o = x(e, n.schema), s = t.selection.$anchor;
  for (let i = s.depth; i > 0; i -= 1)
    if (s.node(i).type === o) {
      if (r) {
        const c = s.before(i), l = s.after(i);
        t.delete(c, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, wt = (e) => ({ tr: t, dispatch: n }) => {
  const { from: r, to: o } = e;
  return n && t.delete(r, o), !0;
}, St = () => ({ state: e, dispatch: t }) => Xe(e, t), Mt = () => ({ commands: e }) => e.keyboardShortcut("Enter"), bt = () => ({ state: e, dispatch: t }) => Qe(e, t);
function K(e, t, n = { strict: !0 }) {
  const r = Object.keys(t);
  return r.length ? r.every((o) => n.strict ? t[o] === e[o] : at(t[o]) ? t[o].test(e[o]) : t[o] === e[o]) : !0;
}
function ye(e, t, n = {}) {
  return e.find((r) => r.type === t && K(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(n).map((o) => [o, r.attrs[o]])),
    n
  ));
}
function re(e, t, n = {}) {
  return !!ye(e, t, n);
}
function ke(e, t, n) {
  var r;
  if (!e || !t)
    return;
  let o = e.parent.childAfter(e.parentOffset);
  if ((!o.node || !o.node.marks.some((d) => d.type === t)) && (o = e.parent.childBefore(e.parentOffset)), !o.node || !o.node.marks.some((d) => d.type === t) || (n = n || ((r = o.node.marks[0]) === null || r === void 0 ? void 0 : r.attrs), !ye([...o.node.marks], t, n)))
    return;
  let i = o.index, a = e.start() + o.offset, c = i + 1, l = a + o.node.nodeSize;
  for (; i > 0 && re([...e.parent.child(i - 1).marks], t, n); )
    i -= 1, a -= e.parent.child(i).nodeSize;
  for (; c < e.parent.childCount && re([...e.parent.child(c).marks], t, n); )
    l += e.parent.child(c).nodeSize, c += 1;
  return {
    from: a,
    to: l
  };
}
function N(e, t) {
  if (typeof e == "string") {
    if (!t.marks[e])
      throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);
    return t.marks[e];
  }
  return e;
}
const Ct = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  const s = N(e, r.schema), { doc: i, selection: a } = n, { $from: c, from: l, to: d } = a;
  if (o) {
    const u = ke(c, s, t);
    if (u && u.from <= l && u.to >= d) {
      const f = v.create(i, u.from, u.to);
      n.setSelection(f);
    }
  }
  return !0;
}, vt = (e) => (t) => {
  const n = typeof e == "function" ? e(t) : e;
  for (let r = 0; r < n.length; r += 1)
    if (n[r](t))
      return !0;
  return !1;
};
function xe(e) {
  return e instanceof v;
}
function P(e = 0, t = 0, n = 0) {
  return Math.min(Math.max(e, t), n);
}
function Tt(e, t = null) {
  if (!t)
    return null;
  const n = B.atStart(e), r = B.atEnd(e);
  if (t === "start" || t === !0)
    return n;
  if (t === "end")
    return r;
  const o = n.from, s = r.to;
  return t === "all" ? v.create(e, P(0, o, s), P(e.content.size, o, s)) : v.create(e, P(t, o, s), P(t, o, s));
}
function At() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Y() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const Et = (e = null, t = {}) => ({ editor: n, view: r, tr: o, dispatch: s }) => {
  t = {
    scrollIntoView: !0,
    ...t
  };
  const i = () => {
    (Y() || At()) && r.dom.focus(), requestAnimationFrame(() => {
      n.isDestroyed || (r.focus(), t != null && t.scrollIntoView && n.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && e === null || e === !1)
    return !0;
  if (s && e === null && !xe(n.state.selection))
    return i(), !0;
  const a = Tt(o.doc, e) || n.state.selection, c = n.state.selection.eq(a);
  return s && (c || o.setSelection(a), c && o.storedMarks && o.setStoredMarks(o.storedMarks), i()), !0;
}, Ot = (e, t) => (n) => e.every((r, o) => t(r, { ...n, index: o })), $t = (e, t) => ({ tr: n, commands: r }) => r.insertContentAt({ from: n.selection.from, to: n.selection.to }, e, t), we = (e) => {
  const t = e.childNodes;
  for (let n = t.length - 1; n >= 0; n -= 1) {
    const r = t[n];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? e.removeChild(r) : r.nodeType === 1 && we(r);
  }
  return e;
};
function z(e) {
  const t = `<body>${e}</body>`, n = new window.DOMParser().parseFromString(t, "text/html").body;
  return we(n);
}
function D(e, t, n) {
  if (e instanceof $e || e instanceof L)
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
      const c = new Ie({
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
function It(e, t, n) {
  const r = e.steps.length - 1;
  if (r < t)
    return;
  const o = e.steps[r];
  if (!(o instanceof Pe || o instanceof Be))
    return;
  const s = e.mapping.maps[r];
  let i = 0;
  s.forEach((a, c, l, d) => {
    i === 0 && (i = d);
  }), e.setSelection(B.near(e.doc.resolve(i), n));
}
const Nt = (e) => !("type" in e), Pt = (e, t, n) => ({ tr: r, dispatch: o, editor: s }) => {
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
    if ((Nt(a) ? a : [a]).forEach((h) => {
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
    n.updateSelection && It(r, r.steps.length - 1, -1), n.applyInputRules && r.setMeta("applyInputRules", { from: d, text: m }), n.applyPasteRules && r.setMeta("applyPasteRules", { from: d, text: m });
  }
  return !0;
}, Bt = () => ({ state: e, dispatch: t }) => Ke(e, t), jt = () => ({ state: e, dispatch: t }) => Ge(e, t), Lt = () => ({ state: e, dispatch: t }) => qe(e, t), Ft = () => ({ state: e, dispatch: t }) => Ue(e, t), Rt = () => ({ state: e, dispatch: t, tr: n }) => {
  try {
    const r = fe(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, Dt = () => ({ state: e, dispatch: t, tr: n }) => {
  try {
    const r = fe(e.doc, e.selection.$from.pos, 1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, _t = () => ({ state: e, dispatch: t }) => Je(e, t), zt = () => ({ state: e, dispatch: t }) => Ve(e, t);
function Se() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Ht(e) {
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
      Y() || Se() ? i = !0 : o = !0;
    else
      throw new Error(`Unrecognized modifier name: ${c}`);
  }
  return r && (n = `Alt-${n}`), o && (n = `Ctrl-${n}`), i && (n = `Meta-${n}`), s && (n = `Shift-${n}`), n;
}
const Wt = (e) => ({ editor: t, view: n, tr: r, dispatch: o }) => {
  const s = Ht(e).split(/-(?!$)/), i = s.find((l) => !["Alt", "Ctrl", "Meta", "Shift"].includes(l)), a = new KeyboardEvent("keydown", {
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
function Z(e, t, n = {}) {
  const { from: r, to: o, empty: s } = e.selection, i = t ? x(t, e.schema) : null, a = [];
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
const Kt = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = x(e, n.schema);
  return Z(n, o, t) ? We(n, r) : !1;
}, Vt = () => ({ state: e, dispatch: t }) => He(e, t), Jt = (e) => ({ state: t, dispatch: n }) => {
  const r = x(e, t.schema);
  return tt(r)(t, n);
}, Ut = () => ({ state: e, dispatch: t }) => ze(e, t);
function Me(e, t) {
  return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function oe(e, t) {
  const n = typeof t == "string" ? [t] : t;
  return Object.keys(e).reduce((r, o) => (n.includes(o) || (r[o] = e[o]), r), {});
}
const Gt = (e, t) => ({ tr: n, state: r, dispatch: o }) => {
  let s = null, i = null;
  const a = Me(typeof e == "string" ? e : e.name, r.schema);
  return a ? (a === "node" && (s = x(e, r.schema)), a === "mark" && (i = N(e, r.schema)), o && n.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (l, d) => {
      s && s === l.type && n.setNodeMarkup(d, void 0, oe(l.attrs, t)), i && l.marks.length && l.marks.forEach((u) => {
        i === u.type && n.addMark(d, d + l.nodeSize, i.create(oe(u.attrs, t)));
      });
    });
  }), !0) : !1;
}, qt = () => ({ tr: e, dispatch: t }) => (t && e.scrollIntoView(), !0), Qt = () => ({ tr: e, dispatch: t }) => {
  if (t) {
    const n = new Ae(e.doc);
    e.setSelection(n);
  }
  return !0;
}, Xt = () => ({ state: e, dispatch: t }) => _e(e, t), Yt = () => ({ state: e, dispatch: t }) => De(e, t), Zt = () => ({ state: e, dispatch: t }) => Re(e, t), en = () => ({ state: e, dispatch: t }) => Fe(e, t), tn = () => ({ state: e, dispatch: t }) => Le(e, t);
function nn(e, t, n = {}, r = {}) {
  return D(e, t, {
    slice: !1,
    parseOptions: n,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
const rn = (e, t = !1, n = {}, r = {}) => ({ editor: o, tr: s, dispatch: i, commands: a }) => {
  var c, l;
  const { doc: d } = s;
  if (n.preserveWhitespace !== "full") {
    const u = nn(e, o.schema, n, {
      errorOnInvalidContent: (c = r.errorOnInvalidContent) !== null && c !== void 0 ? c : o.options.enableContentCheck
    });
    return i && s.replaceWith(0, d.content.size, u).setMeta("preventUpdate", !t), !0;
  }
  return i && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: d.content.size }, e, {
    parseOptions: n,
    errorOnInvalidContent: (l = r.errorOnInvalidContent) !== null && l !== void 0 ? l : o.options.enableContentCheck
  });
};
function on(e, t) {
  const n = N(t, e.schema), { from: r, to: o, empty: s } = e.selection, i = [];
  s ? (e.storedMarks && i.push(...e.storedMarks), i.push(...e.selection.$head.marks())) : e.doc.nodesBetween(r, o, (c) => {
    i.push(...c.marks);
  });
  const a = i.find((c) => c.type.name === n.name);
  return a ? { ...a.attrs } : {};
}
function sn(e) {
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
function an(e, t) {
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
function ee(e) {
  return (t) => an(t.$from, e);
}
function W(e, t, n) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => {
    const o = e.find((s) => s.type === t && s.name === r);
    return o ? o.attribute.keepOnSplit : !1;
  }));
}
function cn(e, t, n = {}) {
  const { empty: r, ranges: o } = e.selection, s = t ? N(t, e.schema) : null;
  if (r)
    return !!(e.storedMarks || e.selection.$from.marks()).filter((u) => s ? s.name === u.type.name : !0).find((u) => K(u.attrs, n, { strict: !1 }));
  let i = 0;
  const a = [];
  if (o.forEach(({ $from: u, $to: f }) => {
    const p = u.pos, g = f.pos;
    e.doc.nodesBetween(p, g, (m, h) => {
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(p, h), w = Math.min(g, h + m.nodeSize), k = w - y;
      i += k, a.push(...m.marks.map((S) => ({
        mark: S,
        from: y,
        to: w
      })));
    });
  }), i === 0)
    return !1;
  const c = a.filter((u) => s ? s.name === u.mark.type.name : !0).filter((u) => K(u.mark.attrs, n, { strict: !1 })).reduce((u, f) => u + f.to - f.from, 0), l = a.filter((u) => s ? u.mark.type !== s && u.mark.type.excludes(s) : !0).reduce((u, f) => u + f.to - f.from, 0);
  return (c > 0 ? c + l : c) >= i;
}
function se(e, t) {
  const { nodeExtensions: n } = ot(t), r = n.find((i) => i.name === e);
  if (!r)
    return !1;
  const o = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = A(C(r, "group", o));
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
function ln(e, t, n) {
  var r;
  const { selection: o } = t;
  let s = null;
  if (xe(o) && (s = o.$cursor), s) {
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
const dn = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  const { selection: s } = n, { empty: i, ranges: a } = s, c = N(e, r.schema);
  if (o)
    if (i) {
      const l = on(r, c);
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
  return ln(r, n, c);
}, un = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), fn = (e, t = {}) => ({ state: n, dispatch: r, chain: o }) => {
  const s = x(e, n.schema);
  let i;
  return n.selection.$anchor.sameParent(n.selection.$head) && (i = n.selection.$anchor.parent.attrs), s.isTextblock ? o().command(({ commands: a }) => ne(s, { ...i, ...t })(n) ? !0 : a.clearNodes()).command(({ state: a }) => ne(s, { ...i, ...t })(a, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, pn = (e) => ({ tr: t, dispatch: n }) => {
  if (n) {
    const { doc: r } = t, o = P(e, 0, r.content.size), s = ue.create(r, o);
    t.setSelection(s);
  }
  return !0;
}, mn = (e) => ({ tr: t, dispatch: n }) => {
  if (n) {
    const { doc: r } = t, { from: o, to: s } = typeof e == "number" ? { from: e, to: e } : e, i = v.atStart(r).from, a = v.atEnd(r).to, c = P(o, i, a), l = P(s, i, a), d = v.create(r, c, l);
    t.setSelection(d);
  }
  return !0;
}, hn = (e) => ({ state: t, dispatch: n }) => {
  const r = x(e, t.schema);
  return et(r)(t, n);
};
function ie(e, t) {
  const n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
  if (n) {
    const r = n.filter((o) => t == null ? void 0 : t.includes(o.type.name));
    e.tr.ensureMarks(r);
  }
}
const gn = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: r, editor: o }) => {
  const { selection: s, doc: i } = t, { $from: a, $to: c } = s, l = o.extensionManager.attributes, d = W(l, a.node().type.name, a.node().attrs);
  if (s instanceof ue && s.node.isBlock)
    return !a.parentOffset || !H(i, a.pos) ? !1 : (r && (e && ie(n, o.extensionManager.splittableMarks), t.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const u = c.parentOffset === c.parent.content.size, f = a.depth === 0 ? void 0 : sn(a.node(-1).contentMatchAt(a.indexAfter(-1)));
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
    e && ie(n, o.extensionManager.splittableMarks), t.scrollIntoView();
  }
  return g;
}, yn = (e, t = {}) => ({ tr: n, state: r, dispatch: o, editor: s }) => {
  var i;
  const a = x(e, r.schema), { $from: c, $to: l } = r.selection, d = r.selection.node;
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
      const w = c.index(-1) ? 1 : c.index(-2) ? 2 : 3;
      for (let I = c.depth - w; I >= c.depth - 3; I -= 1)
        y = L.from(c.node(I).copy(y));
      const k = c.indexAfter(-1) < c.node(-2).childCount ? 1 : c.indexAfter(-2) < c.node(-3).childCount ? 2 : 3, S = {
        ...W(f, c.node().type.name, c.node().attrs),
        ...t
      }, M = ((i = a.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(S)) || void 0;
      y = y.append(L.from(a.createAndFill(null, M) || void 0));
      const b = c.before(c.depth - (w - 1));
      n.replace(b, c.after(-k), new Oe(y, 4 - w, 0));
      let j = -1;
      n.doc.nodesBetween(b, n.doc.content.size, (I, Te) => {
        if (j > -1)
          return !1;
        I.isTextblock && I.content.size === 0 && (j = Te + 1);
      }), j > -1 && n.setSelection(v.near(n.doc.resolve(j))), n.scrollIntoView();
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
    const { selection: y, storedMarks: w } = r, { splittableMarks: k } = s.extensionManager, S = w || y.$to.parentOffset && y.$from.marks();
    if (n.split(c.pos, 2, h).scrollIntoView(), !S || !o)
      return !0;
    const M = S.filter((b) => k.includes(b.type.name));
    n.ensureMarks(M);
  }
  return !0;
}, U = (e, t) => {
  const n = ee((i) => i.type === t)(e.selection);
  if (!n)
    return !0;
  const r = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
  if (r === void 0)
    return !0;
  const o = e.doc.nodeAt(r);
  return n.node.type === (o == null ? void 0 : o.type) && pe(e.doc, n.pos) && e.join(n.pos), !0;
}, G = (e, t) => {
  const n = ee((i) => i.type === t)(e.selection);
  if (!n)
    return !0;
  const r = e.doc.resolve(n.start).after(n.depth);
  if (r === void 0)
    return !0;
  const o = e.doc.nodeAt(r);
  return n.node.type === (o == null ? void 0 : o.type) && pe(e.doc, r) && e.join(r), !0;
}, kn = (e, t, n, r = {}) => ({ editor: o, tr: s, state: i, dispatch: a, chain: c, commands: l, can: d }) => {
  const { extensions: u, splittableMarks: f } = o.extensionManager, p = x(e, i.schema), g = x(t, i.schema), { selection: m, storedMarks: h } = i, { $from: y, $to: w } = m, k = y.blockRange(w), S = h || m.$to.parentOffset && m.$from.marks();
  if (!k)
    return !1;
  const M = ee((b) => se(b.type.name, u))(m);
  if (k.depth >= 1 && M && k.depth - M.depth <= 1) {
    if (M.node.type === p)
      return l.liftListItem(g);
    if (se(M.node.type.name, u) && p.validContent(M.node.content) && a)
      return c().command(() => (s.setNodeMarkup(M.pos, p), !0)).command(() => U(s, p)).command(() => G(s, p)).run();
  }
  return !n || !S || !a ? c().command(() => d().wrapInList(p, r) ? !0 : l.clearNodes()).wrapInList(p, r).command(() => U(s, p)).command(() => G(s, p)).run() : c().command(() => {
    const b = d().wrapInList(p, r), j = S.filter((I) => f.includes(I.type.name));
    return s.ensureMarks(j), b ? !0 : l.clearNodes();
  }).wrapInList(p, r).command(() => U(s, p)).command(() => G(s, p)).run();
}, xn = (e, t = {}, n = {}) => ({ state: r, commands: o }) => {
  const { extendEmptyMarkRange: s = !1 } = n, i = N(e, r.schema);
  return cn(r, i, t) ? o.unsetMark(i, { extendEmptyMarkRange: s }) : o.setMark(i, t);
}, wn = (e, t, n = {}) => ({ state: r, commands: o }) => {
  const s = x(e, r.schema), i = x(t, r.schema), a = Z(r, s, n);
  let c;
  return r.selection.$anchor.sameParent(r.selection.$head) && (c = r.selection.$anchor.parent.attrs), a ? o.setNode(i, c) : o.setNode(s, { ...c, ...n });
}, Sn = (e, t = {}) => ({ state: n, commands: r }) => {
  const o = x(e, n.schema);
  return Z(n, o, t) ? r.lift(o) : r.wrapIn(o, t);
}, Mn = () => ({ state: e, dispatch: t }) => {
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
}, bn = () => ({ tr: e, dispatch: t }) => {
  const { selection: n } = e, { empty: r, ranges: o } = n;
  return r || t && o.forEach((s) => {
    e.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, Cn = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  var s;
  const { extendEmptyMarkRange: i = !1 } = t, { selection: a } = n, c = N(e, r.schema), { $from: l, empty: d, ranges: u } = a;
  if (!o)
    return !0;
  if (d && i) {
    let { from: f, to: p } = a;
    const g = (s = l.marks().find((h) => h.type === c)) === null || s === void 0 ? void 0 : s.attrs, m = ke(l, c, g);
    m && (f = m.from, p = m.to), n.removeMark(f, p, c);
  } else
    u.forEach((f) => {
      n.removeMark(f.$from.pos, f.$to.pos, c);
    });
  return n.removeStoredMark(c), !0;
}, vn = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  let s = null, i = null;
  const a = Me(typeof e == "string" ? e : e.name, r.schema);
  return a ? (a === "node" && (s = x(e, r.schema)), a === "mark" && (i = N(e, r.schema)), o && n.selection.ranges.forEach((c) => {
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
          const w = Math.max(h, l), k = Math.min(h + m.nodeSize, d);
          n.addMark(w, k, i.create({
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
}, Tn = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = x(e, n.schema);
  return je(o, t)(n, r);
}, An = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = x(e, n.schema);
  return Ze(o, t)(n, r);
};
var En = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: ft,
  clearContent: pt,
  clearNodes: mt,
  command: ht,
  createParagraphNear: gt,
  cut: yt,
  deleteCurrentNode: kt,
  deleteNode: xt,
  deleteRange: wt,
  deleteSelection: St,
  enter: Mt,
  exitCode: bt,
  extendMarkRange: Ct,
  first: vt,
  focus: Et,
  forEach: Ot,
  insertContent: $t,
  insertContentAt: Pt,
  joinBackward: Lt,
  joinDown: jt,
  joinForward: Ft,
  joinItemBackward: Rt,
  joinItemForward: Dt,
  joinTextblockBackward: _t,
  joinTextblockForward: zt,
  joinUp: Bt,
  keyboardShortcut: Wt,
  lift: Kt,
  liftEmptyBlock: Vt,
  liftListItem: Jt,
  newlineInCode: Ut,
  resetAttributes: Gt,
  scrollIntoView: qt,
  selectAll: Qt,
  selectNodeBackward: Xt,
  selectNodeForward: Yt,
  selectParentNode: Zt,
  selectTextblockEnd: en,
  selectTextblockStart: tn,
  setContent: rn,
  setMark: dn,
  setMeta: un,
  setNode: fn,
  setNodeSelection: pn,
  setTextSelection: mn,
  sinkListItem: hn,
  splitBlock: gn,
  splitListItem: yn,
  toggleList: kn,
  toggleMark: xn,
  toggleNode: wn,
  toggleWrap: Sn,
  undoInputRule: Mn,
  unsetAllMarks: bn,
  unsetMark: Cn,
  updateAttributes: vn,
  wrapIn: Tn,
  wrapInList: An
});
T.create({
  name: "commands",
  addCommands() {
    return {
      ...En
    };
  }
});
T.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new O({
        key: new $("tiptapDrop"),
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
T.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new O({
        key: new $("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
const On = new $("focusEvents");
T.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: e } = this;
    return [
      new O({
        key: On,
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
T.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const e = () => this.editor.commands.first(({ commands: i }) => [
      () => i.undoInputRule(),
      // maybe convert first text block node to default node
      () => i.command(({ tr: a }) => {
        const { selection: c, doc: l } = a, { empty: d, $anchor: u } = c, { pos: f, parent: p } = u, g = u.parent.isTextblock && f > 0 ? a.doc.resolve(f - 1) : u, m = g.parent.type.spec.isolating, h = u.pos - u.parentOffset, y = m && g.parent.childCount === 1 ? h === u.pos : B.atStart(l).from === f;
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
    return Y() || Se() ? s : o;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new O({
        key: new $("clearDocument"),
        appendTransaction: (e, t, n) => {
          if (e.some((m) => m.getMeta("composition")))
            return;
          const r = e.some((m) => m.docChanged) && !t.doc.eq(n.doc), o = e.some((m) => m.getMeta("preventClearDocument"));
          if (!r || o)
            return;
          const { empty: s, from: i, to: a } = t.selection, c = B.atStart(t.doc).from, l = B.atEnd(t.doc).to;
          if (s || !(i === c && a === l) || !be(n.doc))
            return;
          const f = n.tr, p = ge({
            state: n,
            transaction: f
          }), { commands: g } = new rt({
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
T.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new O({
        key: new $("tiptapPaste"),
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
T.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new O({
        key: new $("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
function ae(e) {
  return new ct({
    find: e.find,
    handler: ({ state: t, range: n, match: r }) => {
      const o = t.doc.resolve(n.from), s = A(e.getAttributes, void 0, r) || {};
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
    }, this.name = this.config.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = A(C(this, "addOptions", {
      name: this.name
    }))), this.storage = A(C(this, "addStorage", {
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
      addOptions: () => X(this.options, t)
    });
    return n.name = this.name, n.parent = this.parent, n;
  }
  extend(t = {}) {
    const n = new V(t);
    return n.parent = this, this.child = n, n.name = t.name ? t.name : n.parent.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = A(C(n, "addOptions", {
      name: n.name
    })), n.storage = A(C(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
const $n = /^```([a-z]+)?[\s\n]$/, In = /^~~~([a-z]+)?[\s\n]$/, Nn = V.create({
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
      st(this.options.HTMLAttributes, t),
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
        return a === void 0 ? !1 : r.nodeAt(a) ? e.commands.command(({ tr: l }) => (l.setSelection(B.near(r.resolve(a))), !0)) : e.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      ae({
        find: $n,
        type: this.type,
        getAttributes: (e) => ({
          language: e[1]
        })
      }),
      ae({
        find: In,
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
      new O({
        key: new $("codeBlockVSCodeHandler"),
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
}), Pn = [
  [/^(<!--)(.+)(-->)$/, !1],
  [/^(\/\*)(.+)(\*\/)$/, !1],
  [/^(\/\/|["'#]|;{1,2}|%{1,2}|--)(.*)$/, !0],
  /**
   * for multi-line comments like this
   */
  [/^(\*)(.+)$/, !0]
];
function Bn(e, t, n) {
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
        if (!le(d.value, u))
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
      const d = a === s.length - 1, u = le(l.value, d);
      if (u)
        if (t && !d && a !== 0) {
          const f = ce(s[a - 1], "{") && ce(s[a + 1], "}");
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
function ce(e, t) {
  if (e.type !== "element")
    return !1;
  const n = e.children[0];
  return n.type !== "text" ? !1 : n.value.trim() === t;
}
function le(e, t) {
  let n = e.trimStart();
  const r = e.length - n.length;
  n = n.trimEnd();
  const o = e.length - n.length - r;
  for (const [s, i] of Pn) {
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
function jn(e) {
  const t = e.match(/(?:\/\/|["'#]|;{1,2}|%{1,2}|--)(\s*)$/);
  return t && t[1].trim().length === 0 ? e.slice(0, t.index) : e;
}
function Ln(e, t, n, r) {
  return r == null && (r = "v3"), {
    name: e,
    code(o) {
      const s = o.children.filter((l) => l.type === "element"), i = [];
      o.data ?? (o.data = {});
      const a = o.data;
      a._shiki_notation ?? (a._shiki_notation = Bn(s, ["jsx", "tsx"].includes(this.options.lang), r));
      const c = a._shiki_notation;
      for (const l of c) {
        if (l.info[1].length === 0)
          continue;
        let d = s.indexOf(l.line);
        l.isLineCommentOnly && r !== "v1" && d++;
        let u = !1;
        if (l.info[1] = l.info[1].replace(t, (...p) => n.call(this, p, l.line, l.token, s, d) ? (u = !0, "") : p[0]), !u)
          continue;
        r === "v1" && (l.info[1] = jn(l.info[1]));
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
function Fn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Rn(e = {}, t = "@shikijs/transformers:notation-map") {
  const {
    classMap: n = {},
    classActivePre: r = void 0
  } = e;
  return Ln(
    t,
    new RegExp(`\\s*\\[!code (${Object.keys(n).map(Fn).join("|")})(:\\d+)?\\]`),
    function([o, s, i = ":1"], a, c, l, d) {
      const u = Number.parseInt(i.slice(1), 10);
      for (let f = d; f < Math.min(d + u, l.length); f++)
        this.addClassToHast(l[f], n[s]);
      return r && this.addClassToHast(this.pre, r), !0;
    },
    e.matchAlgorithm
  );
}
function Dn(e = {}) {
  const {
    classActiveLine: t = "highlighted",
    classActivePre: n = "has-highlighted"
  } = e;
  return Rn(
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
let E, F;
const q = /* @__PURE__ */ new Set(), Q = /* @__PURE__ */ new Set();
function _n() {
  return E;
}
function zn(e) {
  if (!E && !F) {
    const t = e.themes.filter(
      (r) => !!r && r in me
    ), n = e.languages.filter(
      (r) => !!r && r in he
    );
    return F = nt({
      themes: t,
      langs: n
    }).then((r) => {
      E = r;
    }), F;
  }
  if (F)
    return F;
}
async function Ce(e) {
  return E && !E.getLoadedThemes().includes(e) && !Q.has(e) && e in me ? (Q.add(e), await E.loadTheme(e), Q.delete(e), !0) : !1;
}
async function ve(e) {
  return E && !E.getLoadedLanguages().includes(e) && !q.has(e) && e in he ? (q.add(e), await E.loadLanguage(e), q.delete(e), !0) : !1;
}
async function Hn({
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
  E ? await Promise.all([
    ...s.flatMap((a) => Ce(a)),
    ...i.flatMap((a) => !!a && ve(a))
  ]) : await zn({ languages: i, themes: s });
}
function de({
  doc: e,
  name: t,
  defaultTheme: n,
  defaultLanguage: r
}) {
  let o = [];
  const s = R(e, (i) => i.type.name === t);
  return console.log("children", s), s.forEach((i) => {
    var m, h, y, w;
    let a = i.node.attrs.language || r, c = i.node.attrs.theme || n;
    const l = _n();
    if (!l) return;
    l.getLoadedLanguages().includes(a) || (a = "plaintext");
    const d = l.getLoadedThemes().includes(c) ? c : l.getLoadedThemes()[0], u = l.getTheme(d);
    console.log("block.node.textContent", i.node.textContent);
    const f = l.codeToHast(i.node.textContent, {
      theme: u,
      lang: i.node.attrs.language,
      transformers: [Dn()]
    }).children[0];
    o.push(
      te.node(i.pos, i.pos + i.node.nodeSize, {
        class: `${(m = f.properties) == null ? void 0 : m.class} node-editor__code-block-shiki`,
        style: (h = f.properties) == null ? void 0 : h.style
      })
    );
    let p = i.pos + 1;
    const g = f.children[0].children;
    console.log("lines", g);
    for (const k of g)
      if ((y = k.children) != null && y.length) {
        let S = p;
        (w = k.children) == null || w.forEach((M) => {
          const b = M.children[0].value.length;
          o.push(
            te.inline(
              S,
              S + b,
              M.properties
            )
          ), S += b;
        }), p = S;
      } else k.type === "text" && (p += k.value.length);
  }), console.log("decorations", o), o = o.filter((i) => !!i), Ee.create(e, o);
}
function Wn({
  name: e,
  defaultLanguage: t,
  defaultTheme: n
}) {
  const r = new O({
    key: new $("shiki"),
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
          console.log("initDecorations doc", a), await Hn({ doc: a, name: e, defaultLanguage: t, defaultTheme: n });
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
              Ce(d.node.attrs.theme),
              ve(d.node.attrs.language)
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
      init: (o, { doc: s }) => (console.log("initdd", s), de({
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
        return o.getMeta("shikiPluginForceDecoration") || f ? de({
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
const Yn = Nn.extend({
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
      Wn({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage,
        defaultTheme: this.options.defaultTheme
      })
    ];
  }
});
export {
  Yn as CodeBlockShiki,
  Yn as default
};
