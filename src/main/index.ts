import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { LoLApiService } from './services/LoLApiService'
import { LoLCredentialService } from './services/LoLCredentialService'
import { registerLoLIpcHandlers } from './ipc/lolIpc'
import { registerUserSettingIpc } from './ipc/userSettingIpc'
import { registerRecordIpcHandlers } from './ipc/recordIpc'
import { UserSettingService } from './services/UserSettingService'
import { OBSService } from './services/ObsService'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.loc')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  const userSettingService = new UserSettingService()
  const lolCredentialService = new LoLCredentialService(userSettingService)
  const lolApiService = new LoLApiService(lolCredentialService)
  const obsService = new OBSService(userSettingService)

  registerLoLIpcHandlers(lolApiService)
  registerUserSettingIpc(userSettingService)
  registerRecordIpcHandlers(obsService)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
