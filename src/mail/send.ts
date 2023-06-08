import {transporter} from "./transporter";
import {appConfig} from "../config";
import {codeTemplate} from "./temp";

interface MailInfo {
  to: string
  subject: string
  html: string
}

export const baseSendMail = ({to, subject, html}: MailInfo) => transporter.sendMail({
  to, subject, html,
  from: appConfig.mail.from
})

export const sendAuthCode = (code: string, to: string) => {
  return baseSendMail({
    to,
    subject: `${code} 是你的 wx 验证码`,
    html: codeTemplate(code)
  })
}
