import {query} from "./query";
import {SelectQuery} from "../../types/maria";

export function select<T extends object>(table: string, q?: SelectQuery<T>) {
  if (q === undefined) return query<T>(`select * from ${table}`)

  const {limit, where, fields} = q

  let whereSql = ''
  let fieldValues: (string | number)[] | null = null

  if (where !== undefined) {
    const keys = Reflect.ownKeys(where)

    if (keys.length !== 0) {
      whereSql += ' where '
      fieldValues = []
      const fieldNames: string[] = []

      for (const key of keys) {
        if (typeof key === 'string') {
          fieldNames.push(`${key}=?`)
          fieldValues.push(<string | number>Reflect.get(where, key))
        }
      }
      whereSql += fieldNames.join(' and ')
    }
  }

  const sql = `select ${(fields ?? ['*']).join(',')} from ${table}${whereSql}${limit ? ` limit ${limit}`:''}`

  return query<T>(sql, fieldValues)
}
