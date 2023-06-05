import {parse} from 'yaml'
import {readFileSync, writeFileSync} from 'node:fs'


const configFilePath = './app-config.yml'
const [out, defOut] = ['./src/config.ts', './src/types/config.ts']

const configRaw = readFileSync(configFilePath, 'utf-8')
const config = parse(configRaw)

function getItem(data: object, prefix: string): [string, string][] {
  const ret: [string, string][] = []
  const keys = Object.keys(data)
  for (const key of keys) {
    const value = Reflect.get(data, key)
    if (typeof value === 'object' && value !== null) {
      for (const item of getItem(value, prefix === '' ? key : [prefix, key].join('.'))) {
        ret.push(item)
      }
    } else {
      ret.push([[prefix, key].join('.'), typeof value])
    }
  }
  return ret
}

const withSpace = (n: number, s: string) => '  '.repeat(n) + s

function createInterface(data: object, level: number): string {
  const keys = Object.keys(data)
  const ret: string[] = []
  for (const key of keys) {
    const value = Reflect.get(data, key)
    if (typeof value === 'object' && value !== null) {
      ret.push(`${withSpace(level, key)}: ${createInterface(value, level + 1)}`)
    } else {
      ret.push(`${withSpace(level, key)}: ${typeof value}`)
    }
  }

  return `{
${ret.join('\n')}
${withSpace(level - 1, '}')}`
}

const tmp = `//this file is auto gen by 'gen-config.ts'
//to check config file
//${new Date()}

import {parse} from 'yaml'
import {readFileSync} from 'node:fs'


const configFilePath = '${configFilePath}'
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
  ${getItem(config, '').map(item => JSON.stringify(item)).join(',\n  ')}
]

for (const item of items) {
  if (!check(item)) {
    errors.push(item)
  }
}

if (errors.length !== 0) {
  console.log(errors.map(err => JSON.stringify(err)).join('\\n'))
  throw new Error('config file error')
}

export interface AppConfig ${createInterface(config, 1)}

export const appConfig = configRaw as AppConfig
`

writeFileSync(out, tmp)
