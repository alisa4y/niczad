import { init, resMessage } from "../../tools/init"
import { ael, jss, qs } from "jss"
import Cookies from "js-cookie"
import { login } from "../../clientApi/users"
import { XElement } from "jss/dist/types"
import { aim } from "bafu"

init()
const resElm = qs(".dialog.response") as XElement
const showMessage = aim(resMessage, resElm)
jss({
  ".intro": elm => {
    const btn = qs("button", elm)
    ael(btn, "click", e => {
      e.preventDefault()
      login(elm.eval)
        .then(res => {
          if (res.ok) {
            res.json().then(j => {
              Cookies.set("token", j.token, {
                expires: new Date(Date.now() + 120 * 60 * 1000),
              })
              showMessage({ message: "با موفقیت وارد شدید" })
              setTimeout(() => {
                window.location.href = "http://localhost:3000/orders"
              }, 1000)
            })
          } else {
            res.text().then(text => {
              showMessage({ message: text })
            })
          }
        })
        .catch(e => {
          showMessage(e)
        })
    })
  },
})
