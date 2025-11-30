import type {
  StopRecordMessage,
  LoLGameEventMessage,
  LoLGameFlowMessage,
  StartRecordMessage,
  UserSetting
} from '../common/type'

export interface LoLApi {
  fetchGameEvent(): Promise<LoLGameEventMessage>
  fetchGameFlow(): Promise<LoLGameFlowMessage>
}

export interface UserSettingApi {
  get(): Promise<UserSetting>
  update(setting: UserSetting): Promise<void>
}

export interface RecordApi {
  startRecord(): Promise<StartRecordMessage>
  stopRecord(): Promise<StopRecordMessage>
}
