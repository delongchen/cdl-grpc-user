import {userTable} from "../data/maria";
import {CdlUser} from "../types/CdlUser";


let USER_ID = 800000
export const newUserID = () => ++USER_ID

const userIdMap = new Map<number, CdlUser>()
export const userMailMap = new Map<string, CdlUser>()

export const addUserCache = (user: CdlUser) => {
  if (user.id > USER_ID) {
    USER_ID = user.id
  }
  userIdMap.set(user.id, user)
  userMailMap.set(user.mail, user)
}

export const initUserStore = async () => {
  const {results} = await userTable.select<CdlUser>()
  for (const user of results) {
    addUserCache(user)
  }
}
