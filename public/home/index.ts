import { init } from "../../tools/init"
import { ael, jss, qs } from "jss"
import Cookies from "js-cookie"

init()
jss({
  ".intro": elm => {
    const btn = qs("button", elm)
    ael(btn, "click", () => {
      fetch("/users/login", {
        method: "POST",
        body: JSON.stringify(elm.eval),
      })
        .then(res => {
          if (res.ok) {
            res.json().then(j => {
              Cookies.set("token", j.token, {
                expires: new Date(Date.now() + 120 * 60 * 1000),
              })
              document.body.setAttribute("data-token", "")
            })
          } else {
            res
              .text()
              .then(text => qs(".warn").setAttribute("data-content", text))
          }
        })
        .catch(e => qs(".warn").setAttribute("data-content", e.message))
    })
  },
})
