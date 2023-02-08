import { init, resMessage } from "../../tools/init"
import { ael, qsr, qs } from "qs-rule"
import Cookies from "js-cookie"
import { login } from "../../clientApi/users"
import { XElement } from "qs-rule/dist/types"
import { aim } from "bafu"

init()
const resElm = qs(".dialog.response") as XElement
const showMessage = aim(resMessage, resElm)
qsr({
  ".intro": elm => {
    const btn = qs("button", elm)
    ael(btn, "click", e => {
      e.preventDefault()
      login(elm.eval)
        .then(j => {
          Cookies.set("token", j.token, {
            expires: new Date(Date.now() + 120 * 60 * 1000),
          })
          showMessage({ message: "با موفقیت وارد شدید" })
          setTimeout(() => {
            window.location.href = "http://localhost:3000/orders"
          }, 1000)
        })
        .catch(e => {
          showMessage(e)
        })
    })
  },
})
