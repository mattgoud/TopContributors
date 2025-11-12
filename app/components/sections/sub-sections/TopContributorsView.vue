<script setup lang="ts">
import { ref } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import type { Contributor } from '@/types'

defineProps<{
  topContributors: Contributor[]
}>()

const headers: PuikTableHeader[] = [
  {
    text: 'Rank',
    value: 'rank',
    size: 'sm',
    align: 'center',
    searchable: false,
  },
  {
    text: 'Avatar',
    value: 'avatar',
    size: 'sm',
    align: 'center',
    searchable: false,
  },
  {
    text: 'Name',
    value: 'name',
    size: 'md',
    align: 'left',
    searchable: true,
  },
  {
    text: 'Contributions',
    value: 'mergedPullRequests',
    size: 'sm',
    align: 'center',
    searchable: false,
  },
  {
    value: 'actions',
    size: 'sm',
    align: 'center',
    preventExpand: true,
    searchSubmit: true,
  },
]
const stickyLastCol = ref(false)
const fullWidth = ref(true)

const modalContributorItem = ref()
const isModalOpen = ref(false)
const openModal = (contributor: any) => {
  modalContributorItem.value = contributor
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <TopCard
    title="🔥 Top contributors"
    description="These experts spent hours improving PrestaShop's quality."
    link-content="View all"
    link-href="#wof-all-contributors"
    :headers="headers"
    :items="topContributors"
    :stickyLastCol="stickyLastCol"
    :full-width="fullWidth"
    @view="openModal"
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

    <template #item-avatar="{ item }">
      <puik-avatar size="large" type="photo" :src="item.avatar_url" />
    </template>

    <template #item-name="{ item }">
      <div class="wof-top-contributors__name">
        <span v-if="item.name" class="puik-body-default">{{ item.name }}</span>
        <span v-else-if="item.login" class="puik-body-default">{{ item.login }}</span>
        <puik-tag v-if="item.company" :content="item.company" variant="blue" />
      </div>
    </template>

    <template #item-actions="{ item }">
      <puik-button
        @click="openModal(item)"
        variant="text"
        force-legacy-text-variant
        right-icon="visibility"
        aria-label="view profile"
      />
    </template>
  </TopCard>

  <TopModal
    v-if="modalContributorItem"
    :contributor="modalContributorItem"
    :isOpen="isModalOpen"
    @close="closeModal"
  />
</template>
