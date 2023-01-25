import { ael, jss, mqs, qs, qsa } from "jss"
import { XElement } from "jss/dist/types"
import { getAll as getAllCustomers } from "../../clientApi/customers"
import { getAll } from "../../clientApi/orders"
import { init, initList } from "../../tools/init"
import { Order } from "../../tools/types"
init()
initList()

type Clock = {
  startTime: string
  endTime: string
}

ael(window, "load", e => {
  let orders: Order[] = []
  getAll({ method: "GET" })
    .then(r => r.json())
    .then(r => {
      orders = r as Order[]
      const selected = qs(".days .selected") as XElement
      const find = orders.find(({ date }) => {
        let od = new Date(date)
        return od.getTime() === parseInt(selected.eval.date)
      })
      if (find) {
        table.eval = [find]
      }
    })
  getAllCustomers({ method: "GET" })
    .then(r => r.json())
    .then(customers => {
      qsa("select[data-key='customerId']").forEach(elm => {
        elm.innerHTML =
          "<option>مشتری انتخاب کنید</option>" +
          customers
            .map(c => `<option value="${c.id}">${(c as any).name}</option>`)
            .join("\n")
        ael(elm, "change", e => {
          const v = (e.target as HTMLInputElement).value
          const [name, placeName] = mqs(
            "[data-key='name']",
            "[data-key='placeName']",
            elm.parentElement
          )
          const cus = (customers as any[]).find(({ id }) => id === v)
          name.textContent = cus.name || ""
          placeName.textContent = cus.place?.name || ""
        })
      })
    })
  qsa("form input[data-key='duration']").forEach(elm => {
    const startTime = qs(
      "[data-key='startTime']",
      elm.parentElement.parentElement
    )
    const endTime = qs("[data-key='endTime']", elm.parentElement.parentElement)
    ael(elm, "change", e => {
      const v = (e.target as HTMLInputElement).value
      const s = (startTime as HTMLInputElement).value
      const [hour, minute = 0] = s.split(":").map(t => parseInt(t))
      let [hour2, minute2 = 0] = v.split(":").map(t => parseInt(t))
      let m = minute + minute2
      if (m > 59) {
        m -= 60
        hour2++
      }
      endTime.textContent = `${hour2 + hour}:${m}`
    })
  })
  const [head, table, days] = mqs(
    ".order-head",
    ".order-table",
    ".days",
    document.querySelector("main")
  )
  const ppm = getPPM(head as any as HTMLElement)
  jss({
    ".days": elm => {
      const today = new Date(Date.now())
      today.setHours(3, 30, 0, 0)
      const options = { month: "long", day: "numeric", weekday: "long" }
      const days: any[] = []
      today.setDate(today.getDate() - 30)
      days.push({
        value: today.toLocaleDateString("fa", options as any),
        date: today.valueOf(),
      })
      for (let i = 0; i < 60; i++) {
        today.setDate(today.getDate() + 1)
        days.push({
          value: today.toLocaleDateString("fa", options as any),
          date: today.valueOf(),
        })
      }
      elm.eval = days
      elm.children[30].scrollIntoView({ block: "center", inline: "center" })
      elm.children[30].classList.add("selected")
      const find = orders.find(({ date }) => {
        let od = new Date(date)
        return od.getTime() === days[30].date
      })
      if (find) {
        table.eval = [find]
      }
    },
    ".days > div": elm => {
      const d = parseInt(elm.eval.date)
      ael(elm, "click", () => {
        table.eval = []
        qs(".selected", elm.parentElement)?.classList.remove("selected")
        elm.classList.add("selected")
        const founds = orders.filter(({ date }) => {
          let od = new Date(date)
          return od.getTime() === d
        })
        if (founds) {
          table.eval = founds
        }
      })
    },
    ".order-label > div": elm => {
      const { startTime, endTime }: Clock = elm.eval
      const [hour, minute] = startTime.split(":").map(s => parseInt(s))
      ;(elm as any).style.top = `${Math.floor(
        ((hour - 10) * 60 + minute) * ppm
      )}px`
      const [hour2, minute2] = endTime.split(":").map(s => parseInt(s))
      ;(qs(".clock", elm) as any).style.height =
        Math.floor(
          ((hour2 - 10) * 60 + minute2 - ((hour - 10) * 60 + minute)) * ppm
        ) + "px"
    },
    ".dialog.add, .dialog.edit": elm => {
      const btn = qs(".accept", elm)
      const d = new Date((qs("input[type='date']") as any).value)
      ael(btn, "click", () => {
        let find
        for (let c of days.children)
          if (parseInt((c as XElement).eval.date) === d.getTime()) {
            find = c
            break
          }
        if (find) {
          qs(".selected", days)?.classList.remove("selected")
          find.classList.add("selected")
          find.scrollIntoView({ block: "center" })
        }
      })
    },
  })
})

function getPPM(orderHead: HTMLElement) {
  const h1 = orderHead.children[0].getBoundingClientRect().y
  const h2 = orderHead.children[2].getBoundingClientRect().y
  const ppm = (h2 - h1) / 120 // pixel per minute
  return ppm
}
type Pos = { top: number; left: number; x: number; y: number }
function mouseDownHandler(e: MouseEvent, elm: HTMLElement) {
  const pos = {
    // The current scroll
    left: elm.scrollLeft,
    // Get the current mouse position
    x: e.clientX,
  }
  // Change the cursor and prevent user from selecting the text
  elm.style.cursor = "grabbing"
  elm.style.userSelect = "none"
  document.addEventListener("mousemove", mouseMoveHandler as any)
  document.addEventListener("mouseup", mouseUpHandler as any)
}
function mouseMoveHandler(e: MouseEvent, pos: Pos, elm: HTMLElement) {
  // How far the mouse has been moved
  const dx = e.clientX - pos.x
  // Scroll the element
  elm.scrollLeft = pos.left - dx
}
function mouseUpHandler(pos: Pos, elm: HTMLElement) {
  document.removeEventListener("mousemove", mouseMoveHandler as any)
  document.removeEventListener("mouseup", mouseUpHandler as any)

  elm.style.cursor = "grab"
  elm.style.removeProperty("user-select")
}
