import {GrpcServiceImplFn} from "../../../types/grpc";
import {LoginRequest, LoginResponse, LoginStatus} from "cdl-grpc";
import {userMailMap} from "../../../store/user";
import {getSHA256} from "../../../rsa";
import {callSign} from "../../client";

export const loginHandler: GrpcServiceImplFn<LoginRequest, LoginResponse> = (call, callback) => {
  const req = call.request.toObject()
  const exist = userMailMap.get(req.mail)

  const res = new LoginResponse()

  if (exist === undefined) {
    res.setStatus(LoginStatus.ERROR_NAME)
    res.setMsg('not register!')
    callback(null, res)
  } else {
    const pswHash = getSHA256(req.password)
    if (pswHash !== exist.password) {
      res.setStatus(LoginStatus.ERROR_PASSWORD)
      res.setMsg('password error!')
      callback(null, res)
    } else {
      callSign(exist, req.remember)
        .then(token => {
          res.setStatus(LoginStatus.LOGIN_OK)
          res.setMsg(token)
        })
        .catch(reason => {
          res.setStatus(LoginStatus.ERROR_PASSWORD)
          res.setMsg(reason.message ?? 'unknown error')
        })
        .finally(() => {
          callback(null, res)
        })
    }
  }
}
