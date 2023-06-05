import {readFileSync} from 'node:fs'
import NodeRSA from "node-rsa";
import {createHash} from 'node:crypto'

const publicKeyRaw = readFileSync('./key/app_public_key.pem')
const publicKey = new NodeRSA(publicKeyRaw)
const getSHA256 = (s: string) =>
  createHash('sha256')
    .update(s)
    .digest('hex')

export const isTokenOk = (token: string) => {
  const [header, body, sign] = token.split('.')
  if (sign !== undefined) {
    const hash = getSHA256([header, body].join('.'))
    if (hash === publicKey.decryptPublic(sign).toString()) return true
  }
  return false
}
