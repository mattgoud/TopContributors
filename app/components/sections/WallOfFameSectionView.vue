<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PuikTableHeader } from '@prestashopcorp/puik-components'
import type { Contributor } from '@/types'

const props = defineProps<{
  contributorsData: Contributor[]
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
    value: 'login',
    size: 'lg',
    align: 'left',
    searchable: true,
  },
  {
    text: 'Contributions',
    value: 'mergedPullRequests',
    size: 'sm',
    align: 'center',
    searchable: true,
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

const page = ref(1)
const itemsPerPage = ref(10)

const modalContributorItem = ref()
const isModalOpen = ref(false)
const openModal = (contributor: any) => {
  modalContributorItem.value = contributor
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false;
}

onMounted (() => {
  page.value = 1
  itemsPerPage.value = 10
})
</script>

<template>
  <section class="wof-section wof-wall-of-fame-section">
    <h2 class="puik-h2">🏆 PrestaShop Project’s Wall of fame</h2>
    <p class="puik-body-default">
      The PrestaShop Wall of Fame: built by the best, committed to the core.
    </p>

    <puik-table
      v-if="contributorsData?.length"
      :headers="headers"
      :search-bar="true"
      :items="contributorsData.slice((page - 1) * itemsPerPage, page * itemsPerPage)"
      :stickyLastCol="stickyLastCol"
      :fullWidth="fullWidth"
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
    </puik-table>

    <puik-pagination
      id="contributors-pagination"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      variant="large"
      :total-item="contributorsData.length"
      @update:page="(event: number) => console.log('Page changed to: ', event)"
      @update:itemsPerPage="(event: number) => console.log('Items per page changed to: ', event)"
    ></puik-pagination>

    <TopModal
      v-if="modalContributorItem"
      :contributor="modalContributorItem"
      :isOpen="isModalOpen"
      @close="closeModal"
    />
  </section>
</template>
