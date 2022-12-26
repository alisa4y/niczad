import Cookies from "js-cookie"
import { ael, qs, qsa, jss, findAncestors, ma, mqs } from "jss"
import { XElement } from "jss/dist/types"

export function init() {
  const paths = ["/home", "/orders", "/customers", "/users"]

  ael(window, "load", () => {
    const p = window.location.pathname
    const navs = qsa("header > ul > li")
    paths.some((path, i) => {
      if (p.startsWith(path)) {
        navs[i].classList.add("active")
      }
    })
    ael(navs.at(-1), "click", () => {
      Cookies.remove("token")
      document.body.removeAttribute("data-token")
    })
    if (Cookies.get("token")) {
      document.body.setAttribute("data-token", "")
    }
    const [list, addDialog, editdialog] = mqs(
      "[data-item]",
      ".dialog.add",
      ".dialog.edit",
      document.body
    )
    ;(addDialog as any).end = () => {
      list.eval.push(addDialog.eval)
    }
    fetch(p + "/getAll").then(async res => {
      if (res.ok) {
        const data = await res.json()
        list.eval = data
      } else {
        qs(".warn").setAttribute("data-content", await res.text())
      }
    })
    jss({
      ".icon.password > *:nth-child(1)": elm => {
        const inp = qs("input", elm.parentElement.parentElement)
        elm.addEventListener("click", () => {
          ;(inp as HTMLInputElement).type = "text"
        })
      },
      ".icon.password > *:nth-child(2)": elm => {
        const inp = qs("input", elm.parentElement.parentElement)
        elm.addEventListener("click", () => {
          ;(inp as HTMLInputElement).type = "password"
        })
      },
      ".icon.text > *:nth-child(1)": elm => {
        const inp = qs(
          "input",
          elm.parentElement.parentElement
        ) as HTMLInputElement
        elm.addEventListener("click", () => {
          inp.value = ""
          inp.focus()
        })
      },
      ".warn": elm => {
        const close = qs("svg", elm)
        ael(close, "click", () => {
          elm.dataset.content = ""
        })
      },
      ".warn:not([data-content=''])": elm => {
        qs(".message", elm).textContent = elm.dataset.content
      },
      ".dialog": elm => {
        const close = qs(".title > svg", elm)
        ael(close, "click", () => {
          hideDialog(elm)
        })
      },
      "button.btn.accept": elm => {
        const form = findAncestors("form", elm).pop() as XElement
        const [url, method = "POST"] = ma("action", "method", form)
        const [syncSuccess, syncError] = syncFactory(qs(".sync", form))
        ael(elm, "click", () => {
          fetch(url, {
            method,
            body: JSON.stringify(form.eval),
          })
            .then(async res => {
              if (res.ok) {
                syncSuccess("انجام شد")
                setTimeout(() => {
                  submitForm(form)
                }, 500)
              } else {
                syncError(await res.text())
              }
            })
            .catch(e => {
              syncError("خطا در ارتباط")
              console.error(e)
            })
        })
      },
      "button.btn.back": elm => {
        const dialog = findAncestors(".dialog", elm).pop() as XElement
        ael(elm, "click", () => {
          hideDialog(dialog)
        })
      },
      "[data-item-add]": elm => {
        showDialog(addDialog, elm)
      },
      "[data-item-edit]": elm => {
        const child = findAncestors("[data-item]", elm).at(-2) as XElement
        ;(editdialog as any).end = () => {
          child.eval = editdialog.eval
        }
      },
      "[data-key='search']": elm => {
        // TODO: general search rule
      },
    })

    const warnElm = qs(".warn")
    ael(window, "click", () => {
      warnElm.setAttribute("data-const", "")
    })
  })
}
function submitForm(elm: XElement) {
  ;(submitForm as any).end()
  hideDialog(findAncestors(".dialog", elm).pop())
  qsa("[data-key]", elm).forEach((inp: HTMLInputElement) => (inp.value = ""))
}
function hideDialog(elm: XElement) {
  elm.classList.remove("show")
}
function syncFactory(elm: Element) {
  return [
    (text: string) => {
      elm.textContent = text
      elm.classList.add("error")
    },
    (text: string) => {
      elm.textContent = text
      elm.classList.remove("error")
    },
  ]
}
function showDialog(form: XElement, elm: XElement) {
  ael(elm, "click", () => {
    form.classList.add("show")
  })
}
