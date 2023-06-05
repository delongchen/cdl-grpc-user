import {AuthJWTClient, ResponseCode, SignPayload, SignRequest} from "cdl-grpc";
import {appConfig} from "../../config";
import {credentials} from "@grpc/grpc-js";

const client = new AuthJWTClient(
  appConfig.grpc.client.jwt,
  credentials.createInsecure()
)

export const callSign = (payload: SignPayload) => new Promise<string>((resolve, reject) => {
  const req = new SignRequest()
  req.setPayload(payload)

  client.sign(req, (err, value) => {
    if (err !== null) {
      reject(err)
    } else {
      if (value === undefined) {
        reject(new Error(''))
      } else {
        const code = value.getCode()
        if (code !== ResponseCode.OK) {
          reject(new Error(''))
        } else {
          const token = value.getToken()
          resolve(token)
        }
      }
    }
  })
})
