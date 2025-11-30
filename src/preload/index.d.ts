import { ElectronAPI } from '@electron-toolkit/preload'
import type { UserSettingApi, LoLApi, RecordApi } from './type'

declare global {
  interface Window {
    electron: ElectronAPI
    lolApi: LoLApi
    userSettingApi: UserSettingApi
    recordApi: RecordApi
  }
}
