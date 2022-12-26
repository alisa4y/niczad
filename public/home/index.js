"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../tools/init");
const jss_1 = require("jss");
const js_cookie_1 = __importDefault(require("js-cookie"));
(0, init_1.init)();
(0, jss_1.jss)({
    ".intro": elm => {
        const btn = (0, jss_1.qs)("button", elm);
        (0, jss_1.ael)(btn, "click", () => {
            fetch("/users/login", {
                method: "POST",
                body: JSON.stringify(elm.eval),
            })
                .then(res => {
                if (res.ok) {
                    res.json().then(j => {
                        js_cookie_1.default.set("token", j.token, {
                            expires: new Date(Date.now() + 120 * 60 * 1000),
                        });
                        document.body.setAttribute("data-token", "");
                    });
                }
                else {
                    res
                        .text()
                        .then(text => (0, jss_1.qs)(".warn").setAttribute("data-content", text));
                }
            })
                .catch(e => (0, jss_1.qs)(".warn").setAttribute("data-content", e.message));
        });
    },
});
//# sourceMappingURL=index.js.map