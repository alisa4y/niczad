import { Customer } from "../tools/types"
import { query } from "../tools/db"
import { v4 as uuidv4 } from "uuid"
import { XParam } from "ez-server"
import { ifAuthorized } from "./users"

const messages = {
  addedCustomer: "مشتری جدید اضافه شد",
  removedCustomer: "مشتری حذف شد",
  updatedCustomer: "اصلاعات مشتری آپدیت شد",
}

export function add(c: Customer, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(
      `create (n:Customer ${JSON.stringify({ ...c, id: uuidv4() })})`,
      "WRITE"
    )
    return messages.addedCustomer
  })
}
export function remove({ id }: { id: string }, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(`match (n {id: ${id}}) delete n`, "WRITE")
    return messages.removedCustomer
  })
}
export function update(c: Customer, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(`merge (n:Customer ${JSON.stringify(c)})`, "WRITE")
    return messages.removedCustomer
  })
}
export async function getAll() {
  const r = await query(`match (n:Customer) return n`, "READ")
  return r.records.map(n => n.get("n").properties)
}
