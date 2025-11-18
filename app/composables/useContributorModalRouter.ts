import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'
import type { Contributor, Company } from '@/types'

export function useContributorModalRouter(contributors: Contributor[] | Ref<Contributor[]>) {
  const isModalOpen = ref(false)
  const currentContributor = ref<Contributor | null>(null)

  const getContributors = () => (Array.isArray(contributors) ? contributors : contributors.value)

  const parseHash = (): string | null => {
    const hash = window.location.hash.replace('#', '').trim()
    return hash.length > 0 ? hash : null
  }

  const openModal = (item: Contributor | Company) => {
    const contributor = item as Contributor
    if (!contributor?.login) {
      console.warn('[useContributorModalRouter] openModal called with non-contributor:', item)
      return
    }
    currentContributor.value = contributor
    isModalOpen.value = true
    navigateTo(contributor.login)
  }

  const closeModal = () => {
    isModalOpen.value = false
    currentContributor.value = null
    history.replaceState(null, '', window.location.pathname)
  }

  const navigateTo = (login: string) => {
    if (window.location.hash !== `#${login}`) {
      history.pushState(null, '', `#${login}`)
    }
  }

  const copyProfileLink = async (contributor: Contributor) => {
    const url = `${window.location.origin}${window.location.pathname}#${contributor.login}`

    try {
      await navigator.clipboard.writeText(url)
    } catch (e) {
      console.info('Clipboard API not supported, falling back to execCommand.', e)
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }

  const tryOpenFromHash = () => {
    const login = parseHash()
    if (!login) return

    const list = getContributors()
    const found = list.find((c) => c.login === login)
    if (found) {
      currentContributor.value = found
      isModalOpen.value = true
    }
  }

  const onHashChange = () => {
    tryOpenFromHash()
  }

  onMounted(() => {
    tryOpenFromHash()
    window.addEventListener('hashchange', onHashChange)
  })

  onUnmounted(() => {
    window.removeEventListener('hashchange', onHashChange)
  })

  watch(
    () => (Array.isArray(contributors) ? contributors : contributors.value),
    () => {
      if (!currentContributor.value) tryOpenFromHash()
    }
  )

  return {
    currentContributor,
    isModalOpen,
    openModal,
    closeModal,
    navigateTo,
    copyProfileLink
  }
}
