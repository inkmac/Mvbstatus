import Store from "@store/base/store";
import dayjs from "dayjs";
import { app } from "electron";

export const expireStore = new Store<ExpireStoreData>({
  name: 'Software',
  fileExtension: '',
  encryptionKey: 'secretKey'
})

export function initExpireStore(): void {
  const versions = expireStore.get('versions') || []
  const currentVersion = app.getVersion()

  if (!versions.includes(currentVersion)) {
    versions.push(currentVersion)
    expireStore.set("versions", versions)
    expireStore.set("expireDate", dayjs().add(1, "month").format())
    expireStore.set("lastUseDate", dayjs().format())
  } else {
    const lastUseDate = expireStore.get("lastUseDate")
    const expireDate = expireStore.get("expireDate")

    if (dayjs(lastUseDate).isAfter(dayjs())) {
      process.exit(1)
    }

    if (dayjs().isAfter(expireDate)) {
      process.exit(1)
    }

    expireStore.set("lastUseDate", dayjs().format())
  }
}

interface ExpireStoreData {
  versions: string[]
  expireDate: string
  lastUseDate: string
}
