import * as __oApi from "../api/customers"

    export const add = function (data:Parameters<typeof __oApi["add"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["add"]>>, Record<any, any>>
  return fetch("/customers/add"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const remove = function (data:Parameters<typeof __oApi["remove"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["remove"]>>, Record<any, any>>
  return fetch("/customers/remove"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const update = function (data:Parameters<typeof __oApi["update"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["update"]>>, Record<any, any>>
  return fetch("/customers/update"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const getAll = function (options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["getAll"]>>, Record<any, any>>
  return fetch("/customers/getAll"
    , options
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
  