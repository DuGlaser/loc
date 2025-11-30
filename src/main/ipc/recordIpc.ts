import { ipcMain } from 'electron'
import { OBSService } from '../services/ObsService'

export const registerRecordIpcHandlers = (ObsService: OBSService) => {
  ipcMain.handle('record/start/exec', async () => {
    return ObsService.startRecord()
  })

  ipcMain.handle('record/stop/exec', async () => {
    return ObsService.stopRecord()
  })
}
