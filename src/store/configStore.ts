import Store from "@store/base/store";
import { join } from "path";
import { app } from "electron";

export const configStore = new Store<ConfigStoreData>({
  path: join(app.getPath('userData'), 'Config'),
  name: "config",
  fileExtension: "json",
})

export function initConfigStore(): void {
  if (!configStore.get("init")) {
    configStore.set("init", true)
    configStore.set("logDirectoryPath", join(app.getPath("documents"), 'MvbstatusLogs'))
  }
}

interface ConfigStoreData {
  init: boolean,
  logDirectoryPath: string,
}
