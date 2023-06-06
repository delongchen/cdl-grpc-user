import {query} from "./query";

export const insert = <T extends object>(table: string, data: T) => {
  return query<T>(`insert into ${table} set ?`, data)
}
