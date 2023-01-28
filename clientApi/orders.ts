import * as __oApi from "../api/orders"

    export function add (data:Parameters<typeof __oApi.add>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.add>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/orders/add"
    , {method: "POST",body: JSON.stringify(data),...options}
    ) as Promise<RetType>
}
export function remove (data:Parameters<typeof __oApi.remove>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.remove>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/orders/remove"
    , {method: "POST",body: JSON.stringify(data),...options}
    ) as Promise<RetType>
}
export function update (data:Parameters<typeof __oApi.update>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.update>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/orders/update"
    , {method: "POST",body: JSON.stringify(data),...options}
    ) as Promise<RetType>
}
export function getAll (options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.getAll>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/orders/getAll"
    , options
    ) as Promise<RetType>
}
  