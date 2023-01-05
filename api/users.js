"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.getAll = exports.update = exports.remove = exports.add = exports.ifAuthorized = void 0;
const db_1 = require("../tools/db");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const messages = {
    loginPlease: "لطفا وارد شوید",
    notAuthorized: "شما اجازه این کار را ندارید",
    addedNewUser: "کاربر جدید اضافه شد",
    removedUser: "کابر حذف شد",
    updatedUser: "تغییرات کاربر انجام شد",
    failedLogin: "نام کاربری یا رمز عبور اشتباه است",
};
async function ifAuthorized(x, then) {
    const token = getToken(x);
    if (token) {
        const id = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const user = (await (0, db_1.query)(`match (n:User {id:${id}})`, "READ")).records[0]?.get("n").properties;
        if (user === null) {
            x.statusCode = 401;
            return messages.loginPlease;
        }
        else if (user.auth === "admin") {
            return await then();
        }
        else {
            x.statusCode = 403;
            return messages.notAuthorized;
        }
    }
    else {
        x.statusCode = 401;
        return messages.loginPlease;
    }
}
exports.ifAuthorized = ifAuthorized;
function getToken({ req }) {
    return req.headers["authorization"]?.split(" ")[1];
}
function add(u, x) {
    return ifAuthorized(x, async () => {
        const id = (0, uuid_1.v4)();
        await (0, db_1.query)(`create (n:User ${JSON.stringify({ ...u, id })})`, "WRITE");
        return { id, message: messages.addedNewUser };
    });
}
exports.add = add;
function remove(u, x) {
    return ifAuthorized(x, async () => {
        await (0, db_1.query)(`match (n:User {id: $id}) delete n`, "WRITE", u);
        return messages.removedUser;
    });
}
exports.remove = remove;
function update(u, x) {
    return ifAuthorized(x, async () => {
        await (0, db_1.query)(`merge (n:User ${JSON.stringify(u)} )`, "WRITE", u);
        return messages.updatedUser;
    });
}
exports.update = update;
async function getAll() {
    const r = await (0, db_1.query)("match(n:User) return n", "READ");
    return r.records.map(n => n.get("n").properties);
}
exports.getAll = getAll;
async function login(data, x) {
    try {
        const user = await (0, db_1.query)("match (n:User {username:$username, password:$password}) return n", "READ", data).then(r => r.records[0]?.get("n").properties);
        if (user) {
            const { username, auth, id } = user;
            return { username, auth, token: jsonwebtoken_1.default.sign({ id }, process.env.SECRET_KEY) };
        }
        else {
            x.statusCode = 401;
            return messages.failedLogin;
        }
    }
    catch (e) {
        x.statusCode = 500;
        return e.message;
    }
}
exports.login = login;
//# sourceMappingURL=users.js.map