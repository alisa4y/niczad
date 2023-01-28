import { db } from "../tools/db"
import { User } from "../tools/types"
import { v4 as uuidv4 } from "uuid"
import { XParam } from "ultimate-server"
import jwt from "jsonwebtoken"
import { config } from "dotenv"

config()

const messages = {
  loginPlease: "لطفا وارد شوید",
  notAuthorized: "شما اجازه این کار را ندارید",
  add: "کاربر جدید اضافه شد",
  remove: "کابر حذف شد",
  update: "تغییرات کاربر انجام شد",
  failedLogin: "نام کاربری یا رمز عبور اشتباه است",
}
type Fn = (...args: any[]) => any
export async function ifAuthorized<T extends Fn>(
  x: XParam,
  then: T
): Promise<string | Awaited<ReturnType<T>>> {
  const token = getToken(x)
  try {
    if (token) {
      const { id } = jwt.verify(token, process.env.SECRET_KEY) as { id: string }
      const user = db.users.find(u => u.id === id)
      if (user === undefined) {
        x.statusCode = 401
        return messages.loginPlease
      } else if (user.auth === "admin") {
        return await then()
      } else {
        x.statusCode = 403
        return messages.notAuthorized
      }
    } else {
      x.statusCode = 401
      return messages.loginPlease
    }
  } catch (e) {
    x.statusCode = 401
    return messages.loginPlease
  }
}
function getToken({ req }: XParam) {
  return req.headers["authorization"]?.split(" ")[1]
}
interface LoginData {
  username: string
  password: string
}
type LoginRet = { username: string; auth: User["auth"]; token: string }
export async function login(
  data: LoginData,
  x: XParam
): Promise<string | LoginRet> {
  try {
    const user = db.users.find(
      ({ username, password }) =>
        username === data.username && password === data.password
    )
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
export function generateApi(
  field: keyof typeof db,
  messages: Record<"add" | "remove" | "update", string>
) {
  return {
    add(u: any, x: XParam) {
      return ifAuthorized(x, async () => {
        const id = uuidv4()
        db[field].push({ ...u, id } as any)
        return { id, message: messages.add }
      })
    },
    remove(u: { id: string }, x: XParam) {
      return ifAuthorized(x, async () => {
        const index = db[field].findIndex((o: any) => o.id === u.id)
        if (index !== -1) db[field].splice(index, 1)
        return messages.remove
      })
    },
    update(u: any, x: XParam) {
      return ifAuthorized(x, async () => {
        const record = (db[field] as any[]).find((o: any) => o.id === u.id)
        if (record) Object.assign(record, u)
        return messages.update
      })
    },
    getAll() {
      return db[field]
    },
  }
}
export const { add, remove, update, getAll } = generateApi("users", messages)

export function resetDB(): null {
  Object.assign(db, {
    users: [{ username: "niczad", password: "1234", auth: "admin", id: "0" }],
    customers: [],
    orders: [],
  })
  return null
}
