import { ipcMain } from 'electron'
import { UserSetting } from '../../common/type'
import { UserSettingService } from '../services/UserSettingService'

export const registerUserSettingIpc = (userSettingService: UserSettingService) => {
  ipcMain.handle('user-setting/get', (_event) => {
    return userSettingService.get()
  })

  ipcMain.handle('user-setting/update', (_event, setting: UserSetting) => {
    return userSettingService.update(setting)
  })
}
