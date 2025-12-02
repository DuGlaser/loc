import { app } from 'electron'
import { LowSync } from 'lowdb'
import { UserSetting } from '../../common/type'
import { JSONFileSync } from 'lowdb/node'
import path from 'node:path'

export class UserSettingService {
  #store: LowSync<UserSetting>

  constructor() {
    const defaultSetting: UserSetting = {
      obs: {
        obsStudioDirectoryPath: undefined,
        port: 4455,
        password: undefined
      },
      lol: {
        lolDirectoryPath: undefined
      }
    }
    const userDataDir = app.getPath('userData')
    const file = path.join(userDataDir, 'user-setting.json')
    const adapter = new JSONFileSync<UserSetting>(file)
    this.#store = new LowSync<UserSetting>(adapter, defaultSetting)
    this.#store.read()
  }

  public get(): UserSetting {
    return this.#store.data
  }

  public update(setting: UserSetting) {
    this.#store.data = setting
    this.#store.write()
  }
}

export const userSettingService = new UserSettingService()
