import dayjs from "dayjs";
import { app } from "electron";
import Store from "@api/utils/store";


export function initStore(): void {
  const store = new Store<StoreData>({
    encryptionKey: 'secretKey'
  })

  const versions = store.get('versions') || []
  const currentVersion = app.getVersion()

  if (!versions.includes(currentVersion)) {
    versions.push(currentVersion)
    store.set("versions", versions)
    store.set("expireDate", dayjs().add(1, "month").format())
    store.set("lastUseDate", dayjs().format())
  } else {
    const lastUseDate = store.get("lastUseDate")
    const expireDate = store.get("expireDate")

    if (dayjs(lastUseDate).isAfter(dayjs())) {
      process.exit(1)
    }

    if (dayjs().isAfter(expireDate)) {
      process.exit(1)
    }

    store.set("lastUseDate", dayjs().format())
  }
}

interface StoreData {
  versions: string[]
  expireDate: string
  lastUseDate: string
}
