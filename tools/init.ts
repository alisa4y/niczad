import Cookies from "js-cookie"
import { ael, qs, qsa, jss, findAncestors, ma, mqs } from "jss"
import { Fn, XElement } from "jss/dist/types"
import { debounce } from "flowco"

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
      qs("header > ul > li:nth-child(1)").classList.add("n")
    }

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
      ".dialog.response": elm => {
        const close = qs("svg", elm)
        ael(close, "click", () => {
          elm.dataset.content = ""
        })
      },
      ".dialog.response:not([data-content=''])": elm => {
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
    })
    const resElm = qs(".dialog.response")
    ael(window, "click", () => {
      resElm.setAttribute("data-content", "")
    })
  })
}
export function initList() {
  let editAction: Fn
  const p = window.location.pathname
  const [list, addDialog, editDialog, watchDialog, resElm] = mqs(
    "main .label [data-item]",
    ".dialog.add",
    ".dialog.edit",
    ".dialog.watch",
    ".dialog.response",
    document.body
  )
  let listData: any[] = []
  fetchForm(addDialog, (res, syncSuccess) => {
    res.json().then(({ id, message }) => {
      listData.push({ ...addDialog.eval, id })
      list.eval.push({ ...addDialog.eval, id })
      syncSuccess(message)
      onFormSubmitted(addDialog)
    })
  })
  fetchForm(editDialog, async (res, syncSuccess) => {
    syncSuccess(await res.text())
    editAction()
    onFormSubmitted(editDialog)
  })
  fetch(p + "/getAll").then(async res => {
    if (res.ok) {
      listData = await res.json()
      if (!p.startsWith("/order")) list.eval = listData
    } else {
      resElm.setAttribute("data-content", await res.text())
    }
  })
  jss({
    "[data-item-add]": elm => {
      ael(elm, "click", () => {
        showDialog(addDialog)
      })
    },
    "main .label [data-item-edit]": elm => {
      const child = findAncestors("[data-item]", elm).at(-2) as XElement
      ael(elm, "click", e => {
        e.stopImmediatePropagation()
        editDialog.eval.id = child.eval.id
        const item = listData.find(v => v.id === child.eval.id)
        editDialog.eval = item
        editAction = () => {
          Object.assign(item, editDialog.eval)
          child.eval = item
        }
        showDialog(editDialog)
      })
    },
    "main .label [data-item-remove]": elm => {
      const child = findAncestors("[data-item]", elm).at(-2) as XElement
      ael(elm, "click", e => {
        e.stopImmediatePropagation()
        fetch(p + "/remove", {
          method: "POST",
          body: JSON.stringify({ id: child.eval.id }),
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
          },
        }).then(async res => {
          if (res.ok) {
            child.remove()
          } else {
            resElm.setAttribute("data-content", await res.text())
          }
        })
      })
    },
    ".dialog [data-item-remove]": elm => {
      ael(elm, "click", () => {
        const child = findAncestors("[data-item]", elm).at(-2) as XElement
        child.remove()
      })
    },
    "main [data-key='search']": elm => {
      ael(
        elm,
        "keyup",
        debounce(() => {
          const value = (elm as any as HTMLInputElement).value
          if (value === "")
            for (const child of list.children) child.classList.remove("n")
          else
            list.eval.forEach((v: object, i: number) => {
              if (!JSON.stringify(v).includes(value))
                list.children[i].classList.add("n")
            })
        }, 500)
      )
    },
    "main .label > * > [data-item] > *": elm => {
      const item = listData.find(({ id }) => id === elm.eval.id)
      ael(elm, "click", e => {
        watchDialog.eval = item
        showDialog(watchDialog)
      })
    },
  })
}
function clearForm(elm: XElement) {
  qsa("input", elm).forEach((inp: HTMLInputElement) => (inp.value = ""))
  qsa("[data-item]", elm).forEach((inp: XElement) => (inp.eval = []))
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
type ActionHandle = (res: Response, sync: (msg: string) => void) => void
function fetchForm(dialog: XElement, handle: ActionHandle) {
  const form = qs("form", dialog) as XElement
  const [url, method = "POST"] = ma("action", "method", form)
  const [syncError, syncSuccess] = syncFactory(qs(".sync", dialog))
  ael(qs("button.btn.accept", dialog), "click", () => {
    fetch(url, {
      method,
      body: JSON.stringify(form.eval),
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then(async res => {
        if (res.ok) {
          handle(res, syncSuccess)
        } else {
          syncError(await res.text())
        }
      })
      .catch(e => {
        syncError("خطا در ارتباط")
        console.error(e)
      })
  })
}
function onFormSubmitted(dialog: XElement) {
  setTimeout(() => {
    hideDialog(dialog)
    clearForm(dialog)
  }, 10)
}
export function resMessage(msg: { message: string }, dialog: XElement) {
  dialog.eval = msg
  showDialog(dialog)
}
