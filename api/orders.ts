import { generateApi } from "./users"
const messages = {
  add: "سفارش جدید اضافه شد",
  remove: "سفارش حذف شد",
  update: "تغییرات جدید اعمال شد",
}
export const { add, remove, update, getAll } = generateApi("orders", messages)
