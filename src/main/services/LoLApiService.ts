import { LoLCredentialService } from './LoLCredentialService'
import { hasServiceError, isServiceMessage } from '../../common'
import { ServiceError, ServiceMessage } from '../../common/type'

export class LoLApiService {
  private credentialService: LoLCredentialService

  constructor(credentialService: LoLCredentialService) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    this.credentialService = credentialService
  }

  private async fetchLCU(path: string): Promise<Response | ServiceError> {
    const credential = await this.credentialService.getCredential()
    if (hasServiceError(credential)) {
      return credential
    }

    const { password, port } = credential.data

    const url = `https://127.0.0.1:${port}${path}`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.createAuthHeader(password)
      }
    })

    return res
  }

  private async fetchLCD(path: string): Promise<Response> {
    const url = `https://127.0.0.1:2999/liveclientdata${path}`
    const res = await fetch(url, {
      method: 'GET'
    })

    return res
  }

  private createAuthHeader(password) {
    const encoded = Buffer.from(`riot:${password}`).toString('base64')
    return `Basic ${encoded}`
  }

  public async fetchGameEvent() {
    const res = await this.fetchLCD('/allgamedata')
    if (isServiceMessage(res) && hasServiceError(res)) {
      return res
    }

    const json = await res.json()

    return {
      data: json,
      error: undefined
    }
  }

  public async fetchGameFlow(): Promise<ServiceMessage> {
    const res = await this.fetchLCU('/lol-gameflow/v1/gameflow-phase')
    if (isServiceMessage(res) && hasServiceError(res)) {
      return res
    }

    const json = await res.json()

    return {
      data: json,
      error: undefined
    }
  }
}
