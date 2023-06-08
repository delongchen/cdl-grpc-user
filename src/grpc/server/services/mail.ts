import {GrpcServiceImplFn} from "../../../types/grpc";
import {auth} from "cdl-grpc";
import {addMailCode} from "../../../store/mail";
import {sendAuthCode} from "../../../mail/send";

export const mailHandler: GrpcServiceImplFn<auth.MailRequest, auth.MailResponse> = (call, callback) => {
  const req = call.request.toObject()
  const res = new auth.MailResponse()
  const info = addMailCode(req.mail)

  sendAuthCode(info.code, info.mail)
    .then(() => {
      res.setStatus(auth.MailStatus.SEND_OK)
    })
    .catch(reason => {
      res.setStatus(auth.MailStatus.ERROR_MAIL_SEND)
    })
    .finally(() => {
      callback(null, res)
    })
}
