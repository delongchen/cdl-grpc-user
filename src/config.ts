//this file is auto gen by 'gen-config.ts'
//to check config file
//time Tue Jun 06 2023 05:52:47 GMT+0800 (China Standard Time)

import {parse} from 'yaml'
import {readFileSync} from 'node:fs'


const configFilePath = './app-config.yml'
const configRaw = parse(readFileSync(configFilePath, 'utf-8'))

const check = ([key, t]: [string, string]): boolean => {
  const paths: string[] = key.split('.')
  let cur: any = configRaw
  while (paths.length !== 0) {
    const path = paths.shift()
    if (path !== undefined) {
      const exist = Reflect.get(cur, path)
      if (exist !== undefined) {
        cur = exist
        continue
      }
    }
    return false
  }
  return typeof cur === t
}

const errors: [string, string][] = []
const items: [string, string][] = [
  ["grpc.server.port","string"],
  ["grpc.client.jwt","string"],
  ["mariadb.host","string"],
  ["mariadb.port","number"],
  ["mariadb.user","string"],
  ["mariadb.password","string"],
  ["mariadb.database","string"]
]

for (const item of items) {
  if (!check(item)) {
    errors.push(item)
  }
}

if (errors.length !== 0) {
  console.log(errors.map(err => JSON.stringify(err)).join('\n'))
  throw new Error('config file error')
}

export interface AppConfig {
  grpc: {
    server: {
      port: string
    }
    client: {
      jwt: string
    }
  }
  mariadb: {
    host: string
    port: number
    user: string
    password: string
    database: string
  }
}

export const appConfig = configRaw as AppConfig
