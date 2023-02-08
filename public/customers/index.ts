import { ael, qsr, mqs } from "qs-rule"
import { init, initList } from "../../tools/init"
init()
initList()
qsr({
  ".phone": elm => {
    const [inp, addBtn, list] = mqs("input", "button.add", "[data-item]", elm)
    ael(addBtn, "click", e => {
      e.preventDefault()
      list.eval.push({ value: (inp as any as HTMLInputElement).value })
    })
  },
})
