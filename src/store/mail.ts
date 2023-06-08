import {MailCodeInfo} from "../types/mail";

export const mailCodeMap = new Map<string, MailCodeInfo>()

const getCode = () => {
  let raw = ((Math.random() * 1000000) >> 0) + ''
  if (raw.length < 6) {
    raw = '0'.repeat(6 - raw.length) + raw
  }
  return raw
}

export const addMailCode = (mail: string) => {
  const exist = mailCodeMap.get(mail)
  if (exist !== undefined) {
    clearTimeout(exist.timeout)
  }

  const timeout = setTimeout(() => {
    mailCodeMap.delete(mail)
  }, 30 * 60 * 1000)

  const info: MailCodeInfo = {
    mail,
    timeout,
    code: getCode(),
  }

  mailCodeMap.set(mail, info)
  return info
}

