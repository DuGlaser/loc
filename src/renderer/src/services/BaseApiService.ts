import { catchError, from, of, tap, type Observable } from 'rxjs'
import type { ServiceMessage } from '../../../common/type'
import { ERROR_TYPE, hasServiceError } from '../../../common'
import { logService } from './ErrorService'

export class BaseApiService {
  #logService = logService

  protected toObservable<T>(f: Promise<ServiceMessage<T>>): Observable<ServiceMessage<T>> {
    return from(f).pipe(
      catchError((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err)

        return of({
          data: undefined,
          error: {
            type: ERROR_TYPE.IPC_ERROR,
            message: errorMessage
          }
        } satisfies ServiceMessage)
      }),
      tap({
        next: (value) => {
          if (hasServiceError(value)) {
            this.#logService.error(value.error)
          }
        }
      })
    )
  }
}
