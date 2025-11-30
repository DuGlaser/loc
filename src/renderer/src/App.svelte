<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { recordService } from './services/RecordService'

  import UserSettingModal from './components/UserSettingModal.svelte'
  import { userSettingService } from './services/UserSettingService'

  let setting$ = $state(userSettingService.get())
  onMount(() => {
    recordService.startAutoRecord()
  })

  onDestroy(() => {
    recordService.stopAutoRecord()
  })

  let showSetting = $state(false)

  const openSetting = () => (showSetting = true)
  const closeSetting = () => {
    showSetting = false
    setting$ = userSettingService.get()
  }
</script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
  <header class="flex items-center justify-between px-6 py-4 border-b border-slate-800">
    <div class="flex items-center gap-2">
      <div
        class="h-8 w-8 rounded-xl bg-emerald-500/90 flex items-center justify-center text-slate-950"
      >
        🎮
      </div>
      <div>
        <div class="text-sm font-semibold">LoL Recorder</div>
        <div class="text-xs text-slate-400">自動録画コントローラー</div>
      </div>
    </div>

    <button
      type="button"
      class="px-3 py-1.5 text-sm rounded-md border border-slate-700 hover:bg-slate-800/80"
      onclick={openSetting}
    >
      設定
    </button>
  </header>

  {#await setting$ then setting}
    <main class="flex-1 px-6 py-4 text-sm space-y-2">
      <div class="text-slate-300">現在の設定:</div>
      {JSON.stringify(setting)}
    </main>
  {/await}

  {#if showSetting}
    {#await setting$ then value}
      <UserSettingModal
        initial={value}
        onSave={(value) => userSettingService.update(value)}
        onClose={closeSetting}
      />
    {/await}
  {/if}
</div>
