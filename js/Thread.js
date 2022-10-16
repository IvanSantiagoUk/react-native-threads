import { NativeModules, DeviceEventEmitter } from "react-native";

const { ThreadManager } = NativeModules;

export default class Thread {
  constructor(jsPath) {
    this.id = ThreadManager.startThread(jsPath.replace(".tsx", ""))
      .then((id) => {
        DeviceEventEmitter.addListener(`Thread${id}`, (message) => {
          !!message && this.onmessage && this.onmessage(message);
        });
        return id;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  postMessage(message) {
    this.id.then((id) => ThreadManager.postThreadMessage(id, message));
  }

  terminate() {
    this.id.then(ThreadManager.stopThread);
  }
}
