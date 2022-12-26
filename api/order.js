"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.update = exports.remove = exports.add = void 0;
const db_1 = require("../tools/db");
const uuid_1 = require("uuid");
const users_1 = require("./users");
const messages = {
    addedOrder: "سفارش جدید اضافه شد",
    removedOrder: "سفارش حذف شد",
    updatedOrder: "تغییرات جدید اعمال شد",
};
function add(o, x) {
    return (0, users_1.ifAuthorized)(x, async () => {
        await (0, db_1.query)(`create (n:Order ${JSON.stringify({ ...o, id: (0, uuid_1.v4)() })})`, "WRITE");
        return messages.addedOrder;
    });
}
exports.add = add;
function remove({ id }, x) {
    return (0, users_1.ifAuthorized)(x, async () => {
        await (0, db_1.query)(`match(n:Order {id:${id}}) delete n`, "WRITE");
        return messages.removedOrder;
    });
}
exports.remove = remove;
function update(o, x) {
    return (0, users_1.ifAuthorized)(x, async () => {
        await (0, db_1.query)(`merge (n:Order ${JSON.stringify(o)})`, "WRITE");
        return messages.updatedOrder;
    });
}
exports.update = update;
async function getAll() {
    const r = await (0, db_1.query)(`match(n:Order) return n`, "READ");
    return r.records.map(n => n.get("n").properties);
}
exports.getAll = getAll;
//# sourceMappingURL=order.js.map