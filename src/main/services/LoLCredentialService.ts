import path from 'path'
import fs from 'node:fs/promises'
import { ERROR_TYPE } from '../../common'
import { ServiceMessage } from '../../common/type'
import { UserSettingService } from './UserSettingService'

interface LoLCredential {
  password: string
  port: string
}

export class LoLCredentialService {
  #password?: string
  #port?: string

  #userSettingService: UserSettingService

  constructor(userSettingService: UserSettingService) {
    this.#userSettingService = userSettingService
  }

  public async getCredential(): Promise<ServiceMessage<LoLCredential>> {
    if (this.#password && this.#port) {
      return {
        data: {
          password: this.#password,
          port: this.#port
        },
        error: undefined
      }
    }

    const lolDirectory = this.#userSettingService.get().lol.lolDirectoryPath

    if (!lolDirectory) {
      return {
        data: undefined,
        error: {
          type: ERROR_TYPE.CREDENTIAL_FILE_PATH_UNSPECIFIED
        }
      }
    }

    const credentialFilePath = path.join(lolDirectory, 'lockfile')
    try {
      const credentialTxt = await fs.readFile(credentialFilePath, 'utf-8')
      const credential = this.parseCredential(credentialTxt)

      this.#password = credential.password
      this.#port = credential.port

      return {
        data: {
          password: this.#password,
          port: this.#port
        },
        error: undefined
      }
    } catch (e) {
      return {
        data: undefined,
        error: {
          type: ERROR_TYPE.NOT_FOUND_CREDENTIAL_FILE
        }
      }
    }
  }

  private parseCredential(credential: string): LoLCredential {
    const [, , port, password] = credential.split(':')
    return { port, password }
  }
}
