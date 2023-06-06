import {SelectQuery} from "../../types/maria";
import {select} from "./select";
import {insert} from "./insert";

const tableApi = (table: string) => {
  return {
    select: <T extends object>(q?: SelectQuery<T>) => select<T>(table, q),
    insert: <T extends object>(data: T) => insert<T>(table, data)
  }
}

export const userTable = tableApi('user')
