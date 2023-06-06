import {GrpcServiceImplFn} from "../../../types/grpc";
import {RegisterRequest, RegisterResponse, RegisterStatus, UserType} from "cdl-grpc";
import {userMailMap, newUserID, addUserCache} from "../../../store/user";
import {getSHA256} from "../../../rsa";
import {userTable} from "../../../data/maria";
import {CdlUser} from "../../../types/CdlUser";


const checkUserInfo = (info: CdlUser): string | undefined => {
  return
}

export const registerHandler: GrpcServiceImplFn<RegisterRequest, RegisterResponse> = (call, callback) => {
  const {mail, password} = call.request.toObject()
  const res = new RegisterResponse()

  const exist = userMailMap.get(mail)
  if (exist !== undefined) {
    res.setStatus(RegisterStatus.ERROR_NAME_EXIST)
    res.setMsg('the e-mail already exists!')
    callback(null, res)
  } else {
    const pswHash = getSHA256(password)
    const id = newUserID()
    const user: CdlUser = {
      id,
      mail,
      name: `wx${id}`,
      password: pswHash,
      level: UserType.NORMAL
    }

    userTable.insert(user)
      .then(() => {
        addUserCache(user)
        res.setStatus(RegisterStatus.REGISTER_OK)
        res.setMsg('ok')
      })
      .catch(reason => {
        res.setStatus(RegisterStatus.ERROR_PASSWORD_ILLEGAL)
        res.setMsg('500')
      })
      .finally(() => {
        callback(null, res)
      })
  }
}
