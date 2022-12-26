"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const driver = neo4j_driver_1.default.driver("neo4j://localhost:7687", neo4j_driver_1.default.auth.basic("neo4j", "1234"));
function query(q, mode, params) {
    const session = driver.session({
        defaultAccessMode: neo4j_driver_1.default.session[mode],
    });
    return new Promise(async (resolve) => {
        const result = await session.run(q, params);
        resolve(result);
        session.close();
    });
}
exports.query = query;
//------------- initializing ----------------
;
(async function init() {
    await query(`CREATE CONSTRAINT uniqueId IF NOT EXISTS
  FOR (n:User)
  REQUIRE n.id IS UNIQUE`, "WRITE");
    await query(`CREATE CONSTRAINT notNullId IF NOT EXISTS
  FOR (n:User)
  REQUIRE n.id IS NOT NULL`, "WRITE");
})();
const closeDriver = () => {
    driver.close();
};
process.on("exit", closeDriver);
//# sourceMappingURL=db.js.map