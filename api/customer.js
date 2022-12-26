"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.update = exports.remove = exports.add = void 0;
const db_1 = require("../tools/db");
const uuid_1 = require("uuid");
const users_1 = require("./users");
const messages = {
    addedCustomer: "مشتری جدید اضافه شد",
    removedCustomer: "مشتری حذف شد",
    updatedCustomer: "اصلاعات مشتری آپدیت شد",
};
function add(c, x) {
    return (0, users_1.ifAuthorized)(x, async () => {
        await (0, db_1.query)(`create (n:Customer ${JSON.stringify({ ...c, id: (0, uuid_1.v4)() })})`, "WRITE");
        return messages.addedCustomer;
    });
}
exports.add = add;
function remove({ id }, x) {
    return (0, users_1.ifAuthorized)(x, async () => {
        await (0, db_1.query)(`match (n {id: ${id}}) delete n`, "WRITE");
        return messages.removedCustomer;
    });
}
exports.remove = remove;
function update(c, x) {
    return (0, users_1.ifAuthorized)(x, async () => {
        await (0, db_1.query)(`merge (n:Customer ${JSON.stringify(c)})`, "WRITE");
        return messages.removedCustomer;
    });
}
exports.update = update;
async function getAll() {
    const r = await (0, db_1.query)(`match (n:Customer) return n`, "READ");
    return r.records.map(n => n.get("n").properties);
}
exports.getAll = getAll;
//# sourceMappingURL=customer.js.map