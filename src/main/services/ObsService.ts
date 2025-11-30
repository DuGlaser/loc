import { exec, spawn } from 'child_process'
import { OBSWebSocket } from 'obs-websocket-js'
import { StartRecordMessage, StopRecordMessage } from '../../common/type'
import { ERROR_TYPE } from '../../common'
import path from 'path'
import { UserSettingService } from './UserSettingService'

export class OBSService {
  obs: OBSWebSocket
  connected: boolean = false

  #userSettingService: UserSettingService

  constructor(userSettingService: UserSettingService) {
    this.#userSettingService = userSettingService
    this.obs = new OBSWebSocket()
    setTimeout(async () => {
      const isRunning = await this.isObsRunning()
      if (!isRunning) {
        this.spawnObs()
      }
    }, 1000)
  }

  private spawnObs() {
    // TODO: なんかいい感じにする
    const obsDirectory = this.#userSettingService.get().obs.obsStudioDirectoryPath
    if (!obsDirectory) return

    const cwdPath = path.join(obsDirectory, 'bin', '64bit')
    const obsPath = path.join(cwdPath, 'obs64.exe')
    const profile = 'LoLAutoRecord'
    spawn(obsPath, ['--profile', profile], {
      cwd: cwdPath,
      detached: true,
      stdio: 'ignore'
    }).unref()
  }

  private async isObsRunning(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('tasklist /FI "IMAGENAME eq obs64.exe" /FO CSV /NH', (err, stdout) => {
        if (err) {
          console.warn(err)
          return resolve(false)
        }

        const line = stdout.trim()
        if (!line) {
          return resolve(false)
        }

        resolve(line.toLowerCase().startsWith('"obs64.exe"'))
      })
    })
  }

  private async connect() {
    if (this.connected) return

    try {
      const port = this.#userSettingService.get().obs.port
      const url = `ws://127.0.0.1:${port}`
      const password = this.#userSettingService.get().obs.password
      await this.obs.connect(url, password)
      this.connected = true
    } catch (e) {
      console.warn(e)
    }
  }

  public async startRecord(): Promise<StartRecordMessage> {
    try {
      await this.connect()
      await this.obs.call('StartRecord')

      return {
        data: {
          startAt: new Date().getTime()
        },
        error: undefined
      }
    } catch (e) {
      return {
        data: undefined,
        error: {
          type: ERROR_TYPE.OBS_ERROR,
          message: e instanceof Error ? e.message : String(e)
        }
      }
    }
  }

  public async stopRecord(): Promise<StopRecordMessage> {
    try {
      await this.connect()
      const { outputPath } = await this.obs.call('StopRecord')

      return {
        data: {
          endAt: new Date().getTime(),
          filePath: outputPath
        },
        error: undefined
      }
    } catch (e) {
      return {
        data: undefined,
        error: {
          type: ERROR_TYPE.OBS_ERROR,
          message: e instanceof Error ? e.message : String(e)
        }
      }
    }
  }
}
