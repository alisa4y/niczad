"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const js_cookie_1 = __importDefault(require("js-cookie"));
const jss_1 = require("jss");
function init() {
    const paths = ["/home", "/orders", "/customers", "/users"];
    (0, jss_1.ael)(window, "load", () => {
        const p = window.location.pathname;
        const navs = (0, jss_1.qsa)("header > ul > li");
        paths.some((path, i) => {
            if (p.startsWith(path)) {
                navs[i].classList.add("active");
            }
        });
        (0, jss_1.ael)(navs.at(-1), "click", () => {
            js_cookie_1.default.remove("token");
            document.body.removeAttribute("data-token");
        });
        if (js_cookie_1.default.get("token")) {
            document.body.setAttribute("data-token", "");
        }
        const [list, addDialog, editdialog] = (0, jss_1.mqs)("[data-item]", ".dialog.add", ".dialog.edit", document.body);
        addDialog.end = () => {
            list.eval.push(addDialog.eval);
        };
        fetch(p + "/getAll").then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                list.eval = data;
            }
            else {
                (0, jss_1.qs)(".warn").setAttribute("data-content", await res.text());
            }
        });
        (0, jss_1.jss)({
            ".icon.password > *:nth-child(1)": elm => {
                const inp = (0, jss_1.qs)("input", elm.parentElement.parentElement);
                elm.addEventListener("click", () => {
                    ;
                    inp.type = "text";
                });
            },
            ".icon.password > *:nth-child(2)": elm => {
                const inp = (0, jss_1.qs)("input", elm.parentElement.parentElement);
                elm.addEventListener("click", () => {
                    ;
                    inp.type = "password";
                });
            },
            ".icon.text > *:nth-child(1)": elm => {
                const inp = (0, jss_1.qs)("input", elm.parentElement.parentElement);
                elm.addEventListener("click", () => {
                    inp.value = "";
                    inp.focus();
                });
            },
            ".warn": elm => {
                const close = (0, jss_1.qs)("svg", elm);
                (0, jss_1.ael)(close, "click", () => {
                    elm.dataset.content = "";
                });
            },
            ".warn:not([data-content=''])": elm => {
                (0, jss_1.qs)(".message", elm).textContent = elm.dataset.content;
            },
            ".dialog": elm => {
                const close = (0, jss_1.qs)(".title > svg", elm);
                (0, jss_1.ael)(close, "click", () => {
                    hideDialog(elm);
                });
            },
            "button.btn.accept": elm => {
                const form = (0, jss_1.findAncestors)("form", elm).pop();
                const [url, method = "POST"] = (0, jss_1.ma)("action", "method", form);
                const [syncSuccess, syncError] = syncFactory((0, jss_1.qs)(".sync", form));
                (0, jss_1.ael)(elm, "click", () => {
                    fetch(url, {
                        method,
                        body: JSON.stringify(form.eval),
                    })
                        .then(async (res) => {
                        if (res.ok) {
                            syncSuccess("انجام شد");
                            setTimeout(() => {
                                submitForm(form);
                            }, 500);
                        }
                        else {
                            syncError(await res.text());
                        }
                    })
                        .catch(e => {
                        syncError("خطا در ارتباط");
                        console.error(e);
                    });
                });
            },
            "button.btn.back": elm => {
                const dialog = (0, jss_1.findAncestors)(".dialog", elm).pop();
                (0, jss_1.ael)(elm, "click", () => {
                    hideDialog(dialog);
                });
            },
            "[data-item-add]": elm => {
                showDialog(addDialog, elm);
            },
            "[data-item-edit]": elm => {
                const child = (0, jss_1.findAncestors)("[data-item]", elm).at(-2);
                editdialog.end = () => {
                    child.eval = editdialog.eval;
                };
            },
            "[data-key='search']": elm => {
                // TODO: general search rule
            },
        });
        const warnElm = (0, jss_1.qs)(".warn");
        (0, jss_1.ael)(window, "click", () => {
            warnElm.setAttribute("data-const", "");
        });
    });
}
exports.init = init;
function submitForm(elm) {
    ;
    submitForm.end();
    hideDialog((0, jss_1.findAncestors)(".dialog", elm).pop());
    (0, jss_1.qsa)("[data-key]", elm).forEach((inp) => (inp.value = ""));
}
function hideDialog(elm) {
    elm.classList.remove("show");
}
function syncFactory(elm) {
    return [
        (text) => {
            elm.textContent = text;
            elm.classList.add("error");
        },
        (text) => {
            elm.textContent = text;
            elm.classList.remove("error");
        },
    ];
}
function showDialog(form, elm) {
    (0, jss_1.ael)(elm, "click", () => {
        form.classList.add("show");
    });
}
//# sourceMappingURL=init.js.map