import { h as I, resolveComponent as E, openBlock as o, createElementBlock as u, normalizeClass as D, withModifiers as $, createElementVNode as w, normalizeStyle as J, createCommentVNode as T, createVNode as B, Transition as G, withCtx as U, Fragment as A, renderList as S, createBlock as N, toDisplayString as Q, provide as q, resolveDynamicComponent as z } from "vue";
const Z = {
  name: "node-content",
  props: ["node"],
  render() {
    const s = this.node, e = this.node.tree.vm;
    if (s.isEditing) {
      let t = s.text;
      return this.$nextTick((i) => {
        this.$refs.editCtrl.focus();
      }), I("input", {
        domProps: {
          value: s.text,
          type: "text"
        },
        class: "tree-input",
        on: {
          input(i) {
            t = i.target.value;
          },
          blur() {
            s.stopEditing(t);
          },
          keyup(i) {
            i.keyCode === 13 && s.stopEditing(t);
          },
          mouseup(i) {
            i.stopPropagation();
          }
        },
        ref: "editCtrl"
      });
    }
    return e.$slots.default ? e.$slots.default({ node: this.node }) : I("span", s.text);
  }
}, K = Z;
const L = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [i, r] of e)
    t[i] = r;
  return t;
}, ee = {
  name: "Node",
  inject: ["tree"],
  props: ["node", "options"],
  components: {
    NodeContent: K
  },
  watch: {
    node() {
      this.node.vm = this;
    }
  },
  data() {
    return this.node.vm = this, {
      loading: !1
    };
  },
  computed: {
    padding() {
      return this.node.depth * (this.options.paddingLeft ? this.options.paddingLeft : this.options.nodeIndent) + "px";
    },
    nodeClass() {
      let s = this.node.states, e = this.hasChildren(), t = {
        "has-child": e,
        expanded: e && s.expanded,
        selected: s.selected,
        disabled: s.disabled,
        matched: s.matched,
        dragging: s.dragging,
        loading: this.loading,
        draggable: s.draggable
      };
      return this.options.checkbox && (t.checked = s.checked, t.indeterminate = s.indeterminate), t;
    },
    visibleChildren() {
      return this.node.children.filter(function(s) {
        return s && s.visible();
      });
    }
  },
  methods: {
    onNodeFocus() {
      this.tree.activeElement = this.node;
    },
    focus() {
      this.$refs.anchor.focus(), this.node.select();
    },
    check() {
      this.node.checked() ? this.node.uncheck() : this.node.check();
    },
    select({ ctrlKey: s } = evnt) {
      const e = this.options, t = this.tree, i = this.node;
      if (t.$emit("node:clicked", i), !(e.editing && i.isEditing)) {
        if (e.editing && i.editable())
          return this.startEditing();
        if (e.checkbox && e.checkOnSelect)
          return !e.parentSelect && this.hasChildren() ? this.toggleExpand() : this.check(s);
        !e.parentSelect && this.hasChildren() && this.toggleExpand(), e.multiple ? i.selected() ? s ? i.unselect() : this.tree.selectedNodes.length != 1 && (t.unselectAll(), i.select()) : i.select(s) : i.selected() && s ? i.unselect() : i.select();
      }
    },
    toggleExpand() {
      this.hasChildren() && this.node.toggleExpand();
    },
    hasChildren() {
      return this.node.hasChildren();
    },
    startEditing() {
      this.tree._editingNode && this.tree._editingNode.stopEditing(), this.node.startEditing();
    },
    stopEditing() {
      this.node.stopEditing();
    },
    handleMouseDown(s) {
      this.options.dnd && this.tree.vm.startDragging(this.node, s);
    }
  }
}, te = ee, se = ["data-id"], ie = {
  key: 0,
  class: "tree-children"
};
function re(s, e, t, i, r, n) {
  const h = E("node-content"), a = E("node");
  return o(), u("li", {
    role: "treeitem",
    class: D(["tree-node", s.nodeClass]),
    "data-id": s.node.id,
    onMousedown: e[5] || (e[5] = $((...l) => s.handleMouseDown && s.handleMouseDown(...l), ["stop"]))
  }, [
    w("div", {
      class: "tree-content",
      style: J([s.options.direction == "ltr" ? { "padding-left": s.padding } : { "padding-right": s.padding }]),
      onClick: e[4] || (e[4] = $((...l) => s.select && s.select(...l), ["stop"]))
    }, [
      w("i", {
        class: D(["tree-arrow", [{ expanded: s.node.states.expanded, "has-child": s.node.children.length || s.node.isBatch }, s.options.direction]]),
        onClick: e[0] || (e[0] = $((...l) => s.toggleExpand && s.toggleExpand(...l), ["stop"]))
      }, null, 2),
      s.options.checkbox ? (o(), u("i", {
        key: 0,
        class: D(["tree-checkbox", { checked: s.node.states.checked, indeterminate: s.node.states.indeterminate }]),
        onClick: e[1] || (e[1] = $((...l) => s.check && s.check(...l), ["stop"]))
      }, null, 2)) : T("", !0),
      w("span", {
        ref: "anchor",
        class: "tree-anchor",
        tabindex: "-1",
        onFocus: e[2] || (e[2] = (...l) => s.onNodeFocus && s.onNodeFocus(...l)),
        onDblclick: e[3] || (e[3] = (l) => s.tree.$emit("node:dblclick", s.node))
      }, [
        B(h, { node: s.node }, null, 8, ["node"])
      ], 544)
    ], 4),
    B(G, { name: "l-fade" }, {
      default: U(() => [
        s.hasChildren() && s.node.states.expanded ? (o(), u("ul", ie, [
          (o(!0), u(A, null, S(s.visibleChildren, (l) => (o(), N(a, {
            key: l.id,
            node: l,
            options: s.options
          }, null, 8, ["node", "options"]))), 128))
        ])) : T("", !0)
      ]),
      _: 1
    })
  ], 42, se);
}
const ne = /* @__PURE__ */ L(te, [["render", re]]);
const he = {
  name: "DragNode",
  props: ["target"],
  computed: {
    style() {
      return this.target.top === void 0 ? "display: none" : `top: ${this.target.top}px; left: ${this.target.left}px`;
    }
  }
};
function ae(s, e, t, i, r, n) {
  return o(), u("div", {
    class: "tree-dragnode",
    style: J(n.style)
  }, Q(t.target.node.text), 5);
}
const le = /* @__PURE__ */ L(he, [["render", ae]]);
function b(s, e) {
  let t;
  return Array.isArray(s) ? s.map((i) => b(i, e)) : (t = e(s), t !== !1 && s.children && s.children.length && (t = b(s.children, e)), t);
}
function v(s) {
  return document ? (v.__element || (v.__element = document.createElement("div")), v.__element.innerHTML = s, v.__element.innerText) : s;
}
function oe(s) {
  return function(e) {
    return Object.keys(s).every((t) => {
      if (t === "text" || t === "id") {
        const r = s[t];
        let n = e[t];
        return n = v(n), de(r) ? r.test(n) : r === n;
      }
      const i = s[t];
      return t === "state" && (t = "states"), Object.keys(i).every((r) => e[t][r] === i[r]);
    });
  };
}
function de(s) {
  return s instanceof RegExp;
}
function ce(s) {
  const e = [];
  return s.forEach(function t(i) {
    e.push(i), i.children && i.children.forEach(t);
  }), e;
}
function Y(s, e, t = !0) {
  if (!s || !s.length || !e)
    return null;
  if (t && (s = ce(s)), typeof e == "number")
    return s[e] || null;
  (typeof e == "string" || e instanceof RegExp) && (e = {
    text: e
  }), typeof e != "function" && (e = oe(e));
  const i = s.filter(e);
  return i.length ? i : null;
}
function p() {
  return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
}
function R() {
  return p() + p() + "-" + p() + "-" + p() + "-" + p() + "-" + p() + p() + p();
}
function c(s, e, ...t) {
  s.forEach((i) => i[e](...t));
}
class m extends Array {
  constructor(e, t = []) {
    super(), this.tree = e, this.push(t);
  }
  remove() {
    return c(this, "remove"), this;
  }
  expand() {
    return c(this, "expand"), this;
  }
  collapse() {
    return c(this, "collapse"), this;
  }
  select(e) {
    return c(this, "select", e), this;
  }
  unselect() {
    return c(this, "unselect"), this;
  }
  check() {
    return this.tree.options.checkbox && c(this, "check"), this;
  }
  uncheck() {
    return this.tree.options.checkbox && c(this, "uncheck"), this;
  }
  disable() {
    return c(this, "disable"), this;
  }
  enable() {
    return c(this, "enable"), this;
  }
}
class k {
  constructor(e, t) {
    if (!t)
      throw new Error("Node can not be empty");
    if (this.id = t.id || R(), this.states = t.state || {}, this.showChildren = !0, this.children = t.children || [], this.parent = t.parent || null, this.isBatch = t.isBatch || !1, this.isEditing = !1, this.data = Object.assign({}, t.data || {}, {
      text: t.text
    }), !e)
      throw new Error("Node must have a Tree context!");
    this.tree = e;
  }
  $emit(e, t) {
    this.tree.$emit(`node:${e}`, this, t);
  }
  getPath() {
    if (!this.parent)
      return [this];
    const e = [this];
    let t = this;
    for (; (t = t.parent) !== null; )
      e.push(t);
    return e;
  }
  get key() {
    return this.id + this.text;
  }
  get depth() {
    let e = 0, t = this.parent;
    if (!t || this.showChildren === !1)
      return e;
    do
      e++;
    while (t = t.parent);
    return e;
  }
  get text() {
    return this.data.text;
  }
  set text(e) {
    const t = this.text;
    t !== e && (this.data.text = e, this.$emit("text:changed", e, t));
  }
  setData(e) {
    return this.data = Object.assign({}, this.data, e), this.$emit("data:changed", this.data), this.data;
  }
  state(e, t) {
    return t === void 0 ? this.states[e] : (this.states[e] = t, this);
  }
  recurseUp(e, t = this) {
    if (t.parent && e(t.parent) !== !1)
      return this.recurseUp(e, t.parent);
  }
  recurseDown(e, t) {
    t !== !0 && e(this), this.hasChildren() && b(this.children, e);
  }
  refreshIndeterminateState() {
    if (!this.tree.options.autoCheckChildren)
      return this;
    if (this.state("indeterminate", !1), this.hasChildren()) {
      const e = this.children.length;
      let t = 0, i = 0, r = 0;
      this.children.forEach((n) => {
        n.checked() && t++, n.disabled() && r++, n.indeterminate() && i++;
      }), t > 0 && t === e - r ? this.checked() || (this.state("checked", !0), this.tree.check(this), this.$emit("checked")) : (this.checked() && (this.state("checked", !1), this.tree.uncheck(this), this.$emit("unchecked")), this.state(
        "indeterminate",
        i > 0 || t > 0 && t < e
      ));
    }
    this.parent && this.parent.refreshIndeterminateState();
  }
  indeterminate() {
    return this.state("indeterminate");
  }
  editable() {
    return !this.state("disabled") && this.state("editable");
  }
  selectable() {
    return !this.state("disabled") && this.state("selectable");
  }
  selected() {
    return this.state("selected");
  }
  select(e) {
    return !this.selectable() || this.selected() ? this : (this.tree.select(this, e), this.state("selected", !0), this.$emit("selected"), this);
  }
  unselect() {
    return !this.selectable() || !this.selected() ? this : (this.tree.unselect(this), this.state("selected", !1), this.$emit("unselected"), this);
  }
  checked() {
    return this.state("checked");
  }
  check() {
    if (this.checked() || this.disabled())
      return this;
    if (this.indeterminate())
      return this.uncheck();
    const e = this.tree.options.checkDisabledChildren, t = this;
    return this.tree.options.autoCheckChildren ? (this.recurseDown((i) => {
      i.state("indeterminate", !1), !(i.disabled() && !e) && (i.checked() || (this.tree.check(i), i.state("checked", !0), i.$emit("checked", i.id === t.id ? void 0 : t)));
    }), this.parent && this.parent.refreshIndeterminateState()) : (this.tree.check(this), this.state("checked", !0), this.$emit("checked")), this;
  }
  uncheck() {
    if (!this.indeterminate() && !this.checked() || this.disabled())
      return this;
    const e = this;
    return this.tree.options.autoCheckChildren ? (this.recurseDown((t) => {
      t.state("indeterminate", !1), t.checked() && (this.tree.uncheck(t), t.state("checked", !1), t.$emit("unchecked", t.id === e.id ? void 0 : e));
    }), this.parent && this.parent.refreshIndeterminateState()) : (this.tree.uncheck(this), this.state("checked", !1), this.$emit("unchecked")), this;
  }
  show() {
    return this.visible() ? this : (this.state("visible", !0), this.$emit("shown"), this);
  }
  hide() {
    return this.hidden() ? this : (this.state("visible", !1), this.$emit("hidden"), this);
  }
  visible() {
    return this.state("visible");
  }
  hidden() {
    return !this.state("visible");
  }
  enable() {
    return this.enabled() ? this : (this.tree.options.autoDisableChildren ? this.recurseDown((e) => {
      e.disabled() && (e.state("disabled", !1), e.$emit("enabled"));
    }) : (this.state("disabled", !1), this.$emit("enabled")), this);
  }
  enabled() {
    return !this.state("disabled");
  }
  disable() {
    return this.disabled() ? this : (this.tree.options.autoDisableChildren ? this.recurseDown((e) => {
      e.enabled() && (e.state("disabled", !0), e.$emit("disabled"));
    }) : (this.state("disabled", !0), this.$emit("disabled")), this);
  }
  disabled() {
    return this.state("disabled");
  }
  expandTop(e) {
    this.recurseUp((t) => {
      t.state("expanded", !0), e !== !0 && this.$emit("expanded", t);
    });
  }
  expand() {
    return this.canExpand() ? (this.isBatch ? this.tree.loadChildren(this).then((e) => {
      this.state("expanded", !0), this.$emit("expanded");
    }) : (this.state("expanded", !0), this.$emit("expanded")), this) : this;
  }
  canExpand() {
    return this.disabled() || !this.hasChildren() ? !1 : this.collapsed() && (!this.tree.autoDisableChildren || this.disabled());
  }
  canCollapse() {
    return this.disabled() || !this.hasChildren() ? !1 : this.expanded() && (!this.tree.autoDisableChildren || this.disabled());
  }
  expanded() {
    return this.state("expanded");
  }
  collapse() {
    return this.canCollapse() ? (this.state("expanded", !1), this.$emit("collapsed"), this) : this;
  }
  collapsed() {
    return !this.state("expanded");
  }
  toggleExpand() {
    return this._toggleOpenedState();
  }
  toggleCollapse() {
    return this._toggleOpenedState();
  }
  _toggleOpenedState() {
    if (this.canCollapse())
      return this.collapse();
    if (this.canExpand())
      return this.expand();
  }
  isDropable() {
    return this.enabled() && this.state("dropable");
  }
  isDraggable() {
    return this.enabled() && this.state("draggable") && !this.isEditing;
  }
  startDragging() {
    return !this.isDraggable() || this.state("dragging") || this.isRoot() && this.tree.model.length === 1 ? !1 : (this.tree.options.store && (this.tree.__silence = !0), this.select(), this.state("dragging", !0), this.$emit("dragging:start"), this.tree.__silence = !1, !0);
  }
  finishDragging(e, t) {
    if (!e.isDropable() && t === "drag-on")
      return;
    const i = this.tree, r = this.clone(), n = this.parent;
    r.id = this.id, i.__silence = !0, this.remove(), t === "drag-on" ? i.append(e, r) : t === "drag-below" ? i.after(e, r) : t === "drag-above" && i.before(e, r), e.refreshIndeterminateState(), n && n.refreshIndeterminateState(), i.__silence = !1, r.state("dragging", !1), this.state("dragging", !1), r.$emit("dragging:finish", e, t), r.state("selected") && (i.selectedNodes.remove(this), i.selectedNodes.add(r), i.vm.$set(this.state, "selected", !1), i.vm.$set(r.state, "selected", !0)), this.tree.options.store && this.tree.vm.$emit("LIQUOR_NOISE");
  }
  startEditing() {
    if (this.disabled())
      return !1;
    this.isEditing || (this.tree._editingNode = this, this.tree.activeElement = this, this.isEditing = !0, this.$emit("editing:start"));
  }
  stopEditing(e) {
    if (!this.isEditing)
      return;
    this.isEditing = !1, this.tree._editingNode = null, this.tree.activeElement = null;
    const t = this.text;
    e && e !== !1 && this.text !== e && (this.text = e), this.$emit("editing:stop", t);
  }
  index(e) {
    return this.tree.index(this, e);
  }
  first() {
    return this.hasChildren() ? this.children[0] : null;
  }
  last() {
    return this.hasChildren() ? this.children[this.children.length - 1] : null;
  }
  next() {
    return this.tree.nextNode(this);
  }
  prev() {
    return this.tree.prevNode(this);
  }
  insertAt(e, t = this.children.length) {
    if (e)
      return e = this.tree.objectToNode(e), Array.isArray(e) ? (e.reverse().map((i) => this.insertAt(i, t)), new m(this.tree, [...e])) : (e.parent = this, this.children.splice(
        t,
        0,
        e
      ), e.disabled() && e.hasChildren() && e.recurseDown((i) => {
        i.state("disabled", !0);
      }), this.isBatch || this.$emit("added", e), e);
  }
  addChild(e) {
    return this.insertAt(e);
  }
  append(e) {
    return this.addChild(e);
  }
  prepend(e) {
    return this.insertAt(e, 0);
  }
  before(e) {
    return this.tree.before(this, e);
  }
  after(e) {
    return this.tree.after(this, e);
  }
  empty() {
    let e;
    for (; e = this.children.pop(); )
      e.remove();
    return this;
  }
  remove() {
    return this.tree.removeNode(this);
  }
  removeChild(e) {
    const t = this.find(e);
    return t ? this.tree.removeNode(t) : null;
  }
  find(e, t) {
    return this.tree.isNode(e) ? e : Y(this.children, e, t);
  }
  focus() {
    this.vm && this.vm.focus();
  }
  hasChildren() {
    return this.showChildren && this.isBatch || this.children.length > 0;
  }
  /**
  * Sometimes it's no need to have a parent. It possible to have more than 1 parent
  */
  isRoot() {
    return this.parent === null;
  }
  clone() {
    return this.tree.objectToNode(this.toJSON());
  }
  toJSON() {
    return {
      text: this.text,
      data: this.data,
      state: this.states,
      children: this.children.map((e) => this.tree.objectToNode(e).toJSON())
    };
  }
}
const ue = {
  selected: !1,
  selectable: !0,
  checked: !1,
  expanded: !1,
  disabled: !1,
  visible: !0,
  indeterminate: !1,
  matched: !1,
  editable: !0,
  dragging: !1,
  draggable: !0,
  dropable: !0
};
function F(s = {}) {
  return Object.assign({}, ue, s);
}
function x(s, e) {
  let t = null;
  if (e instanceof k)
    return e;
  if (typeof e == "string")
    t = new k(s, {
      text: e,
      state: F(),
      id: R()
    });
  else {
    if (Array.isArray(e))
      return e.map((i) => x(s, i));
    t = new k(s, e), t.states = F(t.states), t.id || (t.id = R()), t.children.length && (t.children = t.children.map((i) => (i = x(s, i), i.parent = t, i)));
  }
  return t;
}
class V extends Array {
  empty() {
    return this.splice(0, this.length), this;
  }
  has(e) {
    return this.includes(e);
  }
  add(...e) {
    return this.push(...e), this;
  }
  remove(e) {
    const t = this.indexOf(e);
    return t === -1 ? this : (this.splice(t, 1), this);
  }
  removeAll(e) {
    for (; this.includes(e); )
      this.remove(e);
    return this;
  }
  top() {
    return this[this.length - 1];
  }
}
const fe = {
  id: "id",
  text: "text",
  children: "children",
  state: "state",
  data: "data",
  isBatch: "isBatch"
};
function pe(s, e) {
  return {
    id: s[e.id],
    text: s[e.text],
    children: s[e.children],
    state: s[e.state],
    data: s[e.data],
    isBatch: s[e.isBatch]
  };
}
const ge = {
  parse(s, e, t = {}) {
    typeof s == "string" && (s = JSON.parse(s)), Array.isArray(s) || (s = [s]);
    const i = Object.assign(
      {},
      fe,
      t
    );
    return s.map(function n(h) {
      const a = pe(h, i);
      return a.children && !Array.isArray(a.children) && (a.children = [a.children]), a.children && (a.children = a.children.map(n)), a;
    }).map((n) => x(e, n));
  }
};
function me(s) {
  return new Promise((e, t) => {
    const i = new XMLHttpRequest();
    i.open("GET", s), i.setRequestHeader("Content-Type", "application/json"), i.addEventListener("load", (r) => {
      try {
        const n = JSON.parse(i.response);
        e(n);
      } catch (n) {
        t(n);
      }
    }), i.send(null);
  });
}
function W(s) {
  return me(s);
}
function be(s) {
  return (e) => {
    const t = /{([^}]+)}/;
    let i, r = s;
    for (; i = t.exec(r); )
      r = r.replace(i[0], e[i[1]]);
    return r;
  };
}
function Ne(s, e) {
  return s.text < e.text ? -1 : s.text > e.text ? 1 : 0;
}
function ve(s, e) {
  return s.text < e.text ? 1 : s.text > e.text ? -1 : 0;
}
function xe(s) {
  switch (s.toLowerCase()) {
    case "asc":
      return Ne;
    case "desc":
      return ve;
  }
}
const H = (s, e) => {
  typeof e == "string" && (e = xe(e)), Array.isArray(s) && typeof e == "function" && s.sort(e);
};
function $e(s) {
  return new Promise((e) => {
    setTimeout(e, s);
  });
}
var C = {}, De = {
  get exports() {
    return C;
  },
  set exports(s) {
    C = s;
  }
};
function P() {
}
P.prototype = {
  on: function(s, e, t) {
    var i = this.e || (this.e = {});
    return (i[s] || (i[s] = [])).push({
      fn: e,
      ctx: t
    }), this;
  },
  once: function(s, e, t) {
    var i = this;
    function r() {
      i.off(s, r), e.apply(t, arguments);
    }
    return r._ = e, this.on(s, r, t);
  },
  emit: function(s) {
    var e = [].slice.call(arguments, 1), t = ((this.e || (this.e = {}))[s] || []).slice(), i = 0, r = t.length;
    for (i; i < r; i++)
      t[i].fn.apply(t[i].ctx, e);
    return this;
  },
  off: function(s, e) {
    var t = this.e || (this.e = {}), i = t[s], r = [];
    if (i && e)
      for (var n = 0, h = i.length; n < h; n++)
        i[n].fn !== e && i[n].fn._ !== e && r.push(i[n]);
    return r.length ? t[s] = r : delete t[s], this;
  }
};
De.exports = P;
C.TinyEmitter = P;
var ke = C, d = new ke();
class Ee {
  constructor(e) {
    this.vm = e, this.options = e.opts, this.activeElement = null;
    const t = this.options.fetchData;
    typeof t == "string" && (this.options.fetchData = ((i) => {
      const r = be(i);
      return (n) => W(r(n)).catch(this.options.onFetchError);
    })(t));
  }
  $on(e, ...t) {
    d.on(e, ...t);
  }
  $once(e, ...t) {
    d.once(e, ...t);
  }
  $off(e, ...t) {
    d.off(e, ...t);
  }
  $emit(e, ...t) {
    this.__silence || (this.vm.$emit(e, ...t), this.options.store && this.vm.$emit("LIQUOR_NOISE"));
  }
  _sort(e, t, i) {
    i !== !1 && this.recurseDown(e, (r) => {
      r.hasChildren() && H(r.children, t);
    }), H(e, t);
  }
  sortTree(e, t) {
    this._sort(this.model, e, t);
  }
  sort(e, t, i) {
    const r = this.find(e, !0);
    !r || !t || r.forEach((n) => {
      this._sort(n.children, t, i);
    });
  }
  clearFilter() {
    this.recurseDown((e) => {
      e.state("matched", !1), e.state("visible", !0), e.state("expanded", e.__expanded), e.__expanded = void 0, e.showChildren = !0;
    }), this.vm.matches.length = 0, d.emit("tree:filtered", [], "");
  }
  filter(e) {
    if (!e)
      return this.clearFilter();
    const t = [], i = this.options.filter.matcher, { showChildren: r, plainList: n } = this.options.filter;
    return this.recurseDown((h) => {
      i(e, h) && t.push(h), h.showChildren = !0, h.__expanded === void 0 && (h.__expanded = h.state("expanded")), h.state("visible", !1), h.state("matched", !1), h.state("expanded", !0);
    }), t.reverse().forEach((h) => {
      h.state("matched", !0), h.state("visible", !0), h.showChildren = !n, h.hasChildren() && h.recurseDown((a) => {
        a.state("visible", !!r);
      }, !0), h.recurseUp((a) => {
        a.state("visible", !0), a.state("expanded", !0);
      }), h.hasChildren() && h.state("expanded", !1);
    }), this.vm.matches = t, d.emit("tree:filtered", t, e), t;
  }
  selected() {
    return new m(this, this.selectedNodes);
  }
  checked() {
    return this.options.checkbox ? new m(this, this.checkedNodes) : null;
  }
  loadChildren(e) {
    if (!e)
      return;
    d.emit("tree:data:fetch", e), this.options.minFetchDelay > 0 && e.vm && (e.vm.loading = !0);
    const t = this.fetch(e).then((i) => {
      e.append(i), e.isBatch = !1, this.options.autoCheckChildren && (e.checked() && e.recurseDown((r) => {
        r.state("checked", !0);
      }), e.refreshIndeterminateState()), d.emit("tree:data:received", e);
    });
    return Promise.all([
      $e(this.options.minFetchDelay),
      t
    ]).then((i) => (e.vm && (e.vm.loading = !1), t));
  }
  fetch(e, t) {
    let i = this.options.fetchData(e);
    return i.then || (i = W(i).catch(this.options.onFetchError)), t === !1 ? i : i.then((r) => {
      try {
        return this.parse(r, this.options.modelParse);
      } catch (n) {
        throw new Error(n);
      }
    }).catch(this.options.onFetchError);
  }
  fetchInitData() {
    const e = {
      id: "root",
      name: "root"
    };
    return this.fetch(e, !1);
  }
  setModel(e) {
    return new Promise((t) => {
      if (this.model = this.parse(e, this.options.modelParse), requestAnimationFrame((i) => {
        this.vm.model = this.model, t();
      }), this.selectedNodes = new V(), this.checkedNodes = new V(), b(this.model, (i) => {
        i.tree = this, i.selected() && this.selectedNodes.add(i), i.checked() && (this.checkedNodes.add(i), i.parent && i.parent.refreshIndeterminateState()), this.options.autoDisableChildren && i.disabled() && i.recurseDown((r) => {
          r.state("disabled", !0);
        });
      }), !this.options.multiple && this.selectedNodes.length) {
        const i = this.selectedNodes.top();
        this.selectedNodes.forEach((r) => {
          i !== r && r.state("selected", !1);
        }), this.selectedNodes.empty().add(i);
      }
      this.options.checkOnSelect && this.options.checkbox && this.unselectAll();
    });
  }
  recurseDown(e, t) {
    return !t && e && (t = e, e = this.model), b(e, t);
  }
  select(e, t) {
    const i = this.getNode(e);
    return i ? (this.options.multiple && t ? this.selectedNodes.add(i) : (this.unselectAll(), this.selectedNodes.empty().add(i)), !0) : !1;
  }
  selectAll() {
    return this.options.multiple ? (this.selectedNodes.empty(), this.recurseDown((e) => {
      this.selectedNodes.add(
        e.select(!0)
      );
    }), !0) : !1;
  }
  unselect(e) {
    const t = this.getNode(e);
    return t ? (this.selectedNodes.remove(t), !0) : !1;
  }
  unselectAll() {
    let e;
    for (; e = this.selectedNodes.pop(); )
      e.unselect();
    return !0;
  }
  check(e) {
    this.checkedNodes.add(e);
  }
  uncheck(e) {
    this.checkedNodes.remove(e);
  }
  checkAll() {
    this.recurseDown((e) => {
      e.depth === 0 && (e.indeterminate() && e.state("indeterminate", !1), e.check());
    });
  }
  uncheckAll() {
    let e;
    for (; e = this.checkedNodes.pop(); )
      e.uncheck();
    return !0;
  }
  expand(e) {
    return e.expanded() ? !1 : (e.expand(), !0);
  }
  collapse(e) {
    return e.collapsed() ? !1 : (e.collapse(), !0);
  }
  toggleExpand(e) {
    return e.hasChildren() ? (e.toggleExpand(), !0) : !1;
  }
  toggleCollapse(e) {
    return e.hasChildren() ? (e.toggleCollapse(), !0) : !1;
  }
  expandAll() {
    this.recurseDown((e) => {
      e.hasChildren() && e.collapsed() && e.expand();
    });
  }
  collapseAll() {
    this.recurseDown((e) => {
      e.hasChildren() && e.expanded() && e.collapse();
    });
  }
  index(e, t) {
    let i = e.parent;
    i ? i = i.children : i = this.model;
    const r = i.indexOf(e);
    return t ? {
      index: r,
      target: i,
      node: i[r]
    } : r;
  }
  nextNode(e) {
    const { target: t, index: i } = this.index(e, !0);
    return t[i + 1] || null;
  }
  nextVisibleNode(e) {
    if (e.hasChildren() && e.expanded())
      return e.first();
    const t = this.nextNode(e);
    return !t && e.parent ? e.parent.next() : t;
  }
  prevNode(e) {
    const { target: t, index: i } = this.index(e, !0);
    return t[i - 1] || null;
  }
  prevVisibleNode(e) {
    const t = this.prevNode(e);
    return t ? t.hasChildren() && t.expanded() ? t.last() : t : e.parent;
  }
  addToModel(e, t = this.model.length) {
    return e = this.objectToNode(e), this.model.splice(t, 0, e), this.recurseDown(e, (i) => {
      i.tree = this;
    }), d.emit("node:added", e), e;
  }
  append(e, t) {
    const i = this.find(e);
    return i ? i.append(t) : !1;
  }
  prepend(e, t) {
    const i = this.find(e);
    return i ? i.prepend(t) : !1;
  }
  before(e, t) {
    e = this.find(e);
    const i = this.index(e, !0), r = this.objectToNode(t);
    return ~i.index ? (i.target.splice(
      i.index,
      0,
      r
    ), r.parent = e.parent, d.emit("node:added", r), r) : !1;
  }
  after(e, t) {
    e = this.find(e);
    const i = this.index(e, !0), r = this.objectToNode(t);
    return ~i.index ? (i.target.splice(
      i.index + 1,
      0,
      r
    ), r.parent = e.parent, d.emit("node:added", r), r) : !1;
  }
  addNode(e) {
    const t = this.model.length;
    return e = x(e), this.model.splice(t, 0, e), d.emit("node:added", e), e;
  }
  remove(e, t) {
    return this.removeNode(
      this.find(e, t)
    );
  }
  removeNode(e) {
    if (e instanceof m)
      return e.remove();
    if (!e)
      return !1;
    if (!e.parent)
      ~this.model.indexOf(e) && this.model.splice(
        this.model.indexOf(e),
        1
      );
    else {
      const i = e.parent.children;
      ~i.indexOf(e) && i.splice(
        i.indexOf(e),
        1
      );
    }
    e.parent && e.parent.indeterminate() && !e.parent.hasChildren() && e.parent.state("indeterminate", !1), this.activeElement !== null && e.id === this.activeElement.id && (this.activeElement = null), e.parent = null, d.emit("node:removed", e), this.selectedNodes.remove(e), this.checkedNodes.remove(e);
    const t = this.vm.matches;
    return t && t.length && t.includes(e) && t.splice(
      t.indexOf(e),
      1
    ), e;
  }
  isNode(e) {
    return e instanceof k;
  }
  find(e, t) {
    if (this.isNode(e))
      return e;
    const i = Y(this.model, e);
    return !i || !i.length ? new m(this, []) : t === !0 ? new m(this, i) : new m(this, [i[0]]);
  }
  updateData(e, t) {
    const i = this.find(e);
    return i.forEach((r) => r.setData(t(r))), i;
  }
  getNodeById(e) {
    let t = null;
    return b(this.model, (i) => {
      if ("" + i.id === e)
        return t = i, !1;
    }), t;
  }
  getNode(e) {
    return this.isNode(e) ? e : null;
  }
  objectToNode(e) {
    return x(this, e);
  }
  parse(e, t) {
    t || (t = this.options.propertyNames);
    try {
      return ge.parse(e, this, t);
    } catch {
      return [];
    }
  }
}
const g = {
  ARROW_LEFT: 37,
  ARROW_TOP: 38,
  ARROW_RIGHT: 39,
  ARROW_BOTTOM: 40,
  SPACE: 32,
  DELETE: 46,
  ENTER: 13,
  ESC: 27
}, Ce = [37, 38, 39, 40, 32];
function j(s, e) {
  const t = s.prevVisibleNode(e);
  if (t) {
    if (t.disabled())
      return j(s, t);
    t.focus();
  }
}
function X(s, e) {
  const t = s.nextVisibleNode(e);
  if (t) {
    if (t.disabled())
      return X(s, t);
    t.focus();
  }
}
function we(s, e) {
  s.options.checkbox && (e.checked() ? e.uncheck() : e.check());
}
function ye(s, e) {
  if (e.expanded())
    e.collapse();
  else {
    const t = e.parent;
    t && t.focus();
  }
}
function _e(s, e) {
  if (e.collapsed())
    e.expand();
  else {
    const t = e.first();
    t && t.focus();
  }
}
function Oe(s, e) {
  const t = s.options.deletion;
  t && (typeof t == "function" ? t(e) === !0 && e.remove() : t === !0 && e.remove());
}
function Te(s) {
  s.vm.$el.addEventListener("keydown", (i) => {
    const r = i.keyCode, n = s.activeElement;
    if (s.isNode(n))
      if (n.isEditing)
        switch (r) {
          case g.ESC:
            return n.stopEditing(!1);
        }
      else
        switch (Ce.includes(r) && (i.preventDefault(), i.stopPropagation()), r) {
          case g.ARROW_LEFT:
            return ye(s, n);
          case g.ARROW_RIGHT:
            return _e(s, n);
          case g.ARROW_TOP:
            return j(s, n);
          case g.ARROW_BOTTOM:
            return X(s, n);
          case g.SPACE:
          case g.ENTER:
            return we(s, n);
          case g.DELETE:
            return Oe(s, n);
        }
  }, !0);
}
function y(s, e) {
  if (s === !1)
    throw new Error(e);
}
function Ae(s) {
  const { multiple: e, checkbox: t } = s.opts, i = s.tree, r = (n) => {
    const h = s.selected();
    t ? s.$emit("input", {
      selected: e ? h : h[0] || null,
      checked: s.checked()
    }) : s.$emit("input", e ? h : h[0] || null);
  };
  r(), i.$on("node:selected", r), i.$on("node:unselected", r), t && (i.$on("node:checked", r), i.$on("node:unchecked", r)), i.$on("node:added", (n, h) => {
    const a = h || n;
    t && (a.state("checked") && !i.checkedNodes.has(a) && i.checkedNodes.add(a), a.refreshIndeterminateState()), a.state("selected") && !i.selectedNodes.has(a) && i.select(a), r();
  });
}
const Se = {
  mounted() {
    const s = new Ee(this);
    let e;
    this.tree = s, q("tree", this.tree), !this.data && this.opts.fetchData ? e = s.fetchInitData() : this.data && this.data.then ? (e = this.data, this.loading = !0) : e = Promise.resolve(this.data), e.then((t) => {
      t || (t = []), this.opts.store ? this.connectStore(this.opts.store) : this.tree.setModel(t), this.loading && (this.loading = !1), this.$emit("tree:mounted", this), Ae(this);
    }), this.opts.keyboardNavigation !== !1 && Te(s);
  },
  methods: {
    connectStore(s) {
      const { store: e, mutations: t, getter: i, dispatcher: r } = s;
      y(typeof i == "function", "`getter` must be a function"), y(typeof r == "function", "`dispatcher` must be a function"), t !== void 0 && y(Array.isArray(t), "`mutations` must be an array"), e.subscribe((n, h) => {
        t ? t.includes(n.type) && this.tree.setModel(i()) : this.tree.setModel(i());
      }), this.tree.setModel(i()), this.tree.$on("LIQUOR_NOISE", () => {
        this.$nextTick((n) => {
          r(this.toJSON());
        });
      });
    },
    recurseDown(s) {
      this.tree.recurseDown(s);
    },
    selected() {
      return this.tree.selected();
    },
    checked() {
      return this.tree.checked();
    },
    append(s, e) {
      return e ? this.tree.append(s, e) : this.tree.addToModel(s, this.tree.model.length);
    },
    prepend(s, e) {
      return e ? this.tree.prepend(s, e) : this.tree.addToModel(s, 0);
    },
    addChild(s, e) {
      return this.append(s, e);
    },
    remove(s, e) {
      return this.tree.remove(s, e);
    },
    before(s, e) {
      return e ? this.tree.before(s, e) : this.prepend(s);
    },
    after(s, e) {
      return e ? this.tree.after(s, e) : this.append(s);
    },
    find(s, e) {
      return this.tree.find(s, e);
    },
    findAll(s) {
      return this.tree.find(s, !0);
    },
    expandAll() {
      return this.tree.expandAll();
    },
    updateData(s, e) {
      return this.tree.updateData(s, e);
    },
    collapseAll() {
      return this.tree.collapseAll();
    },
    sortTree(s, e) {
      return this.tree.sortTree(s, e);
    },
    sort(s) {
      return this.tree.sort(s);
    },
    setModel(s) {
      return this.tree.setModel(s);
    },
    getRootNode() {
      return this.tree.model.length === 1 ? this.tree.model[0] : this.tree.model;
    },
    toJSON() {
      return JSON.parse(
        JSON.stringify(this.model)
      );
    }
  }
  /*eslint semi: 0 */
  /* https://github.com/vuejs/rollup-plugin-vue/issues/169 */
}, f = {
  ABOVE: "drag-above",
  BELOW: "drag-below",
  ON: "drag-on"
};
function Re(s, e) {
  return Math.abs(s.clientX - e[0]) > 5 || Math.abs(s.clientY - e[1]) > 5;
}
function Me(s) {
  let e = s.target;
  const t = [];
  for (; e; ) {
    if (t.push(e), e.tagName === "HTML")
      return t.push(document), t.push(window), t;
    e = e.parentElement;
  }
  return t;
}
function Le(s) {
  return s.path ? s.path : s.composedPath ? s.composedPath() : Me(s);
}
function Pe(s) {
  let e, t = 0;
  const i = Le(s);
  for (; t < i.length; t++)
    if (e = i[t].className || "", /tree-node/.test(e))
      return i[t];
  return null;
}
function Ie(s) {
  const e = Pe(s);
  return e || null;
}
function M(s, e) {
  if (!s)
    return;
  let t = s.className;
  if (e)
    new RegExp(e).test(t) || (t += " " + e);
  else {
    for (const i in f)
      t = t.replace(f[i], "");
    t.replace("dragging", "");
  }
  s.className = t.replace(/\s+/g, " ");
}
function Be(s, e) {
  const t = e.getBoundingClientRect(), i = t.height / 3;
  let r = f.ON;
  return t.top + i >= s.clientY ? r = f.ABOVE : t.top + i * 2 <= s.clientY && (r = f.BELOW), r;
}
function _(s, e, t) {
  if (!(!e || !e[t] || typeof e[t] != "function"))
    return e[t](...s) !== !1;
}
function Fe(s) {
  for (const e in f) {
    const t = s.querySelectorAll(`.${f[e]}`);
    for (let i = 0; i < t.length; i++)
      M(t[i]);
  }
}
const Ve = {
  methods: {
    onDragStart(s) {
      s.preventDefault();
    },
    startDragging(s, e) {
      !s.isDraggable() || _([s], this.tree.options.dnd, "onDragStart") === !1 || (this.$$startDragPosition = [e.clientX, e.clientY], this.$$possibleDragNode = s, this.initDragListeners());
    },
    initDragListeners() {
      let s;
      const e = () => {
        window.removeEventListener("mouseup", t, !0), window.removeEventListener("mousemove", i, !0);
      }, t = (r) => {
        this.$$startDragPosition || r.stopPropagation(), this.draggableNode && this.draggableNode.node.state("dragging", !1), this.$$dropDestination && this.tree.isNode(this.$$dropDestination) && this.$$dropDestination.vm && (M(this.$$dropDestination.vm.$el, null), _(
          [this.draggableNode.node, this.$$dropDestination, s],
          this.tree.options.dnd,
          "onDragFinish"
        ) !== !1 && !(!this.$$dropDestination.isDropable() && s === f.ON || !s) && (this.draggableNode.node.finishDragging(this.$$dropDestination, s), this.draggableNode.node.parent = this.$$dropDestination), this.$$dropDestination = null), this.$$possibleDragNode = null, this.$set(this, "draggableNode", null), e();
      }, i = (r) => {
        if (this.$$startDragPosition && !Re(r, this.$$startDragPosition))
          return;
        if (this.$$startDragPosition = null, this.$$possibleDragNode) {
          if (this.$$possibleDragNode.startDragging() === !1) {
            e(), this.$$possibleDragNode = null;
            return;
          }
          this.$set(this, "draggableNode", { node: this.$$possibleDragNode, left: 0, top: 0 }), this.$$possibleDragNode = null;
        }
        this.draggableNode.left = r.clientX, this.draggableNode.top = r.clientY;
        const n = Ie(r);
        if (Fe(this.$el), n) {
          const h = n.getAttribute("data-id");
          if (this.draggableNode.node.id === h)
            return;
          if ((!this.$$dropDestination || this.$$dropDestination.id !== h) && (this.$$dropDestination = this.tree.getNodeById(h)), this.$$dropDestination && this.draggableNode.node && this.$$dropDestination.getPath().includes(this.draggableNode.node)) {
            this.$$dropDestination = null;
            return;
          }
          s = Be(r, n);
          const a = _(
            [this.draggableNode.node, this.$$dropDestination, s],
            this.tree.options.dnd,
            "onDragOn"
          );
          !(this.$$dropDestination.isDropable() && a !== !1) && s === f.ON && (s = null), M(n, s);
        }
      };
      window.addEventListener("mouseup", t, !0), window.addEventListener("mousemove", i, !0);
    }
  }
};
const We = {
  direction: "ltr",
  multiple: !0,
  checkbox: !0,
  checkOnSelect: !1,
  autoCheckChildren: !0,
  autoDisableChildren: !0,
  checkDisabledChildren: !0,
  parentSelect: !1,
  keyboardNavigation: !0,
  nodeIndent: 24,
  minFetchDelay: 0,
  fetchData: null,
  propertyNames: null,
  deletion: !1,
  dnd: !1,
  editing: !1,
  onFetchError: function(s) {
    throw s;
  }
}, He = {
  emptyText: "Nothing found!",
  matcher(s, e) {
    const t = new RegExp(s, "i").test(e.text);
    return t && e.parent && new RegExp(s, "i").test(e.parent.text) ? !1 : t;
  },
  plainList: !1,
  showChildren: !0
}, Je = {
  name: "Tree",
  components: {
    TreeNode: ne,
    DraggableNode: le
  },
  mixins: [Se, Ve],
  provide: (s) => ({
    tree: null
  }),
  props: {
    data: {},
    options: {
      type: Object,
      default: (s) => ({})
    },
    filter: String,
    tag: {
      type: String,
      default: "div"
    }
  },
  data() {
    let s = Object.assign({}, We, this.options);
    return s.filter = Object.assign(
      {},
      He,
      s.filter
    ), {
      model: [],
      tree: null,
      loading: !1,
      opts: s,
      matches: [],
      draggableNode: null
    };
  },
  computed: {
    visibleModel() {
      return this.model.filter(function(s) {
        return s && s.visible();
      });
    },
    visibleMatches() {
      return this.matches.filter(function(s) {
        return s && s.visible();
      });
    }
  },
  watch: {
    filter(s) {
      this.tree.filter(s);
    }
  }
}, Ue = ["innerHTML"];
function Ye(s, e, t, i, r, n) {
  const h = E("TreeNode"), a = E("DraggableNode");
  return o(), N(z(t.tag), {
    role: "tree",
    class: D({ tree: !0, "tree-loading": this.loading, "tree--draggable": !!this.draggableNode })
  }, {
    default: U(() => [
      t.filter && r.matches.length == 0 ? (o(), u("div", {
        key: 0,
        class: "tree-filter-empty",
        innerHTML: r.opts.filter.emptyText
      }, null, 8, Ue)) : (o(), u("ul", {
        key: 1,
        class: "tree-root",
        onDragstart: e[0] || (e[0] = (...l) => s.onDragStart && s.onDragStart(...l))
      }, [
        r.opts.filter.plainList && r.matches.length > 0 ? (o(!0), u(A, { key: 0 }, S(n.visibleMatches, (l) => (o(), N(h, {
          key: l.id,
          node: l,
          options: r.opts
        }, null, 8, ["node", "options"]))), 128)) : (o(!0), u(A, { key: 1 }, S(n.visibleModel, (l) => (o(), N(h, {
          key: l.id,
          node: l,
          options: r.opts
        }, null, 8, ["node", "options"]))), 128))
      ], 32)),
      r.draggableNode ? (o(), N(a, {
        key: 2,
        target: r.draggableNode
      }, null, 8, ["target"])) : T("", !0)
    ]),
    _: 1
  }, 8, ["class"]);
}
const O = /* @__PURE__ */ L(Je, [["render", Ye]]);
O.install = (s) => {
  s.component(O.name, O);
};
export {
  O as default
};
//# sourceMappingURL=liquor-tree-vue3-compliance.esm.js.map
