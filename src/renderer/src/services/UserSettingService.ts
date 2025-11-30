import type { UserSetting } from '../../../common/type'

class UserSettingService {
  public get(): Promise<UserSetting> {
    return window.userSettingApi.get()
  }

  public update(setting: UserSetting) {
    console.warn({ setting })
    return window.userSettingApi.update(setting)
  }
}

export const userSettingService = new UserSettingService()
