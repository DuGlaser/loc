import { ipcMain } from 'electron'
import { LoLApiService } from '../services/LoLApiService'

export const registerLoLIpcHandlers = (lolApiService: LoLApiService) => {
  ipcMain.handle('lol/game-flow/get', async () => {
    return lolApiService.fetchGameFlow()
  })

  ipcMain.handle('lol/game-event/get', async () => {
    return lolApiService.fetchGameEvent()
  })
}
