import { Server, ServerCredentials } from '@grpc/grpc-js'
import {appConfig} from "../../config";
import {UserService} from "cdl-grpc";

import {loginHandler} from "./services/login";
import {registerHandler} from "./services/register";

const grpcServer = new Server()

grpcServer.addService(UserService, {
  login: loginHandler,
  register: registerHandler
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
