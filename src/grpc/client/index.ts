import {auth} from "cdl-grpc";
import {appConfig} from "../../config";
import {credentials} from "@grpc/grpc-js";
import {CdlUser} from "../../types/CdlUser";

const client = new auth.AuthJWTClient(
  appConfig.grpc.client.jwt,
  credentials.createInsecure()
)

export const callSign = (user: CdlUser, remember: boolean) => new Promise<string>((resolve, reject) => {
  const req = new auth.SignRequest()

  const payload = new auth.SignPayload()
  payload.setUserMail(user.mail)
  payload.setUserName(user.name)
  payload.setUserType(user.level as 0)
  payload.setUserId(user.id)
  payload.setRemember(remember)

  req.setPayload(payload)

  client.sign(req, (err, value) => {
    if (err !== null) {
      reject(err)
    } else {
      if (value === undefined) {
        reject(new Error(''))
      } else {
        const code = value.getCode()
        if (code !== auth.ResponseCode.OK) {
          reject(new Error(''))
        } else {
          const token = value.getToken()
          resolve(token)
        }
      }
    }
  })
})
