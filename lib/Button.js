"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var react_1 = require("react");
var Button_css_1 = require("./Button.css");
var Button = function (props) {
    var _a;
    return (react_1.default.createElement("button", __assign({}, props, { className: Button_css_1.buttonStyle + " " + ((_a = props.className) !== null && _a !== void 0 ? _a : '') }), props.children));
};
exports.Button = Button;
//# sourceMappingURL=Button.js.map