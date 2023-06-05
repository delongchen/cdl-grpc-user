import {createPool} from "mysql";
import {appConfig} from "../../config";

export const MARIA_POOL = createPool(appConfig.mariadb)
