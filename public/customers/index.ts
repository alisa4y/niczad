import { ael, jss, mqs } from "jss"
import { init, initList } from "../../tools/init"
init()
initList()
jss({
  ".phone": elm => {
    const [inp, addBtn, list] = mqs(
      "input",
      "[data-item-add]",
      "[data-item]",
      elm
    )
    ael(addBtn, "click", e => {
      e.preventDefault()
      list.eval.push({ value: (inp as any as HTMLInputElement).value })
    })
  },
})
