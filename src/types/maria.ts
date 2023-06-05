import {FieldInfo} from "mysql";

export interface QueryResult<T = any> {
  results: T[],
  fields: FieldInfo[] | undefined
}

export interface SelectQuery<T> {
  limit?: number,
  where?: Partial<T>,
  fields?: (keyof T)[]
}
