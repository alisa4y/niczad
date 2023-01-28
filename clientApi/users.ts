import * as __oApi from "../api/users"

    export function ifAuthorized (data:Parameters<typeof __oApi.ifAuthorized>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.ifAuthorized>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/users/ifAuthorized"
    , {method: "POST",body: JSON.stringify(data),...options}
    ) as Promise<RetType>
}
export function login (data:Parameters<typeof __oApi.login>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.login>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/users/login"
    , {method: "POST",body: JSON.stringify(data),...options}
    ) as Promise<RetType>
}
export function generateApi (data:Parameters<typeof __oApi.generateApi>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.generateApi>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/users/generateApi"
    , {method: "POST",body: JSON.stringify(data),...options}
    ) as Promise<RetType>
}
export function add (data:Parameters<typeof __oApi.add>[0], options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.add>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/users/add"
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
  return fetch("/users/remove"
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
  return fetch("/users/update"
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
  return fetch("/users/getAll"
    , options
    ) as Promise<RetType>
}
export function resetDB (options:RequestInit={}) {
  type ObjRetType = Extract<Awaited<ReturnType<typeof __oApi.resetDB>>, Record<any, any>>
  type RetType =  ObjRetType extends never 
    ? Omit<Response, "json"> & {
      json: () => Promise<never>
    }
    : Omit<Response, "json"> & {
        json: () => Promise<ObjRetType>
      }
  return fetch("/users/resetDB"
    , options
    ) as Promise<RetType>
}
  