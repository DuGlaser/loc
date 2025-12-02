import { exec, spawn } from 'child_process'
import { OBSWebSocket } from 'obs-websocket-js'
import { ServiceError, StartRecordMessage, StopRecordMessage } from '../../common/type'
import { ERROR_TYPE } from '../../common'
import path from 'node:path'
import { UserSettingService } from './UserSettingService'
import { catchError, concatMap, from, interval, lastValueFrom, of, takeWhile, timeout } from 'rxjs'

export class OBSService {
  obs: OBSWebSocket
  connected: boolean = false

  #userSettingService: UserSettingService

  constructor(userSettingService: UserSettingService) {
    this.#userSettingService = userSettingService
    this.obs = new OBSWebSocket()
    setTimeout(async () => {
      this.setupObs()
    }, 1000)
  }

  private spawnObs(): ServiceError | undefined {
    const obsSetting = this.#userSettingService.get().obs
    const obsDirectory = obsSetting.obsStudioDirectoryPath
    if (!obsDirectory) {
      return {
        data: undefined,
        error: {
          type: ERROR_TYPE.OBS_PATH_UNSPECIFIED
        }
      }
    }

    const obsProfile = obsSetting.profile

    const cwdPath = path.join(obsDirectory, 'bin', '64bit')
    const obsPath = path.join(cwdPath, 'obs64.exe')
    const args = obsProfile ? ['--profile', obsProfile] : []
    spawn(obsPath, args, {
      cwd: cwdPath,
      detached: true,
      stdio: 'ignore'
    }).unref()

    return
  }

  private async setupObs(): Promise<ServiceError | undefined> {
    const isRunning = await this.isObsRunning()
    if (isRunning) return

    const err = this.spawnObs()
    if (err) return err

    const intervalMs = 100
    const timeoutMs = 1000
    const source$ = interval(intervalMs).pipe(
      concatMap(() => from(this.isObsRunning()).pipe(catchError(() => of(false)))),
      takeWhile((v) => v === false, true),
      timeout(timeoutMs),
      catchError(() => of(false))
    )

    if (!lastValueFrom(source$)) {
      return {
        data: undefined,
        error: {
          type: ERROR_TYPE.OBS_CONNECTION_ERROR
        }
      }
    }

    return
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

  private async connect(): Promise<ServiceError | undefined> {
    if (this.connected) return

    try {
      const port = this.#userSettingService.get().obs.port
      const url = `ws://127.0.0.1:${port}`
      const password = this.#userSettingService.get().obs.password
      await this.obs.connect(url, password)
      this.connected = true
      return
    } catch (e) {
      return {
        data: undefined,
        error: {
          type: ERROR_TYPE.OBS_CONNECTION_ERROR,
          message: e instanceof Error ? e.message : String(e)
        }
      }
    }
  }

  public async startRecord(): Promise<StartRecordMessage> {
    const err = await this.setupObs()
    if (err) return err

    try {
      const err = await this.connect()
      if (err) return err
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
