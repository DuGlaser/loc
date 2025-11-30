import {
  switchMap,
  timer,
  from,
  Observable,
  shareReplay,
  tap,
  catchError,
  of,
  distinctUntilChanged
} from 'rxjs'
import type { LoLGameEventMessage, LoLGameFlowMessage } from '../../../common/type'
import { BaseApiService } from './BaseApiService'

export class LoLApiService extends BaseApiService {
  gameEvent$ = timer(0, 1000).pipe(
    switchMap(() => this.fetchGameEvent()),
    distinctUntilChanged((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur)),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  gameFlow$ = timer(0, 100).pipe(
    switchMap(() => this.fetchGameFlow()),
    distinctUntilChanged((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur)),
    tap((value) => console.log(value)),
    shareReplay({ bufferSize: 1, refCount: true })
  )

  private fetchGameEvent(): Observable<LoLGameEventMessage> {
    return this.toObservable(window.lolApi.fetchGameEvent())
  }

  private fetchGameFlow(): Observable<LoLGameFlowMessage> {
    return this.toObservable(window.lolApi.fetchGameFlow())
  }
}

export const lolApiService = new LoLApiService()
