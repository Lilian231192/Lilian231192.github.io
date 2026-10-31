// @env browser
let initialized = false

/**
 * Full-screen plate index. Native <dialog> gives focus trapping and Escape
 * handling; closing restores focus to the button that opened it.
 */
export function initIndexDialog(): void {
  if (initialized)
    return
  initialized = true

  const dialog = document.getElementById('indexDialog') as HTMLDialogElement | null
  if (!dialog)
    return

  let lastTrigger: HTMLElement | null = null

  const open = (trigger: HTMLElement) => {
    if (dialog.open)
      return
    lastTrigger = trigger
    dialog.showModal()
    document.documentElement.classList.add('index-open')
  }

  const close = () => {
    if (!dialog.open)
      return
    dialog.close()
  }

  for (const trigger of document.querySelectorAll<HTMLElement>('[data-index-open]')) {
    trigger.addEventListener('click', () => open(trigger))
  }

  for (const closer of document.querySelectorAll<HTMLElement>('[data-index-close]')) {
    closer.addEventListener('click', close)
  }

  for (const link of dialog.querySelectorAll<HTMLElement>('[data-index-link]')) {
    link.addEventListener('click', close)
  }

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog)
      close()
  })

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('index-open')
    lastTrigger?.focus({ preventScroll: true })
  })
}
