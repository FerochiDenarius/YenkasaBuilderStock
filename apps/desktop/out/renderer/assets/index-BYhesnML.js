function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$2() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$2;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$2;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X$1 = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X$1, e = Xj;
      X$1 = null;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X$1.removeChild(c.stateNode));
      break;
    case 18:
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X$1, c.stateNode));
      break;
    case 4:
      d = X$1;
      e = Xj;
      X$1 = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X$1 = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X$1) throw Error(p(160));
      Zj(f2, g, e);
      X$1 = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowLeft = createLucideIcon("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRight = createLucideIcon("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Banknote = createLucideIcon("Banknote", [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Barcode = createLucideIcon("Barcode", [
  ["path", { d: "M3 5v14", key: "1nt18q" }],
  ["path", { d: "M8 5v14", key: "1ybrkv" }],
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "M17 5v14", key: "ycjyhj" }],
  ["path", { d: "M21 5v14", key: "nzette" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bell = createLucideIcon("Bell", [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookOpen = createLucideIcon("BookOpen", [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Boxes = createLucideIcon("Boxes", [
  [
    "path",
    {
      d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
      key: "lc1i9w"
    }
  ],
  ["path", { d: "m7 16.5-4.74-2.85", key: "1o9zyk" }],
  ["path", { d: "m7 16.5 5-3", key: "va8pkn" }],
  ["path", { d: "M7 16.5v5.17", key: "jnp8gn" }],
  [
    "path",
    {
      d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
      key: "8zsnat"
    }
  ],
  ["path", { d: "m17 16.5-5-3", key: "8arw3v" }],
  ["path", { d: "m17 16.5 4.74-2.85", key: "8rfmw" }],
  ["path", { d: "M17 16.5v5.17", key: "k6z78m" }],
  [
    "path",
    {
      d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
      key: "1xygjf"
    }
  ],
  ["path", { d: "M12 8 7.26 5.15", key: "1vbdud" }],
  ["path", { d: "m12 8 4.74-2.85", key: "3rx089" }],
  ["path", { d: "M12 13.5V8", key: "1io7kd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Building2 = createLucideIcon("Building2", [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleCheck = createLucideIcon("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleUser = createLucideIcon("CircleUser", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
  ["path", { d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662", key: "154egf" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardCheck = createLucideIcon("ClipboardCheck", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "m9 14 2 2 4-4", key: "df797q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardList = createLucideIcon("ClipboardList", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clipboard = createLucideIcon("Clipboard", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudOff = createLucideIcon("CloudOff", [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193", key: "yfwify" }],
  [
    "path",
    { d: "M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07", key: "jlfiyv" }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cloud = createLucideIcon("Cloud", [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CreditCard = createLucideIcon("CreditCard", [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Crown = createLucideIcon("Crown", [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Download = createLucideIcon("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EyeOff = createLucideIcon("EyeOff", [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eye = createLucideIcon("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileText = createLucideIcon("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const History = createLucideIcon("History", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const House = createLucideIcon("House", [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Image = createLucideIcon("Image", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const KeyRound = createLucideIcon("KeyRound", [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Landmark = createLucideIcon("Landmark", [
  ["line", { x1: "3", x2: "21", y1: "22", y2: "22", key: "j8o0r" }],
  ["line", { x1: "6", x2: "6", y1: "18", y2: "11", key: "10tf0k" }],
  ["line", { x1: "10", x2: "10", y1: "18", y2: "11", key: "54lgf6" }],
  ["line", { x1: "14", x2: "14", y1: "18", y2: "11", key: "380y" }],
  ["line", { x1: "18", x2: "18", y1: "18", y2: "11", key: "1kevvc" }],
  ["polygon", { points: "12 2 20 7 4 7", key: "jkujk7" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutDashboard = createLucideIcon("LayoutDashboard", [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LockKeyhole = createLucideIcon("LockKeyhole", [
  ["circle", { cx: "12", cy: "16", r: "1", key: "1au0dj" }],
  ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2", key: "6s8ecr" }],
  ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3", key: "1pqi11" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LogIn = createLucideIcon("LogIn", [
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }],
  ["polyline", { points: "10 17 15 12 10 7", key: "1ail0h" }],
  ["line", { x1: "15", x2: "3", y1: "12", y2: "12", key: "v6grx8" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPin = createLucideIcon("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Menu = createLucideIcon("Menu", [
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
  ["line", { x1: "4", x2: "20", y1: "6", y2: "6", key: "1owob3" }],
  ["line", { x1: "4", x2: "20", y1: "18", y2: "18", key: "yk5zj1" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Minus = createLucideIcon("Minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Monitor = createLucideIcon("Monitor", [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackageCheck = createLucideIcon("PackageCheck", [
  ["path", { d: "m16 16 2 2 4-4", key: "gfu2re" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackagePlus = createLucideIcon("PackagePlus", [
  ["path", { d: "M16 16h6", key: "100bgy" }],
  ["path", { d: "M19 13v6", key: "85cyf1" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Package = createLucideIcon("Package", [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["path", { d: "m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7", key: "yx3hmr" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Palette = createLucideIcon("Palette", [
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  [
    "path",
    {
      d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
      key: "12rzf8"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PenLine = createLucideIcon("PenLine", [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pencil = createLucideIcon("Pencil", [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Printer = createLucideIcon("Printer", [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Receipt = createLucideIcon("Receipt", [
  [
    "path",
    { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z", key: "q3az6g" }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 17.5v-11", key: "1jc1ny" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCw = createLucideIcon("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Save = createLucideIcon("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Settings = createLucideIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldCheck = createLucideIcon("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShoppingCart = createLucideIcon("ShoppingCart", [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SlidersHorizontal = createLucideIcon("SlidersHorizontal", [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Smartphone = createLucideIcon("Smartphone", [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Store = createLucideIcon("Store", [
  ["path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7", key: "ztvudi" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }],
  ["path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4", key: "2ebpfo" }],
  ["path", { d: "M2 7h20", key: "1fcdvo" }],
  [
    "path",
    {
      d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",
      key: "6c3vgh"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TestTubeDiagonal = createLucideIcon("TestTubeDiagonal", [
  [
    "path",
    { d: "M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3", key: "1ub6xw" }
  ],
  ["path", { d: "m16 2 6 6", key: "1gw87d" }],
  ["path", { d: "M12 16H4", key: "1cjfip" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Truck = createLucideIcon("Truck", [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Users = createLucideIcon("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WalletCards = createLucideIcon("WalletCards", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2", key: "4125el" }],
  [
    "path",
    {
      d: "M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21",
      key: "1dpki6"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wifi = createLucideIcon("Wifi", [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
const LOCAL_API_URL = window.desktopBridge?.apiBaseUrl ?? void 0 ?? "http://127.0.0.1:8765";
function ownerHeaders() {
  const token = sessionStorage.getItem("yenkasa-owner-session");
  return token ? { "X-Owner-Session": token } : { "X-Role": "HQ_ADMIN" };
}
async function request(path, init) {
  const response = await fetch(`${LOCAL_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers }
  });
  if (!response.ok) {
    const body = await response.json().catch(() => void 0);
    throw new Error(
      body?.error?.message ?? `Local API request failed (${response.status})`
    );
  }
  return response.json();
}
const companyApi = {
  get: () => request("/api/company"),
  save: (company) => request("/api/company", {
    method: "PUT",
    headers: ownerHeaders(),
    body: JSON.stringify(company)
  })
};
const ownerApi = {
  get: () => request("/api/owner", { headers: ownerHeaders() }),
  save: (owner) => request("/api/owner", {
    method: "PUT",
    headers: ownerHeaders(),
    body: JSON.stringify(owner)
  }),
  status: () => request("/api/owner/status"),
  login: (username, password) => request("/api/owner/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  }),
  logout: () => request("/api/owner/logout", { method: "POST", headers: ownerHeaders() }),
  getSecurity: () => request("/api/owner/security", {
    headers: ownerHeaders()
  }),
  saveSecurity: (security) => request("/api/owner/security", {
    method: "PUT",
    headers: ownerHeaders(),
    body: JSON.stringify(security)
  }),
  activity: () => request("/api/owner/activity", {
    headers: ownerHeaders()
  })
};
const branchApi = {
  list: () => request("/api/branches", { headers: ownerHeaders() }),
  activatedList: () => request("/api/activated-branches"),
  create: (branch) => request("/api/branches", {
    method: "POST",
    headers: ownerHeaders(),
    body: JSON.stringify(branch)
  }),
  update: (id2, branch) => request(`/api/branches/${id2}`, {
    method: "PATCH",
    headers: ownerHeaders(),
    body: JSON.stringify(branch)
  })
};
const deviceApi = {
  list: () => request("/api/devices", {
    headers: ownerHeaders()
  }),
  create: (payload) => request("/api/devices", {
    method: "POST",
    headers: ownerHeaders(),
    body: JSON.stringify(payload)
  }),
  update: (id2, active) => request(`/api/devices/${id2}`, {
    method: "PATCH",
    headers: ownerHeaders(),
    body: JSON.stringify({ active })
  })
};
const authApi = {
  login: (payload) => request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  }),
  logout: (userId) => request("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({ userId })
  })
};
const syncApi = {
  status: (branchId, userId) => request(
    `/api/sync/status?branchId=${encodeURIComponent(branchId)}`,
    { headers: { "X-User-Id": userId, "X-Branch-Id": branchId } }
  ),
  saveSettings: (branchId, userId, payload) => request("/api/sync/settings", {
    method: "PUT",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify({ branchId, ...payload })
  }),
  run: (branchId, userId) => request(
    "/api/sync/run",
    {
      method: "POST",
      headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
      body: JSON.stringify({ branchId })
    }
  )
};
const staffApi = {
  companyUsers: () => request("/api/company-users", {
    headers: ownerHeaders()
  }),
  list: (branchId, userId) => request(
    `/api/staff?branchId=${encodeURIComponent(branchId)}`,
    { headers: { "X-User-Id": userId, "X-Branch-Id": branchId } }
  ),
  create: (branchId, userId, payload) => request("/api/staff", {
    method: "POST",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify({ ...payload, branchId })
  }),
  update: (id2, branchId, userId, payload) => request(`/api/staff/${id2}`, {
    method: "PATCH",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify(payload)
  }),
  resetPassword: (id2, branchId, userId, password) => request(`/api/staff/${id2}/reset-password`, {
    method: "POST",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify({ password })
  }),
  audit: (branchId, userId) => request(
    branchId ? `/api/audit-log?branchId=${encodeURIComponent(branchId)}` : "/api/company-audit-log",
    {
      headers: branchId ? { "X-User-Id": userId ?? "", "X-Branch-Id": branchId } : ownerHeaders()
    }
  )
};
const salesApi = {
  products: (branchId, userId) => request(
    `/api/products?branchId=${encodeURIComponent(branchId)}`,
    { headers: { "X-User-Id": userId, "X-Branch-Id": branchId } }
  ),
  list: (branchId, userId) => request(
    `/api/sales?branchId=${encodeURIComponent(branchId)}`,
    { headers: { "X-User-Id": userId, "X-Branch-Id": branchId } }
  ),
  create: (payload, userId) => request("/api/sales", {
    method: "POST",
    headers: { "X-User-Id": userId, "X-Branch-Id": payload.branchId },
    body: JSON.stringify(payload)
  })
};
const inventoryApi = {
  list: (branchId, userId) => salesApi.products(branchId, userId),
  create: (branchId, userId, payload) => request("/api/products", {
    method: "POST",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify({ branchId, ...payload })
  }),
  adjustStock: (branchId, userId, sku, quantity, reason) => request(`/api/products/${encodeURIComponent(sku)}/stock`, {
    method: "PATCH",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify({ branchId, quantity, reason })
  })
};
const purchasingApi = {
  list: (branchId, userId) => request(`/api/purchases?branchId=${encodeURIComponent(branchId)}`, {
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId }
  }),
  create: (branchId, userId, payload) => request("/api/purchases", {
    method: "POST",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify({ branchId, ...payload })
  })
};
const paymentsApi = {
  invoices: (branchId, userId, search = "") => request(
    `/api/cashier/invoices?branchId=${encodeURIComponent(branchId)}&search=${encodeURIComponent(search)}`,
    { headers: { "X-User-Id": userId, "X-Branch-Id": branchId } }
  ),
  history: (branchId, userId) => request(
    `/api/payments/history?branchId=${encodeURIComponent(branchId)}`,
    { headers: { "X-User-Id": userId, "X-Branch-Id": branchId } }
  ),
  record: (payload, userId) => request("/api/payments", {
    method: "POST",
    headers: { "X-User-Id": userId, "X-Branch-Id": payload.branchId },
    body: JSON.stringify(payload)
  }),
  verify: (paymentId, branchId, userId, evidenceNote) => request(`/api/payments/${paymentId}/verify`, {
    method: "POST",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify({ evidenceNote })
  })
};
const materialReleaseApi = {
  invoices: (branchId, userId, search = "") => request(
    `/api/material-release/invoices?branchId=${encodeURIComponent(branchId)}&search=${encodeURIComponent(search)}`,
    { headers: { "X-User-Id": userId, "X-Branch-Id": branchId } }
  ),
  create: (branchId, userId, saleId, items) => request("/api/material-releases", {
    method: "POST",
    headers: { "X-User-Id": userId, "X-Branch-Id": branchId },
    body: JSON.stringify({ branchId, saleId, items })
  })
};
const fallback$1 = {
  registeredName: "Yenkasa Builders Supplies Ltd",
  tradingName: "Yenkasa Builders",
  category: "Building Materials",
  email: "info@yenkasa.xyz",
  phone: "+233 24 567 8900",
  country: "Ghana",
  address: "Oyarifa Main Road, Accra, Greater Accra Region, Ghana",
  currency: "GHS – Ghana Cedi (GH₵)",
  timezone: "Africa/Accra (GMT+00:00)",
  brandColor: "#0B2D6B",
  tagline: "Quality Building Materials for Every Project",
  logoRef: "",
  secondaryColor: "#F7B500",
  accentColor: "#D7263D",
  showLogoReceipts: true,
  showLogoInvoices: true,
  useBrandColours: true,
  documentTemplates: {
    selectedDocument: "Invoice Template",
    layoutStyle: "Classic",
    pageSize: "A4 (210 × 297 mm)",
    showCompanyLogo: true,
    showCompanyDetails: true,
    showBranchInformation: true,
    showFooterMessage: true,
    footerMessage: "Thank you for your business!",
    templateId: "invoice-classic-default",
    templateName: "Classic Invoice",
    version: 1,
    styles: {
      headingFontFamily: "Arial",
      headingFontSize: "20",
      headingColor: "#0B7E34",
      headingBold: true,
      logoWidth: "170",
      logoHeight: "88",
      logoOffsetX: "0",
      logoOffsetY: "0"
    },
    content: {
      companyName: "Yenkasa Builders Supplies Ltd",
      branchName: "Oyarifa Branch, Accra",
      companyPhone: "+233 24 123 4567",
      companyEmail: "info@yenkasa.xyz",
      invoiceNumber: "INV-000218",
      date: "22 Jan 2026",
      dueDate: "29 Jan 2026",
      billToName: "BuildRight Construction Ltd",
      billToAddress: "P. O. Box CT 456, Accra",
      billToPhone: "+233 55 987 6543",
      paymentTerms: "Cash / Credit",
      notes: "Goods are not returnable after delivery.\nPlease keep this invoice for your records.",
      items: [
        {
          description: "Cement (50kg)",
          quantity: "20",
          unit: "bags",
          unitPrice: "85.00"
        },
        {
          description: "Roofing Sheet (0.45mm)",
          quantity: "10",
          unit: "pcs",
          unitPrice: "125.00"
        },
        {
          description: 'PVC Pipe 4" (6m)',
          quantity: "5",
          unit: "pcs",
          unitPrice: "180.00"
        }
      ],
      discountPercent: "5",
      vatPercent: "15",
      amountPaid: "0"
    }
  }
};
function ConnectedBranding() {
  const fileInputRef = reactExports.useRef(null);
  const [value, setValue] = reactExports.useState(fallback$1);
  const [status, setStatus] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [previewTab, setPreviewTab] = reactExports.useState("Application");
  const [brandSection, setBrandSection] = reactExports.useState("Brand Identity");
  reactExports.useEffect(() => {
    companyApi.get().then((data) => {
      if (data) {
        const loaded = {
          ...fallback$1,
          ...data,
          documentTemplates: {
            ...fallback$1.documentTemplates,
            ...data.documentTemplates,
            styles: {
              ...fallback$1.documentTemplates.styles,
              ...data.documentTemplates?.styles
            },
            content: {
              ...fallback$1.documentTemplates.content,
              ...data.documentTemplates?.content,
              items: data.documentTemplates?.content?.items ?? fallback$1.documentTemplates.content.items
            }
          }
        };
        setValue(loaded);
      }
    }).catch(
      (reason) => setError(
        reason instanceof Error ? reason.message : "Unable to load branding."
      )
    );
  }, []);
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (!value.useBrandColours) {
      root.style.setProperty("--brand-primary", "#0b9438");
      root.style.setProperty("--brand-primary-dark", "#147536");
      root.style.setProperty("--brand-secondary", "#f7b500");
      root.style.setProperty("--brand-accent", "#d7263d");
      return;
    }
    root.style.setProperty("--brand-primary", value.brandColor);
    root.style.setProperty("--brand-primary-dark", value.brandColor);
    root.style.setProperty("--brand-secondary", value.secondaryColor);
    root.style.setProperty("--brand-accent", value.accentColor);
  }, [value.brandColor, value.secondaryColor, value.accentColor, value.useBrandColours]);
  const update = (key, next) => {
    setValue((current) => ({ ...current, [key]: next }));
    setStatus("");
    setError("");
  };
  const updateTemplate = (key, next) => {
    setValue((current) => ({
      ...current,
      documentTemplates: { ...current.documentTemplates, [key]: next }
    }));
    setStatus("");
    setError("");
  };
  const updateTemplateContent = (key, next) => {
    setValue((current) => ({
      ...current,
      documentTemplates: {
        ...current.documentTemplates,
        content: { ...current.documentTemplates.content, [key]: next }
      }
    }));
    setStatus("");
    setError("");
  };
  const chooseLogo = () => {
    setError("");
    fileInputRef.current?.click();
  };
  const onLogoSelected = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Choose a PNG, JPG or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo must be 2 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setError("The selected logo could not be read.");
    reader.onload = () => {
      if (typeof reader.result === "string") {
        update("logoRef", reader.result);
        setStatus("Logo selected; save branding to persist it.");
      }
    };
    reader.readAsDataURL(file);
  };
  const validate = () => {
    const problems = [];
    if (!value.tradingName.trim()) problems.push("Business name is required.");
    if (![value.brandColor, value.secondaryColor, value.accentColor].every(
      (colour) => /^#[0-9a-f]{6}$/i.test(colour)
    ))
      problems.push(
        "Brand colours must be six-digit hex values such as #0B2D6B."
      );
    const template = value.documentTemplates;
    const content = template.content;
    if (!content.companyName.trim())
      problems.push("Document company name is required.");
    if (!content.invoiceNumber.trim())
      problems.push("Invoice number is required.");
    if (!content.date.trim()) problems.push("Invoice date is required.");
    if (!content.billToName.trim()) problems.push("Customer name is required.");
    if (!content.items.length)
      problems.push("At least one invoice item is required.");
    content.items.forEach((item, index) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      if (!item.description.trim())
        problems.push(`Item ${index + 1} needs an item name.`);
      if (!item.unit.trim()) problems.push(`Item ${index + 1} needs a unit.`);
      if (!Number.isFinite(quantity) || quantity <= 0)
        problems.push(`Item ${index + 1} quantity must be greater than zero.`);
      if (!Number.isFinite(unitPrice) || unitPrice < 0)
        problems.push(`Item ${index + 1} unit price must be zero or greater.`);
    });
    const discount = Number(content.discountPercent);
    const vat = Number(content.vatPercent);
    if (!Number.isFinite(discount) || discount < 0 || discount > 100)
      problems.push("Discount must be between 0 and 100 percent.");
    if (!Number.isFinite(vat) || vat < 0 || vat > 100)
      problems.push("VAT must be between 0 and 100 percent.");
    return problems;
  };
  const save = async () => {
    const problems = validate();
    if (problems.length) {
      setError(problems.join(" "));
      setStatus("");
      return;
    }
    setSaving(true);
    setStatus("Saving locally…");
    setError("");
    try {
      const { templates: existingTemplates, ...currentTemplate } = value.documentTemplates;
      const toSave = {
        ...value,
        documentTemplates: {
          ...value.documentTemplates,
          templates: {
            ...existingTemplates ?? {},
            [value.documentTemplates.selectedDocument]: currentTemplate
          },
          version: Math.max(1, value.documentTemplates.version) + 1
        }
      };
      const saved = await companyApi.save(toSave);
      setValue({
        ...fallback$1,
        ...saved,
        documentTemplates: {
          ...fallback$1.documentTemplates,
          ...saved.documentTemplates,
          content: {
            ...fallback$1.documentTemplates.content,
            ...saved.documentTemplates?.content,
            items: saved.documentTemplates?.content?.items ?? fallback$1.documentTemplates.content.items
          },
          styles: {
            ...fallback$1.documentTemplates.styles,
            ...saved.documentTemplates?.styles
          },
          templates: saved.documentTemplates?.templates
        }
      });
      setStatus("Saved branding locally to SQLite");
    } catch (reason) {
      setStatus("");
      setError(
        reason instanceof Error ? reason.message : "Unable to save branding."
      );
    } finally {
      setSaving(false);
    }
  };
  const reset = () => {
    setValue(fallback$1);
    setStatus("Reset to default values; save to persist the reset.");
    setError("");
  };
  const removeLogo = () => {
    update("logoRef", "");
    setStatus("Logo removed; save branding to persist removal.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page branding-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  › ",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Business Branding" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Business Branding" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Customise your business identity, logo and visual appearance across the application, receipts and reports." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "branding-section-tabs",
        role: "tablist",
        "aria-label": "Business branding sections",
        children: ["Brand Identity", "Document Templates", "Brand Preview"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": brandSection === tab,
            className: brandSection === tab ? "active" : "",
            onClick: () => setBrandSection(tab),
            children: [
              tab === "Brand Identity" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 19 }) : tab === "Document Templates" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 19 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 19 }),
              tab
            ]
          },
          tab
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "branding-grid", children: brandSection === "Brand Identity" ? /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "panel brand-identity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 20 }),
        "Brand Identity"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ConnectedField,
        {
          name: "tradingName",
          label: "Business Name",
          value: value.tradingName,
          onChange: (v2) => update("tradingName", v2),
          required: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ConnectedField,
        {
          name: "tagline",
          label: "Business Tagline (optional)",
          value: value.tagline,
          onChange: (v2) => update("tagline", v2)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 20 }),
        "Logo"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-logo-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-logo-box", children: [
          value.logoRef ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              className: "brand-logo-image",
              src: value.logoRef,
              alt: `${value.tradingName || "Business"} logo`
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brand-logo-mark", children: "⌂" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value.tradingName || "Yenkasa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Builders Supplies Ltd" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "brand-outline",
              "data-testid": "branding-change-logo",
              type: "button",
              onClick: chooseLogo,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 16 }),
                "Change Logo"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "outline brand-remove",
              "data-testid": "branding-remove-logo",
              type: "button",
              onClick: removeLogo,
              disabled: !value.logoRef,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 }),
                " Remove"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              "data-testid": "branding-logo-input",
              className: "visually-hidden-file",
              type: "file",
              accept: "image/png,image/jpeg,image/webp",
              onChange: onLogoSelected
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "brand-help", children: [
        "PNG, JPG or WebP · maximum 2 MB",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Recommended: at least 512 × 512 px (transparent background preferred)"
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error", role: "alert", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("hr", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 20 }),
        "Brand Colours"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "colour-fields", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ColourField,
          {
            name: "primaryColor",
            label: "Primary Colour",
            value: value.brandColor,
            colour: value.brandColor,
            onChange: (v2) => update("brandColor", v2)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ColourField,
          {
            name: "secondaryColor",
            label: "Secondary Colour",
            value: value.secondaryColor,
            colour: value.secondaryColor,
            onChange: (v2) => update("secondaryColor", v2)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ColourField,
          {
            name: "accentColor",
            label: "Accent Colour",
            value: value.accentColor,
            colour: value.accentColor,
            onChange: (v2) => update("accentColor", v2)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20 }),
        "Business Assets"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleRowConnected,
        {
          label: "Show logo on receipts",
          checked: value.showLogoReceipts,
          onChange: () => update("showLogoReceipts", !value.showLogoReceipts)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleRowConnected,
        {
          label: "Show logo on invoices",
          checked: value.showLogoInvoices,
          onChange: () => update("showLogoInvoices", !value.showLogoInvoices)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToggleRowConnected,
        {
          label: "Use brand colours in the application",
          checked: value.useBrandColours,
          onChange: () => update("useBrandColours", !value.useBrandColours)
        }
      )
    ] }) }) : brandSection === "Document Templates" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      DocumentTemplatesPanel,
      {
        value: value.documentTemplates,
        update: updateTemplate,
        updateContent: updateTemplateContent,
        saveTemplate: save,
        logoRef: value.logoRef,
        brandColor: value.brandColor,
        error,
        setStatus
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brand-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel branding-preview", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brand-panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 20 }),
          "Branding Preview"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-tabs", children: ["Application", "Receipt", "Invoice", "Report"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-testid": `branding-preview-${item.toLowerCase()}`,
            className: previewTab === item ? "active" : "",
            onClick: () => setPreviewTab(item),
            children: item
          },
          item
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-mock", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { style: { background: value.brandColor }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mock-logo", children: [
              value.logoRef ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  className: "mock-logo-image",
                  src: value.logoRef,
                  alt: ""
                }
              ) : "⌂",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value.tradingName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "⌂   Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🛒   Sales" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "▱   Inventory" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "◈   Purchasing" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mock-content", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mock-skeleton", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              previewTab,
              " preview"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "How your business identity appears on this document." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mock-cards", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
                "Business name",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value.tradingName || "Your business" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
                "Primary colour",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: value.secondaryColor }, children: value.brandColor })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
                "Logo",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value.logoRef ? "Uploaded" : "Not set" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-callout", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 22 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Where your branding will be used" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your business name, logo and colours will appear in the application, receipts, invoices, reports and other printed documents." })
        ] })
      ] })
    ] }) }),
    brandSection !== "Brand Preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "outline",
          "data-testid": "branding-reset",
          type: "button",
          onClick: reset,
          children: "↶   Reset to Default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "primary-button",
          "data-testid": "branding-save",
          type: "button",
          disabled: saving,
          onClick: save,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 17 }),
            saving ? "Saving…" : "Save Branding"
          ]
        }
      ),
      status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status", role: "status", children: status })
    ] })
  ] });
}
function DocumentTemplatesPanel({
  value,
  update,
  updateContent,
  saveTemplate,
  logoRef,
  brandColor,
  error,
  setStatus
}) {
  const documents = [
    ["Invoice Template", "Sales invoice layout"],
    ["Receipt Template", "Payment receipt layout"],
    ["Quotation Template", "Customer quotation layout"],
    ["Delivery Note Template", "Goods delivery layout"],
    ["Credit Note Template", "Sales return / credit layout"]
  ];
  const [editing, setEditing] = reactExports.useState(false);
  const [selectedElement, setSelectedElement] = reactExports.useState("Company Heading");
  const [history, setHistory] = reactExports.useState([]);
  const [future, setFuture] = reactExports.useState([]);
  const content = value.content;
  const styles = value.styles;
  const number = (input) => {
    const parsed = Number(input);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const money2 = (input) => input.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const rows = content.items.map((item) => ({
    ...item,
    amount: number(item.quantity) * number(item.unitPrice)
  }));
  const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
  const discount = subtotal * (number(content.discountPercent) / 100);
  const taxable = subtotal - discount;
  const vat = taxable * (number(content.vatPercent) / 100);
  const total = taxable + vat;
  const amountPaid = number(content.amountPaid);
  const balance = total - amountPaid;
  const restore = (snapshot) => {
    Object.keys(snapshot).forEach(
      (key) => update(key, snapshot[key])
    );
  };
  const remember = (next) => {
    setHistory((items) => [...items, value].slice(-20));
    setFuture([]);
    restore(next);
  };
  const changeContent = (key, next) => {
    setHistory((items) => [...items, value].slice(-20));
    setFuture([]);
    updateContent(key, next);
  };
  const changeStyles = (key, next) => {
    setHistory((items) => [...items, value].slice(-20));
    setFuture([]);
    update("styles", { ...styles, [key]: next });
  };
  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((items) => items.slice(0, -1));
    setFuture((items) => [value, ...items].slice(0, 20));
    restore(previous);
    setStatus("Last template edit undone.");
  };
  const redo = () => {
    const next = future[0];
    if (!next) return;
    setFuture((items) => items.slice(1));
    setHistory((items) => [...items, value].slice(-20));
    restore(next);
    setStatus("Template edit restored.");
  };
  const updateItem = (index, key, next) => {
    const items = content.items.map(
      (item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item
    );
    changeContent("items", items);
  };
  const addItem = () => {
    changeContent("items", [
      ...content.items,
      {
        description: "New item",
        quantity: "1",
        unit: "pcs",
        unitPrice: "0.00"
      }
    ]);
    setStatus("Item row added.");
    window.setTimeout(() => {
      document.querySelector(
        `[data-testid="document-item-${content.items.length}-description"]`
      )?.focus();
    }, 0);
  };
  const removeItem = (index) => {
    if (content.items.length === 1) return;
    changeContent(
      "items",
      content.items.filter((_, itemIndex) => itemIndex !== index)
    );
  };
  const addTool = (tool) => {
    setSelectedElement(tool);
    if (tool === "Add Company Logo") update("showCompanyLogo", true);
    if (tool === "Add Company Information") update("showCompanyDetails", true);
    if (tool === "Add Branch Information")
      update("showBranchInformation", true);
    if (tool === "Add Footer") update("showFooterMessage", true);
    if (tool === "Add Customer Information")
      setStatus("Customer information is bound to the Bill To fields below.");
    else if (tool === "Add Item Table")
      setStatus("Item table is active and editable below.");
    else setStatus(`${tool} added to the template editor.`);
  };
  const selectDocument = (name) => {
    const { templates: existingTemplates, ...currentTemplate } = value;
    const nextTemplates = {
      ...existingTemplates ?? {},
      [value.selectedDocument]: currentTemplate
    };
    const savedTemplate = existingTemplates?.[name];
    if (savedTemplate) {
      remember({
        ...savedTemplate,
        selectedDocument: name,
        templates: nextTemplates
      });
    } else {
      remember({
        ...value,
        selectedDocument: name,
        templateName: `Classic ${name.replace(" Template", "")}`,
        templates: nextTemplates
      });
    }
    setStatus(
      `${name} selected. Save the template to make it available to branches.`
    );
  };
  const editText = (key, event) => {
    const text = event.currentTarget.textContent ?? "";
    if (text !== content[key])
      changeContent(key, text);
  };
  const print = () => {
    if (window.desktopBridge?.print) void window.desktopBridge.print();
    else window.print();
  };
  const exportPdf = async () => {
    if (window.desktopBridge?.exportPdf) {
      const result = await window.desktopBridge.exportPdf(
        void 0,
        value.pageSize
      );
      setStatus(result ? `PDF saved to ${result}` : "PDF export cancelled.");
    } else {
      window.print();
      setStatus("Choose “Save as PDF” in the print dialog.");
    }
  };
  const documentTitle = value.selectedDocument.replace(" Template", "").toUpperCase();
  const editorTools = [
    "Add Text",
    "Add Company Logo",
    "Add Company Information",
    "Add Branch Information",
    "Add Customer Information",
    "Add Invoice Details",
    "Add Item Table",
    "Add Totals",
    "Add Payment Details",
    "Add Signature",
    "Add Footer",
    "Add QR Code",
    "Add Lines and Shapes"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel document-templates-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-templates-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 24 }),
          "Document Templates"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Customize invoice, receipt and other document layouts." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-template-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "outline",
            onClick: () => {
              remember({
                ...value,
                selectedDocument: "Invoice Template",
                templateName: "Classic Invoice",
                version: value.version + 1
              });
              setStatus(
                "Invoice Template selected as the default; save the template to persist it."
              );
            },
            children: "✓  Set as Default"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "outline",
            onClick: () => setEditing(false),
            children: "◉  Preview"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "outline",
            "data-testid": "document-edit-toggle",
            onClick: () => setEditing((current) => !current),
            children: [
              "✎  ",
              editing ? "Close Editor" : "Edit Template"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "outline",
            "data-testid": "document-print-test",
            onClick: print,
            children: "▣  Print"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "outline", onClick: exportPdf, children: "⇩  Save PDF" })
      ] })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-editor-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "outline",
          onClick: undo,
          disabled: !history.length,
          children: "↶ Undo"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "outline",
          onClick: redo,
          disabled: !future.length,
          children: "↷ Redo"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Editor mode · select a tool, then edit the document fields." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "primary-button",
          onClick: () => void saveTemplate(),
          children: "Save Template"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "document-validation-error", role: "alert", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `document-template-layout ${editing ? "document-editor-layout" : ""}`,
        children: [
          editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "document-editor-tools", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Editing Tools" }),
            editorTools.map((tool) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: selectedElement === tool ? "selected" : "",
                onClick: () => addTool(tool),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "＋" }),
                  tool
                ]
              },
              tool
            ))
          ] }),
          !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "document-template-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Select Document" }),
            documents.map(([name, description]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: value.selectedDocument === name ? "selected" : "",
                onClick: () => selectDocument(name),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 21 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: description })
                  ] })
                ]
              },
              name
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "section",
            {
              className: `document-template-preview ${editing ? "document-editor-canvas" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-preview-title", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: value.selectedDocument }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      "Design and customize your",
                      " ",
                      value.selectedDocument.replace(" Template", "").toLowerCase(),
                      "."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Default" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `document-paper ${value.layoutStyle.toLowerCase()}`,
                    style: { borderTopColor: brandColor },
                    children: [
                      value.showCompanyLogo && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `document-paper-logo ${selectedElement === "Add Company Logo" ? "document-element-selected" : ""}`,
                          style: {
                            width: `${styles.logoWidth}px`,
                            height: `${styles.logoHeight}px`,
                            transform: `translate(${styles.logoOffsetX}px, ${styles.logoOffsetY}px)`
                          },
                          onClick: () => setSelectedElement("Add Company Logo"),
                          children: logoRef ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoRef, alt: "Company logo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⌂" })
                        }
                      ),
                      value.showCompanyDetails && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-paper-company", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "strong",
                          {
                            contentEditable: editing,
                            suppressContentEditableWarning: true,
                            onClick: () => setSelectedElement("Company Heading"),
                            onBlur: (event) => editText("companyName", event),
                            style: {
                              fontFamily: styles.headingFontFamily,
                              fontSize: `${styles.headingFontSize}px`,
                              color: styles.headingColor,
                              fontWeight: styles.headingBold ? 800 : 400
                            },
                            children: content.companyName
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: content.branchName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                          content.companyEmail,
                          " · ",
                          content.companyPhone
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-paper-meta", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value.showBranchInformation ? content.branchName : "—" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Document No." }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "strong",
                            {
                              contentEditable: editing,
                              suppressContentEditableWarning: true,
                              onBlur: (event) => editText("invoiceNumber", event),
                              children: content.invoiceNumber
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "strong",
                            {
                              contentEditable: editing,
                              suppressContentEditableWarning: true,
                              onBlur: (event) => editText("date", event),
                              children: content.date
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Due Date" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "strong",
                            {
                              contentEditable: editing,
                              suppressContentEditableWarning: true,
                              onBlur: (event) => editText("dueDate", event),
                              children: content.dueDate
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: documentTitle }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-paper-bill-to", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Bill To" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: content.billToName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: content.billToAddress }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: content.billToPhone })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "document-paper-table", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "#" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Item Description" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Qty" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Unit" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Unit Price (GH₵)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Amount (GH₵)" })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: index + 1 }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: row.description }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: row.quantity }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: row.unit }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: money2(number(row.unitPrice)) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: money2(row.amount) })
                        ] }, `${row.description}-${index}`)) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-paper-totals", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money2(subtotal) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "Discount (",
                          content.discountPercent,
                          "%)"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                          "-",
                          money2(discount)
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "VAT (",
                          content.vatPercent,
                          "%)"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money2(vat) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Total (GH₵)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money2(total) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Amount Paid" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money2(amountPaid) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Outstanding Balance" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money2(balance) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-paper-payment", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Payment Terms:" }),
                        " ",
                        content.paymentTerms
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-paper-notes", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Notes:" }),
                        content.notes.split("\n").map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "• ",
                          line
                        ] }, line))
                      ] }),
                      value.showFooterMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "document-paper-footer", children: value.footerMessage })
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "document-template-options", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Template Options" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Layout Style" }),
            ["Classic", "Modern", "Professional", "Simple"].map((style) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: `template-radio ${value.layoutStyle === style ? "selected" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "layoutStyle",
                      checked: value.layoutStyle === style,
                      onChange: () => update("layoutStyle", style)
                    }
                  ),
                  style,
                  style === "Classic" && " (Recommended)"
                ]
              },
              style
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
              "Page Size",
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: value.pageSize,
                  onChange: (event) => update("pageSize", event.target.value),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "A4 (210 × 297 mm)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "A5 (148 × 210 mm)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "80 mm Receipt" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Brand Elements" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-check", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: value.showCompanyLogo,
                  onChange: (event) => update("showCompanyLogo", event.target.checked)
                }
              ),
              "Show Company Logo"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-check", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: value.showCompanyDetails,
                  onChange: (event) => update("showCompanyDetails", event.target.checked)
                }
              ),
              "Show Company Details"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-check", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: value.showBranchInformation,
                  onChange: (event) => update("showBranchInformation", event.target.checked)
                }
              ),
              "Show Branch Information"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-check", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: value.showFooterMessage,
                  onChange: (event) => update("showFooterMessage", event.target.checked)
                }
              ),
              "Show Footer Message"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
              "Footer Message",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-testid": "document-footerMessage",
                  value: value.footerMessage,
                  onChange: (event) => update("footerMessage", event.target.value)
                }
              )
            ] }),
            editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-properties", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Element Properties" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedElement }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
                "Font Family",
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: styles.headingFontFamily,
                    onChange: (event) => changeStyles("headingFontFamily", event.target.value),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Arial" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Georgia" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Inter" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Times New Roman" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
                "Font Size",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "8",
                    max: "48",
                    value: styles.headingFontSize,
                    onChange: (event) => changeStyles("headingFontSize", event.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
                "Text Colour",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: styles.headingColor,
                    onChange: (event) => changeStyles("headingColor", event.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-check", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: styles.headingBold,
                    onChange: (event) => changeStyles("headingBold", event.target.checked)
                  }
                ),
                " ",
                "Bold heading"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
                "Logo Width",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "40",
                    max: "300",
                    value: styles.logoWidth,
                    onChange: (event) => changeStyles("logoWidth", event.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
                "Logo Height",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "30",
                    max: "180",
                    value: styles.logoHeight,
                    onChange: (event) => changeStyles("logoHeight", event.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
                "Logo Move X",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "-100",
                    max: "100",
                    value: styles.logoOffsetX,
                    onChange: (event) => changeStyles("logoOffsetX", event.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
                "Logo Move Y",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "number",
                    min: "-100",
                    max: "100",
                    value: styles.logoOffsetY,
                    onChange: (event) => changeStyles("logoOffsetY", event.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Invoice Content" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-editor-fields", children: [
                [
                  ["invoiceNumber", "Invoice Number"],
                  ["date", "Invoice Date"],
                  ["dueDate", "Due Date"],
                  ["companyName", "Company Name"],
                  ["branchName", "Branch"],
                  ["companyEmail", "Company Email"],
                  ["companyPhone", "Company Phone"],
                  ["billToName", "Customer Name"],
                  ["billToAddress", "Customer Address"],
                  ["billToPhone", "Customer Phone"],
                  ["paymentTerms", "Payment Terms"],
                  ["discountPercent", "Discount %"],
                  ["vatPercent", "VAT %"],
                  ["amountPaid", "Amount Paid"]
                ].map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  label,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-testid": `document-${String(key)}`,
                      value: String(content[key]),
                      onChange: (event) => changeContent(key, event.target.value)
                    }
                  )
                ] }, key)),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Notes",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      "data-testid": "document-notes",
                      value: content.notes,
                      onChange: (event) => changeContent("notes", event.target.value)
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Item Rows" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "document-item-editor", children: content.items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "document-item-row",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                      "Item name",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          "data-testid": `document-item-${index}-description`,
                          value: item.description,
                          onChange: (event) => updateItem(index, "description", event.target.value),
                          placeholder: "Enter item name"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-item-inline-fields", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                        "Qty",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            value: item.quantity,
                            onChange: (event) => updateItem(index, "quantity", event.target.value),
                            placeholder: "0",
                            inputMode: "decimal"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                        "Unit",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            value: item.unit,
                            onChange: (event) => updateItem(index, "unit", event.target.value),
                            placeholder: "pcs"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                        "Unit price",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            value: item.unitPrice,
                            onChange: (event) => updateItem(index, "unitPrice", event.target.value),
                            placeholder: "0.00",
                            inputMode: "decimal"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => removeItem(index),
                          "aria-label": `Remove item ${index + 1}`,
                          children: "×"
                        }
                      )
                    ] })
                  ]
                },
                `${index}-${item.description}`
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "outline", onClick: addItem, children: "＋ Add Item Row" })
            ] })
          ] })
        ]
      }
    )
  ] });
}
function ConnectedField({
  name,
  label,
  value,
  onChange,
  required
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
    label,
    required && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: " *" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        name,
        "data-testid": `branding-${name}`,
        value,
        onChange: (event) => onChange(event.target.value)
      }
    )
  ] });
}
function ColourField({
  name,
  label,
  value,
  colour,
  onChange
}) {
  const safeColour = /^#[0-9a-f]{6}$/i.test(colour) ? colour : "#000000";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
    label,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "colour-picker",
          "data-testid": `branding-${name}-picker`,
          type: "color",
          value: safeColour,
          onChange: (event) => onChange(event.target.value.toUpperCase())
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: safeColour } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-testid": `branding-${name}`,
          value,
          onChange: (event) => onChange(event.target.value)
        }
      )
    ] })
  ] });
}
function ToggleRowConnected({
  label,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toggle-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: checked ? "on" : "",
        onClick: onChange,
        "aria-label": label,
        "aria-pressed": checked,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
      }
    )
  ] });
}
const initial = {
  registeredName: "",
  tradingName: "",
  category: "",
  email: "",
  phone: "",
  country: "Ghana",
  address: "",
  currency: "GHS – Ghana Cedi (GH₵)",
  timezone: "Africa/Accra (GMT+00:00)",
  brandColor: "#0B2D6B",
  tagline: "",
  logoRef: "",
  secondaryColor: "#F7B500",
  accentColor: "#D7263D",
  showLogoReceipts: true,
  showLogoInvoices: true,
  useBrandColours: true
};
const categories = [
  "Building Materials",
  "Construction",
  "Retail",
  "Hardware",
  "Other"
];
const countries = ["Ghana", "Nigeria", "Togo", "Côte d’Ivoire"];
const currencies = [
  "GHS – Ghana Cedi (GH₵)",
  "NGN – Nigerian Naira (₦)",
  "USD – US Dollar ($)"
];
const timezones = [
  "Africa/Accra (GMT+00:00)",
  "Africa/Lagos (GMT+01:00)",
  "UTC (GMT+00:00)"
];
function BusinessInfoPage$1() {
  const [value, setValue] = reactExports.useState(initial);
  const [savedValue, setSavedValue] = reactExports.useState(initial);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  reactExports.useEffect(() => {
    companyApi.get().then((data) => {
      if (data) {
        setValue({ ...initial, ...data });
        setSavedValue({ ...initial, ...data });
      }
    }).catch(
      (reason) => setError(
        reason instanceof Error ? reason.message : "Unable to load company information."
      )
    ).finally(() => setLoading(false));
  }, []);
  const update = (key, next) => {
    setValue((current) => ({ ...current, [key]: next }));
    setMessage("");
    setError("");
    setFieldErrors((current) => ({ ...current, [key]: void 0 }));
  };
  const validate = () => {
    const errors = {};
    const required = [
      "registeredName",
      "tradingName",
      "category",
      "email",
      "phone",
      "country",
      "address",
      "currency",
      "timezone"
    ];
    required.forEach((key) => {
      if (!String(value[key] ?? "").trim())
        errors[key] = "This field is required.";
    });
    if (value.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()))
      errors.email = "Enter a valid business email address.";
    if (value.phone.trim() && !/^[+0-9][0-9 ()-]{7,}$/.test(value.phone.trim()))
      errors.phone = "Enter a valid phone number.";
    return errors;
  };
  const save = async () => {
    setMessage("");
    setError("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError("Review the highlighted fields before saving.");
      return;
    }
    setSaving(true);
    try {
      const saved = await companyApi.save({
        ...value,
        registeredName: value.registeredName.trim(),
        tradingName: value.tradingName.trim(),
        address: value.address.trim(),
        phone: value.phone.trim()
      });
      setValue(saved);
      setSavedValue(saved);
      setMessage("Saved locally to SQLite");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to save company information."
      );
    } finally {
      setSaving(false);
    }
  };
  const reset = () => {
    setValue(savedValue);
    setMessage("Changes reset");
    setError("");
    setFieldErrors({});
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page info-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  › ",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Business Information" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Business Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Manage your registered company details and business profile." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info-design-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Company Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Keep your official business details up to date." })
        ] }) }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-loading", children: "Loading saved company information…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-fields", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field$2,
              {
                name: "registeredName",
                label: "Registered Company Name",
                value: value.registeredName,
                onChange: (v2) => update("registeredName", v2),
                required: true,
                error: fieldErrors.registeredName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field$2,
              {
                name: "tradingName",
                label: "Trading / Business Name",
                value: value.tradingName,
                onChange: (v2) => update("tradingName", v2),
                required: true,
                error: fieldErrors.tradingName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectField,
              {
                name: "category",
                label: "Business Category",
                value: value.category,
                options: categories,
                onChange: (v2) => update("category", v2),
                required: true,
                error: fieldErrors.category
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field$2,
              {
                name: "email",
                label: "Business Email",
                value: value.email,
                onChange: (v2) => update("email", v2),
                required: true,
                type: "email",
                error: fieldErrors.email
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field$2,
              {
                name: "phone",
                label: "Phone Number",
                value: value.phone,
                onChange: (v2) => update("phone", v2),
                required: true,
                error: fieldErrors.phone
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectField,
              {
                name: "country",
                label: "Country",
                value: value.country,
                options: countries,
                onChange: (v2) => update("country", v2),
                required: true,
                error: fieldErrors.country
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field$2,
              {
                name: "address",
                label: "Business Address",
                value: value.address,
                onChange: (v2) => update("address", v2),
                required: true,
                textarea: true,
                error: fieldErrors.address
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectField,
              {
                name: "currency",
                label: "Currency",
                value: value.currency,
                options: currencies,
                onChange: (v2) => update("currency", v2),
                required: true,
                error: fieldErrors.currency
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectField,
              {
                name: "timezone",
                label: "Timezone",
                value: value.timezone,
                options: timezones,
                onChange: (v2) => update("timezone", v2),
                required: true,
                error: fieldErrors.timezone
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "outline",
                "data-testid": "business-info-reset",
                onClick: reset,
                children: "Reset Changes"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "primary-button",
                "data-testid": "business-info-save",
                disabled: saving,
                onClick: save,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 }),
                  saving ? "Saving…" : "Save Changes"
                ]
              }
            ),
            message && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status", role: "status", children: message }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error", role: "alert", children: error })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel setup-info-side", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Company Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "How your company appears across the application." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "company-profile-preview", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "company-emblem", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 42 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: value.registeredName || "Your company" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            value.category || "Business category",
            " · ",
            value.country
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            value.currency,
            " · ",
            value.timezone
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Field$2({
  name,
  label,
  value,
  onChange,
  required,
  type = "text",
  textarea = false,
  error
}) {
  const describedBy = error ? `${name}-error` : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: error ? "field-invalid" : void 0, children: [
    label,
    required && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: " *" }),
    textarea ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        name,
        "data-testid": `business-info-${name}`,
        value,
        onChange: (event) => onChange(event.target.value),
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        name,
        "data-testid": `business-info-${name}`,
        type,
        value,
        onChange: (event) => onChange(event.target.value),
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { id: describedBy, className: "field-error", children: error })
  ] });
}
function SelectField({
  name,
  label,
  value,
  options,
  onChange,
  required,
  error
}) {
  const describedBy = error ? `${name}-error` : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: error ? "field-invalid" : void 0, children: [
    label,
    required && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: " *" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        name,
        "data-testid": `business-info-${name}`,
        value,
        onChange: (event) => onChange(event.target.value),
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "", children: [
            "Select ",
            label.toLowerCase()
          ] }),
          options.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option, children: option }, option))
        ]
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { id: describedBy, className: "field-error", children: error })
  ] });
}
const fallback = {
  fullName: "Bright Kofi Ofosu Menya",
  role: "Business Owner",
  phone: "+233 24 123 4567",
  email: "bright@yenkasa.xyz",
  identificationType: "Ghana Card",
  idNumber: "GHA-123456789-0",
  dateOfBirth: "12 Jan 1989",
  gender: "Male",
  photoRef: ""
};
const permissions = [
  "Manage company information",
  "Manage business branding",
  "Create and manage branches",
  "Create and manage user roles",
  "Access all branches and reports",
  "Configure system settings",
  "Approve critical changes"
];
const settingsItems = [
  ["Business Information", Building2],
  ["Owner Account", CircleUser],
  ["Users & Roles", Users],
  ["Branches", Building2],
  ["System Settings", Settings]
];
function OwnerAccountPage({
  onNavigate
}) {
  const photoInput = reactExports.useRef(null);
  const [value, setValue] = reactExports.useState(fallback);
  const [savedValue, setSavedValue] = reactExports.useState(fallback);
  const [editing, setEditing] = reactExports.useState(false);
  const [section, setSection] = reactExports.useState("Profile Information");
  const [status, setStatus] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    ownerApi.get().then((data) => {
      if (data) {
        setValue(data);
        setSavedValue(data);
      }
    }).catch(
      (reason) => setError(
        reason instanceof Error ? reason.message : "Unable to load owner account."
      )
    );
  }, []);
  const update = (key, next) => {
    setValue((current) => ({ ...current, [key]: next }));
    setStatus("");
    setError("");
  };
  const choosePhoto = () => photoInput.current?.click();
  const onPhotoSelected = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Choose a PNG, JPG or WebP profile photo.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Profile photo must be 2 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setError("The selected profile photo could not be read.");
    reader.onload = () => typeof reader.result === "string" && update("photoRef", reader.result);
    reader.readAsDataURL(file);
  };
  const save = async () => {
    if (!value.fullName.trim() || !value.role.trim() || !value.phone.trim() || !value.email.trim()) {
      setError("Complete the required owner fields before saving.");
      setEditing(true);
      return;
    }
    setSaving(true);
    setError("");
    setStatus("Saving locally…");
    try {
      const saved = await ownerApi.save(value);
      setValue(saved);
      setSavedValue(saved);
      setStatus("Saved owner account locally to SQLite");
      setEditing(false);
    } catch (reason) {
      setStatus("");
      setError(
        reason instanceof Error ? reason.message : "Unable to save owner account."
      );
    } finally {
      setSaving(false);
    }
  };
  const reset = () => {
    setValue(savedValue);
    setEditing(false);
    setStatus("Changes reset");
    setError("");
  };
  const initials = value.fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "BO";
  const navigate = (page) => onNavigate?.(page);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-reference-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "owner-reference-topbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-brand", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reference-brand-mark", children: "⌂" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            "Yenkasa",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "BuildersStock" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Building Materials Management" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "reference-main-nav", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => navigate("Dashboard"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 20 }),
          "Dashboard"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => navigate("Inventory"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 20 }),
          "Inventory"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => navigate("Sales"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-glyph", children: "▱" }),
          "Sales"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => navigate("Purchasing"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-glyph", children: "▱" }),
          "Purchases"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => navigate("Customers"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20 }),
          "Customers"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => navigate("Reports"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 20 }),
          "Reports"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "reference-branch",
          type: "button",
          onClick: () => setStatus(
            "Branch selector is available when branch access is configured."
          ),
          children: [
            "Branch: Oyarifa ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⌄" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "reference-user",
          type: "button",
          onClick: () => setStatus("Owner profile menu"),
          children: initials
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "owner-reference-sidebar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-settings-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { size: 24 }),
        "Settings"
      ] }),
      settingsItems.map(([label, Icon2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: label === "Owner Account" ? "active" : "",
          onClick: () => label === "Owner Account" ? void 0 : navigate(label),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 22 }),
            label
          ]
        },
        label
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "owner-reference-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-owner-layout", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "reference-section-menu", children: ["Profile Information", "Security & Login", "Activity Log"].map(
          (label) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: section === label ? "active" : "",
              onClick: () => setSection(label),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label === "Profile Information" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 23 }) : label === "Security & Login" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { size: 23 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 23 }) }),
                label
              ]
            },
            label
          )
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "reference-content", children: section === "Profile Information" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-profile-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "reference-edit",
                type: "button",
                onClick: () => setEditing(true),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 17 }),
                  " Edit Profile"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-profile-avatar", children: [
              value.photoRef ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: value.photoRef, alt: "Owner profile" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "owner-initials", children: initials }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Change profile photo",
                  onClick: choosePhoto,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 15 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-profile-info", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-profile-title", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Owner Profile" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active" })
              ] }),
              editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-edit-form", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OwnerField,
                  {
                    name: "fullName",
                    label: "Full Name",
                    required: true,
                    value: value.fullName,
                    onChange: (v2) => update("fullName", v2)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OwnerField,
                  {
                    name: "phone",
                    label: "Phone",
                    required: true,
                    value: value.phone,
                    onChange: (v2) => update("phone", v2)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OwnerField,
                  {
                    name: "email",
                    label: "Email",
                    required: true,
                    value: value.email,
                    onChange: (v2) => update("email", v2)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OwnerField,
                  {
                    name: "gender",
                    label: "Gender",
                    value: value.gender,
                    onChange: (v2) => update("gender", v2),
                    select: true,
                    options: ["Male", "Female", "Prefer not to say"]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OwnerField,
                  {
                    name: "dateOfBirth",
                    label: "Date of Birth",
                    value: value.dateOfBirth,
                    onChange: (v2) => update("dateOfBirth", v2)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OwnerField,
                  {
                    name: "identificationType",
                    label: "ID Type",
                    value: value.identificationType,
                    onChange: (v2) => update("identificationType", v2),
                    select: true,
                    options: ["Ghana Card", "Passport", "Driver Licence"]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OwnerField,
                  {
                    name: "idNumber",
                    label: "ID Number",
                    value: value.idNumber,
                    onChange: (v2) => update("idNumber", v2)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  OwnerField,
                  {
                    name: "role",
                    label: "Role",
                    required: true,
                    value: value.role,
                    onChange: (v2) => update("role", v2)
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-profile-details", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Full Name", value: value.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Phone", value: value.phone }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Email", value: value.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Gender", value: value.gender }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Detail,
                  {
                    label: "Date of Birth",
                    value: value.dateOfBirth
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Detail,
                  {
                    label: "ID Type",
                    value: value.identificationType
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "ID Number", value: value.idNumber })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: photoInput,
                "data-testid": "owner-photo-input",
                className: "visually-hidden-file",
                type: "file",
                accept: "image/png,image/jpeg,image/webp",
                onChange: onPhotoSelected
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-cards", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReferenceCard,
              {
                title: "Business Ownership",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 27 }),
                rows: [
                  ["Company", "Yenkasa Builders Supplies Ltd"],
                  ["Owner Since", "01 Nov 2026"],
                  ["Ownership Type", "Primary Owner"],
                  ["Account Scope", "Full Access"]
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 27 }),
                "Owner Permissions"
              ] }),
              permissions.map((permission) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-permission", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 17 }),
                permission
              ] }, permission))
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ReferenceSubsection, { section }) })
      ] }),
      section === "Profile Information" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "reference-reset",
            type: "button",
            "data-testid": "owner-reset",
            onClick: reset,
            children: "↶  Reset Changes"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "reference-save",
            type: "button",
            "data-testid": "owner-save",
            disabled: saving,
            onClick: save,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
              saving ? "Saving…" : "Save Changes"
            ]
          }
        ),
        status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status", role: "status", children: status }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error", role: "alert", children: error })
      ] })
    ] })
  ] });
}
function Detail({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-detail", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value || "—" })
  ] });
}
function OwnerField({
  name,
  label,
  required,
  value,
  onChange,
  select,
  options
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "reference-field", children: [
    label,
    required && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: " *" }),
    select ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        name,
        "data-testid": `owner-${name}`,
        value,
        onChange: (event) => onChange(event.target.value),
        children: options?.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: option }, option))
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        name,
        "data-testid": `owner-${name}`,
        value,
        onChange: (event) => onChange(event.target.value)
      }
    )
  ] });
}
function ReferenceCard({
  title,
  icon,
  rows
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
      icon,
      title
    ] }),
    rows.map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reference-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      label === "Account Scope" ? /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: value }) : /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value })
    ] }, label))
  ] });
}
function ReferenceSubsection({ section }) {
  if (section === "Security & Login") return /* @__PURE__ */ jsxRuntimeExports.jsx(OwnerSecuritySection, {});
  if (section === "Activity Log") return /* @__PURE__ */ jsxRuntimeExports.jsx(OwnerActivitySection, {});
  return null;
}
const fallbackSecurity = {
  username: "brightkofi",
  email: "bright@yenkasa.xyz",
  passwordSet: true,
  twoFactorEnabled: true,
  emailNotifications: true,
  smsNotifications: false,
  recoveryPhone: "+233 24 123 4567",
  recoveryEmail: "bright@yenkasa.xyz"
};
function OwnerSecuritySection() {
  const [value, setValue] = reactExports.useState(fallbackSecurity);
  const [savedValue, setSavedValue] = reactExports.useState(fallbackSecurity);
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [recoveryCodes, setRecoveryCodes] = reactExports.useState([]);
  reactExports.useEffect(() => {
    ownerApi.getSecurity().then((data) => {
      setValue(data);
      setSavedValue(data);
    }).catch(
      (reason) => setError(
        reason instanceof Error ? reason.message : "Unable to load security settings."
      )
    );
  }, []);
  const update = (key, next) => {
    setValue((current) => ({ ...current, [key]: next }));
    setStatus("");
    setError("");
  };
  const saveSecurity = async () => {
    if (!value.username.trim() || !value.email.trim()) {
      setError("Username and email are required.");
      return;
    }
    setSaving(true);
    setStatus("Saving security settings…");
    setError("");
    try {
      const saved = await ownerApi.saveSecurity({
        ...value,
        password: password || void 0
      });
      if (saved.ownerSession?.token) {
        sessionStorage.setItem("yenkasa-owner-session", saved.ownerSession.token);
        sessionStorage.setItem("yenkasa-owner-session-data", JSON.stringify(saved.ownerSession));
        window.dispatchEvent(new Event("yenkasa-owner-session-changed"));
      }
      setValue(saved);
      setSavedValue(saved);
      setPassword("");
      setStatus("Saved security settings to SQLite");
    } catch (reason) {
      setStatus("");
      setError(
        reason instanceof Error ? reason.message : "Unable to save security settings."
      );
    } finally {
      setSaving(false);
    }
  };
  const reset = () => {
    setValue(savedValue);
    setPassword("");
    setStatus("Changes reset");
    setError("");
  };
  const manageTwoFactor = () => {
    update("twoFactorEnabled", !value.twoFactorEnabled);
    setStatus(
      value.twoFactorEnabled ? "Two-factor authentication will be disabled after saving." : "Two-factor authentication will be enabled after saving."
    );
  };
  const generateRecoveryCodes = () => setRecoveryCodes(
    Array.from(
      { length: 6 },
      () => `${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    )
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-security-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card owner-section-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "owner-section-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 28 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Security & Login" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Manage your login credentials, authentication and account security." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-security-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card owner-security-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 24 }),
          "Login Details"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
          "Username",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-testid": "owner-security-username",
              value: value.username,
              onChange: (event) => update("username", event.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
          "Email Address",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-testid": "owner-security-email",
              type: "email",
              value: value.email,
              onChange: (event) => update("email", event.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
          "Password",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-testid": "owner-security-password",
              type: showPassword ? "text" : "password",
              placeholder: value.passwordSet ? "••••••••••••" : "Set a password",
              value: password,
              onChange: (event) => setPassword(event.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "security-outline-button",
            type: "button",
            onClick: () => setShowPassword(!showPassword),
            children: [
              showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16 }),
              " ",
              showPassword ? "Hide Password" : "Show Password"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card owner-security-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "security-card-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 24 }),
            "Two-Factor Authentication (2FA)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `security-toggle ${value.twoFactorEnabled ? "on" : ""}`,
              type: "button",
              "aria-label": "Toggle two-factor authentication",
              "aria-pressed": value.twoFactorEnabled,
              "data-testid": "owner-security-2fa",
              onClick: manageTwoFactor,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "security-help", children: "Add an extra layer of security to your account." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `security-status ${value.twoFactorEnabled ? "enabled" : ""}`,
            children: value.twoFactorEnabled ? "✓ 2FA is enabled" : "2FA is disabled"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "security-button-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "security-outline-button",
              type: "button",
              onClick: manageTwoFactor,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 16 }),
                "Manage 2FA"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "security-outline-button",
              type: "button",
              onClick: generateRecoveryCodes,
              children: "Recovery Codes"
            }
          )
        ] }),
        recoveryCodes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recovery-codes", children: recoveryCodes.map((code) => /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: code }, code)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card owner-security-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "security-card-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 24 }),
            "Login Notifications"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `security-toggle ${value.emailNotifications || value.smsNotifications ? "on" : ""}`,
              type: "button",
              "aria-label": "Toggle login notifications",
              "aria-pressed": value.emailNotifications || value.smsNotifications,
              onClick: () => {
                const enabled = !(value.emailNotifications || value.smsNotifications);
                update("emailNotifications", enabled);
                update("smsNotifications", enabled);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "security-help", children: "Get alerts when your account is signed in on a new device." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-check", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-testid": "owner-security-email-notifications",
              type: "checkbox",
              checked: value.emailNotifications,
              onChange: (event) => update("emailNotifications", event.target.checked)
            }
          ),
          "Email Notifications"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-check", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-testid": "owner-security-sms-notifications",
              type: "checkbox",
              checked: value.smsNotifications,
              onChange: (event) => update("smsNotifications", event.target.checked)
            }
          ),
          "SMS Notifications"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card owner-security-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 24 }),
          "Trusted Devices"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "security-help", children: "Devices that have signed in to your account." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trusted-device", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 23 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "This device" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Local Electron app · Active now" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Trusted device options",
              onClick: () => setStatus(
                "The current device cannot be revoked while it is in use."
              ),
              children: "•••"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trusted-device", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 23 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Previously trusted device" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Local SQLite record · Review required" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setStatus("Device review is available from Device Activation."),
              children: "•••"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card owner-security-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 24 }),
          "Account Recovery"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "security-help", children: "Set up recovery options to regain access if you cannot log in." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
          "Recovery Phone",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: value.recoveryPhone,
              onChange: (event) => update("recoveryPhone", event.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "security-field", children: [
          "Recovery Email",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "email",
              value: value.recoveryEmail,
              onChange: (event) => update("recoveryEmail", event.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "verified-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✓ Verified options are stored locally" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-security-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "reference-reset", type: "button", onClick: reset, children: "↶  Reset Changes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "reference-save",
          type: "button",
          "data-testid": "owner-security-save",
          disabled: saving,
          onClick: saveSecurity,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 17 }),
            saving ? "Saving…" : "Save Changes"
          ]
        }
      ),
      status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status", role: "status", children: status }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error", role: "alert", children: error })
    ] })
  ] });
}
function OwnerActivitySection() {
  const [rows, setRows] = reactExports.useState([]);
  const [activityType, setActivityType] = reactExports.useState("All Activities");
  const [dateRange, setDateRange] = reactExports.useState("Last 30 Days");
  const [query, setQuery] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const load = () => {
    setError("");
    ownerApi.activity().then(setRows).catch(
      (reason) => setError(
        reason instanceof Error ? reason.message : "Unable to load activity log."
      )
    );
  };
  reactExports.useEffect(load, []);
  const filtered = rows.filter((row) => {
    const matchesType = activityType === "All Activities" || row.activityType === activityType;
    const matchesQuery = !query.trim() || `${row.activityType} ${row.details} ${row.device}`.toLowerCase().includes(query.toLowerCase());
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1e3;
    const matchesDate = dateRange === "All Time" || Number.isNaN(Date.parse(row.createdAt)) || Date.parse(row.createdAt) >= cutoff;
    return matchesType && matchesQuery && matchesDate;
  });
  const exportLog = () => {
    const csv = [
      ["Date & Time", "Activity", "Details", "IP / Device"],
      ...filtered.map((row) => [
        row.createdAt,
        row.activityType,
        row.details,
        row.device
      ])
    ].map(
      (line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")
    ).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "owner-activity-log.csv";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Activity log exported");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-activity-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card owner-section-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "owner-section-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 28 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Activity Log" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Track important account activities, security events and changes to your owner account." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "security-outline-button activity-export",
          type: "button",
          "data-testid": "owner-activity-export",
          onClick: exportLog,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 16 }),
            "Export"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card owner-activity-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-activity-toolbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Activity Type",
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              "data-testid": "owner-activity-type",
              value: activityType,
              onChange: (event) => setActivityType(event.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All Activities" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Login" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Security" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Profile Update" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Branch" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "User Management" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "System Settings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Branch Sync" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Logout" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Date Range",
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              "data-testid": "owner-activity-range",
              value: dateRange,
              onChange: (event) => setDateRange(event.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Last 30 Days" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All Time" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "activity-search", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-testid": "owner-activity-search",
              placeholder: "Search activity...",
              value: query,
              onChange: (event) => setQuery(event.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "activity-refresh",
            type: "button",
            "data-testid": "owner-activity-refresh",
            onClick: load,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16 }),
              "Refresh"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-activity-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-activity-row activity-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Date & Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Activity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "IP / Device" })
        ] }),
        filtered.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-activity-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatActivityDate(row.createdAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.activityType }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.details }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: row.device })
        ] }, row.id)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "activity-empty", children: "No activities match the selected filters." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "activity-footer", children: [
        "Showing ",
        filtered.length,
        " of ",
        rows.length,
        " activities"
      ] }),
      status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status", role: "status", children: status }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error", role: "alert", children: error })
    ] })
  ] });
}
function formatActivityDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
const emptyForm$1 = {
  name: "",
  code: "",
  branchType: "Sales & Warehouse",
  location: "",
  phone: "",
  email: "",
  manager: "",
  managerContact: "",
  managerUsername: "",
  managerPassword: "",
  confirmPassword: "",
  deviceName: "",
  activateDevice: true
};
const accessRights = [
  ["sales", "Sales", "Create sales, print receipts and invoices"],
  [
    "purchases",
    "Purchases",
    "Create purchase orders and record goods received"
  ],
  ["inventory", "Inventory", "Manage stock, stock adjustments and transfers"],
  ["customers", "Customers", "Add and manage customer records"],
  ["suppliers", "Suppliers", "Add and manage supplier records"],
  ["reports", "Reports", "View branch sales, stock and transaction reports"]
];
const actionRights = [
  ["edit_selling_prices", "Edit selling prices"],
  ["apply_discounts", "Apply discounts"],
  ["process_returns", "Process returns"],
  ["adjust_stock", "Adjust stock (stock in/out)"],
  ["transfer_stock", "Transfer stock (to/from branches)"],
  ["financial_reports", "View financial reports (branch only)"]
];
function BranchesPage$1() {
  const [branches, setBranches] = reactExports.useState([]);
  const [query, setQuery] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [wizard, setWizard] = reactExports.useState(false);
  const load = () => {
    setLoading(true);
    branchApi.list().then(setBranches).catch(() => void 0).finally(() => setLoading(false));
  };
  reactExports.useEffect(load, []);
  const filtered = reactExports.useMemo(
    () => branches.filter(
      (branch) => `${branch.name} ${branch.code} ${branch.location} ${branch.manager}`.toLowerCase().includes(query.toLowerCase())
    ),
    [branches, query]
  );
  if (wizard)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      BranchCreationWizard,
      {
        onCancel: () => setWizard(false),
        onCreated: (branch) => {
          setBranches(
            (current) => [...current, branch].sort((a, b) => a.name.localeCompare(b.name))
          );
          window.dispatchEvent(new Event("yenkasa-branches-changed"));
          setWizard(false);
        }
      }
    );
  const active = branches.filter((branch) => branch.status === "Active").length;
  const users = branches.reduce(
    (total, branch) => total + branch.usersCount,
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page branch-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  ›  ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Branches" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Branch Setup" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Create and manage company branches, branch accounts and access from headquarters." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Stat$1,
        {
          label: "Total Branches",
          value: String(branches.length),
          tone: "blue"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat$1, { label: "Active Branches", value: String(active), tone: "teal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Stat$1,
        {
          label: "Suspended",
          value: String(branches.length - active),
          tone: "orange"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat$1, { label: "Branch Users", value: String(users), tone: "purple" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel branch-list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Registered Branches" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Every branch is isolated to your company and has its own manager account." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 15 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-testid": "branch-search",
              value: query,
              onChange: (event) => setQuery(event.target.value),
              placeholder: "Search branches..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "primary-button",
            type: "button",
            "data-testid": "branch-add-new",
            onClick: () => setWizard(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 17 }),
              "Add New Branch"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-row branch-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Manager" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-loading", children: "Loading branches…" }) : filtered.length ? filtered.map((branch, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: index + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            "▥  ",
            branch.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: branch.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: branch.location }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: branch.manager }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: branch.usersCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `status ${branch.status === "Active" ? "in-stock" : "low-stock"}`,
              children: branch.status
            }
          )
        ] }, branch.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-loading", children: "No branches match this search." })
      ] })
    ] })
  ] });
}
function BranchCreationWizard({
  onCancel,
  onCreated
}) {
  const [step, setStep] = reactExports.useState(1);
  const [form, setForm] = reactExports.useState(emptyForm$1);
  const [permissions2, setPermissions] = reactExports.useState(
    () => Object.fromEntries(
      [...accessRights, ...actionRights].map(([key]) => [key, true])
    )
  );
  const [error, setError] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setStatus("");
  };
  const next = () => {
    setError("");
    if (step === 1 && (!form.name.trim() || !form.code.trim() || !form.location.trim() || !form.manager.trim()))
      return setError("Complete branch name, code, address and manager name.");
    if (step === 2 && (!form.managerUsername.trim() || !form.managerPassword || form.managerPassword.length < 8 || form.managerPassword !== form.confirmPassword))
      return setError(
        form.managerPassword !== form.confirmPassword ? "Passwords do not match." : "Enter a username and a password of at least 8 characters."
      );
    setStep((current) => Math.min(3, current + 1));
  };
  const create = async () => {
    setSaving(true);
    setError("");
    setStatus("Creating branch, manager account and device record…");
    try {
      const branch = await branchApi.create({
        name: form.name,
        code: form.code,
        location: form.location,
        phone: form.phone,
        email: form.email,
        manager: form.manager,
        managerContact: form.managerContact,
        branchType: form.branchType,
        managerUsername: form.managerUsername,
        managerPassword: form.managerPassword,
        managerRole: "BRANCH_MANAGER",
        deviceName: form.deviceName,
        activateDevice: form.activateDevice,
        permissions: permissions2
      });
      onCreated(branch);
    } catch (reason) {
      setStatus("");
      setError(
        reason instanceof Error ? reason.message : "Unable to create branch."
      );
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page branch-wizard", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "breadcrumb-link", onClick: onCancel, children: "Branches" }),
      " ",
      " ›  ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Add New Branch" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Create New Branch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Set up branch details, login access and permissions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wizard-header-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "outline",
            type: "button",
            "data-testid": "branch-cancel",
            onClick: onCancel,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 17 }),
              "Cancel"
            ]
          }
        ),
        step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "primary-button",
            type: "button",
            "data-testid": "branch-create-final",
            disabled: saving,
            onClick: create,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 17 }),
              saving ? "Creating…" : "Create Branch"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wizard-steps", children: [
      ["1", "Branch Details"],
      ["2", "Login Setup"],
      ["3", "Permissions"]
    ].map(([number, label], index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: step === index + 1 ? "active" : step > index + 1 ? "complete" : "",
        onClick: () => step > index + 1 && setStep(index + 1),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: step > index + 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 17 }) : number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
          step > index + 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 17 })
        ]
      },
      label
    )) }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepDetails, { form, update, onNext: next }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      StepLogin,
      {
        form,
        update,
        onBack: () => setStep(1),
        onNext: next
      }
    ),
    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      StepPermissions,
      {
        form,
        permissions: permissions2,
        setPermissions,
        onBack: () => setStep(2),
        onCreate: create,
        saving
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wizard-error", role: "alert", children: error }),
    status && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wizard-status", role: "status", children: status })
  ] });
}
function StepDetails({
  form,
  update,
  onNext
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel wizard-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WizardHeading,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 29 }),
        title: "Branch Details",
        text: "Basic information about the branch"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wizard-fields", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field$1,
        {
          name: "name",
          label: "Branch Name",
          value: form.name,
          required: true,
          onChange: (value) => update("name", value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field$1,
        {
          name: "code",
          label: "Branch Code",
          value: form.code,
          required: true,
          onChange: (value) => update("code", value.toUpperCase())
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        "Branch Type ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            "data-testid": "branch-type",
            value: form.branchType,
            onChange: (event) => update("branchType", event.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Sales & Warehouse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Warehouse Only" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Sales Only" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        "Status",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "switch-line", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-pressed": "true", className: "switch-on", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}) }),
          "Active"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field$1,
        {
          name: "location",
          label: "Address",
          value: form.location,
          required: true,
          onChange: (value) => update("location", value),
          wide: true,
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 17 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field$1,
        {
          name: "phone",
          label: "Phone",
          value: form.phone,
          onChange: (value) => update("phone", value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field$1,
        {
          name: "email",
          label: "Email",
          value: form.email,
          onChange: (value) => update("email", value),
          type: "email"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field$1,
        {
          name: "manager",
          label: "Branch Manager (Full Name)",
          value: form.manager,
          required: true,
          onChange: (value) => update("manager", value),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 17 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field$1,
        {
          name: "managerContact",
          label: "Manager Contact",
          value: form.managerContact,
          onChange: (value) => update("managerContact", value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WizardFooter, { action: "Continue to Login Setup", onAction: onNext })
  ] });
}
function StepLogin({
  form,
  update,
  onBack,
  onNext
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel wizard-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WizardHeading,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 29 }),
        title: "Login Setup",
        text: "Create the branch manager's login account and device access"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wizard-login-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Manager Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "radio-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", checked: true, readOnly: true }),
            "Create New Account"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", disabled: true }),
            "Assign Existing User"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            name: "managerUsername",
            label: "Username",
            value: form.managerUsername,
            required: true,
            onChange: (value) => update("managerUsername", value),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 17 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            name: "managerPassword",
            label: "Password",
            value: form.managerPassword,
            required: true,
            onChange: (value) => update("managerPassword", value),
            type: "password",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { size: 17 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field$1,
          {
            name: "confirmPassword",
            label: "Confirm Password",
            value: form.confirmPassword,
            required: true,
            onChange: (value) => update("confirmPassword", value),
            type: "password",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { size: 17 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Role ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "static-select", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 17 }),
            "Branch Manager",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 21 }),
            "Branch Computer Activation"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Register this computer for the branch (offline & sync)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Field$1,
            {
              name: "deviceName",
              label: "Device Name",
              value: form.deviceName,
              required: true,
              onChange: (value) => update("deviceName", value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "check-line", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: form.activateDevice,
                onChange: (event) => update("activateDevice", event.target.checked)
              }
            ),
            "Activate branch computer now"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WizardFooter,
      {
        back: true,
        onBack,
        action: "Continue to Permissions",
        onAction: onNext
      }
    )
  ] });
}
function StepPermissions({
  form,
  permissions: permissions2,
  setPermissions,
  onBack,
  onCreate,
  saving
}) {
  const toggle = (key) => setPermissions((current) => ({ ...current, [key]: !current[key] }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel wizard-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WizardHeading,
      {
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 29 }),
        title: "Branch Permissions",
        text: `Select what ${form.manager || "the branch manager"} can access and do at this branch`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "permissions-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "permission-box", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Access Rights" }),
        accessRights.map(([key, label, detail]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "permission-check", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: !!permissions2[key],
              onChange: () => toggle(key)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: detail })
          ] })
        ] }, key))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "permission-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Action Permissions" }),
          actionRights.map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "permission-toggle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-pressed": !!permissions2[key],
                className: permissions2[key] ? "switch-on" : "",
                onClick: () => toggle(key),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
              }
            )
          ] }, key))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-note green", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { size: 17 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "These permissions apply to the branch manager for",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: form.name || "this branch" }),
            " only."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WizardFooter,
      {
        back: true,
        onBack,
        action: saving ? "Creating…" : "Create Branch",
        onAction: onCreate
      }
    )
  ] });
}
function WizardHeading({
  icon,
  title,
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wizard-heading", children: [
    icon,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: text })
    ] })
  ] });
}
function WizardFooter({
  back = false,
  onBack,
  action,
  onAction
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wizard-footer", children: [
    back ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "outline", onClick: onBack, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 17 }),
      "Back"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "primary-button", onClick: onAction, children: [
      action,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
    ] })
  ] });
}
function Field$1({
  name,
  label,
  value,
  onChange,
  required,
  type = "text",
  wide = false,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: wide ? "wide-field" : "", children: [
    label,
    required && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: " *" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wizard-input", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-testid": `branch-${name}`,
          name,
          type,
          value,
          onChange: (event) => onChange(event.target.value)
        }
      )
    ] })
  ] });
}
function Stat$1({
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `summary-icon ${tone}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 21 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value })
  ] });
}
const roleLabels = {
  BRANCH_MANAGER: "Branch Manager",
  SALES_OFFICER: "Sales Officer",
  CASHIER: "Cashier",
  STOCK_MANAGER: "Stock Manager / Storekeeper",
  // Legacy accounts remain selectable until the manager replaces them.
  SALES_CASHIER: "Sales + Cashier (Combined)"
};
function BranchLoginPage({
  onAuthenticated
}) {
  const [branches, setBranches] = reactExports.useState([]);
  const [loaded, setLoaded] = reactExports.useState(false);
  const [branchId, setBranchId] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("BRANCH_MANAGER");
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [remember, setRemember] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  reactExports.useEffect(() => {
    branchApi.activatedList().then((list) => {
      setBranches(list);
      if (list[0]) setBranchId(list[0].id);
    }).catch(
      (reason) => setError(
        reason instanceof Error ? reason.message : "Unable to load activated branch."
      )
    ).finally(() => setLoaded(true));
  }, []);
  const branch = branches.find((item) => item.id === branchId);
  const login = async () => {
    setError("");
    setStatus("");
    if (!branchId || !username.trim() || !password) {
      setError(
        "Select an activated branch and enter your username or email and password."
      );
      return;
    }
    try {
      const result = await authApi.login({
        branchId,
        username,
        password,
        loginRole: role
      });
      sessionStorage.setItem("yenkasa-session", JSON.stringify(result));
      if (remember) localStorage.setItem("yenkasa-remembered-user", username);
      setStatus("Signed in securely");
      onAuthenticated(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "branch-login-content", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "branch-login-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "branch-login-icon", size: 50 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Branch Login" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sign in to access the branch system" }),
    branch ? /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "branch-login-branch", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 29 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: branch.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Yenkasa Builders Supplies Ltd" })
      ] })
    ] }) : loaded ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "branch-login-unavailable", role: "alert", children: "No activated branch is available on this installation. Activate this device for a branch before signing in." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "login-muted", children: "Loading activated branch…" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "login-field", children: [
      "Login As",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          "data-testid": "login-role",
          value: role,
          onChange: (event) => setRole(event.target.value),
          children: Object.entries(roleLabels).map(([value, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value, children: label }, value))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "login-field", children: [
      "Username or Email",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "data-testid": "login-username",
          value: username,
          autoComplete: "username",
          onChange: (event) => setUsername(event.target.value),
          placeholder: "Enter your username or email"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "login-field", children: [
      "Password",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "password-control", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { size: 19 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-testid": "login-password",
            type: showPassword ? "text" : "password",
            value: password,
            autoComplete: "current-password",
            onChange: (event) => setPassword(event.target.value),
            placeholder: "Enter your password"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": showPassword ? "Hide password" : "Show password",
            onClick: () => setShowPassword((current) => !current),
            children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 20 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "login-options", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: remember,
            onChange: (event) => setRemember(event.target.checked)
          }
        ),
        " ",
        "Remember me"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setStatus(
            "Password resets are handled by the Branch Manager or company owner."
          ),
          children: "Forgot password?"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "login-submit",
        type: "button",
        "data-testid": "branch-login-submit",
        disabled: !branch,
        onClick: login,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 22 }),
          "Log In"
        ]
      }
    ),
    status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "login-status", role: "status", children: status }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "login-error", role: "alert", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "offline-login-note", children: "Offline login uses the securely provisioned local account for this activated company, branch and device." })
  ] }) });
}
function OwnerLoginPage({
  onAuthenticated
}) {
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const login = async () => {
    if (!username.trim() || !password) {
      setError("Enter the owner username or email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const session = await ownerApi.login(username, password);
      sessionStorage.setItem("yenkasa-owner-session", session.token);
      sessionStorage.setItem("yenkasa-owner-session-data", JSON.stringify(session));
      window.dispatchEvent(new Event("yenkasa-owner-session-changed"));
      onAuthenticated(session);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Owner login failed.");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "owner-login-page", "aria-labelledby": "owner-login-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "owner-login-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "owner-login-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 30 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "owner-login-title", children: "Owner Login" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Authenticate to reopen Company Setup and owner-only controls." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "login-field", children: [
      "Username or Email",
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: username, onChange: (event) => setUsername(event.target.value), autoComplete: "username" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "login-field", children: [
      "Password",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "owner-password-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { size: 17 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", value: password, onChange: (event) => setPassword(event.target.value), autoComplete: "current-password", onKeyDown: (event) => {
          if (event.key === "Enter") void login();
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": showPassword ? "Hide password" : "Show password", onClick: () => setShowPassword((current) => !current), children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 17 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 17 }) })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "login-error", role: "alert", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button owner-login-submit", type: "button", disabled: busy, onClick: () => void login(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 17 }),
      busy ? "Signing in…" : "Unlock Company Setup"
    ] })
  ] }) });
}
const permissionOptions = [
  ["sales", "Sales & Invoices"],
  ["quotations", "Quotations"],
  ["invoices", "Invoice access"],
  ["invoice_view", "View invoices"],
  ["payments", "Cashier & Payments"],
  ["receipts", "Receipts"],
  ["customers", "Customers"],
  ["suppliers", "Suppliers"],
  ["inventory_view", "View inventory"],
  ["inventory", "Manage inventory"],
  ["stock_receipts", "Stock receiving"],
  ["purchases", "Purchasing"],
  ["stock_adjustments", "Stock adjustments"],
  ["material_release", "Material release"],
  ["payment_reports", "Payment reports"],
  ["stock_reports", "Stock reports"],
  ["limited_reports", "Limited reports"]
];
const defaultPermissions = (role) => {
  const defaults = {
    STOCK_MANAGER: ["inventory_view", "inventory", "stock_receipts", "purchases", "suppliers", "stock_adjustments", "material_release", "stock_reports"],
    SALES_OFFICER: ["sales", "quotations", "invoices", "inventory_view", "customers", "limited_reports"],
    CASHIER: ["invoice_view", "payments", "receipts", "payment_reports"],
    SALES_CASHIER: ["sales", "quotations", "invoices", "invoice_view", "payments", "receipts", "inventory_view"]
  };
  return defaults[role] ?? [];
};
const blank$1 = {
  fullName: "",
  username: "",
  email: "",
  role: "STOCK_MANAGER",
  password: "",
  permissions: defaultPermissions("STOCK_MANAGER")
};
function StaffAccountsPage() {
  const stored = readSession();
  const ownerMode = !stored;
  const managerMode = stored?.role === "BRANCH_MANAGER";
  const [accounts, setAccounts] = reactExports.useState([]);
  const [form, setForm] = reactExports.useState(blank$1);
  const [editForm, setEditForm] = reactExports.useState({
    fullName: "",
    email: "",
    permissions: []
  });
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [resetting, setResetting] = reactExports.useState(null);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [auditOpen, setAuditOpen] = reactExports.useState(false);
  const [audit, setAudit] = reactExports.useState([]);
  const [query, setQuery] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [roleFilter, setRoleFilter] = reactExports.useState("All");
  const [error, setError] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const load = async () => {
    try {
      const list = ownerMode ? await staffApi.companyUsers() : managerMode && stored ? await staffApi.list(stored.branchId, stored.userId) : [];
      setAccounts(list);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to load users."
      );
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const filtered = reactExports.useMemo(
    () => accounts.filter(
      (account) => `${account.fullName} ${account.username} ${account.email} ${account.role} ${account.branchName ?? ""}`.toLowerCase().includes(query.toLowerCase())
    ).filter(
      (account) => statusFilter === "All" || (statusFilter === "Active" ? account.active : !account.active)
    ).filter(
      (account) => roleFilter === "All" || account.role === roleFilter
    ),
    [accounts, query, roleFilter, statusFilter]
  );
  const create = async () => {
    if (!stored || !managerMode) {
      setError(
        "Only an authenticated Branch Manager can create staff accounts."
      );
      return;
    }
    if (!form.fullName.trim() || !form.username.trim() || form.password.length < 8) {
      setError(
        "Full name, username and a password of at least 8 characters are required."
      );
      return;
    }
    try {
      await staffApi.create(stored.branchId, stored.userId, form);
      await load();
      setForm(blank$1);
      setOpen(false);
      setStatus("Staff account created securely");
      setError("");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to create staff account."
      );
    }
  };
  const saveEdit = async () => {
    if (!editing || !stored || !managerMode) return;
    try {
      await staffApi.update(
        editing.id,
        stored.branchId,
        stored.userId,
        editForm
      );
      await load();
      setEditing(null);
      setStatus("Staff information updated");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to update staff account."
      );
    }
  };
  const toggle = async (account) => {
    if (!stored || !managerMode) return;
    try {
      await staffApi.update(account.id, stored.branchId, stored.userId, {
        active: !account.active
      });
      await load();
      setStatus(account.active ? "Account deactivated" : "Account reactivated");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to update account status."
      );
    }
  };
  const resetPassword = async () => {
    if (!resetting || !stored || !managerMode || newPassword.length < 8) {
      setError("Enter a new password with at least 8 characters.");
      return;
    }
    try {
      await staffApi.resetPassword(
        resetting.id,
        stored.branchId,
        stored.userId,
        newPassword
      );
      setResetting(null);
      setNewPassword("");
      setStatus("Password reset securely");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to reset password."
      );
    }
  };
  const showAudit = async () => {
    try {
      const rows = await staffApi.audit(stored?.branchId, stored?.userId);
      setAudit(rows);
      setAuditOpen(true);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to load audit records."
      );
    }
  };
  const activeCount = accounts.filter((account) => account.active).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page staff-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  › ",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Users & Roles" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: ownerMode ? "Users & Roles" : "Staff Accounts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: ownerMode ? "Review company users, branch assignments and access status from headquarters." : "Create and manage Sales Officer, Cashier and Stock Manager accounts for the authenticated branch." })
      ] })
    ] }),
    managerMode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-action-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "primary-button",
        type: "button",
        "data-testid": "staff-add",
        onClick: () => {
          setOpen(true);
          setError("");
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 17 }),
          "Add Staff Account"
        ]
      }
    ) }),
    managerMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-policy", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 20 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch Managers can assign only Sales Officer, Cashier and Stock Manager roles. Staff accounts cannot create users or elevate their own privileges." })
    ] }),
    ownerMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total users", value: String(accounts.length) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Active users", value: String(activeCount) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Stat,
        {
          label: "Branch managers",
          value: String(
            accounts.filter((account) => account.role === "BRANCH_MANAGER").length
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel staff-list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-tabs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: !auditOpen ? "active-tab" : "",
            type: "button",
            onClick: () => setAuditOpen(false),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16 }),
              "Users"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: auditOpen ? "active-tab" : "",
            type: "button",
            onClick: showAudit,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16 }),
              "Audit Log"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-filters", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-testid": "staff-search",
              value: query,
              onChange: (event) => setQuery(event.target.value),
              placeholder: "Search users..."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              "data-testid": "staff-role-filter",
              value: roleFilter,
              onChange: (event) => setRoleFilter(event.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "All", children: "All roles" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "BRANCH_MANAGER", children: "Branch Manager" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "STOCK_MANAGER", children: "Stock Manager / Storekeeper" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SALES_OFFICER", children: "Sales Officer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CASHIER", children: "Cashier" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SALES_CASHIER", children: "Sales + Cashier (Combined)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              "data-testid": "staff-status-filter",
              value: statusFilter,
              onChange: (event) => setStatusFilter(event.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Active" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Inactive" })
              ]
            }
          )
        ] })
      ] }),
      auditOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(AuditRows, { rows: audit }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: !ownerMode && !managerMode ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-empty", children: "Sign in as a Branch Manager to manage branch staff." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-empty", children: "No matching user accounts." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-table", children: filtered.map((account) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        StaffRow,
        {
          account,
          ownerMode,
          onEdit: () => {
            setEditing(account);
            setEditForm({
              fullName: account.fullName,
              email: account.email,
              permissions: account.permissions?.length ? account.permissions : defaultPermissions(account.role)
            });
          },
          onToggle: () => toggle(account),
          onReset: () => {
            setResetting(account);
            setNewPassword("");
          }
        },
        account.id
      )) }) })
    ] }),
    status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status", role: "status", children: status }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error", role: "alert", children: error }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateModal,
      {
        form,
        setForm,
        onClose: () => setOpen(false),
        onCreate: create
      }
    ),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditModal,
      {
        form: editForm,
        setForm: setEditForm,
        onClose: () => setEditing(null),
        onSave: saveEdit
      }
    ),
    resetting && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResetModal,
      {
        password: newPassword,
        setPassword: setNewPassword,
        onClose: () => setResetting(null),
        onReset: resetPassword
      }
    )
  ] });
}
function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem("yenkasa-session") ?? "null");
  } catch {
    return null;
  }
}
function StaffRow({
  account,
  ownerMode,
  onEdit,
  onToggle,
  onReset
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 22 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: account.fullName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
        account.username,
        " ·",
        " ",
        account.role === "SALES_CASHIER" ? "Sales + Cashier (Combined)" : account.role === "SALES_OFFICER" ? "Sales Officer" : account.role === "CASHIER" ? "Cashier" : account.role === "STOCK_MANAGER" ? "Stock Manager / Storekeeper" : "Branch Manager",
        ownerMode && ` · ${account.branchName ?? "Unassigned"}`
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: account.active ? "status in-stock" : "status out-of-stock",
        children: account.active ? "Active" : "Inactive"
      }
    ),
    !ownerMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "outline small-button",
          type: "button",
          "data-testid": `staff-edit-${account.id}`,
          onClick: onEdit,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 13 }),
            "Edit"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "outline small-button",
          type: "button",
          "data-testid": `staff-reset-${account.id}`,
          onClick: onReset,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 13 }),
            "Reset"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "outline small-button",
          type: "button",
          onClick: onToggle,
          children: account.active ? "Deactivate" : "Reactivate"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: account.active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 17 }) : "—" })
  ] });
}
function CreateModal({
  form,
  setForm,
  onClose,
  onCreate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel staff-create", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Create Staff Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Passwords are hashed before they leave this form and are never returned by the API." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-button", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-fields", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: "Full Name",
          value: form.fullName,
          onChange: (value) => setForm({ ...form, fullName: value })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: "Username",
          value: form.username,
          onChange: (value) => setForm({ ...form, username: value })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: "Email",
          value: form.email,
          onChange: (value) => setForm({ ...form, email: value })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        "Role",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: form.role,
            onChange: (event) => setForm({ ...form, role: event.target.value, permissions: defaultPermissions(event.target.value) }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "STOCK_MANAGER", children: "Stock Manager / Storekeeper" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SALES_OFFICER", children: "Sales Officer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CASHIER", children: "Cashier" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SALES_CASHIER", children: "Sales + Cashier (Combined)" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: "Initial Password",
          type: "password",
          value: form.password,
          onChange: (value) => setForm({ ...form, password: value })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "staff-permission-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { children: "Initial branch permissions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Grant or revoke modules for this account. The backend enforces these permissions." }),
      permissionOptions.map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: form.permissions.includes(key),
            onChange: (event) => setForm({ ...form, permissions: event.target.checked ? [...form.permissions, key] : form.permissions.filter((permission) => permission !== key) })
          }
        ),
        label
      ] }, key))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "outline",
          type: "button",
          onClick: () => setForm(blank$1),
          children: "Reset"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", type: "button", onClick: onCreate, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 16 }),
        "Create Account"
      ] })
    ] })
  ] });
}
function EditModal({
  form,
  setForm,
  onClose,
  onSave
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel staff-create staff-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Edit Staff Information" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-button", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-fields", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: "Full Name",
          value: form.fullName,
          onChange: (value) => setForm({ ...form, fullName: value })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: "Email",
          value: form.email,
          onChange: (value) => setForm({ ...form, email: value })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "staff-permission-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { children: "Branch permissions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Choose the modules this account can use. Changes apply at the next login." }),
      permissionOptions.map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: form.permissions.includes(key),
            onChange: (event) => setForm({
              ...form,
              permissions: event.target.checked ? [...form.permissions, key] : form.permissions.filter((permission) => permission !== key)
            })
          }
        ),
        label
      ] }, key))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", type: "button", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary-button", type: "button", onClick: onSave, children: "Save Changes" })
    ] })
  ] });
}
function ResetModal({
  password,
  setPassword,
  onClose,
  onReset
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel staff-create staff-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Reset Password" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "icon-button", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-fields", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Field,
      {
        label: "New Password",
        type: "password",
        value: password,
        onChange: setPassword
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", type: "button", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary-button", type: "button", onClick: onReset, children: "Reset Password" })
    ] })
  ] });
}
function AuditRows({
  rows
}) {
  return rows.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "audit-list", children: rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "audit-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 17 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: row.action.replaceAll("_", " ") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(row.createdAt).toLocaleString() })
  ] }, row.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "staff-empty", children: "No audit events recorded yet." });
}
function Field({
  label,
  value,
  onChange,
  type = "text"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
    label,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        value,
        onChange: (event) => onChange(event.target.value)
      }
    )
  ] });
}
function Stat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "staff-stat", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value })
  ] });
}
const blank = {
  branchId: "",
  deviceName: "",
  deviceType: "Windows PC",
  validity: "Permanent"
};
function DeviceActivationPage() {
  const [branches, setBranches] = reactExports.useState([]);
  const [devices, setDevices] = reactExports.useState([]);
  const [form, setForm] = reactExports.useState(blank);
  const [query, setQuery] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [code, setCode] = reactExports.useState("");
  const load = async () => {
    try {
      const [branchList, deviceList] = await Promise.all([
        branchApi.list(),
        deviceApi.list()
      ]);
      setBranches(branchList);
      setDevices(deviceList);
      if (!form.branchId && branchList[0])
        setForm((current) => ({ ...current, branchId: branchList[0].id }));
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to load devices."
      );
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const create = async () => {
    if (!form.branchId || !form.deviceName.trim()) {
      setError("Select a branch and enter a device name.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await deviceApi.create(form);
      setDevices((current) => [created, ...current]);
      setCode(created.activationCode);
      setForm((current) => ({ ...current, deviceName: "" }));
      setStatus("Activation code generated and saved to SQLite");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to generate activation code."
      );
    } finally {
      setSaving(false);
    }
  };
  const toggle = async (device) => {
    try {
      const updated = await deviceApi.update(device.id, !device.active);
      setDevices(
        (current) => current.map((item) => item.id === updated.id ? updated : item)
      );
      setStatus(updated.active ? "Device reactivated" : "Device revoked");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to update device."
      );
    }
  };
  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard?.writeText(code);
    setStatus("Activation code copied");
  };
  const filtered = reactExports.useMemo(
    () => devices.filter(
      (device) => `${device.deviceName} ${device.branchName} ${device.deviceType} ${device.activationCode}`.toLowerCase().includes(query.toLowerCase())
    ),
    [devices, query]
  );
  const active = devices.filter((device) => device.active).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page device-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  › ",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Device Activation" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Device Activation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Authorize computers that can run YenkasaBuildersStock for your company and branches." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary$1,
        {
          label: "Total Devices",
          value: String(devices.length),
          tone: "blue"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Summary$1, { label: "Active Devices", value: String(active), tone: "teal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary$1,
        {
          label: "Revoked / Inactive",
          value: String(devices.length - active),
          tone: "orange"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel device-form", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 19 }),
            " Activate New Device"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Generate a secure activation code for a branch computer." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-fields one-column", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Select Branch ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                "data-testid": "device-branch",
                value: form.branchId,
                onChange: (event) => setForm({ ...form, branchId: event.target.value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select branch" }),
                  branches.map((branch) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: branch.id, children: [
                    branch.name,
                    " (",
                    branch.code,
                    ")"
                  ] }, branch.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Device Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                "data-testid": "device-name",
                value: form.deviceName,
                onChange: (event) => setForm({ ...form, deviceName: event.target.value }),
                placeholder: "Oyarifa-PC-02"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Device Type",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                "data-testid": "device-type",
                value: form.deviceType,
                onChange: (event) => setForm({ ...form, deviceType: event.target.value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Windows PC" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "macOS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Linux" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Tablet" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Activation Validity",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: form.validity,
                onChange: (event) => setForm({ ...form, validity: event.target.value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Permanent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "30 days" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "90 days" })
                ]
              }
            )
          ] })
        ] }),
        code && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "activation-code", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Activation Code",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "outline", onClick: copyCode, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { size: 15 }),
            "Copy"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "primary-button full-button",
            type: "button",
            "data-testid": "device-generate",
            disabled: saving || loading,
            onClick: create,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16 }),
              saving ? "Generating…" : "Generate Activation Code"
            ]
          }
        ),
        status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status device-message", role: "status", children: status }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error device-message", role: "alert", children: error })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel device-list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Registered Devices" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Devices linked to your company and branch." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 15 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                "data-testid": "device-search",
                value: query,
                onChange: (event) => setQuery(event.target.value),
                placeholder: "Search devices..."
              }
            )
          ] })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-loading", children: "Loading devices…" }) : filtered.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-row device-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Device Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Action" })
          ] }),
          filtered.map((device, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-row device-data-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: device.deviceName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: device.branchName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: device.activationCode || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: device.deviceType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `status ${device.active ? "in-stock" : "out-of-stock"}`,
                children: device.active ? "Active" : "Revoked"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "outline small-button",
                onClick: () => toggle(device),
                children: device.active ? "Revoke" : "Reactivate"
              }
            )
          ] }, device.id))
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-loading", children: "No registered devices match this search." })
      ] })
    ] })
  ] });
}
function Summary$1({
  label,
  value,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `summary-icon ${tone}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 21 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value })
  ] });
}
const fallbackProducts = [
  {
    sku: "CEM-001",
    barcode: "615110000003",
    name: "Dangote Cement (50kg)",
    category: "Cement",
    brand: "Dangote",
    productType: "Rapid Strength Cement",
    variant: "42.5R · 50kg bag",
    stock: 320,
    unit: "Bag",
    price: 90
  },
  {
    sku: "IRO-012",
    barcode: "615110000012",
    name: "Iron Rod 12mm (12m)",
    category: "Iron Rods",
    brand: "TOR",
    productType: "High Yield Reinforcement Bar",
    variant: "12mm · 12m length",
    stock: 150,
    unit: "Piece",
    price: 185
  },
  {
    sku: "BLO-006",
    barcode: "615110000021",
    name: "Hollow Block (6 inch)",
    category: "Blocks",
    brand: "Local Manufacture",
    productType: "Hollow Concrete Block",
    variant: "6 inch · standard",
    stock: 4200,
    unit: "Piece",
    price: 8.5
  },
  {
    sku: "PAI-020",
    barcode: "615110000031",
    name: "Paint (Emulsion) 20L - White",
    category: "Paints",
    brand: "ABC Paints",
    productType: "Emulsion Paint",
    variant: "20L · White",
    stock: 28,
    unit: "Tin",
    price: 460
  },
  {
    sku: "PVC-002",
    barcode: "615110000041",
    name: 'PVC Pipe 2" (6m)',
    category: "Plumbing",
    brand: "WAVIN",
    productType: "uPVC Pressure Pipe",
    variant: "2 inch · 6m length",
    stock: 85,
    unit: "Piece",
    price: 75
  },
  {
    sku: "ROO-035",
    barcode: "615110000051",
    name: "Roofing Sheet 0.35mm",
    category: "Roofing",
    brand: "Aluzinc",
    productType: "Corrugated Roofing Sheet",
    variant: "0.35mm · 3m length",
    stock: 120,
    unit: "Sheet",
    price: 230
  },
  {
    sku: "BWI-025",
    barcode: "615110000061",
    name: "Binding Wire (25kg)",
    category: "Hardware",
    brand: "Local Manufacture",
    productType: "Binding Wire",
    variant: "25kg roll",
    stock: 42,
    unit: "Roll",
    price: 320
  },
  {
    sku: "TIL-060",
    barcode: "615110000071",
    name: "Ceramic Tile (60 × 60)",
    category: "Tiles",
    brand: "MaxTile",
    productType: "Ceramic Floor Tile",
    variant: "60 × 60cm · assorted",
    stock: 310,
    unit: "Box",
    price: 95
  }
];
const money$3 = (value) => `GH₵ ${value.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function SalesPage({ session }) {
  const [mode, setMode] = reactExports.useState("INVOICE");
  const [view, setView] = reactExports.useState("CREATE");
  const [products, setProducts] = reactExports.useState(fallbackProducts);
  const [selectedProduct, setSelectedProduct] = reactExports.useState(fallbackProducts[0]);
  const [query, setQuery] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("All");
  const [brand, setBrand] = reactExports.useState("All");
  const [productType, setProductType] = reactExports.useState("All");
  const [customer, setCustomer] = reactExports.useState("Walk-in Customer");
  const [notes, setNotes] = reactExports.useState("");
  const [vatEnabled, setVatEnabled] = reactExports.useState(true);
  const [cart, setCart] = reactExports.useState([
    {
      product: fallbackProducts[0],
      sku: fallbackProducts[0].sku,
      name: fallbackProducts[0].name,
      quantity: 10,
      unit: fallbackProducts[0].unit,
      unitPrice: fallbackProducts[0].price,
      discountPercent: 0,
      amount: fallbackProducts[0].price * 10
    },
    {
      product: fallbackProducts[1],
      sku: fallbackProducts[1].sku,
      name: fallbackProducts[1].name,
      quantity: 5,
      unit: fallbackProducts[1].unit,
      unitPrice: fallbackProducts[1].price,
      discountPercent: 0,
      amount: fallbackProducts[1].price * 5
    },
    {
      product: fallbackProducts[2],
      sku: fallbackProducts[2].sku,
      name: fallbackProducts[2].name,
      quantity: 50,
      unit: fallbackProducts[2].unit,
      unitPrice: fallbackProducts[2].price,
      discountPercent: 0,
      amount: fallbackProducts[2].price * 50
    }
  ]);
  const [saving, setSaving] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [catalogStatus, setCatalogStatus] = reactExports.useState(
    "Loading branch catalogue…"
  );
  const [invoiceTemplate, setInvoiceTemplate] = reactExports.useState({
    name: "Classic Invoice",
    version: 1,
    id: "invoice-classic-default"
  });
  const [companyProfile, setCompanyProfile] = reactExports.useState(null);
  const [savedInvoice, setSavedInvoice] = reactExports.useState(null);
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  const [invoiceHistory, setInvoiceHistory] = reactExports.useState([]);
  const [historyLoading, setHistoryLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let active = true;
    salesApi.products(session.branchId, session.userId).then((items) => {
      if (!active) return;
      if (items.length) {
        setProducts(items);
        setSelectedProduct(items[0]);
        setCart(
          (current) => current.map((line) => {
            const sizeToken = line.name.match(/\d+(?:\.\d+)?\s?(?:mm|inch|in|kg|l|L)/i)?.[0]?.toLowerCase().replace(/\s+/g, "") ?? "";
            const product = items.find((item) => item.sku === line.sku) ?? items.find(
              (item) => item.name.toLowerCase().includes(line.name.split(" ")[0].toLowerCase())
            ) ?? items.find(
              (item) => item.category === line.product.category && !!sizeToken && `${item.name} ${item.variant}`.toLowerCase().replace(/\s+/g, "").includes(sizeToken)
            );
            return product ? {
              ...line,
              product,
              sku: product.sku,
              name: product.name,
              unit: product.unit,
              unitPrice: product.price,
              amount: line.quantity * product.price
            } : line;
          })
        );
        setCatalogStatus(`${items.length} structured products available`);
      } else setCatalogStatus("No active products in this branch catalogue.");
    }).catch(() => {
      if (active)
        setCatalogStatus("Using the offline catalogue until sync returns.");
    });
    companyApi.get().then((company) => {
      const template = company?.documentTemplates;
      if (active && template) {
        setCompanyProfile(company);
        setInvoiceTemplate({
          id: template.templateId || "invoice-classic-default",
          name: template.templateName || "Classic Invoice",
          version: template.version || 1
        });
      }
    }).catch(() => void 0);
    return () => {
      active = false;
    };
  }, [session.branchId, session.userId]);
  const categories2 = [
    "All",
    ...Array.from(new Set(products.map((product) => product.category)))
  ];
  const brands = [
    "All",
    ...Array.from(new Set(products.map((product) => product.brand)))
  ];
  const productTypes = [
    "All",
    ...Array.from(new Set(products.map((product) => product.productType)))
  ];
  const visibleProducts = reactExports.useMemo(
    () => products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesBrand = brand === "All" || product.brand === brand;
      const matchesType = productType === "All" || product.productType === productType;
      const text = `${product.name} ${product.sku}`.toLowerCase();
      return matchesCategory && matchesBrand && matchesType && text.includes(query.toLowerCase());
    }),
    [brand, category, productType, products, query]
  );
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * (1 - item.discountPercent / 100),
    0
  );
  const discount = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice * item.discountPercent / 100,
    0
  );
  const vat = vatEnabled ? subtotal * 0.15 : 0;
  const total = subtotal + vat;
  const addToCart = (product = selectedProduct, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.sku === product.sku);
      if (existing)
        return current.map(
          (item) => item.sku === product.sku ? {
            ...item,
            quantity: item.quantity + quantity,
            amount: (item.quantity + quantity) * item.unitPrice
          } : item
        );
      return [
        ...current,
        {
          product,
          sku: product.sku,
          name: product.name,
          quantity,
          unit: product.unit,
          unitPrice: product.price,
          discountPercent: 0,
          amount: quantity * product.price
        }
      ];
    });
    setStatus(`${product.name} added to ${mode.toLowerCase()}.`);
    setError("");
  };
  const updateQuantity = (sku, quantity) => setCart(
    (current) => current.map(
      (item) => item.sku === sku ? {
        ...item,
        quantity: Math.max(1, quantity),
        amount: Math.max(1, quantity) * item.unitPrice
      } : item
    )
  );
  const removeItem = (sku) => setCart((current) => current.filter((item) => item.sku !== sku));
  const saveDocument = async () => {
    if (!cart.length) {
      setError("Add at least one item before saving.");
      return;
    }
    if (!customer.trim()) {
      setError("Select or enter a customer before saving.");
      return;
    }
    setSaving(true);
    setError("");
    setStatus("Saving locally…");
    try {
      const documentType = mode;
      const saved = await salesApi.create(
        {
          branchId: session.branchId,
          documentType,
          customerName: customer,
          vatPercent: vatEnabled ? 15 : 0,
          notes,
          items: cart.map(
            ({ product: _product, amount: _amount, ...item }) => item
          )
        },
        session.userId
      );
      setStatus(
        `${documentType === "QUOTATION" ? "Quotation" : "Invoice"} ${saved.saleNumber} saved to SQLite${documentType === "INVOICE" ? ` using ${saved.templateName || invoiceTemplate.name} v${saved.templateVersion || invoiceTemplate.version}.` : "."}`
      );
      if (documentType === "INVOICE") {
        setSavedInvoice(saved);
        setPreviewOpen(true);
      }
    } catch (reason) {
      setStatus("");
      setError(
        reason instanceof Error ? reason.message : "Unable to save document."
      );
    } finally {
      setSaving(false);
    }
  };
  const printableTemplate = savedInvoice?.templateSnapshot ?? companyProfile?.documentTemplates ?? null;
  const printableContent = printableTemplate?.content;
  const printableStyles = printableTemplate?.styles;
  const printInvoice = async () => {
    if (window.desktopBridge?.print) {
      setStatus("Opening the system print dialog…");
      const printed = await window.desktopBridge.print().catch(() => false);
      if (!printed) {
        window.print();
        setStatus("System print dialog opened.");
        return;
      }
      setStatus(
        "Invoice sent to the system print dialog."
      );
      return;
    }
    window.print();
    setStatus("Print dialog opened.");
  };
  const exportInvoicePdf = async () => {
    if (window.desktopBridge?.exportPdf) {
      const path = await window.desktopBridge.exportPdf(
        void 0,
        printableTemplate?.pageSize
      );
      setStatus(
        path ? `Invoice PDF saved to ${path}.` : "Invoice PDF export cancelled."
      );
    } else {
      window.print();
      setStatus("Choose “Save as PDF” in the print dialog.");
    }
  };
  const previewDraftInvoice = () => {
    if (!cart.length) {
      setError("Add at least one item before previewing the invoice.");
      return;
    }
    setSavedInvoice({
      id: "draft-preview",
      saleNumber: "PREVIEW",
      documentType: "INVOICE",
      branchId: session.branchId,
      customerName: customer,
      status: "DRAFT",
      subtotal,
      discount,
      tax: vat,
      total,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      items: cart.map(({ product: _product, ...item }) => item),
      templateId: invoiceTemplate.id,
      templateName: invoiceTemplate.name,
      templateVersion: invoiceTemplate.version,
      templateSnapshot: companyProfile?.documentTemplates
    });
    setPreviewOpen(true);
  };
  const openInvoiceHistory = async () => {
    setView("HISTORY");
    setHistoryLoading(true);
    setError("");
    try {
      const records = await salesApi.list(session.branchId, session.userId);
      setInvoiceHistory(records.filter((record) => record.documentType === "INVOICE"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load invoice history.");
    } finally {
      setHistoryLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-page-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-mode-tabs", role: "tablist", children: [
        [
          ["QUOTATION", "Quotation"],
          ["INVOICE", "Invoice"]
        ].map(([value, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": view === "CREATE" && mode === value,
            className: view === "CREATE" && mode === value ? "active" : "",
            onClick: () => {
              setView("CREATE");
              setMode(value);
              setStatus("");
            },
            children: label
          },
          value
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": view === "HISTORY",
            className: view === "HISTORY" ? "active" : "",
            onClick: () => void openInvoiceHistory(),
            children: "Invoice History"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-context-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: catalogStatus }),
        mode === "INVOICE" && view === "CREATE" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sales-template-status", children: [
          "Owner invoice template: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: invoiceTemplate.name }),
          " · v",
          invoiceTemplate.version
        ] })
      ] })
    ] }),
    view === "HISTORY" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel sales-history-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-history-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Invoice History" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Review saved invoices and reopen their owner-branded preview." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: query,
            onChange: (event) => setQuery(event.target.value),
            placeholder: "Search invoice or customer..."
          }
        )
      ] }),
      historyLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sales-empty", children: "Loading invoice history…" }) : invoiceHistory.filter((record) => `${record.saleNumber} ${record.customerName}`.toLowerCase().includes(query.toLowerCase())).length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sales-history-list", children: invoiceHistory.filter((record) => `${record.saleNumber} ${record.customerName}`.toLowerCase().includes(query.toLowerCase())).map((record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-history-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: record.saleNumber }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: record.customerName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(record.createdAt).toLocaleDateString("en-GH") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money$3(record.total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `sales-history-status ${record.paymentStatus.toLowerCase()}`, children: record.paymentStatus.replaceAll("_", " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", type: "button", onClick: () => {
          setSavedInvoice(record);
          setPreviewOpen(true);
        }, children: "Preview Invoice" })
      ] }, record.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sales-empty", children: "No saved invoices found." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-workspace", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel sales-products-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-segmented", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "active", type: "button", children: "▣ Products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", children: "☆ Favorites" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", children: "◷ Recent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-search-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "sales-search", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 17 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: query,
                onChange: (event) => setQuery(event.target.value),
                placeholder: "Search by product name, code or barcode..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "sales-scan", type: "button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { size: 17 }),
            " Scan Barcode"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sales-category-row", children: categories2.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: category === item ? "active" : "",
            onClick: () => setCategory(item),
            children: item
          },
          item
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-catalog-filters", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Brand",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: brand,
                onChange: (event) => setBrand(event.target.value),
                children: brands.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: item }, item))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Product type",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: productType,
                onChange: (event) => setProductType(event.target.value),
                children: productTypes.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: item }, item))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sales-product-grid", children: visibleProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "sales-product-card",
            type: "button",
            onClick: () => {
              setSelectedProduct(product);
              addToCart(product);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sales-product-details", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                  product.brand,
                  " · ",
                  product.productType,
                  " · ",
                  product.variant
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                  "SKU: ",
                  product.sku,
                  " · Unit: ",
                  product.unit,
                  " · In stock: ",
                  product.stock
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sales-product-action", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money$3(product.price) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }) })
              ] })
            ]
          },
          product.sku
        )) }),
        !visibleProducts.length && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sales-empty", children: "No products match this search." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel sales-cart-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-cart-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 20 }),
            " ",
            mode === "QUOTATION" ? "Current Quotation" : "Current Invoice",
            " ",
            "(",
            cart.length,
            " Items)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setCart([]), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }),
            " Clear"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-details", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Customer",
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: customer,
                onChange: (event) => setCustomer(event.target.value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Walk-in Customer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "BuildRight Construction Ltd" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Temа Construction Ltd." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Adom Builders" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Document Type",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: mode,
                onChange: () => void 0,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: mode })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-cart-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-cart-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Item" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Qty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Unit Price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ] }),
          cart.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-cart-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: item.sku })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quantity-control", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => updateQuantity(item.sku, item.quantity - 1),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 13 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: "1",
                  step: "1",
                  value: item.quantity,
                  "aria-label": `Quantity for ${item.name}`,
                  onChange: (event) => updateQuantity(item.sku, Number(event.target.value))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => updateQuantity(item.sku, item.quantity + 1),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: money$3(item.unitPrice) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: item.discountPercent,
                onChange: (event) => setCart(
                  (current) => current.map(
                    (line) => line.sku === item.sku ? {
                      ...line,
                      discountPercent: Number(event.target.value)
                    } : line
                  )
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "0", children: "0%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "5", children: "5%" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "10", children: "10%" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$3(
              item.quantity * item.unitPrice * (1 - item.discountPercent / 100)
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "sales-remove",
                type: "button",
                "aria-label": `Remove ${item.name}`,
                onClick: () => removeItem(item.sku),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 })
              }
            )
          ] }, item.sku))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "sales-notes", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 17 }),
          " Add Notes (Optional)",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: notes,
              onChange: (event) => setNotes(event.target.value),
              placeholder: "e.g. Site delivery, customer reference, etc."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-summary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$3(subtotal) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "VAT (15%)",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: `sales-toggle ${vatEnabled ? "on" : ""}`,
                  onClick: () => setVatEnabled((current) => !current),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$3(vat) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "discount-total", children: [
              "− ",
              money$3(discount)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-total", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Total Payable" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$3(total) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "outline",
              type: "button",
              onClick: () => setCart([]),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }),
                " Clear Cart"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "outline",
              type: "button",
              onClick: () => {
                setMode("QUOTATION");
                setStatus("Cart prepared as a quotation.");
              },
              children: "▱ Save as Quote"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "primary-button",
              type: "button",
              disabled: saving,
              onClick: () => void saveDocument(),
              children: saving ? "Saving…" : mode === "QUOTATION" ? "Generate Quotation →" : "Generate Invoice →"
            }
          ),
          mode === "INVOICE" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "outline",
              type: "button",
              onClick: previewDraftInvoice,
              children: "Preview Invoice"
            }
          )
        ] }),
        status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "sales-status", role: "status", children: status }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "sales-error", role: "alert", children: error }),
        savedInvoice && mode === "INVOICE" && !previewOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "sales-reopen-preview",
            type: "button",
            onClick: () => setPreviewOpen(true),
            children: "Open saved invoice preview"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-role-note", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 17 }),
      " Sales workspace is scoped to",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: session.branchName }),
      " and authenticated as",
      " ",
      session.fullName,
      ". Backend permissions protect every save operation."
    ] }),
    previewOpen && savedInvoice && printableContent && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "sales-print-preview-shell",
        role: "dialog",
        "aria-label": "Invoice preview",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-print-toolbar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              savedInvoice.saleNumber,
              " ·",
              " ",
              savedInvoice.templateName || invoiceTemplate.name,
              " v",
              savedInvoice.templateVersion || invoiceTemplate.version
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", type: "button", onClick: () => void printInvoice(), children: "Print invoice" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "outline",
                  type: "button",
                  onClick: () => void exportInvoicePdf(),
                  children: "Save PDF"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "outline",
                  type: "button",
                  onClick: () => setPreviewOpen(false),
                  children: "Close preview"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "article",
            {
              className: `sales-print-invoice ${printableTemplate?.layoutStyle?.toLowerCase() || "classic"}`,
              children: [
                printableTemplate?.showCompanyLogo && companyProfile?.logoRef && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    className: "sales-print-logo",
                    src: companyProfile.logoRef,
                    alt: "Company logo"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sales-print-header", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    printableTemplate?.showCompanyDetails && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h1",
                        {
                          style: {
                            fontFamily: printableStyles?.headingFontFamily,
                            color: printableStyles?.headingColor,
                            fontSize: `${printableStyles?.headingFontSize || 20}px`
                          },
                          children: printableContent.companyName || companyProfile?.registeredName
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                        printableContent.companyEmail,
                        " ·",
                        " ",
                        printableContent.companyPhone
                      ] })
                    ] }),
                    printableTemplate?.showBranchInformation && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      session.branchName,
                      " · ",
                      printableContent.branchName
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-print-document-meta", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "INVOICE" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "No. ",
                      savedInvoice.saleNumber
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Date:",
                      " ",
                      new Date(savedInvoice.createdAt).toLocaleDateString("en-GH")
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "sales-print-bill-to", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Bill To" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: savedInvoice.customerName }),
                  printableContent.billToAddress && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: printableContent.billToAddress }),
                  printableContent.billToPhone && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: printableContent.billToPhone })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "#" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Item Description" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Qty" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Unit" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Unit Price" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Amount" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: savedInvoice.items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: index + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.quantity }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.unit }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: money$3(item.unitPrice) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: money$3(item.amount) })
                  ] }, `${item.sku}-${index}`)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sales-print-totals", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$3(savedInvoice.subtotal) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Discount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                    "− ",
                    money$3(savedInvoice.discount)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "VAT (",
                    savedInvoice.vatPercent || 0,
                    "%)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$3(savedInvoice.tax) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Total (GH₵)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money$3(savedInvoice.total) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sales-print-notes", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Payment Terms:" }),
                  " ",
                  printableContent.paymentTerms,
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  savedInvoice.notes || printableContent.notes
                ] }),
                printableTemplate?.showFooterMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { children: printableTemplate.footerMessage })
              ]
            }
          )
        ]
      }
    )
  ] });
}
const money$2 = (value) => `GH₵ ${value.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const methodOptions = [
  ["CASH", "Cash", Banknote],
  ["MOBILE_MONEY", "Mobile Money", Smartphone],
  ["BANK_TRANSFER", "Bank Transfer", Landmark],
  ["CARD", "Card (Optional)", CreditCard]
];
function ReceiptDocument({
  receipt,
  sale,
  company,
  session,
  template,
  method,
  print = false
}) {
  const content = template?.content;
  const styles = template?.styles;
  const amountDue = Math.max(0, sale.total - sale.amountPaid);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: `${print ? "cashier-receipt-print" : "cashier-template-receipt"} ${template?.layoutStyle?.toLowerCase() ?? "classic"}`,
      children: [
        template?.showCompanyLogo && company?.logoRef && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "cashier-receipt-logo", src: company.logoRef, alt: "Company logo" }),
        template?.showCompanyDetails !== false && /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "cashier-receipt-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "strong",
            {
              style: {
                fontFamily: styles?.headingFontFamily,
                color: styles?.headingColor,
                fontSize: `${styles?.headingFontSize || 18}px`,
                fontWeight: styles?.headingBold ? 800 : 400
              },
              children: content?.companyName || company?.tradingName || company?.registeredName || "YenkasaBuildersStock"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            content?.companyEmail || company?.email,
            " · ",
            content?.companyPhone || company?.phone
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-receipt-heading", children: "PAYMENT RECEIPT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-receipt-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Receipt No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: receipt.receiptNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Invoice No." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: sale.saleNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: new Date(receipt.createdAt).toLocaleDateString("en-GH") })
          ] }),
          template?.showBranchInformation !== false && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: session.branchName })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-receipt-customer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Received from" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: sale.customerName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "cashier-receipt-items", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Item" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Qty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Amount" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sale.items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.quantity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: item.unit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: money$2(item.amount) })
          ] }, `${item.sku}-${index}`)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-receipt-totals", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Invoice total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money$2(sale.total) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Amount received" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money$2(receipt.amount) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Paid to date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money$2(sale.amountPaid) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money$2(amountDue) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Payment method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: method.replaceAll("_", " ") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cashier-receipt-notes", children: content?.paymentTerms || "Payment confirmed." }),
        template?.showFooterMessage !== false && /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { children: template?.footerMessage || "Thank you for your business!" })
      ]
    }
  );
}
function CashierPage({ session }) {
  const [invoices, setInvoices] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(null);
  const [query, setQuery] = reactExports.useState("");
  const [method, setMethod] = reactExports.useState("CASH");
  const [amount, setAmount] = reactExports.useState("");
  const [reference, setReference] = reactExports.useState("");
  const [evidence, setEvidence] = reactExports.useState("");
  const [history, setHistory] = reactExports.useState([]);
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const [receiptPreviewOpen, setReceiptPreviewOpen] = reactExports.useState(false);
  const [receipt, setReceipt] = reactExports.useState(null);
  const [pendingPayment, setPendingPayment] = reactExports.useState(
    null
  );
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [company, setCompany] = reactExports.useState(null);
  reactExports.useEffect(() => {
    companyApi.get().then(setCompany).catch(() => setCompany(null));
  }, []);
  const receiptTemplate = company?.documentTemplates?.templates?.["Receipt Template"] ?? company?.documentTemplates ?? null;
  const loadInvoices = async (search = query) => {
    setLoading(true);
    try {
      const [list, payments] = await Promise.all([
        paymentsApi.invoices(session.branchId, session.userId, search),
        paymentsApi.history(session.branchId, session.userId)
      ]);
      setInvoices(list);
      setHistory(payments);
      setSelected(
        (current) => list.find((item) => item.id === current?.id) ?? list[0] ?? null
      );
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to load invoices."
      );
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadInvoices("");
  }, [session.branchId, session.userId]);
  reactExports.useEffect(() => {
    if (selected)
      setAmount(Math.max(0, selected.total - selected.amountPaid).toFixed(2));
  }, [selected?.id, selected?.amountPaid, selected?.total]);
  const outstanding = selected ? Math.max(0, selected.total - selected.amountPaid) : 0;
  const filtered = reactExports.useMemo(
    () => invoices.filter((invoice) => invoice.paymentStatus !== "PAID"),
    [invoices]
  );
  const recordPayment = async () => {
    if (!selected) {
      setError("Search for and select an invoice first.");
      return;
    }
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > outstanding) {
      setError(
        "Enter a payment amount greater than zero and no more than the outstanding balance."
      );
      return;
    }
    if (method !== "CASH" && !reference.trim()) {
      setError(
        "Electronic payments require a transaction reference and verification."
      );
      return;
    }
    setSaving(true);
    setError("");
    setStatus(
      method === "CASH" ? "Recording cash payment…" : "Saving payment as pending verification…"
    );
    try {
      const result = await paymentsApi.record(
        {
          branchId: session.branchId,
          saleId: selected.id,
          amount: parsed,
          method,
          reference,
          evidenceNote: evidence,
          // A new cashier submission is a new transaction.  The API still
          // accepts an idempotency key so a retry can be made explicit, but
          // repeating a legitimate partial cash payment must not collide with
          // the previous payment just because the amount is the same.
          idempotencyKey: `${selected.id}-${method}-${Date.now()}`
        },
        session.userId
      );
      setSelected(result.invoice);
      setReceipt(result.receipt);
      setPendingPayment(
        result.payment.verificationStatus === "PENDING_VERIFICATION" ? result.payment : null
      );
      setStatus(
        result.receipt ? `Payment confirmed. Receipt ${result.receipt.receiptNumber} is ready.` : "Payment recorded and awaiting authorized verification."
      );
      await loadInvoices(query);
    } catch (reason) {
      setStatus("");
      setError(
        reason instanceof Error ? reason.message : "Unable to record payment."
      );
    } finally {
      setSaving(false);
    }
  };
  const verifyPending = async () => {
    if (!pendingPayment || !evidence.trim()) {
      setError(
        "Add verification evidence before confirming an electronic payment."
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await paymentsApi.verify(
        pendingPayment.id,
        session.branchId,
        session.userId,
        evidence
      );
      setSelected(result.invoice);
      setReceipt(result.receipt);
      setPendingPayment(null);
      setStatus(
        `Payment verified. Receipt ${result.receipt.receiptNumber} is ready.`
      );
      await loadInvoices(query);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to verify payment."
      );
    } finally {
      setSaving(false);
    }
  };
  const printReceipt = async () => {
    setError("");
    if (window.desktopBridge?.print) {
      setStatus("Opening the system print dialog…");
      const printed = await window.desktopBridge.print().catch(() => false);
      if (!printed) {
        window.print();
        setStatus("System print dialog opened.");
        return;
      }
      setStatus(
        "Receipt sent to the system print dialog."
      );
      return;
    }
    window.print();
    setStatus("Print dialog opened.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-title-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WalletCards, { size: 31 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Cashier & Payments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Receive payments and issue receipts." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "outline",
          type: "button",
          onClick: () => setHistoryOpen(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 16 }),
            " Payment History"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "cashier-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel cashier-search-panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 21 }),
            " Find Invoice"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-search-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: query,
                onChange: (event) => setQuery(event.target.value),
                onKeyDown: (event) => {
                  if (event.key === "Enter") void loadInvoices();
                },
                placeholder: "Enter invoice number or customer..."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "primary-button",
                type: "button",
                onClick: () => void loadInvoices(),
                children: "Search"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-invoice-list", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Loading invoices…" }) : filtered.length ? filtered.map((invoice) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `cashier-invoice-row ${selected?.id === invoice.id ? "selected" : ""}`,
              type: "button",
              onClick: () => setSelected(invoice),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: invoice.saleNumber }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: invoice.customerName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: money$2(invoice.total - invoice.amountPaid) })
              ]
            },
            invoice.id
          )) : /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "No unpaid invoices found." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel cashier-summary-panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 21 }),
            " Invoice Summary"
          ] }),
          selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "cashier-summary-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Invoice No:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: selected.saleNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Customer:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: selected.customerName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Issued By:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: selected.actorUserId || "Sales Officer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Payment Status:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `cashier-status ${selected.paymentStatus.toLowerCase()}`,
                  children: selected.paymentStatus.replace("_", " ")
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Fulfilment Status:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cashier-fulfilment", children: selected.fulfilmentStatus.replaceAll("_", " ") }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-items-title", children: "Items Purchased" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-items", children: selected.items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: index + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                item.quantity,
                " ",
                item.unit
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: money$2(item.amount) })
            ] }, `${item.sku}-${index}`)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-total", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Total Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$2(selected.total) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-balance", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Already Paid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$2(selected.amountPaid) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance Due" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$2(outstanding) })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cashier-empty", children: "Select an unpaid invoice to collect payment." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel cashier-payment-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 21 }),
          " Payment Collection"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-methods", children: methodOptions.map(([value, label, Icon2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: method === value ? "selected" : "",
            onClick: () => setMethod(value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 28 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
            ]
          },
          value
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cashier-field", children: [
          "Amount Received (GH₵)",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: amount,
              onChange: (event) => setAmount(event.target.value),
              inputMode: "decimal"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-balance-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Balance Due (GH₵)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$2(outstanding) })
        ] }),
        method !== "CASH" && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cashier-field", children: [
          "Payment Reference",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: reference,
              onChange: (event) => setReference(event.target.value),
              placeholder: "Enter transaction reference..."
            }
          )
        ] }),
        method !== "CASH" && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cashier-field", children: [
          "Verification Evidence",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: evidence,
              onChange: (event) => setEvidence(event.target.value),
              placeholder: "Provider confirmation or authorized manual verification note..."
            }
          )
        ] }),
        method !== "CASH" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-info", children: "Electronic payments remain pending until authorized verification. Do not release materials from an unverified payment." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "cashier-confirm",
            type: "button",
            disabled: saving || !selected || outstanding <= 0,
            onClick: () => void (pendingPayment ? verifyPending() : recordPayment()),
            children: saving ? "Saving…" : pendingPayment ? "Verify Payment & Print Receipt" : selected && outstanding <= 0 ? "Invoice Fully Paid" : method === "CASH" ? "Confirm Payment & Print Receipt" : "Record Pending Payment"
          }
        ),
        status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "cashier-status-message", role: "status", children: status }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "cashier-error", role: "alert", children: error })
      ] })
    ] }),
    receipt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-success", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 34 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Payment Successful!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Receipt No: ",
          receipt.receiptNumber,
          " ·",
          " ",
          new Date(receipt.createdAt).toLocaleString("en-GH")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "outline", type: "button", onClick: () => setReceiptPreviewOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 17 }),
        " Preview Receipt"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "outline", type: "button", onClick: printReceipt, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 17 }),
        " Print Receipt"
      ] })
    ] }),
    receiptPreviewOpen && receipt && selected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-modal-backdrop", role: "presentation", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "cashier-receipt-preview", role: "dialog", "aria-modal": "true", "aria-label": "Receipt preview", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-preview-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { size: 20 }),
            " Receipt Preview"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
            "Owner template: ",
            receiptTemplate?.templateName || "Company receipt template",
            " · v",
            receiptTemplate?.version || 1
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Close receipt preview", onClick: () => setReceiptPreviewOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ReceiptDocument,
        {
          receipt,
          sale: selected,
          company,
          session,
          template: receiptTemplate,
          method
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-preview-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", type: "button", onClick: () => setReceiptPreviewOpen(false), children: "Close" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", type: "button", onClick: () => void printReceipt(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 17 }),
          " Print Receipt"
        ] })
      ] })
    ] }) }),
    historyOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-modal-backdrop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "cashier-history-modal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 20 }),
          " Payment History"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setHistoryOpen(false), children: "×" })
      ] }),
      history.length ? history.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: payment.receiptNumber || "Pending verification" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          payment.method,
          " · ",
          money$2(payment.amount),
          " ·",
          " ",
          payment.verificationStatus
        ] })
      ] }, payment.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "No payments recorded." })
    ] }) }),
    receipt && selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReceiptDocument,
      {
        receipt,
        sale: selected,
        company,
        session,
        template: receiptTemplate,
        method,
        print: true
      }
    )
  ] });
}
function MaterialReleasePage({ session }) {
  const [invoices, setInvoices] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(null);
  const [quantities, setQuantities] = reactExports.useState({});
  const [query, setQuery] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [release, setRelease] = reactExports.useState(null);
  const [releasedInvoice, setReleasedInvoice] = reactExports.useState(null);
  const [releasePreviewOpen, setReleasePreviewOpen] = reactExports.useState(false);
  const load = async (search = query) => {
    setLoading(true);
    try {
      const list = await materialReleaseApi.invoices(
        session.branchId,
        session.userId,
        search
      );
      setInvoices(list);
      setSelected((current) => list.find((item) => item.id === current?.id) ?? list[0] ?? null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load paid invoices.");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void load("");
  }, [session.branchId, session.userId]);
  reactExports.useEffect(() => {
    if (!selected) {
      setQuantities({});
      return;
    }
    setQuantities(
      Object.fromEntries(
        selected.releaseableItems.map((item) => [item.sku, String(item.remainingQuantity)])
      )
    );
  }, [selected?.id, selected?.fulfilmentStatus]);
  const requestedItems = reactExports.useMemo(
    () => selected?.releaseableItems.map((item) => ({ sku: item.sku, quantity: Number(quantities[item.sku] ?? 0) })).filter((item) => Number.isFinite(item.quantity) && item.quantity > 0) ?? [],
    [quantities, selected]
  );
  const submit = async () => {
    if (!selected) {
      setError("Select a paid invoice first.");
      return;
    }
    if (!requestedItems.length) {
      setError("Enter at least one quantity to release.");
      return;
    }
    setSaving(true);
    setError("");
    setStatus("Validating stock and recording the release…");
    try {
      const result = await materialReleaseApi.create(
        session.branchId,
        session.userId,
        selected.id,
        requestedItems
      );
      setRelease(result.release);
      setReleasedInvoice({ ...selected, ...result.invoice });
      setStatus(`Material release ${result.release.releaseNumber} recorded.`);
      await load(query);
      setSelected(null);
    } catch (reason) {
      setStatus("");
      setError(reason instanceof Error ? reason.message : "Unable to record material release.");
    } finally {
      setSaving(false);
    }
  };
  const printRelease = async () => {
    setError("");
    if (window.desktopBridge?.print) {
      setStatus("Opening the system print dialog…");
      const printed = await window.desktopBridge.print().catch(() => false);
      if (!printed) {
        window.print();
        setStatus("System print dialog opened.");
        return;
      }
      setStatus(
        "Release slip sent to the system print dialog."
      );
      return;
    }
    window.print();
    setStatus("Print dialog opened.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-title-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "release-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { size: 30 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Material Release" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Verify payment and release purchased materials from the branch store." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-branch-badge", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 17 }),
        " ",
        session.branchName
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel release-search-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 21 }),
          " Find paid invoice"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-search-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: query,
              onChange: (event) => setQuery(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter") void load();
              },
              placeholder: "Receipt number, invoice or customer..."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary-button", type: "button", onClick: () => void load(), children: "Search" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "release-help", children: "Only fully paid invoices awaiting collection are shown." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "release-invoice-list", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Loading paid invoices…" }) : invoices.length ? invoices.map((invoice) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: `release-invoice-row ${selected?.id === invoice.id ? "selected" : ""}`,
            onClick: () => {
              setRelease(null);
              setReleasedInvoice(null);
              setReleasePreviewOpen(false);
              setSelected(invoice);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: invoice.receiptNumber || invoice.saleNumber }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: invoice.customerName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: invoice.fulfilmentStatus.replaceAll("_", " ") })
            ]
          },
          invoice.id
        )) : /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "No paid invoices awaiting release." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel release-summary-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { size: 21 }),
          " Release Summary"
        ] }),
        selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "release-summary-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Receipt No:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: selected.receiptNumber || "Not found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Invoice No:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: selected.saleNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Customer:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: selected.customerName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Payment:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "release-paid", children: "PAID" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "Release:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "release-awaiting", children: selected.fulfilmentStatus.replaceAll("_", " ") }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "release-items-title", children: "Materials to release" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "release-items", children: selected.releaseableItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                item.sku,
                " · ",
                item.unit,
                " · Stock: ",
                item.stock
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              "Qty",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: quantities[item.sku] ?? "", onChange: (event) => setQuantities((current) => ({ ...current, [item.sku]: event.target.value })), inputMode: "decimal" })
            ] })
          ] }, item.sku)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "release-confirm", type: "button", disabled: saving, onClick: () => void submit(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 19 }),
            " ",
            saving ? "Recording…" : "Confirm Material Release"
          ] }),
          status && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "release-status", role: "status", children: status }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "release-error", role: "alert", children: error })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "release-empty", children: "Select a paid invoice to verify and release materials." })
      ] })
    ] }),
    release && releasedInvoice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-success", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 31 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Release recorded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          release.releaseNumber,
          " · ",
          release.status.replaceAll("_", " ")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "outline", type: "button", onClick: () => setReleasePreviewOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 17 }),
        " Preview Slip"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "outline", type: "button", onClick: printRelease, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 17 }),
        " Print Release Slip"
      ] })
    ] }),
    releasePreviewOpen && release && releasedInvoice && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cashier-modal-backdrop", role: "presentation", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "release-slip-preview", role: "dialog", "aria-modal": "true", "aria-label": "Material release slip preview", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-preview-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { size: 20 }),
            " Release Slip Preview"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "This is the release slip that will be sent to print." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Close release preview", onClick: () => setReleasePreviewOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "release-slip-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "YenkasaBuildersStock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "MATERIAL RELEASE SLIP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Release No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: release.releaseNumber })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Receipt No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: releasedInvoice.receiptNumber })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Invoice No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: releasedInvoice.saleNumber })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: releasedInvoice.customerName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", {}),
        releasedInvoice.releaseableItems.map((item) => {
          const releasedQuantity = release.items.find((releasedItem) => releasedItem.sku === item.sku)?.quantity ?? 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
              releasedQuantity,
              " of ",
              item.quantity,
              " ",
              item.unit
            ] })
          ] }, item.sku);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Payment verified" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: releasedInvoice.paymentStatus })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Customer collection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: release.status.replaceAll("_", " ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Released to customer and verified by ",
          session.fullName
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cashier-preview-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", type: "button", onClick: () => setReleasePreviewOpen(false), children: "Close" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", type: "button", onClick: () => void printRelease(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { size: 17 }),
          " Print Release Slip"
        ] })
      ] })
    ] }) }),
    release && releasedInvoice && /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "release-slip-print", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "MATERIAL RELEASE SLIP" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: release.releaseNumber }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Receipt: ",
        releasedInvoice.receiptNumber
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Invoice: ",
        releasedInvoice.saleNumber
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Customer: ",
        releasedInvoice.customerName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("hr", {}),
      releasedInvoice.releaseableItems.map((item) => {
        const releasedQuantity = release.items.find((releasedItem) => releasedItem.sku === item.sku)?.quantity ?? 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          item.name,
          " — ",
          releasedQuantity,
          " of ",
          item.quantity,
          " ",
          item.unit
        ] }, item.sku);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Payment verified: ",
        releasedInvoice.paymentStatus
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Customer collection: ",
        release.status.replaceAll("_", " ")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
        "Released by ",
        session.fullName,
        " · ",
        new Date(release.createdAt).toLocaleString("en-GH")
      ] })
    ] })
  ] });
}
const money$1 = (value) => `GH₵ ${value.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const emptyForm = {
  sku: "",
  barcode: "",
  name: "",
  category: "",
  brand: "",
  productType: "",
  variant: "",
  unit: "Piece",
  stock: "0",
  price: "0"
};
function InventoryPage({ session }) {
  const [products, setProducts] = reactExports.useState([]);
  const [query, setQuery] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("All");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [form, setForm] = reactExports.useState(emptyForm);
  const [adjustment, setAdjustment] = reactExports.useState({ quantity: "", reason: "" });
  const [modal, setModal] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState(null);
  const canManage = session.role === "BRANCH_MANAGER" || session.role === "STOCK_MANAGER";
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await inventoryApi.list(session.branchId, session.userId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load branch inventory.");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void load();
  }, [session.branchId, session.userId]);
  const categories2 = reactExports.useMemo(
    () => ["All", ...Array.from(new Set(products.map((item) => item.category))).sort()],
    [products]
  );
  const filtered = reactExports.useMemo(() => products.filter((item) => {
    const text = `${item.name} ${item.sku} ${item.barcode} ${item.brand} ${item.productType}`.toLowerCase();
    const itemStatus = item.stock === 0 ? "Out of Stock" : item.stock <= 30 ? "Low Stock" : "In Stock";
    return text.includes(query.toLowerCase()) && (category === "All" || item.category === category) && (statusFilter === "All" || itemStatus === statusFilter);
  }), [category, products, query, statusFilter]);
  const totals = reactExports.useMemo(() => ({
    value: products.reduce((sum, item) => sum + item.stock * item.price, 0),
    inStock: products.filter((item) => item.stock > 0).length,
    lowStock: products.filter((item) => item.stock > 0 && item.stock <= 30).length,
    outOfStock: products.filter((item) => item.stock === 0).length
  }), [products]);
  const submitCreate = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const created = await inventoryApi.create(session.branchId, session.userId, {
        ...form,
        stock: Number(form.stock),
        price: Number(form.price)
      });
      setProducts((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      setModal(null);
      setForm(emptyForm);
      setStatus(`${created.name} added to the branch catalogue.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to add inventory item.");
    }
  };
  const submitAdjustment = async (event) => {
    event.preventDefault();
    if (!selected) return;
    setError("");
    try {
      const updated = await inventoryApi.adjustStock(
        session.branchId,
        session.userId,
        selected.sku,
        Number(adjustment.quantity),
        adjustment.reason
      );
      setProducts((current) => current.map((item) => item.sku === updated.sku ? updated : item));
      setModal(null);
      setAdjustment({ quantity: "", reason: "" });
      setStatus(`${updated.name} stock updated to ${updated.stock} ${updated.unit}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to adjust stock.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-heading-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inventory-heading-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { size: 27 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Inventory (Stock Items)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Manage branch building materials, stock levels and selling prices." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-heading-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "outline compact-button", type: "button", onClick: () => void load(), disabled: loading, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
          " Refresh"
        ] }),
        canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button compact-button", type: "button", onClick: () => {
          setError("");
          setModal("create");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PackagePlus, { size: 15 }),
          " Add Item"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-summary-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Items" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: products.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Stock Value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money$1(totals.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "In Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: totals.inStock })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Low Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: totals.lowStock })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Out of Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: totals.outOfStock })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel inventory-list-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inventory-category-tabs", role: "tablist", children: categories2.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: category === item ? "active" : "", onClick: () => setCategory(item), children: item }, item)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-filters", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inventory-search", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "data-testid": "inventory-search", value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search item, SKU or barcode..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { size: 15 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: statusFilter, onChange: (event) => setStatusFilter(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "In Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Low Stock" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Out of Stock" })
          ] })
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "inventory-empty", children: "Loading branch inventory…" }) : filtered.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-list", "data-testid": "inventory-list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-list-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Item" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SKU / Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Unit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
        ] }),
        filtered.map((item) => {
          const itemStatus = item.stock === 0 ? "Out of Stock" : item.stock <= 30 ? "Low Stock" : "In Stock";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-list-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                item.brand || "Unbranded",
                " · ",
                item.productType || "General material"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: item.sku }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: item.variant || item.barcode || "No variant recorded" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.unit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.stock.toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: money$1(item.price) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inventory-status ${itemStatus.toLowerCase().replaceAll(" ", "-")}`, children: itemStatus }),
            canManage ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline compact-button", type: "button", onClick: () => {
              setSelected(item);
              setAdjustment({ quantity: "", reason: "" });
              setError("");
              setModal("adjust");
            }, children: "Adjust" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ] }, item.sku);
        })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "inventory-empty", children: "No inventory items match the current filters." }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "inventory-error", role: "alert", children: error }),
      status && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "inventory-status-message", role: "status", children: status })
    ] }),
    modal === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inventory-modal-backdrop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "inventory-modal", onSubmit: submitCreate, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-modal-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Add Inventory Item" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Close", onClick: () => setModal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inventory-form-grid", children: ["sku", "name", "category", "brand", "productType", "variant", "unit", "stock", "price", "barcode"].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        field === "productType" ? "Product type" : field.charAt(0).toUpperCase() + field.slice(1),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: ["sku", "name", "category"].includes(field), type: ["stock", "price"].includes(field) ? "number" : "text", min: ["stock", "price"].includes(field) ? "0" : void 0, step: "any", value: form[field], onChange: (event) => setForm((current) => ({ ...current, [field]: event.target.value })) })
      ] }, field)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-modal-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline compact-button", type: "button", onClick: () => setModal(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary-button compact-button", type: "submit", children: "Save Item" })
      ] })
    ] }) }),
    modal === "adjust" && selected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inventory-modal-backdrop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "inventory-modal inventory-adjust-modal", onSubmit: submitAdjustment, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-modal-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Adjust Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "Close", onClick: () => setModal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Current stock: ",
        selected.stock,
        " ",
        selected.unit
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        "Adjustment quantity",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "number", step: "any", value: adjustment.quantity, onChange: (event) => setAdjustment((current) => ({ ...current, quantity: event.target.value })), placeholder: "Use a negative number to remove stock" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
        "Reason",
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, value: adjustment.reason, onChange: (event) => setAdjustment((current) => ({ ...current, reason: event.target.value })), placeholder: "e.g. Physical stock count" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-modal-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline compact-button", type: "button", onClick: () => setModal(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary-button compact-button", type: "submit", children: "Save Adjustment" })
      ] })
    ] }) })
  ] });
}
const money = (value) => `GH₵ ${value.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const suppliers = ["BuildPro Ghana Ltd", "Accra Materials Hub", "Kumasi Cement Depot", "Other Supplier"];
function PurchasingPage({ session }) {
  const [products, setProducts] = reactExports.useState([]);
  const [lines, setLines] = reactExports.useState([]);
  const [supplier, setSupplier] = reactExports.useState("");
  const [purchaseDate, setPurchaseDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [reference, setReference] = reactExports.useState("");
  const [paymentType, setPaymentType] = reactExports.useState("Cash");
  const [discount, setDiscount] = reactExports.useState("0");
  const [notes, setNotes] = reactExports.useState("");
  const [query, setQuery] = reactExports.useState("");
  const [history, setHistory] = reactExports.useState([]);
  const [view, setView] = reactExports.useState("FORM");
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [catalogue, purchases] = await Promise.all([
        salesApi.products(session.branchId, session.userId),
        purchasingApi.list(session.branchId, session.userId)
      ]);
      setProducts(catalogue);
      setHistory(purchases);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load purchasing data.");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void load();
  }, [session.branchId, session.userId]);
  const available = reactExports.useMemo(() => products.filter((item) => `${item.name} ${item.sku} ${item.barcode}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const subtotal = lines.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const total = Math.max(0, subtotal - Number(discount || 0));
  const add = (product) => setLines((current) => current.some((item) => item.sku === product.sku) ? current : [...current, { ...product, quantity: 1, unitCost: product.price }]);
  const updateLine = (sku, field, value) => setLines((current) => current.map((item) => item.sku === sku ? { ...item, [field]: Math.max(0, value) } : item));
  const save = async (event) => {
    event.preventDefault();
    setError("");
    if (!supplier || !lines.length) {
      setError("Select a supplier and add at least one item.");
      return;
    }
    if (lines.some((item) => item.quantity <= 0 || item.unitCost < 0)) {
      setError("Every item must have a quantity greater than zero and a valid unit cost.");
      return;
    }
    setSaving(true);
    try {
      const record = await purchasingApi.create(session.branchId, session.userId, { supplier, purchaseDate, reference, paymentType, discount: Number(discount || 0), notes, items: lines.map((item) => ({ sku: item.sku, name: item.name, quantity: item.quantity, unit: item.unit, unitCost: item.unitCost })) });
      setHistory((current) => [record, ...current]);
      setLines([]);
      setSupplier("");
      setReference("");
      setNotes("");
      setDiscount("0");
      setStatus(`Purchase ${record.purchaseNumber} saved and stock updated.`);
      const catalogue = await salesApi.products(session.branchId, session.userId);
      setProducts(catalogue);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save purchase.");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-heading-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "purchasing-heading-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 27 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Purchases" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Record stock purchases from suppliers for ",
            session.branchName,
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-heading-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline compact-button", type: "button", disabled: loading, onClick: () => {
          setView("HISTORY");
          void load();
        }, children: "Purchase History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button compact-button", type: "button", onClick: () => {
          setView("FORM");
          setStatus("");
        }, children: [
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
          " New Purchase"
        ] })
      ] })
    ] }),
    view === "HISTORY" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel purchasing-history-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-history-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Purchase History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "outline compact-button", type: "button", onClick: () => void load(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }),
          " Refresh"
        ] })
      ] }),
      history.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "purchasing-history-list", children: history.map((record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-history-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: record.purchaseNumber }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
            record.supplier,
            " · ",
            record.purchaseDate
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          record.items.length,
          " items"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money(record.total) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: record.paymentType })
      ] }, record.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "purchasing-empty", children: "No purchases recorded for this branch." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "purchasing-form", onSubmit: save, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel purchasing-meta", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Supplier *",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: supplier, onChange: (event) => setSupplier(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Supplier" }),
            suppliers.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: item }, item))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Purchase Date *",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "date", value: purchaseDate, onChange: (event) => setPurchaseDate(event.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Reference No.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: reference, onChange: (event) => setReference(event.target.value), placeholder: "e.g. PO-001" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Payment Type *",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { required: true, value: paymentType, onChange: (event) => setPaymentType(event.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Cash" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Mobile Money" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Bank Transfer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Credit" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel purchasing-items", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-section-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Select Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PackagePlus, { size: 18 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "purchasing-search", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search item, name, code or barcode..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "purchasing-catalogue-hint", children: "Choose from the branch catalogue. Cement, iron rods, roofing sheets and other materials are available below." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-product-results", children: [
          available.slice(0, 8).map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
            add(product);
            setQuery("");
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                product.category,
                " · ",
                product.sku,
                " · Current stock ",
                product.stock
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 })
          ] }, product.sku)),
          !available.length && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "No matching catalogue item." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-table-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Item" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Qty" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Unit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Unit Cost" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ] }),
          lines.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-table-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: item.sku })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "aria-label": `Quantity for ${item.name}`, type: "number", min: "0.01", step: "any", value: item.quantity, onChange: (event) => updateLine(item.sku, "quantity", Number(event.target.value)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.unit }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "aria-label": `Unit cost for ${item.name}`, type: "number", min: "0", step: "0.01", value: item.unitCost, onChange: (event) => updateLine(item.sku, "unitCost", Number(event.target.value)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money(item.quantity * item.unitCost) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": `Remove ${item.name}`, onClick: () => setLines((current) => current.filter((line) => line.sku !== item.sku)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 }) })
          ] }, item.sku))
        ] }),
        !lines.length && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "purchasing-empty", children: "Select an item above to add it to this purchase." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-bottom", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Notes (optional)",
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: notes, onChange: (event) => setNotes(event.target.value), placeholder: "Enter purchase notes..." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-total", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Subtotal ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money(subtotal) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              "Discount",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: subtotal, step: "0.01", value: discount, onChange: (event) => setDiscount(event.target.value) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
              "Total ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: money(total) })
            ] })
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "purchasing-error", role: "alert", children: error }),
      status && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "purchasing-status", role: "status", children: status }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "purchasing-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline compact-button", type: "button", onClick: () => {
          setLines([]);
          setSupplier("");
          setReference("");
          setNotes("");
          setDiscount("0");
        }, children: "Clear" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary-button compact-button", type: "submit", disabled: saving, children: saving ? "Saving…" : "Save Purchase" })
      ] })
    ] })
  ] });
}
const emptyStatus = {
  branchId: "",
  deviceId: "local-device",
  onlineEnabled: true,
  autoSyncEnabled: true,
  intervalMinutes: 15,
  syncState: "NEVER_SYNCED",
  lastSyncAt: "",
  lastAttemptAt: "",
  lastError: "",
  pendingCount: 0,
  updatedAt: ""
};
function SyncSettingsPage({ session }) {
  const [value, setValue] = reactExports.useState(emptyStatus);
  const [saving, setSaving] = reactExports.useState(false);
  const [syncing, setSyncing] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const load = () => {
    setError("");
    syncApi.status(session.branchId, session.userId).then(setValue).catch(
      (reason) => setError(
        reason instanceof Error ? reason.message : "Unable to load synchronization settings."
      )
    );
  };
  reactExports.useEffect(load, [session.branchId, session.userId]);
  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      setValue(
        await syncApi.saveSettings(session.branchId, session.userId, {
          onlineEnabled: value.onlineEnabled,
          autoSyncEnabled: value.autoSyncEnabled,
          intervalMinutes: value.intervalMinutes
        })
      );
      setMessage("Synchronization settings saved locally.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };
  const run = async () => {
    setSyncing(true);
    setMessage("");
    setError("");
    try {
      const result = await syncApi.run(session.branchId, session.userId);
      setValue(result);
      setMessage(result.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to start synchronization.");
    } finally {
      setSyncing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sync-settings-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card sync-settings-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "owner-section-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 28 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Database Synchronization" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Control this branch device's online synchronization policy. Local SQLite operations remain available when offline." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card sync-status-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sync-status-topline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sync-label", children: "Current status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { "data-testid": "sync-state", children: value.syncState.replaceAll("_", " ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `sync-state-pill sync-${value.syncState.toLowerCase()}`, children: [
          value.onlineEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CloudOff, { size: 14 }),
          value.onlineEnabled ? "Online mode enabled" : "Offline mode enforced"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sync-stat-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Pending local records" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value.pendingCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Last successful sync" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatSyncDate(value.lastSyncAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Last attempt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatSyncDate(value.lastAttemptAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Device" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value.deviceId })
        ] })
      ] }),
      value.lastError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sync-warning", role: "status", children: value.lastError })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card sync-settings-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Branch Manager Controls" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "sync-toggle-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Allow online synchronization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Turn this off to keep the device in controlled offline mode." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-testid": "sync-online-toggle",
            type: "checkbox",
            checked: value.onlineEnabled,
            onChange: (event) => setValue((current) => ({ ...current, onlineEnabled: event.target.checked }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "sync-toggle-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Automatic sync when available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Manual Sync Now remains available to the Branch Manager." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-testid": "sync-auto-toggle",
            type: "checkbox",
            checked: value.autoSyncEnabled,
            onChange: (event) => setValue((current) => ({ ...current, autoSyncEnabled: event.target.checked }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "sync-interval-field", children: [
        "Sync interval (minutes)",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-testid": "sync-interval",
            type: "number",
            min: 5,
            max: 1440,
            step: 5,
            value: value.intervalMinutes,
            onChange: (event) => setValue((current) => ({ ...current, intervalMinutes: Number(event.target.value) }))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sync-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "outline", type: "button", "data-testid": "sync-now", disabled: syncing, onClick: run, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
          syncing ? "Checking…" : "Sync Now"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", type: "button", "data-testid": "sync-save", disabled: saving, onClick: save, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 15 }),
          saving ? "Saving…" : "Save Settings"
        ] })
      ] }),
      message && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status", role: "status", children: message }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error", role: "alert", children: error })
    ] })
  ] });
}
function formatSyncDate(value) {
  if (!value) return "Never";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}
const initialForm = {
  projectUrl: "",
  projectRef: "",
  databaseHost: "",
  databasePort: "5432",
  databaseName: "postgres",
  databaseUser: "postgres",
  databasePassword: ""
};
function normalizeProjectUrl(value) {
  const parsed = new URL(value.trim());
  if (parsed.protocol !== "https:") throw new Error("Project URL must begin with https://. Do not paste a PostgreSQL connection string here.");
  return parsed.origin;
}
function CloudDatabaseSetupPage() {
  const [form, setForm] = reactExports.useState(initialForm);
  const [passwordConfigured, setPasswordConfigured] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [tested, setTested] = reactExports.useState(false);
  const [testing, setTesting] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState("Not tested yet");
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    const cloud = window.desktopBridge?.cloud;
    if (!cloud) {
      setError("Secure cloud configuration is available only inside the installed desktop application.");
      return;
    }
    cloud.getConfig().then((config) => {
      setForm({
        projectUrl: config.projectUrl,
        projectRef: config.projectRef,
        databaseHost: config.databaseHost,
        databasePort: String(config.databasePort),
        databaseName: config.databaseName,
        databaseUser: config.databaseUser,
        databasePassword: ""
      });
      setPasswordConfigured(config.passwordConfigured);
    }).catch(() => setError("Unable to load the saved cloud configuration."));
  }, []);
  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setTested(false);
    setStatus("Not tested yet");
    setMessage("");
    setError("");
  };
  const validate = () => {
    try {
      normalizeProjectUrl(form.projectUrl);
    } catch (error2) {
      return error2 instanceof Error ? error2.message : "Enter the Supabase project URL, for example https://your-project.supabase.co.";
    }
    if (!form.projectRef.trim()) return "Enter the Supabase project reference, for example xwyblizsmfeulyykufwg.";
    if (!form.databaseHost.trim()) return "Enter the PostgreSQL host from Supabase Connect.";
    const port = Number(form.databasePort);
    if (!Number.isInteger(port) || port < 1 || port > 65535) return "Enter a valid database port between 1 and 65535.";
    if (!form.databaseName.trim()) return "Enter the database name.";
    if (!form.databaseUser.trim()) return "Enter the database username.";
    if (!form.databasePassword.trim() && !passwordConfigured) return "Enter the database password.";
    return "";
  };
  const testConnection = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!window.desktopBridge?.cloud) {
      setError("Secure cloud configuration is available only inside the installed desktop application.");
      return;
    }
    setTesting(true);
    setError("");
    setMessage("Testing the Supabase connection securely…");
    try {
      await window.desktopBridge.cloud.testConfig({ ...form, projectUrl: normalizeProjectUrl(form.projectUrl), databasePort: Number(form.databasePort), ownerSession: sessionStorage.getItem("yenkasa-owner-session") ?? void 0 });
      setTested(true);
      setStatus("Connection verified");
      setMessage("Supabase is reachable. You can now save this configuration.");
    } catch (reason) {
      setTested(false);
      setStatus("Connection failed");
      setError(reason instanceof Error ? reason.message : "Supabase connection failed.");
    } finally {
      setTesting(false);
    }
  };
  const save = async () => {
    if (!tested) {
      setError("Test the Supabase connection successfully before saving.");
      return;
    }
    if (!window.desktopBridge?.cloud) {
      setError("Secure cloud configuration is available only inside the installed desktop application.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await window.desktopBridge.cloud.saveConfig({ ...form, projectUrl: normalizeProjectUrl(form.projectUrl), databasePort: Number(form.databasePort), ownerSession: sessionStorage.getItem("yenkasa-owner-session") ?? void 0 });
      setPasswordConfigured(true);
      setForm((current) => ({ ...current, databasePassword: "" }));
      setMessage("Cloud configuration saved securely on this computer.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save cloud configuration.");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cloud-setup-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Installation  ›  ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Cloud Database (Supabase)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Connect to Supabase" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Configure the central PostgreSQL database used for branch synchronization, backups and headquarters reporting." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cloud-setup-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card cloud-instructions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 21 }),
          " Setup Instructions"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Create a Supabase account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Go to supabase.com and create or sign in to the authorized deployment account." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Create a project" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Create the central project for YenkasaBuildersStock and choose the required region." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Copy connection details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open Supabase → Connect → Database and select Session pooler. Copy its exact host, port, database name and user." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Test before continuing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Enter the project URL, project reference, host, port, database, user and password, then test the connection." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cloud-info-callout", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 21 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Credentials are kept in the trusted desktop process. Passwords are encrypted with the operating-system credential store and are never returned to the renderer." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reference-card cloud-connection-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 21 }),
          " Supabase Connection Details"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Supabase Project URL",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "data-testid": "cloud-project-url", value: form.projectUrl, onChange: (event) => update("projectUrl", event.target.value), placeholder: "https://xxxxxxxx.supabase.co" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Project Reference (Project ID)",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "data-testid": "cloud-project-ref", value: form.projectRef, onChange: (event) => update("projectRef", event.target.value), placeholder: "abcdefghijklmnop" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cloud-field-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Database Host",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "data-testid": "cloud-database-host", value: form.databaseHost, onChange: (event) => update("databaseHost", event.target.value), placeholder: "aws-0-region.pooler.supabase.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Port",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "data-testid": "cloud-database-port", type: "number", min: 1, max: 65535, value: form.databasePort, onChange: (event) => update("databasePort", event.target.value), placeholder: "5432" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Database Name",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "data-testid": "cloud-database-name", value: form.databaseName, onChange: (event) => update("databaseName", event.target.value), placeholder: "postgres" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Database User",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "data-testid": "cloud-database-user", value: form.databaseUser, onChange: (event) => update("databaseUser", event.target.value), placeholder: "postgres.project-reference" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Database Password",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cloud-password-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { "data-testid": "cloud-password", type: showPassword ? "text" : "password", value: form.databasePassword, onChange: (event) => update("databasePassword", event.target.value), placeholder: passwordConfigured ? "Saved securely — enter only to replace" : "Enter database password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": showPassword ? "Hide database password" : "Show database password", onClick: () => setShowPassword((current) => !current), children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 17 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 17 }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "cloud-connection-note", children: "For Supabase Session Pooler, use the exact host and username shown in Supabase Connect, normally port 5432 and a username like postgres.project-reference. The application constructs the secure SSL connection internally." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cloud-test-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "outline", type: "button", "data-testid": "cloud-test", disabled: testing, onClick: testConnection, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TestTubeDiagonal, { size: 16 }),
            testing ? "Testing…" : "Test Connection"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: tested ? "cloud-test-status success" : status === "Connection failed" ? "cloud-test-status failed" : "cloud-test-status", children: [
            tested ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 16 }),
            status
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cloud-setup-actions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", type: "button", "data-testid": "cloud-save", disabled: !tested || saving, onClick: save, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 16 }),
          saving ? "Saving…" : "Save and Continue"
        ] }) }),
        message && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-status", role: "status", children: message }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "save-error", role: "alert", children: error })
      ] })
    ] })
  ] });
}
const inventory = [
  {
    sku: "BLK-001",
    name: "6-inch Building Block",
    category: "Blocks",
    stock: 2480,
    unit: "pieces",
    price: "GHS 4.50",
    status: "In stock"
  },
  {
    sku: "CEM-042",
    name: "Ghacem 42.5R Cement",
    category: "Cement",
    stock: 186,
    unit: "bags",
    price: "GHS 98.00",
    status: "In stock"
  },
  {
    sku: "IRO-012",
    name: "12mm Reinforcement Bar",
    category: "Steel",
    stock: 42,
    unit: "lengths",
    price: "GHS 62.00",
    status: "Low stock"
  },
  {
    sku: "SAN-020",
    name: "Washed River Sand",
    category: "Aggregates",
    stock: 0,
    unit: "trips",
    price: "GHS 1,250.00",
    status: "Out of stock"
  },
  {
    sku: "ROO-004",
    name: "Aluzinc Roofing Sheet",
    category: "Roofing",
    stock: 96,
    unit: "sheets",
    price: "GHS 145.00",
    status: "In stock"
  }
];
const navItems = [
  [LayoutDashboard, "Dashboard"],
  [ShoppingCart, "Sales & Invoices"],
  [ClipboardList, "Cashier & Payments"],
  [Package, "Inventory"],
  [Package, "Material Release"],
  [ClipboardList, "Purchasing"],
  [Users, "Customers"],
  [Boxes, "Suppliers"],
  [Boxes, "Reports"]
];
const setupItems = [
  [Cloud, "Cloud Database"],
  [Building2, "Business Information"],
  [Palette, "Business Branding"],
  [Building2, "Branches"],
  [Users, "Users & Roles"],
  [Crown, "Owner Account"],
  [Monitor, "Device Activation"],
  [Settings, "System Settings"]
];
const roleNavigation = {
  BRANCH_MANAGER: [
    "Dashboard",
    "Sales & Invoices",
    "Cashier & Payments",
    "Inventory",
    "Material Release",
    "Purchasing",
    "Customers",
    "Suppliers",
    "Reports"
  ],
  SALES_OFFICER: ["Dashboard", "Sales & Invoices", "Inventory", "Customers"],
  CASHIER: ["Dashboard", "Cashier & Payments", "Reports"],
  STOCK_MANAGER: [
    "Dashboard",
    "Inventory",
    "Material Release",
    "Purchasing",
    "Suppliers",
    "Reports"
  ],
  SALES_CASHIER: [
    "Dashboard",
    "Sales & Invoices",
    "Cashier & Payments",
    "Customers",
    "Inventory"
  ]
};
const protectedOperationalLabels = /* @__PURE__ */ new Set([
  ...navItems.map(([, label]) => label),
  "Staff Accounts",
  "Dashboard Preferences",
  "Owner Login",
  "Sync Settings"
]);
const navigationPermission = {
  "Sales & Invoices": "sales",
  "Cashier & Payments": "payments",
  Inventory: "inventory_view",
  "Material Release": "material_release",
  Purchasing: "purchases",
  Customers: "customers",
  Suppliers: "suppliers"
};
function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(false);
  const [active, setActive] = reactExports.useState("Branch Login");
  const [setupExpanded, setSetupExpanded] = reactExports.useState(true);
  const [branchSession, setBranchSession] = reactExports.useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("yenkasa-session") ?? "null");
    } catch {
      return null;
    }
  });
  const [ownerSession, setOwnerSession] = reactExports.useState(() => {
    try {
      const token = sessionStorage.getItem("yenkasa-owner-session");
      return token ? JSON.parse(sessionStorage.getItem("yenkasa-owner-session-data") ?? "null") : null;
    } catch {
      return null;
    }
  });
  const [ownerSetupComplete, setOwnerSetupComplete] = reactExports.useState(false);
  const [ownerStatusLoaded, setOwnerStatusLoaded] = reactExports.useState(false);
  const [initialInstallation, setInitialInstallation] = reactExports.useState(false);
  reactExports.useEffect(() => {
    companyApi.get().then((company) => {
      setInitialInstallation(!company);
      const root = document.documentElement;
      if (!company?.useBrandColours) {
        root.style.setProperty("--brand-primary", "#0b9438");
        root.style.setProperty("--brand-primary-dark", "#147536");
        root.style.setProperty("--brand-secondary", "#f7b500");
        root.style.setProperty("--brand-accent", "#d7263d");
        return;
      }
      root.style.setProperty("--brand-primary", company?.brandColor || "#0b9438");
      root.style.setProperty("--brand-primary-dark", company?.brandColor || "#147536");
      root.style.setProperty("--brand-secondary", company?.secondaryColor || "#f7b500");
      root.style.setProperty("--brand-accent", company?.accentColor || "#d7263d");
    }).catch(() => void 0);
  }, []);
  reactExports.useEffect(() => {
    const sync = () => {
      try {
        setBranchSession(
          JSON.parse(sessionStorage.getItem("yenkasa-session") ?? "null")
        );
      } catch {
        setBranchSession(null);
      }
    };
    sync();
    const ownerSync = () => {
      try {
        const token = sessionStorage.getItem("yenkasa-owner-session");
        setOwnerSession(token ? JSON.parse(sessionStorage.getItem("yenkasa-owner-session-data") ?? "null") : null);
      } catch {
        setOwnerSession(null);
      }
    };
    ownerSync();
    fetch(`${window.desktopBridge?.apiBaseUrl ?? void 0 ?? "http://127.0.0.1:8765"}/api/owner/status`).then((response) => response.ok ? response.json() : Promise.reject(new Error("Unable to read owner setup status"))).then((status) => setOwnerSetupComplete(status.passwordSet)).catch(() => setOwnerSetupComplete(false)).finally(() => setOwnerStatusLoaded(true));
    window.addEventListener("yenkasa-session-changed", sync);
    window.addEventListener("yenkasa-owner-session-changed", ownerSync);
    return () => {
      window.removeEventListener("yenkasa-session-changed", sync);
      window.removeEventListener("yenkasa-owner-session-changed", ownerSync);
    };
  }, []);
  const hasBranchAccess = (label) => {
    if (!branchSession) return false;
    if (label === "Dashboard") return true;
    if (label === "Reports") {
      return branchSession.permissions.some((permission) => permission.endsWith("_reports") || permission === "financial_reports");
    }
    if (label === "Sync Settings") return branchSession.role === "BRANCH_MANAGER";
    if (label === "Dashboard Preferences") return true;
    if (label === "Staff Accounts") return branchSession.role === "BRANCH_MANAGER";
    const required = navigationPermission[label];
    if (required) return branchSession.permissions.includes(required);
    return roleNavigation[branchSession.role]?.includes(label) ?? false;
  };
  const visibleNav = branchSession ? navItems.filter(([, label]) => hasBranchAccess(label)) : [];
  const setupUnlocked = initialInstallation || !ownerSetupComplete || !!ownerSession;
  const visibleSetup = !branchSession && setupUnlocked ? setupItems : [];
  const branchSetup = branchSession?.role === "BRANCH_MANAGER" ? [[Users, "Staff Accounts"]] : [];
  const branchSettings = branchSession?.role === "BRANCH_MANAGER" ? ["Dashboard Preferences", "Sync Settings"] : ["Dashboard Preferences"];
  const logout = () => {
    const userId = branchSession?.userId;
    sessionStorage.removeItem("yenkasa-session");
    sessionStorage.removeItem("yenkasa-owner-session");
    sessionStorage.removeItem("yenkasa-owner-session-data");
    setBranchSession(null);
    setOwnerSession(null);
    setActive("Branch Login");
    if (userId)
      fetch(
        `${window.desktopBridge?.apiBaseUrl ?? void 0 ?? "http://127.0.0.1:8765"}/api/auth/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        }
      ).catch(() => void 0);
  };
  const ownerLogout = () => {
    void fetch(`${window.desktopBridge?.apiBaseUrl ?? void 0 ?? "http://127.0.0.1:8765"}/api/owner/logout`, {
      method: "POST",
      headers: { "X-Owner-Session": sessionStorage.getItem("yenkasa-owner-session") ?? "" }
    }).catch(() => void 0);
    sessionStorage.removeItem("yenkasa-owner-session");
    sessionStorage.removeItem("yenkasa-owner-session-data");
    setOwnerSession(null);
    setActive("Branch Login");
  };
  const navigate = (page) => {
    if (!ownerStatusLoaded) return;
    if (page === "Owner Login" && branchSession) {
      sessionStorage.removeItem("yenkasa-session");
      setBranchSession(null);
    }
    if (setupItems.some(([, label]) => label === page) && (!setupUnlocked || !!branchSession)) {
      setActive("Owner Login");
      return;
    }
    setActive(page);
    setSidebarOpen(false);
  };
  const canRenderSetup = !branchSession && setupUnlocked && setupItems.some(([, label]) => label === active) || branchSession && active === "Staff Accounts" && branchSession.role === "BRANCH_MANAGER";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `dashboard-shell ${active === "Branch Login" && !branchSession ? "branch-login-shell" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `dashboard-sidebar ${sidebarOpen ? "open" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-brand", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dashboard-logo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 32 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "YenkasaBuildersStock" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: branchSession?.branchName?.toUpperCase() ?? "HEADQUARTERS" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "dashboard-nav", children: [
            branchSession && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-section-label", children: "BRANCH OPERATIONS" }),
            visibleNav.map(([Icon2, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: active === label ? "selected" : "",
                onClick: () => navigate(label),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 19 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
                ]
              },
              label
            )),
            !branchSession && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: `branch-login-nav ${active === "Branch Login" ? "selected" : ""}`,
                onClick: () => navigate("Branch Login"),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { size: 19 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch Login" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-divider" }),
            branchSession ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "setup-parent", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 19 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch Operations" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 15 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-subnav", children: branchSetup.map(([Icon2, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: active === label ? "selected" : "",
                  onClick: () => navigate(label),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 16 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
                  ]
                },
                label
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-section-label", children: "BRANCH SETTINGS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-subnav", children: branchSettings.map((label) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: active === label ? "selected" : "",
                  onClick: () => navigate(label),
                  children: [
                    label === "Sync Settings" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
                  ]
                },
                label
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-section-label", children: "OWNER ACCOUNT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-subnav", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: active === "Owner Login" ? "selected" : "",
                  onClick: () => navigate("Owner Login"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 16 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Owner Login" })
                  ]
                }
              ) })
            ] }) : !setupUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-section-label", children: "OWNER ACCOUNT" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-subnav", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: active === "Owner Login" ? "selected" : "",
                  onClick: () => navigate("Owner Login"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 16 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Owner Login" })
                  ]
                }
              ) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "setup-parent",
                  onClick: () => setSetupExpanded((current) => !current),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 19 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Company Setup" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronDown,
                      {
                        className: setupExpanded ? "" : "collapsed-chevron",
                        size: 15
                      }
                    )
                  ]
                }
              ),
              setupExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-subnav", children: visibleSetup.map(([Icon2, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: active === label ? "selected" : "",
                  onClick: () => navigate(label),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 16 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
                  ]
                },
                label
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-status", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Offline ready" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Last synced just now" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "user-card",
              type: "button",
              onClick: branchSession ? logout : ownerSession ? ownerLogout : void 0,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "avatar", children: branchSession ? branchSession.fullName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() : ownerSession ? ownerSession.fullName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() : "KO" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: branchSession?.fullName ?? ownerSession?.fullName ?? "Kofi Osei" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: branchSession ? branchSession.role.replaceAll("_", " ") : ownerSession ? "OWNER · Sign out" : "Setup locked" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16 })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "dashboard-main", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "dashboard-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "mobile-menu",
                onClick: () => setSidebarOpen(!sidebarOpen),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", children: "Thursday, 20 November 2026" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: active === "Dashboard" ? "Good morning, Kofi" : active })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-actions", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "connectivity", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 16 }),
                "Connected"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "icon-button", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 19 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-avatar", children: "KO" })
            ] })
          ] }),
          active === "Branch Login" && !branchSession ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            BranchLoginPage,
            {
              onAuthenticated: (session) => {
                sessionStorage.removeItem("yenkasa-owner-session");
                sessionStorage.removeItem("yenkasa-owner-session-data");
                setOwnerSession(null);
                setBranchSession(session);
                setActive("Dashboard");
              }
            }
          ) : active === "Owner Login" && !branchSession ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            OwnerLoginPage,
            {
              onAuthenticated: (session) => {
                sessionStorage.setItem("yenkasa-owner-session-data", JSON.stringify(session));
                sessionStorage.removeItem("yenkasa-session");
                setBranchSession(null);
                setOwnerSession(session);
                setActive("Owner Account");
              }
            }
          ) : active === "Dashboard" ? branchSession ? /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardHome, { session: branchSession, onNavigate: navigate }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardHome, {}) : branchSession && protectedOperationalLabels.has(active) && !hasBranchAccess(active) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "placeholder-page", role: "alert", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "placeholder-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Access restricted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your Branch Manager has not assigned this module to your account." })
          ] }) : active === "Sales & Invoices" && branchSession && hasBranchAccess("Sales & Invoices") ? /* @__PURE__ */ jsxRuntimeExports.jsx(SalesPage, { session: branchSession }) : active === "Cashier & Payments" && branchSession && hasBranchAccess("Cashier & Payments") ? /* @__PURE__ */ jsxRuntimeExports.jsx(CashierPage, { session: branchSession }) : active === "Inventory" && branchSession && hasBranchAccess("Inventory") ? /* @__PURE__ */ jsxRuntimeExports.jsx(InventoryPage, { session: branchSession }) : active === "Purchasing" && branchSession && hasBranchAccess("Purchasing") ? /* @__PURE__ */ jsxRuntimeExports.jsx(PurchasingPage, { session: branchSession }) : active === "Material Release" && branchSession && hasBranchAccess("Material Release") ? /* @__PURE__ */ jsxRuntimeExports.jsx(MaterialReleasePage, { session: branchSession }) : active === "Sync Settings" && branchSession && branchSession.role === "BRANCH_MANAGER" ? /* @__PURE__ */ jsxRuntimeExports.jsx(SyncSettingsPage, { session: branchSession }) : protectedOperationalLabels.has(active) && !branchSession ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "placeholder-page", role: "alert", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "placeholder-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Branch login required" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sign in to an authorized branch account before opening branch operations." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "primary-button",
                type: "button",
                onClick: () => navigate("Branch Login"),
                children: "Open Branch Login"
              }
            )
          ] }) : active === "Cloud Database" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CloudDatabaseSetupPage, {}) : canRenderSetup ? /* @__PURE__ */ jsxRuntimeExports.jsx(SetupPage, { page: active, onNavigate: setActive }) : setupItems.some(([, label]) => label === active) && (branchSession || !setupUnlocked) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "placeholder-page", role: "alert", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "placeholder-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Owner login required" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Company Setup is locked after owner credentials are created. Sign in as the owner to continue." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary-button", type: "button", onClick: () => navigate("Owner Login"), children: "Open Owner Login" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "placeholder-page", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "placeholder-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: active }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This module is reserved for the next approved development milestone." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sample navigation state" })
          ] })
        ] })
      ]
    }
  );
}
function DashboardHome({
  session,
  onNavigate
}) {
  const [branchProducts, setBranchProducts] = reactExports.useState([]);
  const [branchSales, setBranchSales] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!session) return;
    Promise.all([
      salesApi.products(session.branchId, session.userId),
      salesApi.list(session.branchId, session.userId)
    ]).then(([products, sales]) => {
      setBranchProducts(products);
      setBranchSales(sales);
    }).catch(() => void 0);
  }, [session?.branchId, session?.userId]);
  const branchRows = branchProducts.map((item) => ({
    ...item,
    price: `GH₵ ${item.price.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`,
    status: item.stock === 0 ? "Out of stock" : item.stock <= 30 ? "Low stock" : "In stock"
  }));
  const rows = branchRows.length ? branchRows : inventory;
  const salesTotal = branchSales.filter((record) => record.documentType === "INVOICE").reduce((sum, record) => sum + record.total, 0);
  const stockValue = branchProducts.reduce((sum, item) => sum + item.stock * item.price, 0);
  const pendingInvoices = branchSales.filter((record) => record.documentType === "INVOICE" && record.paymentStatus !== "PAID").length;
  const customerCount = new Set(branchSales.map((record) => record.customerName)).size;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-content", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "summary-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: ShoppingCart,
          label: "Today's sales",
          value: session ? `GH₵ ${salesTotal.toLocaleString("en-GH", { minimumFractionDigits: 2 })}` : "GHS 12,480.00",
          detail: session ? `${branchSales.filter((record) => record.documentType === "INVOICE").length} invoices` : "12 transactions",
          tone: "teal"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Package,
          label: "Inventory value",
          value: session ? `GH₵ ${stockValue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}` : "GHS 248,920.00",
          detail: session ? `${branchProducts.length} products` : "328 products",
          tone: "blue"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: ClipboardList,
          label: "Pending orders",
          value: session ? String(pendingInvoices) : "18",
          detail: session ? "unpaid invoices" : "6 need attention",
          tone: "orange"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Users,
          label: "Active customers",
          value: session ? String(customerCount) : "142",
          detail: session ? "customers on invoices" : "+8 this month",
          tone: "purple"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dashboard-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel inventory-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Inventory overview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: session ? `${session.branchName} live stock levels` : "Sample branch stock levels" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", type: "button", onClick: () => onNavigate?.("Inventory"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 17 }),
            "Add product"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-toolbar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 17 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Search inventory" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "filter-button", children: [
            "All categories ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 15 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inventory-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-row table-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stock level" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Unit price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" })
          ] }),
          rows.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-cell", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "product-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 16 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: item.sku })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: item.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              item.stock.toLocaleString(),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "muted", children: item.unit })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.price }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `status ${item.status.toLowerCase().replaceAll(" ", "-")}`,
                children: item.status
              }
            )
          ] }, item.sku))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "text-button", type: "button", onClick: () => onNavigate?.("Inventory"), children: [
          "View all inventory ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "→" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "side-panels", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Quick actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Common tasks for today" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quick-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { icon: ShoppingCart, label: "Create invoice", onClick: () => onNavigate?.("Sales & Invoices") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { icon: Package, label: "Open inventory", onClick: () => onNavigate?.("Inventory") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { icon: Users, label: "Add customer", onClick: () => onNavigate?.("Customers") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { icon: ClipboardList, label: "New purchase order", onClick: () => onNavigate?.("Purchasing") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel activity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Recent activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Latest branch updates" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Activity,
            {
              color: "teal",
              title: "Sale completed",
              detail: "Invoice #INV-00428 · GHS 1,240.00",
              time: "8 min ago"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Activity,
            {
              color: "blue",
              title: "Stock received",
              detail: "50 bags of Ghacem Cement",
              time: "35 min ago"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Activity,
            {
              color: "orange",
              title: "Low stock alert",
              detail: "12mm Reinforcement Bar",
              time: "1 hr ago"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function Summary({
  icon: Icon2,
  label,
  value,
  detail,
  tone
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `summary-icon ${tone}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 21 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: detail })
  ] });
}
function QuickAction({
  icon: Icon2,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "quick-action", type: "button", onClick, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 19 }) }),
    label,
    /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "→" })
  ] });
}
function Activity({
  color,
  title,
  detail,
  time
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "activity-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: color }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: detail })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("time", { children: time })
  ] });
}
function SetupPage({
  page,
  onNavigate
}) {
  if (page === "Business Information") return /* @__PURE__ */ jsxRuntimeExports.jsx(BusinessInfoPage$1, {});
  if (page === "Business Branding") return /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectedBranding, {});
  if (page === "Users & Roles") return /* @__PURE__ */ jsxRuntimeExports.jsx(StaffAccountsPage, {});
  if (page === "Staff Accounts") return /* @__PURE__ */ jsxRuntimeExports.jsx(StaffAccountsPage, {});
  if (page === "Device Activation") return /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceActivationPage, {});
  if (page === "Owner Account")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(OwnerAccountPage, { onNavigate });
  if (page === "Branches") return /* @__PURE__ */ jsxRuntimeExports.jsx(BranchesPage$1, {});
  if (page === "Branch Login")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BranchLoginPage, { onAuthenticated: () => void 0 });
  if (page === "Business Branding") return /* @__PURE__ */ jsxRuntimeExports.jsx(BrandingPage, {});
  if (page === "Branches") return /* @__PURE__ */ jsxRuntimeExports.jsx(BranchesPage, {});
  if (page === "Device Activation") return /* @__PURE__ */ jsxRuntimeExports.jsx(DevicesPage, {});
  if (page === "Business Information") return /* @__PURE__ */ jsxRuntimeExports.jsx(BusinessInfoPage, {});
  const config = {
    "Business Information": {
      icon: Building2,
      title: "Business Information",
      description: "Manage your registered company details and business profile.",
      fields: [
        "Registered Company Name",
        "Trading / Business Name",
        "Business Category",
        "Business Email",
        "Phone Number",
        "Business Address"
      ]
    },
    "Business Branding": {
      icon: Palette,
      title: "Business Branding",
      description: "Customise your business identity, logo and visual appearance across the application.",
      fields: [
        "Business Name",
        "Business Tagline (optional)",
        "Primary Colour",
        "Secondary Colour",
        "Accent Colour"
      ]
    },
    Branches: {
      icon: Building2,
      title: "Branch Setup",
      description: "Create and manage company branches, branch accounts and access from headquarters.",
      fields: [
        "Branch Name",
        "Branch Code / ID",
        "Location / Address",
        "Phone Number",
        "Branch Manager (Admin)"
      ]
    },
    "Users & Roles": {
      icon: Users,
      title: "Users & Roles",
      description: "Manage users, administrators and role-based access for your business.",
      fields: ["Full Name", "Email Address", "Role", "Branch Scope"]
    },
    "Owner Account": {
      icon: Crown,
      title: "Owner Account",
      description: "Manage the primary owner profile, contact details, security and account preferences.",
      fields: [
        "Full Name",
        "Role / Position",
        "Phone Number",
        "Email Address",
        "Identification Type",
        "ID Number"
      ]
    },
    "Device Activation": {
      icon: Monitor,
      title: "Device Activation",
      description: "Authorise and manage devices that can run YenkasaBuildersStock for your company and branches.",
      fields: [
        "Select Branch",
        "Device Name",
        "Device Type",
        "Activation Validity"
      ]
    },
    "System Settings": {
      icon: Settings,
      title: "System Settings",
      description: "Configure application preferences for this company and branch environment.",
      fields: [
        "Default Currency",
        "Timezone",
        "Receipt Format",
        "Offline Sync Interval"
      ]
    }
  };
  const selected = config[page];
  const Icon2 = selected.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  › ",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: selected.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: selected.description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel setup-form", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: page === "Business Branding" ? "Brand Identity" : page }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Sample data for UI review" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-fields", children: selected.fields.map((field, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          field,
          index < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: " *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              defaultValue: index === 0 ? page === "Branches" ? "Oyarifa Branch" : page === "Business Branding" ? "Yenkasa Builders Supplies Ltd" : "Yenkasa Builders Limited" : index === 1 ? "Yenkasa Builders" : "",
              placeholder: `Enter ${field.toLowerCase()}`
            }
          )
        ] }, field)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", children: "Reset" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 }),
            "Save Changes"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-side", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: page === "Branches" ? "Branches" : page === "Device Activation" ? "Registered Devices" : page === "Owner Account" ? "Account Status" : "Preview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Approved reference layout" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-preview", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-preview-bar", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { size: 20 }),
              "YenkasaBuildersStock"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: selected.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: selected.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-lines", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "info-callout", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 21 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Offline ready" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Changes are prepared locally and can synchronize when connectivity returns." })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function BusinessInfoPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page info-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  › ",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Business Information" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Business Information" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Manage your registered company details and business profile." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info-design-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Company Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Keep your official business details up to date." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-fields", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Registered Company Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Yenkasa Builders Supplies Ltd" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Trading / Business Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Yenkasa Builders" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Business Category ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Building Materials" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Business Email ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "info@yenkasa.xyz" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Phone Number ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "+233 24 567 8900" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Country ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Ghana" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "wide-field", children: [
            "Business Address ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { defaultValue: "Oyarifa Main Road, Accra, Greater Accra Region, Ghana" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Currency ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "GHS – Ghana Cedi (GH₵)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Timezone ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Africa/Accra (GMT+00:00)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", children: "Reset Changes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 }),
            "Save Changes"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel setup-info-side", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Company Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "How your company appears across the application." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "company-profile-preview", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "company-emblem", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 42 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Yenkasa Builders Supplies Ltd" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Building Materials · Ghana" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GHS · Africa/Accra" })
        ] })
      ] })
    ] })
  ] });
}
function BranchesPage() {
  const branches = [
    [
      "Headquarters (HQ)",
      "HQ",
      "Accra (Main)",
      "Bright K. Menya",
      "6",
      "Active"
    ],
    ["Oyarifa Branch", "OY", "Oyarifa, Accra", "Elorm Wisdom", "5", "Active"],
    ["Dodowa Branch", "DD", "Dodowa", "Ruth Awini", "4", "Active"],
    ["Tema Branch", "TA", "Tema, Accra", "Arhinful Hudson", "3", "Suspended"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page branch-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  ›  ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Branches" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Branch Setup" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Create and manage company branches, branch accounts and access from headquarters." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Building2,
          label: "Total Branches",
          value: "4",
          detail: "",
          tone: "blue"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Building2,
          label: "Active Branches",
          value: "3",
          detail: "",
          tone: "teal"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Building2,
          label: "Suspended",
          value: "1",
          detail: "",
          tone: "orange"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Users,
          label: "Branch Users",
          value: "18",
          detail: "",
          tone: "purple"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel branch-form", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 19 }),
            " Add New Branch"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Create a new branch under your company." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-fields one-column", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Branch Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Oyarifa Branch" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Branch Code / ID ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "OY" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Location / Address ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Oyarifa, Accra" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Phone Number",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "+233 24 456 7890" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Branch Manager (Admin) ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Create New Branch Account" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "branch-note", children: "ⓘ   A branch administrator account will be created for this branch. The login details will be issued by headquarters." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", children: "Reset" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16 }),
            "Create Branch"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel branch-list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Branches" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "All company branches registered under your headquarters." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 15 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Search branches..." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-row branch-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Location" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Manager" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Users" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" })
          ] }),
          branches.map((branch, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branch-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              "▥  ",
              branch[0]
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: branch[1] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: branch[2] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: branch[3] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: branch[4] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `status ${branch[5] === "Active" ? "in-stock" : "low-stock"}`,
                children: branch[5]
              }
            )
          ] }, branch[1]))
        ] })
      ] })
    ] })
  ] });
}
function DevicesPage() {
  const devices = [
    ["HQ-PC-01", "Headquarters", "Windows", "01 Nov 2026", "Active"],
    ["OY-PC-01", "Oyarifa Branch", "Windows", "02 Nov 2026", "Active"],
    ["OY-PC-02", "Oyarifa Branch", "Windows", "02 Nov 2026", "Active"],
    ["DD-PC-01", "Dodowa Branch", "Windows", "03 Nov 2026", "Active"],
    ["TA-PC-01", "Tema Branch", "Windows", "03 Nov 2026", "Pending"],
    ["OY-LAP-01", "Oyarifa Branch", "macOS", "28 Oct 2026", "Revoked"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page device-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  › ",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Device Activation" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Device Activation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Authorize and manage devices (computers) that can run YenkasaBuildersStock for your company and branches." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Monitor,
          label: "Total Devices",
          value: "12",
          detail: "",
          tone: "blue"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Monitor,
          label: "Active Devices",
          value: "10",
          detail: "",
          tone: "teal"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Monitor,
          label: "Pending Activation",
          value: "1",
          detail: "",
          tone: "orange"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Summary,
        {
          icon: Monitor,
          label: "Revoked / Inactive",
          value: "1",
          detail: "",
          tone: "purple"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel device-form", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 19 }),
            " Activate New Device"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Generate an activation code for a new computer at a branch." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-fields one-column", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Select Branch ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Oyarifa Branch (OY)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Device Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Oyarifa-PC-02" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Device Type",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Windows PC" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Activation Validity",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Permanent (Recommended)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "device-help", children: "The code will be used on the branch computer to activate the application." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary-button full-button", children: "⌕   Generate Activation Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "how-it-works", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "ⓘ   How It Works" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "❶ Select the branch and enter a device name." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "❷ Generate an activation code." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "❸ On the branch computer, open the app and choose “Activate Device”." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "❹ Enter the code to register the device." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel device-list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Registered Devices" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "All devices linked to your company." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 15 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Search devices..." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-row device-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Device Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Branch" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Device Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Activated On" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" })
          ] }),
          devices.map((device, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: device[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: device[1] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: device[2] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: device[3] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `status ${device[4] === "Active" ? "in-stock" : device[4] === "Pending" ? "low-stock" : "out-of-stock"}`,
                children: device[4]
              }
            )
          ] }, device[0]))
        ] })
      ] })
    ] })
  ] });
}
function BrandingPage() {
  const [tab, setTab] = reactExports.useState("Application");
  const [receipts, setReceipts] = reactExports.useState(true);
  const [invoices, setInvoices] = reactExports.useState(true);
  const [appColours, setAppColours] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-page branding-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "setup-breadcrumb", children: [
      "⌂  ›  Company Setup  › ",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Business Branding" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "setup-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "setup-title-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 31 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Business Branding" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Customise your business identity, logo and visual appearance across the application, receipts and reports." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "branding-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "panel brand-identity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 20 }),
          "Brand Identity"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Business Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Yenkasa Builders Supplies Ltd" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Business Tagline ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "(optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "Quality Building Materials for Every Project" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { size: 20 }),
          "Logo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-logo-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-logo-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brand-logo-mark", children: "⌂" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Yenkasa" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "Builders Supplies Ltd" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "brand-outline", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 16 }),
              "Change Logo"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline brand-remove", children: "▣   Remove" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "brand-help", children: [
          "Recommended: PNG or JPG, at least 512 × 512 px",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "(transparent background preferred)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 20 }),
          "Brand Colours"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "colour-fields", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Primary Colour ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: "#0B2D6B" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "#0B2D6B" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Secondary Colour ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: "#F7B500" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "#F7B500" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Accent Colour",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: "#D7263D" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { defaultValue: "#D7263D" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { size: 20 }),
          "Business Assets"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleRow,
          {
            label: "Show logo on receipts",
            checked: receipts,
            onChange: () => setReceipts(!receipts)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleRow,
          {
            label: "Show logo on invoices",
            checked: invoices,
            onChange: () => setInvoices(!invoices)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleRow,
          {
            label: "Use brand colours in the application",
            checked: appColours,
            onChange: () => setAppColours(!appColours)
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "brand-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel branding-preview", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brand-panel-heading", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { size: 20 }),
            "Branding Preview"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-tabs", children: ["Application", "Receipt", "Invoice", "Report"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: tab === item ? "active" : "",
              onClick: () => setTab(item),
              children: item
            },
            item
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-mock", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mock-logo", children: [
                "⌂",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  "Yenkasa",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "BuildersStock"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "⌂   Dashboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🛒   Sales" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "▱   Inventory" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "◈   Purchasing" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mock-content", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mock-skeleton", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
                tab,
                " preview"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Overview of your business performance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mock-cards", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
                  "Total Stock Value",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "GHS 1,245,300.00" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
                  "Today's Sales",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "GHS 85,240.00" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
                  "Low Stock Items",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "red", children: "12" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-callout", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleUser, { size: 22 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Where your branding will be used" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your business name, logo and colours will appear in the application, receipts, invoices, reports and other printed documents." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "outline", children: "↶   Reset to Default" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "primary-button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 17 }),
        "Save Branding"
      ] })
    ] })
  ] });
}
function ToggleRow({
  label,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toggle-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: checked ? "on" : "",
        onClick: onChange,
        "aria-label": label,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
      }
    )
  ] });
}
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {}) }));
