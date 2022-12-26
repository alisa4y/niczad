import { User } from "../tools/types"
import { query } from "../tools/db"
import { v4 as uuidv4 } from "uuid"
import { XParam } from "ez-server"
import jwt from "jsonwebtoken"
import { config } from "dotenv"

config()

const messages = {
  loginPlease: "لطفا وارد شوید",
  notAuthorized: "شما اجازه این کار را ندارید",
  addedNewUser: "کاربر جدید اضافه شد",
  removedUser: "کابر حذف شد",
  updatedUser: "تغییرات کاربر انجام شد",
  failedLogin: "نام کاربری یا رمز عبور اشتباه است",
}
type Fn = (...args: any[]) => any
export async function ifAuthorized(x: XParam, then: Fn) {
  const token = getToken(x)
  if (token) {
    const id = jwt.verify(token, process.env.SECRET_KEY)
    const user = (
      await query(`match (n:User {id:${id}})`, "READ")
    ).records[0]?.get("n").properties
    if (user === null) {
      x.statusCode = 401
      return messages.loginPlease
    } else if (user.auth === "admin") {
      return then()
    } else {
      x.statusCode = 403
      return messages.notAuthorized
    }
  } else {
    x.statusCode = 401
    return messages.loginPlease
  }
}
function getToken({ req }: XParam) {
  return req.headers["authorization"]?.split(" ")[1]
}
export function add(u: Omit<User, "id">, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(
      `create (n:User ${JSON.stringify({ ...u, id: uuidv4() })})`,
      "WRITE"
    )
    return messages.addedNewUser
  })
}
export function remove(u: { id: string }, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(`match (n:User {id: $id}) delete n`, "WRITE", u)
    return messages.removedUser
  })
}
export function update(u: User, x: XParam) {
  return ifAuthorized(x, async () => {
    await query(`merge (n:User ${JSON.stringify(u)} )`, "WRITE", u)
    return messages.updatedUser
  })
}
export async function getAll() {
  const r = await query("match(n:User) return n", "READ")
  return r.records.map(n => n.get("n").properties)
}

interface LoginData {
  username: string
  password: string
}
export async function login(data: LoginData, x: XParam) {
  try {
    const user = await query(
      "match (n:User {username:$username, password:$password}) return n",
      "READ",
      data
    ).then(r => r.records[0]?.get("n").properties)
    if (user) {
      const { username, auth, id } = user
      return { username, auth, token: jwt.sign({ id }, process.env.SECRET_KEY) }
    } else {
      x.statusCode = 401
      return messages.failedLogin
    }
  } catch (e) {
    x.statusCode = 500
    return e.message
  }
}
