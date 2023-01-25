import { generateApi } from "./users"

const messages = {
  add: "مشتری جدید اضافه شد",
  remove: "مشتری حذف شد",
  update: "اصلاعات مشتری آپدیت شد",
}

export const { add, remove, update, getAll } = generateApi(
  "customers",
  messages
)
