import * as __oApi from "../api/users"

    export const ifAuthorized = function (data:Parameters<typeof __oApi["ifAuthorized"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["ifAuthorized"]>>, Record<any, any>>
  return fetch("/users/ifAuthorized"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const login = function (data:Parameters<typeof __oApi["login"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["login"]>>, Record<any, any>>
  return fetch("/users/login"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const generateApi = function (data:Parameters<typeof __oApi["generateApi"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["generateApi"]>>, Record<any, any>>
  return fetch("/users/generateApi"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const add = function (data:Parameters<typeof __oApi["add"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["add"]>>, Record<any, any>>
  return fetch("/users/add"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const remove = function (data:Parameters<typeof __oApi["remove"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["remove"]>>, Record<any, any>>
  return fetch("/users/remove"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const update = function (data:Parameters<typeof __oApi["update"]>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["update"]>>, Record<any, any>>
  return fetch("/users/update"
    , {method: "POST",body: JSON.stringify(data),...options}
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const getAll = function (options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["getAll"]>>, Record<any, any>>
  return fetch("/users/getAll"
    , options
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
export const resetDB = function (options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi["resetDB"]>>, Record<any, any>>
  return fetch("/users/resetDB"
    , options
  ).then(async res => {
    if (res.ok) return await res.json() as ObjRetType
    else throw new Error(await res.text())
  })
}
  