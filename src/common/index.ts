import { ServiceError, ServiceMessage } from './type'

export const isServiceMessage = (message: any): message is ServiceMessage => {
  return (
    (message.data !== undefined && message.error === undefined) ||
    (message.data === undefined && message.error !== undefined)
  )
}

export const hasServiceError = (message: ServiceMessage): message is ServiceError => {
  return message.error !== undefined
}

export const ERROR_TYPE = {
  NOT_FOUND_CREDENTIAL_FILE: 'NOT_FOUND_CREDENTIAL_FILE',
  CREDENTIAL_FILE_PATH_UNSPECIFIED: 'CREDENTIAL_FILE_PATH_UNSPECIFIED',
  IPC_ERROR: 'IPC_ERROR',
  OBS_ERROR: 'OBS_ERROR',
  OBS_CONNECTION_ERROR: 'OBS_CONNECTION_ERROR',
  OBS_PATH_UNSPECIFIED: 'OBS_PATH_UNSPECIFIED'
} as const
