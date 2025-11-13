<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { PuikTableHeader, searchOption, sortOption } from '@prestashopcorp/puik-components'
import type { Company, Contributor } from '@/types'

const props = defineProps<{
  contributorsData: Contributor[]
  companiesData: Company[]
}>()

// TABLE CONFIG
const headers: PuikTableHeader[] = [
  { text: 'Rank', value: 'rank', size: 'sm', align: 'center', searchable: true, searchType: 'range', sortable: true },
  { text: 'Name', value: 'name', size: 'lg', align: 'left', searchable: true, sortable: true },
  { text: 'Contributions', value: 'mergedPullRequests', size: 'sm', align: 'center', searchable: true, searchType: 'range', sortable: true },
  { value: 'actions', size: 'sm', align: 'center', preventExpand: true, searchSubmit: true },
]

const stickyLastCol = ref(false)
const fullWidth = ref(true)

// DATA & UI STATE
const contributorsRef = ref<Contributor[]>([...props.contributorsData])
const page = ref(1)
const itemsPerPage = ref(5)

const paginatedItems = computed(() =>
  contributorsRef.value.slice((page.value - 1) * itemsPerPage.value, page.value * itemsPerPage.value)
)

const modalContributorItem = ref()
const isModalOpen = ref(false)
const openModal = (contributor: Contributor) => { modalContributorItem.value = contributor; isModalOpen.value = true }
const closeModal = () => { isModalOpen.value = false }

// SEARCH
const handleSearchSubmit = (payload: searchOption[]) => {
  let filtered = [...props.contributorsData]

  payload.forEach(({ searchBy, inputText, inputRange }) => {
    if (inputText) {
      const search = inputText.toLowerCase().trim().replace(/\s+/g, ' ')
      filtered = filtered.filter((c) => {
        const haystack =
          searchBy === 'name'
            ? `${c.name ?? ''} ${c.login ?? ''}`.toLowerCase()
            : String(c[searchBy as keyof Contributor]).toLowerCase()
        return haystack.includes(search)
      })
    }

    if (inputRange) {
      filtered = filtered.filter((c) => {
        const value = c[searchBy as keyof Contributor] as number
        if (typeof inputRange.min === 'number' && value < inputRange.min) return false
        if (typeof inputRange.max === 'number' && value > inputRange.max) return false
        return true
      })
    }
  })

  contributorsRef.value = payload.length ? filtered : [...props.contributorsData]
  page.value = 1
}

// SORT (name fallback login)
const handleSort = (payload: sortOption) => {
  const { sortBy, sortOrder } = payload

  contributorsRef.value = [...contributorsRef.value].sort((a, b) => {
    const valA =
      sortBy === 'name'
        ? (a.name || a.login || '').toLowerCase()
        : a[sortBy as keyof Contributor]
    const valB =
      sortBy === 'name'
        ? (b.name || b.login || '').toLowerCase()
        : b[sortBy as keyof Contributor]

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'ASC' ? valA - valB : valB - valA
    }
    return sortOrder === 'ASC'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA))
  })

  page.value = 1
}

watch(
  () => props.contributorsData,
  (newVal) => {
    if (newVal) contributorsRef.value = [...newVal]
  },
  { immediate: true }
)
</script>

<template>
  <section id="wof-all-contributors" class="wof-section wof-wall-of-fame-section">
    <h2 class="puik-h2">🏆 PrestaShop Project’s Wall of fame</h2>
    <p class="puik-body-default">
      The PrestaShop Wall of Fame: built by the best, committed to the core.
    </p>

    <puik-table
      :headers="headers"
      :search-bar="true"
      :items="paginatedItems"
      :sticky-last-col="stickyLastCol"
      :full-width="fullWidth"
      :search-from-server="true"
      :sort-from-server="true"
      @search-submit="handleSearchSubmit"
      @sort-column="handleSort"
    >
      <template #item-rank="{ item }">
        <div
          :class="[
            'wof-top-section__rank',
            { 'wof-top-section__rank--first': item.rank === 1 },
            { 'wof-top-section__rank--second': item.rank === 2 },
            { 'wof-top-section__rank--third': item.rank === 3 }
          ]"
        >
          <span class="puik-body-default-bold">{{ item.rank }}</span>
        </div>
      </template>

      <template #item-name="{ item }">
        <div class="wof-contributors__login__container">
          <puik-avatar size="large" type="photo" :src="item.avatar_url" />
          <div class="wof-top-contributors__name">
            <span class="puik-body-default">{{ item.name || item.login }}</span>
            <span v-if="item.name" class="puik-body-small-bold">({{ item.login }})</span>
            <puik-tag v-if="item.company" :content="item.company" variant="blue" />
          </div>
        </div>
      </template>

      <template #item-actions="{ item }">
        <puik-button
          variant="text"
          force-legacy-text-variant
          right-icon="visibility"
          aria-label="view profile"
          @click="openModal(item)"
        />
      </template>
    </puik-table>

    <div v-if="contributorsRef.length === 0" class="wof-no-results">
       No contributors found with your search.
    </div>

    <puik-pagination
      id="wof-contributors-pagination"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      variant="large"
      :total-item="contributorsRef.length"
    />

    <TopModal
      v-if="modalContributorItem"
      :contributor="modalContributorItem"
      :is-open="isModalOpen"
      @close="closeModal"
    />
  </section>
</template>

<style>
#wof-contributors-pagination {
  align-self: center;
}
.wof-no-results {
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  color: var(--color-primary);
  background-color: var(--color-blue-50);
  border: 1px solid var(--color-blue);
}
.wof-contributors__login__container {
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 66px;
}
</style>
