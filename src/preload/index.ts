import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { LoLApi, RecordApi, UserSettingApi } from './type'

const lolApi: LoLApi = {
  fetchGameEvent() {
    return ipcRenderer.invoke('lol/game-event/get')
  },

  fetchGameFlow() {
    return ipcRenderer.invoke('lol/game-flow/get')
  }
}

const userSettingApi: UserSettingApi = {
  get() {
    return ipcRenderer.invoke('user-setting/get')
  },

  update(setting) {
    return ipcRenderer.invoke('user-setting/update', setting)
  }
}

const recordApi: RecordApi = {
  startRecord() {
    return ipcRenderer.invoke('record/start/exec')
  },

  stopRecord() {
    return ipcRenderer.invoke('record/stop/exec')
  }
}

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('lolApi', lolApi)
  contextBridge.exposeInMainWorld('userSettingApi', userSettingApi)
  contextBridge.exposeInMainWorld('recordApi', recordApi)
} catch (error) {
  console.error(error)
}
