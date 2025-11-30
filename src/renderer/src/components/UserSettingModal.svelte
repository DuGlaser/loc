<script lang="ts">
  import type { UserSetting } from '../../../common/type'

  const { initial, onSave, onClose } = $props<{
    initial: UserSetting
    onSave: (value: UserSetting) => void
    onClose: () => void
  }>()

  let form: UserSetting = structuredClone(initial)

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  function handleBackdropKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  function handleSave() {
    onSave(form)
  }
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
  role="presentation"
  tabindex="-1"
  onclick={handleBackdropClick}
  onkeydown={handleBackdropKeydown}
>
  <div
    role="dialog"
    aria-modal="true"
    aria-label="アプリ設定"
    class="w-full max-w-md mx-4 rounded-xl bg-slate-900 shadow-2xl"
  >
    <header class="flex items-center justify-between px-5 py-3 border-b border-slate-700">
      <h2 class="text-base font-semibold text-slate-100">設定</h2>
      <button
        type="button"
        class="h-7 w-7 flex items-center justify-center rounded-full text-slate-300 hover:bg-slate-800"
        onclick={onClose}
        aria-label="閉じる"
      >
        ✕
      </button>
    </header>

    <div class="px-5 py-4 space-y-6 text-sm text-slate-200">
      <div class="space-y-3">
        <div class="font-semibold text-slate-100">OBS 設定</div>
        <div class="space-y-1">
          <div class="block text-xs text-slate-400">OBS Studio のインストールパス</div>
          <input
            type="text"
            placeholder="例: C:\Program Files\obs-studio"
            class="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            bind:value={form.obs.obsStudioDirectoryPath}
          />
        </div>
        <div class="space-y-1">
          <div class="block text-xs text-slate-400">WebSocket ポート</div>
          <input
            min="1"
            class="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            bind:value={form.obs.port}
          />
        </div>

        <div class="space-y-1">
          <div class="block text-xs text-slate-400">WebSocket パスワード</div>
          <input
            type="password"
            class="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            bind:value={form.obs.password}
          />
        </div>
      </div>

      <div class="space-y-3">
        <div class="font-semibold text-slate-100">LoL 設定</div>
        <div class="space-y-1">
          <div class="block text-xs text-slate-400">League of Legends のインストールパス</div>
          <input
            type="text"
            placeholder="例: C:\Riot Games\League of Legends"
            class="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            bind:value={form.lol.lolDirectoryPath}
          />
        </div>
      </div>
    </div>

    <footer class="flex justify-end gap-2 px-5 py-3 border-t border-slate-700 bg-slate-950/70">
      <button
        type="button"
        class="rounded-md border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
        onclick={onClose}
      >
        キャンセル
      </button>
      <button
        type="button"
        class="rounded-md bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-400"
        onclick={handleSave}
      >
        保存
      </button>
    </footer>
  </div>
</div>
