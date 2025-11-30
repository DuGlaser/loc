import type { ErrorMessage } from '../../../common/type'

export class LogService {
  error(error: ErrorMessage) {
    // console.error(error)
  }
}

export const logService = new LogService()
