import Cookies from "js-cookie"
import { ael, qs, qsa, jss, findAncestors, ma, mqs } from "jss"
import { Fn, XElement } from "jss/dist/types"
import { debounce } from "flowco"

export function init() {
  const paths = ["/home", "/orders", "/customers", "/users"]
  let editAction: Fn
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
    fetchForm(addDialog).then(({ res, form, syncSuccess }) => {
      res.json().then(({ id, message }) => {
        list.eval.push({ ...form.eval, id })
        syncSuccess(message)
        onFormSubmitted(addDialog, form)
      })
    })
    fetchForm(editdialog).then(async ({ res, form, syncSuccess }) => {
      syncSuccess(await res.text())
      editAction()
      onFormSubmitted(editdialog, form)
    })
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
      "button.btn.back": elm => {
        const dialog = findAncestors(".dialog", elm).pop() as XElement
        ael(elm, "click", () => {
          hideDialog(dialog)
        })
      },
      "[data-item-add]": elm => {
        ael(elm, "click", () => {
          showDialog(addDialog)
        })
      },
      "[data-item-edit]": elm => {
        const child = findAncestors("[data-item]", elm).at(-2) as XElement
        ael(elm, "click", () => {
          editAction = () => {
            child.eval = editdialog.eval
          }
          showDialog(editdialog)
        })
      },
      "[data-item-remove]": elm => {
        const child = findAncestors("[data-item]", elm).at(-2) as XElement
        ael(elm, "click", () => {
          fetch(p + "/remove", {
            method: "POST",
            body: JSON.stringify({ id: child.eval.id }),
          })
          child.remove()
        })
      },
      "[data-key='search']": elm => {
        ael(
          elm,
          "keyup",
          debounce(() => {
            const value = (elm as any as HTMLInputElement).value
            if (value === "")
              for (const child of list.children) child.classList.remove("n")
            list.eval.forEach((v, i) => {
              if (JSON.stringify(v).includes(value))
                list.children[i].classList.add("n")
            })
          }, 500)
        )
      },
    })
    const warnElm = qs(".warn")
    ael(window, "click", () => {
      warnElm.setAttribute("data-const", "")
    })
  })
}
function clearForm(elm: XElement) {
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
function showDialog(dialog: XElement) {
  dialog.classList.add("show")
}
function fetchForm(dialog: XElement) {
  const form = qs("form", dialog) as XElement
  const [url, method = "POST"] = ma("action", "method", form)
  const [syncSuccess, syncError] = syncFactory(qs(".sync", form))
  return new Promise(resolve => {
    ael(qs("button.btn.accept", dialog), "click", () => {
      fetch(url, {
        method,
        body: JSON.stringify(form.eval),
      })
        .then(async res => {
          if (res.ok) {
            resolve({ res, form, syncSuccess })
          } else {
            syncError(await res.text())
          }
        })
        .catch(e => {
          syncError("خطا در ارتباط")
          console.error(e)
        })
    })
  }) as Promise<{ res: Response; form: XElement; syncSuccess: Fn }>
}
function onFormSubmitted(dialog: XElement, form: XElement) {
  setTimeout(() => {
    hideDialog(dialog)
    clearForm(form)
  }, 500)
}
