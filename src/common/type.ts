export type ServiceMessage<T = unknown> =
  | {
      data: T
      error: undefined
    }
  | ServiceError

export type ErrorMessage = {
  type: string
  message?: string
}

export type ServiceError = {
  data: undefined
  error: ErrorMessage
}

export type LoLGameFlowStatus =
  | 'Lobby'
  | 'Ready'
  | 'Matchmaking'
  | 'ReadyCheck'
  | 'ChampSelect'
  | 'InProgress'
  | 'WaitingForStats'
  | 'PreEndOfGame'
  | 'EndOfGame'
  | 'None'

export type LoLGameFlowMessage = ServiceMessage<LoLGameFlowStatus>

export type LoLGameEvent = {}

export type LoLGameEventMessage = ServiceMessage<LoLGameEvent>

export type StartRecord = {
  startAt: number
}

export type StartRecordMessage = ServiceMessage<StartRecord>

export type StopRecord = {
  filePath: string
  endAt: number
}

export type StopRecordMessage = ServiceMessage<StopRecord>

export type UserSetting = {
  obs: {
    obsStudioDirectoryPath?: string
    port: number
    password?: string
  }
  lol: {
    lolDirectoryPath?: string
  }
}
