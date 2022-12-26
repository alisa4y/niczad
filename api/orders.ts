import { Order } from "../tools/types"
import { query } from "../tools/db"
import { v4 as uuidv4 } from "uuid"
import { XParam } from "ez-server"
import { ifAuthorized } from "./users"

const messages = {
  addedOrder: "سفارش جدید اضافه شد",
  removedOrder: "سفارش حذف شد",
  updatedOrder: "تغییرات جدید اعمال شد",
}

export function add(o: Order, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(
      `create (n:Order ${JSON.stringify({ ...o, id: uuidv4() })})`,
      "WRITE"
    )
    return messages.addedOrder
  })
}
export function remove({ id }: { id: string }, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(`match(n:Order {id:${id}}) delete n`, "WRITE")
    return messages.removedOrder
  })
}
export function update(o: Order, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(`merge (n:Order ${JSON.stringify(o)})`, "WRITE")
    return messages.updatedOrder
  })
}
export async function getAll() {
  const r = await query(`match(n:Order) return n`, "READ")
  return r.records.map(n => n.get("n").properties)
}
