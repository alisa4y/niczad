import { access, readFile, writeFile } from "fs/promises"
import { Customer, Order, User } from "./types"

export const db: { users: User[]; customers: Customer[]; orders: Order[] } = {
  users: [{ username: "niczad", password: "1234", auth: "admin", id: "0" }],
  customers: [],
  orders: [],
}
const dbPath = "./db.json"
function save() {
  return writeFile(dbPath, JSON.stringify(db), "utf-8")
}
async function readDb() {
  Object.assign(db, JSON.parse(await readFile(dbPath, "utf-8")))
}
setInterval(() => {
  save()
}, 15 * 60 * 1000)

async function init() {
  try {
    await access(dbPath)
    await readDb()
  } catch (e) {
    if (e.code === "ENOENT") {
      save()
    }
    throw e
  }
}
init()
