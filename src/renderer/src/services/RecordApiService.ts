import { Observable, Subject, tap } from 'rxjs'
import type { StopRecordMessage, StartRecordMessage } from '../../../common/type'
import { BaseApiService } from './BaseApiService'

export class RecordApiService extends BaseApiService {
  public startRecord(): Observable<StartRecordMessage> {
    return this.toObservable(window.recordApi.startRecord())
  }

  public stopRecord(): Observable<StopRecordMessage> {
    return this.toObservable(window.recordApi.stopRecord())
  }
}

export const recordApiService = new RecordApiService()
