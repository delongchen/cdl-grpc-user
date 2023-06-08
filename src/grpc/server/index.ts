import { Server, ServerCredentials } from '@grpc/grpc-js'
import {appConfig} from "../../config";
import {auth} from "cdl-grpc";

import {loginHandler} from "./services/login";
import {registerHandler} from "./services/register";
import {mailHandler} from "./services/mail";

const grpcServer = new Server()

grpcServer.addService(auth.UserService, {
  login: loginHandler,
  register: registerHandler,
  mail: mailHandler
})

export const startGrpcServer = () => new Promise<number>((resolve, reject) => {
  grpcServer.bindAsync(
    appConfig.grpc.server.port,
    ServerCredentials.createInsecure(),
    (error, port) => {
      if (error !== null) {
        reject(error)
      } else {
        grpcServer.start()
        resolve(port)
      }
    }
  )
})
