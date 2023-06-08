import {GrpcServiceImplFn} from "../../../types/grpc";
import {auth} from "cdl-grpc";
import {userMailMap, newUserID, addUserCache} from "../../../store/user";
import {getSHA256} from "../../../rsa";
import {userTable} from "../../../data/maria";
import {CdlUser} from "../../../types/CdlUser";
import {mailCodeMap} from "../../../store/mail";


const checkUserInfo = (info: CdlUser): string | undefined => {
  return
}

export const registerHandler: GrpcServiceImplFn<auth.RegisterRequest, auth.RegisterResponse> = (call, callback) => {
  const {mail, password, code} = call.request.toObject()
  const res = new auth.RegisterResponse()

  const exist = userMailMap.get(mail)
  if (exist !== undefined) {
    res.setStatus(auth.RegisterStatus.ERROR_NAME_EXIST)
    res.setMsg('the e-mail already exists!')
    callback(null, res)
  } else {
    const authCode = mailCodeMap.get(mail)
    if (authCode === undefined) {
      res.setStatus(auth.RegisterStatus.ERROR_PASSWORD_ILLEGAL)
      res.setMsg('auth code not exists')
      callback(null, res)
      return
    }

    if (authCode.code !== code) {
      res.setStatus(auth.RegisterStatus.ERROR_PASSWORD_ILLEGAL)
      res.setMsg('auth code error')
      callback(null, res)
      return
    }

    const pswHash = getSHA256(password)
    const id = newUserID()
    const user: CdlUser = {
      id,
      mail,
      name: `wx${id}`,
      password: pswHash,
      level: auth.UserType.NORMAL
    }

    userTable.insert(user)
      .then(() => {
        addUserCache(user)
        res.setStatus(auth.RegisterStatus.REGISTER_OK)
        res.setMsg('ok')
      })
      .catch(reason => {
        res.setStatus(auth.RegisterStatus.ERROR_PASSWORD_ILLEGAL)
        res.setMsg('500')
      })
      .finally(() => {
        callback(null, res)
      })
  }
}
