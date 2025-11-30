import { lolApiService, type LoLApiService } from './LoLApiService'
import { hasServiceError } from '../../../common'
import { recordApiService, type RecordApiService } from './RecordApiService'
import { BehaviorSubject, type Subscription } from 'rxjs'
import type { LoLGameFlowStatus } from '../../../common/type'

const RECORDING_STATUS = {
  NOT_RECORDING: 'NOT_RECORDING',
  PREPARE_START: 'PREPARE_START',
  RECORDING: 'RECORDING',
  PREPARE_STOP: 'PREPARE_STOP'
} as const

type RecordingStatus = keyof typeof RECORDING_STATUS

class RecordService {
  #lolApiService: LoLApiService
  #recordApiService: RecordApiService

  #autoRecordSub: Subscription | null = null
  recordingStatus$ = new BehaviorSubject<RecordingStatus>(RECORDING_STATUS.NOT_RECORDING)

  constructor(lolApiService: LoLApiService, recordApiService: RecordApiService) {
    this.#lolApiService = lolApiService
    this.#recordApiService = recordApiService
  }

  public startAutoRecord() {
    this.#autoRecordSub = this.#lolApiService.gameFlow$.subscribe((value) => {
      if (hasServiceError(value)) return

      const recordingStatus = this.recordingStatus$.value

      const startRecordStatus: LoLGameFlowStatus[] = ['InProgress']
      const stopRecordStatus: LoLGameFlowStatus[] = ['EndOfGame', 'PreEndOfGame', 'None', 'Lobby']

      if (startRecordStatus.includes(value.data)) {
        if (recordingStatus !== RECORDING_STATUS.NOT_RECORDING) return

        this.recordingStatus$.next(RECORDING_STATUS.PREPARE_START)
        this.#recordApiService.startRecord().subscribe(() => {
          this.recordingStatus$.next(RECORDING_STATUS.RECORDING)
        })
        return
      }

      if (stopRecordStatus.includes(value.data)) {
        if (recordingStatus === RECORDING_STATUS.NOT_RECORDING) return
        this.recordingStatus$.next(RECORDING_STATUS.PREPARE_STOP)
        this.#recordApiService.stopRecord().subscribe(() => {
          this.recordingStatus$.next(RECORDING_STATUS.NOT_RECORDING)
        })
        return
      }
    })
  }

  public stopAutoRecord() {
    if (this.#autoRecordSub) {
      this.#autoRecordSub.unsubscribe()
      this.#autoRecordSub = null
    }
  }
}

export const recordService = new RecordService(lolApiService, recordApiService)
