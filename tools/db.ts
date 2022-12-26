import neo4j, { QueryResult } from "neo4j-driver"

const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "1234")
)
export function query(
  q: string,
  mode: keyof typeof neo4j.session,
  params?: Record<string, any>
): Promise<QueryResult> {
  const session = driver.session({
    defaultAccessMode: neo4j.session[mode],
  })
  return new Promise(async resolve => {
    const result = await session.run(q, params)
    resolve(result)
    session.close()
  })
}
//------------- initializing ----------------
;(async function init() {
  await query(
    `CREATE CONSTRAINT uniqueId IF NOT EXISTS
  FOR (n:User)
  REQUIRE n.id IS UNIQUE`,
    "WRITE"
  )
  await query(
    `CREATE CONSTRAINT notNullId IF NOT EXISTS
  FOR (n:User)
  REQUIRE n.id IS NOT NULL`,
    "WRITE"
  )
})()

const closeDriver = () => {
  driver.close()
}
process.on("exit", closeDriver)
