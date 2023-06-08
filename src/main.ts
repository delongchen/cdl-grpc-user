import {initStore} from "./store";
import {startGrpcServer} from "./grpc/server";

const main = async () => {
  await initStore()
  startGrpcServer()
    .then(port => {
      console.log(port)
    })
}

main()
