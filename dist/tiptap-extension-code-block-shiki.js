import { Plugin as I, PluginKey as O, Selection as N, TextSelection as b, NodeSelection as le, AllSelection as ve } from "@tiptap/pm/state";
import { DecorationSet as Ae, Decoration as J } from "@tiptap/pm/view";
import "@tiptap/pm/keymap";
import { Fragment as F, Slice as Te, Node as Ee, Schema as Ie, DOMParser as U } from "@tiptap/pm/model";
import { canSplit as H, joinPoint as de, liftTarget as Oe, canJoin as ue, ReplaceStep as $e, ReplaceAroundStep as Pe } from "@tiptap/pm/transform";
import { wrapIn as Be, setBlockType as ne, selectTextblockStart as Ne, selectTextblockEnd as je, selectParentNode as Fe, selectNodeForward as Le, selectNodeBackward as De, newlineInCode as Re, liftEmptyBlock as ze, lift as _e, joinUp as He, joinTextblockForward as We, joinTextblockBackward as Ke, joinForward as Ve, joinDown as Je, joinBackward as Ue, exitCode as Ge, deleteSelection as qe, createParagraphNear as Qe } from "@tiptap/pm/commands";
import { wrapInList as Xe, sinkListItem as Ye, liftListItem as Ze } from "@tiptap/pm/schema-list";
import { bundledThemes as fe, bundledLanguages as pe, createHighlighter as et } from "shiki";
function me(e) {
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
class tt {
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
        const h = this.buildProps(l, n), k = p(...m)(h);
        return a.push(k), u;
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
      state: me({
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
function M(e, t, n) {
  return e.config[t] === void 0 && e.parent ? M(e.parent, t, n) : typeof e.config[t] == "function" ? e.config[t].bind({
    ...n,
    parent: e.parent ? M(e.parent, t, n) : null
  }) : e.config[t];
}
function nt(e) {
  const t = e.filter((o) => o.type === "extension"), n = e.filter((o) => o.type === "node"), r = e.filter((o) => o.type === "mark");
  return {
    baseExtensions: t,
    nodeExtensions: n,
    markExtensions: r
  };
}
function y(e, t) {
  if (typeof e == "string") {
    if (!t.nodes[e])
      throw Error(`There is no node type named '${e}'. Maybe you forgot to add the extension?`);
    return t.nodes[e];
  }
  return e;
}
function rt(...e) {
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
function ot(e) {
  return typeof e == "function";
}
function A(e, t = void 0, ...n) {
  return ot(e) ? t ? e.bind(t)(...n) : e(...n) : e;
}
function st(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}
class it {
  constructor(t) {
    this.find = t.find, this.handler = t.handler;
  }
}
function at(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function z(e) {
  return at(e) !== "Object" ? !1 : e.constructor === Object && Object.getPrototypeOf(e) === Object.prototype;
}
function Y(e, t) {
  const n = { ...e };
  return z(e) && z(t) && Object.keys(t).forEach((r) => {
    z(t[r]) && z(e[r]) ? n[r] = Y(e[r], t[r]) : n[r] = t[r];
  }), n;
}
class C {
  constructor(t = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...t
    }, this.name = this.config.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = A(M(this, "addOptions", {
      name: this.name
    }))), this.storage = A(M(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(t = {}) {
    return new C(t);
  }
  configure(t = {}) {
    const n = this.extend({
      ...this.config,
      addOptions: () => Y(this.options, t)
    });
    return n.name = this.name, n.parent = this.parent, n;
  }
  extend(t = {}) {
    const n = new C({ ...this.config, ...t });
    return n.parent = this, this.child = n, n.name = t.name ? t.name : n.parent.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = A(M(n, "addOptions", {
      name: n.name
    })), n.storage = A(M(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
function ct(e, t, n) {
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
function lt(e) {
  return Object.fromEntries(Object.entries(e.nodes).filter(([, t]) => t.spec.toText).map(([t, n]) => [t, n.spec.toText]));
}
C.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new I({
        key: new O("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: e } = this, { state: t, schema: n } = e, { doc: r, selection: o } = t, { ranges: s } = o, i = Math.min(...s.map((d) => d.$from.pos)), a = Math.max(...s.map((d) => d.$to.pos)), c = lt(n);
            return ct(r, { from: i, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: c
            });
          }
        }
      })
    ];
  }
});
const dt = () => ({ editor: e, view: t }) => (requestAnimationFrame(() => {
  var n;
  e.isDestroyed || (t.dom.blur(), (n = window == null ? void 0 : window.getSelection()) === null || n === void 0 || n.removeAllRanges());
}), !0), ut = (e = !1) => ({ commands: t }) => t.setContent("", e), ft = () => ({ state: e, tr: t, dispatch: n }) => {
  const { selection: r } = t, { ranges: o } = r;
  return n && o.forEach(({ $from: s, $to: i }) => {
    e.doc.nodesBetween(s.pos, i.pos, (a, c) => {
      if (a.type.isText)
        return;
      const { doc: l, mapping: d } = t, u = l.resolve(d.map(c)), f = l.resolve(d.map(c + a.nodeSize)), p = u.blockRange(f);
      if (!p)
        return;
      const g = Oe(p);
      if (a.type.isTextblock) {
        const { defaultType: m } = u.parent.contentMatchAt(u.index());
        t.setNodeMarkup(p.start, m);
      }
      (g || g === 0) && t.lift(p, g);
    });
  }), !0;
}, pt = (e) => (t) => e(t), mt = () => ({ state: e, dispatch: t }) => Qe(e, t), ht = (e, t) => ({ editor: n, tr: r }) => {
  const { state: o } = n, s = o.doc.slice(e.from, e.to);
  r.deleteRange(e.from, e.to);
  const i = r.mapping.map(t);
  return r.insert(i, s.content), r.setSelection(new b(r.doc.resolve(Math.max(i - 1, 0)))), !0;
}, gt = () => ({ tr: e, dispatch: t }) => {
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
}, kt = (e) => ({ tr: t, state: n, dispatch: r }) => {
  const o = y(e, n.schema), s = t.selection.$anchor;
  for (let i = s.depth; i > 0; i -= 1)
    if (s.node(i).type === o) {
      if (r) {
        const c = s.before(i), l = s.after(i);
        t.delete(c, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, yt = (e) => ({ tr: t, dispatch: n }) => {
  const { from: r, to: o } = e;
  return n && t.delete(r, o), !0;
}, wt = () => ({ state: e, dispatch: t }) => qe(e, t), xt = () => ({ commands: e }) => e.keyboardShortcut("Enter"), St = () => ({ state: e, dispatch: t }) => Ge(e, t);
function K(e, t, n = { strict: !0 }) {
  const r = Object.keys(t);
  return r.length ? r.every((o) => n.strict ? t[o] === e[o] : st(t[o]) ? t[o].test(e[o]) : t[o] === e[o]) : !0;
}
function he(e, t, n = {}) {
  return e.find((r) => r.type === t && K(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(n).map((o) => [o, r.attrs[o]])),
    n
  ));
}
function re(e, t, n = {}) {
  return !!he(e, t, n);
}
function ge(e, t, n) {
  var r;
  if (!e || !t)
    return;
  let o = e.parent.childAfter(e.parentOffset);
  if ((!o.node || !o.node.marks.some((d) => d.type === t)) && (o = e.parent.childBefore(e.parentOffset)), !o.node || !o.node.marks.some((d) => d.type === t) || (n = n || ((r = o.node.marks[0]) === null || r === void 0 ? void 0 : r.attrs), !he([...o.node.marks], t, n)))
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
function P(e, t) {
  if (typeof e == "string") {
    if (!t.marks[e])
      throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);
    return t.marks[e];
  }
  return e;
}
const Mt = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  const s = P(e, r.schema), { doc: i, selection: a } = n, { $from: c, from: l, to: d } = a;
  if (o) {
    const u = ge(c, s, t);
    if (u && u.from <= l && u.to >= d) {
      const f = b.create(i, u.from, u.to);
      n.setSelection(f);
    }
  }
  return !0;
}, bt = (e) => (t) => {
  const n = typeof e == "function" ? e(t) : e;
  for (let r = 0; r < n.length; r += 1)
    if (n[r](t))
      return !0;
  return !1;
};
function ke(e) {
  return e instanceof b;
}
function B(e = 0, t = 0, n = 0) {
  return Math.min(Math.max(e, t), n);
}
function Ct(e, t = null) {
  if (!t)
    return null;
  const n = N.atStart(e), r = N.atEnd(e);
  if (t === "start" || t === !0)
    return n;
  if (t === "end")
    return r;
  const o = n.from, s = r.to;
  return t === "all" ? b.create(e, B(0, o, s), B(e.content.size, o, s)) : b.create(e, B(t, o, s), B(t, o, s));
}
function vt() {
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
const At = (e = null, t = {}) => ({ editor: n, view: r, tr: o, dispatch: s }) => {
  t = {
    scrollIntoView: !0,
    ...t
  };
  const i = () => {
    (Z() || vt()) && r.dom.focus(), requestAnimationFrame(() => {
      n.isDestroyed || (r.focus(), t != null && t.scrollIntoView && n.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && e === null || e === !1)
    return !0;
  if (s && e === null && !ke(n.state.selection))
    return i(), !0;
  const a = Ct(o.doc, e) || n.state.selection, c = n.state.selection.eq(a);
  return s && (c || o.setSelection(a), c && o.storedMarks && o.setStoredMarks(o.storedMarks), i()), !0;
}, Tt = (e, t) => (n) => e.every((r, o) => t(r, { ...n, index: o })), Et = (e, t) => ({ tr: n, commands: r }) => r.insertContentAt({ from: n.selection.from, to: n.selection.to }, e, t), ye = (e) => {
  const t = e.childNodes;
  for (let n = t.length - 1; n >= 0; n -= 1) {
    const r = t[n];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? e.removeChild(r) : r.nodeType === 1 && ye(r);
  }
  return e;
};
function _(e) {
  const t = `<body>${e}</body>`, n = new window.DOMParser().parseFromString(t, "text/html").body;
  return ye(n);
}
function R(e, t, n) {
  if (e instanceof Ee || e instanceof F)
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
        return F.fromArray(e.map((a) => t.nodeFromJSON(a)));
      const i = t.nodeFromJSON(e);
      return n.errorOnInvalidContent && i.check(), i;
    } catch (s) {
      if (n.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: s });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", e, "Error:", s), R("", t, n);
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
      if (n.slice ? U.fromSchema(c).parseSlice(_(e), n.parseOptions) : U.fromSchema(c).parse(_(e), n.parseOptions), n.errorOnInvalidContent && i)
        throw new Error("[tiptap error]: Invalid HTML content", { cause: new Error(`Invalid element found: ${a}`) });
    }
    const s = U.fromSchema(t);
    return n.slice ? s.parseSlice(_(e), n.parseOptions).content : s.parse(_(e), n.parseOptions);
  }
  return R("", t, n);
}
function It(e, t, n) {
  const r = e.steps.length - 1;
  if (r < t)
    return;
  const o = e.steps[r];
  if (!(o instanceof $e || o instanceof Pe))
    return;
  const s = e.mapping.maps[r];
  let i = 0;
  s.forEach((a, c, l, d) => {
    i === 0 && (i = d);
  }), e.setSelection(N.near(e.doc.resolve(i), n));
}
const Ot = (e) => !("type" in e), $t = (e, t, n) => ({ tr: r, dispatch: o, editor: s }) => {
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
        R(t, s.schema, {
          parseOptions: l,
          errorOnInvalidContent: !0
        });
      } catch (h) {
        c(h);
      }
    try {
      a = R(t, s.schema, {
        parseOptions: l,
        errorOnInvalidContent: (i = n.errorOnInvalidContent) !== null && i !== void 0 ? i : s.options.enableContentCheck
      });
    } catch (h) {
      return c(h), !1;
    }
    let { from: d, to: u } = typeof e == "number" ? { from: e, to: e } : { from: e.from, to: e.to }, f = !0, p = !0;
    if ((Ot(a) ? a : [a]).forEach((h) => {
      h.check(), f = f ? h.isText && h.marks.length === 0 : !1, p = p ? h.isBlock : !1;
    }), d === u && p) {
      const { parent: h } = r.doc.resolve(d);
      h.isTextblock && !h.type.spec.code && !h.childCount && (d -= 1, u += 1);
    }
    let m;
    if (f) {
      if (Array.isArray(t))
        m = t.map((h) => h.text || "").join("");
      else if (t instanceof F) {
        let h = "";
        t.forEach((k) => {
          k.text && (h += k.text);
        }), m = h;
      } else typeof t == "object" && t && t.text ? m = t.text : m = t;
      r.insertText(m, d, u);
    } else
      m = a, r.replaceWith(d, u, m);
    n.updateSelection && It(r, r.steps.length - 1, -1), n.applyInputRules && r.setMeta("applyInputRules", { from: d, text: m }), n.applyPasteRules && r.setMeta("applyPasteRules", { from: d, text: m });
  }
  return !0;
}, Pt = () => ({ state: e, dispatch: t }) => He(e, t), Bt = () => ({ state: e, dispatch: t }) => Je(e, t), Nt = () => ({ state: e, dispatch: t }) => Ue(e, t), jt = () => ({ state: e, dispatch: t }) => Ve(e, t), Ft = () => ({ state: e, dispatch: t, tr: n }) => {
  try {
    const r = de(e.doc, e.selection.$from.pos, -1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, Lt = () => ({ state: e, dispatch: t, tr: n }) => {
  try {
    const r = de(e.doc, e.selection.$from.pos, 1);
    return r == null ? !1 : (n.join(r, 2), t && t(n), !0);
  } catch {
    return !1;
  }
}, Dt = () => ({ state: e, dispatch: t }) => Ke(e, t), Rt = () => ({ state: e, dispatch: t }) => We(e, t);
function we() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function zt(e) {
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
      Z() || we() ? i = !0 : o = !0;
    else
      throw new Error(`Unrecognized modifier name: ${c}`);
  }
  return r && (n = `Alt-${n}`), o && (n = `Ctrl-${n}`), i && (n = `Meta-${n}`), s && (n = `Shift-${n}`), n;
}
const _t = (e) => ({ editor: t, view: n, tr: r, dispatch: o }) => {
  const s = zt(e).split(/-(?!$)/), i = s.find((l) => !["Alt", "Ctrl", "Meta", "Shift"].includes(l)), a = new KeyboardEvent("keydown", {
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
  const { from: r, to: o, empty: s } = e.selection, i = t ? y(t, e.schema) : null, a = [];
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
const Ht = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = y(e, n.schema);
  return ee(n, o, t) ? _e(n, r) : !1;
}, Wt = () => ({ state: e, dispatch: t }) => ze(e, t), Kt = (e) => ({ state: t, dispatch: n }) => {
  const r = y(e, t.schema);
  return Ze(r)(t, n);
}, Vt = () => ({ state: e, dispatch: t }) => Re(e, t);
function xe(e, t) {
  return t.nodes[e] ? "node" : t.marks[e] ? "mark" : null;
}
function oe(e, t) {
  const n = typeof t == "string" ? [t] : t;
  return Object.keys(e).reduce((r, o) => (n.includes(o) || (r[o] = e[o]), r), {});
}
const Jt = (e, t) => ({ tr: n, state: r, dispatch: o }) => {
  let s = null, i = null;
  const a = xe(typeof e == "string" ? e : e.name, r.schema);
  return a ? (a === "node" && (s = y(e, r.schema)), a === "mark" && (i = P(e, r.schema)), o && n.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (l, d) => {
      s && s === l.type && n.setNodeMarkup(d, void 0, oe(l.attrs, t)), i && l.marks.length && l.marks.forEach((u) => {
        i === u.type && n.addMark(d, d + l.nodeSize, i.create(oe(u.attrs, t)));
      });
    });
  }), !0) : !1;
}, Ut = () => ({ tr: e, dispatch: t }) => (t && e.scrollIntoView(), !0), Gt = () => ({ tr: e, dispatch: t }) => {
  if (t) {
    const n = new ve(e.doc);
    e.setSelection(n);
  }
  return !0;
}, qt = () => ({ state: e, dispatch: t }) => De(e, t), Qt = () => ({ state: e, dispatch: t }) => Le(e, t), Xt = () => ({ state: e, dispatch: t }) => Fe(e, t), Yt = () => ({ state: e, dispatch: t }) => je(e, t), Zt = () => ({ state: e, dispatch: t }) => Ne(e, t);
function en(e, t, n = {}, r = {}) {
  return R(e, t, {
    slice: !1,
    parseOptions: n,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
const tn = (e, t = !1, n = {}, r = {}) => ({ editor: o, tr: s, dispatch: i, commands: a }) => {
  var c, l;
  const { doc: d } = s;
  if (n.preserveWhitespace !== "full") {
    const u = en(e, o.schema, n, {
      errorOnInvalidContent: (c = r.errorOnInvalidContent) !== null && c !== void 0 ? c : o.options.enableContentCheck
    });
    return i && s.replaceWith(0, d.content.size, u).setMeta("preventUpdate", !t), !0;
  }
  return i && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: d.content.size }, e, {
    parseOptions: n,
    errorOnInvalidContent: (l = r.errorOnInvalidContent) !== null && l !== void 0 ? l : o.options.enableContentCheck
  });
};
function nn(e, t) {
  const n = P(t, e.schema), { from: r, to: o, empty: s } = e.selection, i = [];
  s ? (e.storedMarks && i.push(...e.storedMarks), i.push(...e.selection.$head.marks())) : e.doc.nodesBetween(r, o, (c) => {
    i.push(...c.marks);
  });
  const a = i.find((c) => c.type.name === n.name);
  return a ? { ...a.attrs } : {};
}
function rn(e) {
  for (let t = 0; t < e.edgeCount; t += 1) {
    const { type: n } = e.edge(t);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
function D(e, t) {
  const n = [];
  return e.descendants((r, o) => {
    t(r) && n.push({
      node: r,
      pos: o
    });
  }), n;
}
function on(e, t) {
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
  return (t) => on(t.$from, e);
}
function W(e, t, n) {
  return Object.fromEntries(Object.entries(n).filter(([r]) => {
    const o = e.find((s) => s.type === t && s.name === r);
    return o ? o.attribute.keepOnSplit : !1;
  }));
}
function sn(e, t, n = {}) {
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
      const k = Math.max(p, h), w = Math.min(g, h + m.nodeSize), x = w - k;
      i += x, a.push(...m.marks.map((S) => ({
        mark: S,
        from: k,
        to: w
      })));
    });
  }), i === 0)
    return !1;
  const c = a.filter((u) => s ? s.name === u.mark.type.name : !0).filter((u) => K(u.mark.attrs, n, { strict: !1 })).reduce((u, f) => u + f.to - f.from, 0), l = a.filter((u) => s ? u.mark.type !== s && u.mark.type.excludes(s) : !0).reduce((u, f) => u + f.to - f.from, 0);
  return (c > 0 ? c + l : c) >= i;
}
function se(e, t) {
  const { nodeExtensions: n } = nt(t), r = n.find((i) => i.name === e);
  if (!r)
    return !1;
  const o = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = A(M(r, "group", o));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function Se(e, { checkChildren: t = !0, ignoreWhitespace: n = !1 } = {}) {
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
      o !== !1 && (Se(s, { ignoreWhitespace: n, checkChildren: t }) || (o = !1));
    }), o;
  }
  return !1;
}
function an(e, t, n) {
  var r;
  const { selection: o } = t;
  let s = null;
  if (ke(o) && (s = o.$cursor), s) {
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
const cn = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  const { selection: s } = n, { empty: i, ranges: a } = s, c = P(e, r.schema);
  if (o)
    if (i) {
      const l = nn(r, c);
      n.addStoredMark(c.create({
        ...l,
        ...t
      }));
    } else
      a.forEach((l) => {
        const d = l.$from.pos, u = l.$to.pos;
        r.doc.nodesBetween(d, u, (f, p) => {
          const g = Math.max(p, d), m = Math.min(p + f.nodeSize, u);
          f.marks.find((k) => k.type === c) ? f.marks.forEach((k) => {
            c === k.type && n.addMark(g, m, c.create({
              ...k.attrs,
              ...t
            }));
          }) : n.addMark(g, m, c.create(t));
        });
      });
  return an(r, n, c);
}, ln = (e, t) => ({ tr: n }) => (n.setMeta(e, t), !0), dn = (e, t = {}) => ({ state: n, dispatch: r, chain: o }) => {
  const s = y(e, n.schema);
  let i;
  return n.selection.$anchor.sameParent(n.selection.$head) && (i = n.selection.$anchor.parent.attrs), s.isTextblock ? o().command(({ commands: a }) => ne(s, { ...i, ...t })(n) ? !0 : a.clearNodes()).command(({ state: a }) => ne(s, { ...i, ...t })(a, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, un = (e) => ({ tr: t, dispatch: n }) => {
  if (n) {
    const { doc: r } = t, o = B(e, 0, r.content.size), s = le.create(r, o);
    t.setSelection(s);
  }
  return !0;
}, fn = (e) => ({ tr: t, dispatch: n }) => {
  if (n) {
    const { doc: r } = t, { from: o, to: s } = typeof e == "number" ? { from: e, to: e } : e, i = b.atStart(r).from, a = b.atEnd(r).to, c = B(o, i, a), l = B(s, i, a), d = b.create(r, c, l);
    t.setSelection(d);
  }
  return !0;
}, pn = (e) => ({ state: t, dispatch: n }) => {
  const r = y(e, t.schema);
  return Ye(r)(t, n);
};
function ie(e, t) {
  const n = e.storedMarks || e.selection.$to.parentOffset && e.selection.$from.marks();
  if (n) {
    const r = n.filter((o) => t == null ? void 0 : t.includes(o.type.name));
    e.tr.ensureMarks(r);
  }
}
const mn = ({ keepMarks: e = !0 } = {}) => ({ tr: t, state: n, dispatch: r, editor: o }) => {
  const { selection: s, doc: i } = t, { $from: a, $to: c } = s, l = o.extensionManager.attributes, d = W(l, a.node().type.name, a.node().attrs);
  if (s instanceof le && s.node.isBlock)
    return !a.parentOffset || !H(i, a.pos) ? !1 : (r && (e && ie(n, o.extensionManager.splittableMarks), t.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const u = c.parentOffset === c.parent.content.size, f = a.depth === 0 ? void 0 : rn(a.node(-1).contentMatchAt(a.indexAfter(-1)));
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
    if (g && (s instanceof b && t.deleteSelection(), t.split(t.mapping.map(a.pos), 1, p), f && !u && !a.parentOffset && a.parent.type !== f)) {
      const m = t.mapping.map(a.before()), h = t.doc.resolve(m);
      a.node(-1).canReplaceWith(h.index(), h.index() + 1, f) && t.setNodeMarkup(t.mapping.map(a.before()), f);
    }
    e && ie(n, o.extensionManager.splittableMarks), t.scrollIntoView();
  }
  return g;
}, hn = (e, t = {}) => ({ tr: n, state: r, dispatch: o, editor: s }) => {
  var i;
  const a = y(e, r.schema), { $from: c, $to: l } = r.selection, d = r.selection.node;
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
      let k = F.empty;
      const w = c.index(-1) ? 1 : c.index(-2) ? 2 : 3;
      for (let $ = c.depth - w; $ >= c.depth - 3; $ -= 1)
        k = F.from(c.node($).copy(k));
      const x = c.indexAfter(-1) < c.node(-2).childCount ? 1 : c.indexAfter(-2) < c.node(-3).childCount ? 2 : 3, S = {
        ...W(f, c.node().type.name, c.node().attrs),
        ...t
      }, v = ((i = a.contentMatch.defaultType) === null || i === void 0 ? void 0 : i.createAndFill(S)) || void 0;
      k = k.append(F.from(a.createAndFill(null, v) || void 0));
      const E = c.before(c.depth - (w - 1));
      n.replace(E, c.after(-x), new Te(k, 4 - w, 0));
      let j = -1;
      n.doc.nodesBetween(E, n.doc.content.size, ($, Ce) => {
        if (j > -1)
          return !1;
        $.isTextblock && $.content.size === 0 && (j = Ce + 1);
      }), j > -1 && n.setSelection(b.near(n.doc.resolve(j))), n.scrollIntoView();
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
    const { selection: k, storedMarks: w } = r, { splittableMarks: x } = s.extensionManager, S = w || k.$to.parentOffset && k.$from.marks();
    if (n.split(c.pos, 2, h).scrollIntoView(), !S || !o)
      return !0;
    const v = S.filter((E) => x.includes(E.type.name));
    n.ensureMarks(v);
  }
  return !0;
}, G = (e, t) => {
  const n = te((i) => i.type === t)(e.selection);
  if (!n)
    return !0;
  const r = e.doc.resolve(Math.max(0, n.pos - 1)).before(n.depth);
  if (r === void 0)
    return !0;
  const o = e.doc.nodeAt(r);
  return n.node.type === (o == null ? void 0 : o.type) && ue(e.doc, n.pos) && e.join(n.pos), !0;
}, q = (e, t) => {
  const n = te((i) => i.type === t)(e.selection);
  if (!n)
    return !0;
  const r = e.doc.resolve(n.start).after(n.depth);
  if (r === void 0)
    return !0;
  const o = e.doc.nodeAt(r);
  return n.node.type === (o == null ? void 0 : o.type) && ue(e.doc, r) && e.join(r), !0;
}, gn = (e, t, n, r = {}) => ({ editor: o, tr: s, state: i, dispatch: a, chain: c, commands: l, can: d }) => {
  const { extensions: u, splittableMarks: f } = o.extensionManager, p = y(e, i.schema), g = y(t, i.schema), { selection: m, storedMarks: h } = i, { $from: k, $to: w } = m, x = k.blockRange(w), S = h || m.$to.parentOffset && m.$from.marks();
  if (!x)
    return !1;
  const v = te((E) => se(E.type.name, u))(m);
  if (x.depth >= 1 && v && x.depth - v.depth <= 1) {
    if (v.node.type === p)
      return l.liftListItem(g);
    if (se(v.node.type.name, u) && p.validContent(v.node.content) && a)
      return c().command(() => (s.setNodeMarkup(v.pos, p), !0)).command(() => G(s, p)).command(() => q(s, p)).run();
  }
  return !n || !S || !a ? c().command(() => d().wrapInList(p, r) ? !0 : l.clearNodes()).wrapInList(p, r).command(() => G(s, p)).command(() => q(s, p)).run() : c().command(() => {
    const E = d().wrapInList(p, r), j = S.filter(($) => f.includes($.type.name));
    return s.ensureMarks(j), E ? !0 : l.clearNodes();
  }).wrapInList(p, r).command(() => G(s, p)).command(() => q(s, p)).run();
}, kn = (e, t = {}, n = {}) => ({ state: r, commands: o }) => {
  const { extendEmptyMarkRange: s = !1 } = n, i = P(e, r.schema);
  return sn(r, i, t) ? o.unsetMark(i, { extendEmptyMarkRange: s }) : o.setMark(i, t);
}, yn = (e, t, n = {}) => ({ state: r, commands: o }) => {
  const s = y(e, r.schema), i = y(t, r.schema), a = ee(r, s, n);
  let c;
  return r.selection.$anchor.sameParent(r.selection.$head) && (c = r.selection.$anchor.parent.attrs), a ? o.setNode(i, c) : o.setNode(s, { ...c, ...n });
}, wn = (e, t = {}) => ({ state: n, commands: r }) => {
  const o = y(e, n.schema);
  return ee(n, o, t) ? r.lift(o) : r.wrapIn(o, t);
}, xn = () => ({ state: e, dispatch: t }) => {
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
}, Sn = () => ({ tr: e, dispatch: t }) => {
  const { selection: n } = e, { empty: r, ranges: o } = n;
  return r || t && o.forEach((s) => {
    e.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, Mn = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  var s;
  const { extendEmptyMarkRange: i = !1 } = t, { selection: a } = n, c = P(e, r.schema), { $from: l, empty: d, ranges: u } = a;
  if (!o)
    return !0;
  if (d && i) {
    let { from: f, to: p } = a;
    const g = (s = l.marks().find((h) => h.type === c)) === null || s === void 0 ? void 0 : s.attrs, m = ge(l, c, g);
    m && (f = m.from, p = m.to), n.removeMark(f, p, c);
  } else
    u.forEach((f) => {
      n.removeMark(f.$from.pos, f.$to.pos, c);
    });
  return n.removeStoredMark(c), !0;
}, bn = (e, t = {}) => ({ tr: n, state: r, dispatch: o }) => {
  let s = null, i = null;
  const a = xe(typeof e == "string" ? e : e.name, r.schema);
  return a ? (a === "node" && (s = y(e, r.schema)), a === "mark" && (i = P(e, r.schema)), o && n.selection.ranges.forEach((c) => {
    const l = c.$from.pos, d = c.$to.pos;
    let u, f, p, g;
    n.selection.empty ? r.doc.nodesBetween(l, d, (m, h) => {
      s && s === m.type && (p = Math.max(h, l), g = Math.min(h + m.nodeSize, d), u = h, f = m);
    }) : r.doc.nodesBetween(l, d, (m, h) => {
      h < l && s && s === m.type && (p = Math.max(h, l), g = Math.min(h + m.nodeSize, d), u = h, f = m), h >= l && h <= d && (s && s === m.type && n.setNodeMarkup(h, void 0, {
        ...m.attrs,
        ...t
      }), i && m.marks.length && m.marks.forEach((k) => {
        if (i === k.type) {
          const w = Math.max(h, l), x = Math.min(h + m.nodeSize, d);
          n.addMark(w, x, i.create({
            ...k.attrs,
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
}, Cn = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = y(e, n.schema);
  return Be(o, t)(n, r);
}, vn = (e, t = {}) => ({ state: n, dispatch: r }) => {
  const o = y(e, n.schema);
  return Xe(o, t)(n, r);
};
var An = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: dt,
  clearContent: ut,
  clearNodes: ft,
  command: pt,
  createParagraphNear: mt,
  cut: ht,
  deleteCurrentNode: gt,
  deleteNode: kt,
  deleteRange: yt,
  deleteSelection: wt,
  enter: xt,
  exitCode: St,
  extendMarkRange: Mt,
  first: bt,
  focus: At,
  forEach: Tt,
  insertContent: Et,
  insertContentAt: $t,
  joinBackward: Nt,
  joinDown: Bt,
  joinForward: jt,
  joinItemBackward: Ft,
  joinItemForward: Lt,
  joinTextblockBackward: Dt,
  joinTextblockForward: Rt,
  joinUp: Pt,
  keyboardShortcut: _t,
  lift: Ht,
  liftEmptyBlock: Wt,
  liftListItem: Kt,
  newlineInCode: Vt,
  resetAttributes: Jt,
  scrollIntoView: Ut,
  selectAll: Gt,
  selectNodeBackward: qt,
  selectNodeForward: Qt,
  selectParentNode: Xt,
  selectTextblockEnd: Yt,
  selectTextblockStart: Zt,
  setContent: tn,
  setMark: cn,
  setMeta: ln,
  setNode: dn,
  setNodeSelection: un,
  setTextSelection: fn,
  sinkListItem: pn,
  splitBlock: mn,
  splitListItem: hn,
  toggleList: gn,
  toggleMark: kn,
  toggleNode: yn,
  toggleWrap: wn,
  undoInputRule: xn,
  unsetAllMarks: Sn,
  unsetMark: Mn,
  updateAttributes: bn,
  wrapIn: Cn,
  wrapInList: vn
});
C.create({
  name: "commands",
  addCommands() {
    return {
      ...An
    };
  }
});
C.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new I({
        key: new O("tiptapDrop"),
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
C.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new I({
        key: new O("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
const Tn = new O("focusEvents");
C.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: e } = this;
    return [
      new I({
        key: Tn,
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
C.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const e = () => this.editor.commands.first(({ commands: i }) => [
      () => i.undoInputRule(),
      // maybe convert first text block node to default node
      () => i.command(({ tr: a }) => {
        const { selection: c, doc: l } = a, { empty: d, $anchor: u } = c, { pos: f, parent: p } = u, g = u.parent.isTextblock && f > 0 ? a.doc.resolve(f - 1) : u, m = g.parent.type.spec.isolating, h = u.pos - u.parentOffset, k = m && g.parent.childCount === 1 ? h === u.pos : N.atStart(l).from === f;
        return !d || !p.type.isTextblock || p.textContent.length || !k || k && u.parent.type.name === "paragraph" ? !1 : i.clearNodes();
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
    return Z() || we() ? s : o;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new I({
        key: new O("clearDocument"),
        appendTransaction: (e, t, n) => {
          if (e.some((m) => m.getMeta("composition")))
            return;
          const r = e.some((m) => m.docChanged) && !t.doc.eq(n.doc), o = e.some((m) => m.getMeta("preventClearDocument"));
          if (!r || o)
            return;
          const { empty: s, from: i, to: a } = t.selection, c = N.atStart(t.doc).from, l = N.atEnd(t.doc).to;
          if (s || !(i === c && a === l) || !Se(n.doc))
            return;
          const f = n.tr, p = me({
            state: n,
            transaction: f
          }), { commands: g } = new tt({
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
C.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new I({
        key: new O("tiptapPaste"),
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
C.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new I({
        key: new O("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
function ae(e) {
  return new it({
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
    }, this.name = this.config.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = A(M(this, "addOptions", {
      name: this.name
    }))), this.storage = A(M(this, "addStorage", {
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
    return n.parent = this, this.child = n, n.name = t.name ? t.name : n.parent.name, t.defaultOptions && Object.keys(t.defaultOptions).length > 0 && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${n.name}".`), n.options = A(M(n, "addOptions", {
      name: n.name
    })), n.storage = A(M(n, "addStorage", {
      name: n.name,
      options: n.options
    })), n;
  }
}
const En = /^```([a-z]+)?[\s\n]$/, In = /^~~~([a-z]+)?[\s\n]$/, On = V.create({
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
      rt(this.options.HTMLAttributes, t),
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
        return a === void 0 ? !1 : r.nodeAt(a) ? e.commands.command(({ tr: l }) => (l.setSelection(N.near(r.resolve(a))), !0)) : e.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      ae({
        find: En,
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
      new I({
        key: new O("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (e, t) => {
            if (!t.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const n = t.clipboardData.getData("text/plain"), r = t.clipboardData.getData("vscode-editor-data"), o = r ? JSON.parse(r) : void 0, s = o == null ? void 0 : o.mode;
            if (!n || !s)
              return !1;
            const { tr: i, schema: a } = e.state, c = a.text(n.replace(/\r\n?/g, `
`));
            return i.replaceSelectionWith(this.type.create({ language: s }, c)), i.selection.$from.parent.type !== this.type && i.setSelection(b.near(i.doc.resolve(Math.max(0, i.selection.from - 2)))), i.setMeta("paste", !0), e.dispatch(i), !0;
          }
        }
      })
    ];
  }
});
let T, L;
const Q = /* @__PURE__ */ new Set(), X = /* @__PURE__ */ new Set();
function $n() {
  return T;
}
function Pn(e) {
  if (!T && !L) {
    const t = e.themes.filter(
      (r) => !!r && r in fe
    ), n = e.languages.filter(
      (r) => !!r && r in pe
    );
    return L = et({
      themes: t,
      langs: n
    }).then((r) => {
      T = r;
    }), L;
  }
  if (L)
    return L;
}
async function Me(e) {
  return T && !T.getLoadedThemes().includes(e) && !X.has(e) && e in fe ? (X.add(e), await T.loadTheme(e), X.delete(e), !0) : !1;
}
async function be(e) {
  return T && !T.getLoadedLanguages().includes(e) && !Q.has(e) && e in pe ? (Q.add(e), await T.loadLanguage(e), Q.delete(e), !0) : !1;
}
async function Bn({
  doc: e,
  name: t,
  defaultTheme: n,
  defaultLanguage: r
}) {
  const o = D(e, (a) => a.type.name === t), s = [
    ...o.map((a) => a.node.attrs.theme),
    n
  ], i = [
    ...o.map((a) => a.node.attrs.language),
    r
  ];
  T ? await Promise.all([
    ...s.flatMap((a) => Me(a)),
    ...i.flatMap((a) => !!a && be(a))
  ]) : await Pn({ languages: i, themes: s });
}
function ce({
  doc: e,
  name: t,
  defaultTheme: n,
  defaultLanguage: r
}) {
  const o = [];
  return D(e, (i) => i.type.name === t).forEach((i) => {
    var g;
    let a = i.pos + 1, c = i.node.attrs.language || r, l = i.node.attrs.theme || n;
    const d = $n();
    if (!d) return;
    d.getLoadedLanguages().includes(c) || (c = "plaintext");
    const u = d.getLoadedThemes().includes(l) ? l : d.getLoadedThemes()[0], f = d.getTheme(u);
    o.push(
      J.node(i.pos, i.pos + i.node.nodeSize, {
        style: `background-color: ${f.bg}`
      })
    );
    const p = d.codeToTokensBase(i.node.textContent, {
      lang: c,
      theme: u
    });
    for (const m of p) {
      const h = a, k = (g = m == null ? void 0 : m.meta) == null ? void 0 : g.highlight;
      for (const w of m) {
        const x = a + w.content.length, S = J.inline(a, x, {
          style: `color: ${w.color}`
        });
        o.push(S), a = x;
      }
      k && o.push(
        J.inline(h, a, {
          class: "shiki-line--highlight"
        })
      ), a += 1;
    }
  }), Ae.create(e, o);
}
function Nn({
  name: e,
  defaultLanguage: t,
  defaultTheme: n
}) {
  const r = new I({
    key: new O("shiki"),
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
          await Bn({ doc: a, name: e, defaultLanguage: t, defaultTheme: n });
          const c = o.state.tr.setMeta("shikiPluginForceDecoration", !0);
          o.dispatch(c);
        }
        // When new codeblocks were added and they have missing themes or
        // languages, load those and then add code decorations once again.
        async checkUndecoratedBlocks() {
          const a = D(
            o.state.doc,
            (d) => d.type.name === e
          );
          if ((await Promise.all(
            a.flatMap((d) => [
              Me(d.node.attrs.theme),
              be(d.node.attrs.language)
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
      init: (o, { doc: s }) => ce({
        doc: s,
        name: e,
        defaultLanguage: t,
        defaultTheme: n
      }),
      apply: (o, s, i, a) => {
        const c = i.selection.$head.parent.type.name, l = a.selection.$head.parent.type.name, d = D(
          i.doc,
          (p) => p.type.name === e
        ), u = D(
          a.doc,
          (p) => p.type.name === e
        ), f = o.docChanged && // Apply decorations if:
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
        return o.getMeta("shikiPluginForceDecoration") || f ? ce({
          doc: o.doc,
          name: e,
          defaultLanguage: t,
          defaultTheme: n
        }) : s.map(o.mapping, o.doc);
      }
    },
    props: {
      decorations(o) {
        return r.getState(o);
      }
    }
  });
  return r;
}
const Wn = On.extend({
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
      Nn({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage,
        defaultTheme: this.options.defaultTheme
      })
    ];
  }
});
export {
  Wn as CodeBlockShiki,
  Wn as default
};
