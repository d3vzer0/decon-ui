<script setup>
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'

const props = defineProps({
  options: Array, // eslint-disable-line
  title: String, // eslint-disable-line
  search: Boolean
})

const store = useSelectionStore()
const { title } = toRefs(props)

const { optionsSelected } = storeToRefs(store)
const { changeSelected, resetTitle } = store

resetTitle(title.value)
function toggleSelection (input) {
  changeSelected(title.value, input)
}

function isSelected (input) {
  return optionsSelected.value[title.value].includes(input)
}
</script>

<template>
  <div class="simplegrid-container">
    <h2
      v-if="title"
      class="text-lg uppercase font-bold dark:text-slate-200"
    >
      {{ title }}
    </h2>
    <div class="simplegrid-container-options pt-5 grid xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-4">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="card card-normal dark:bg-neutral-800 mb-5"
      >
        <div class="card-body">
          <div class="font-bold text-2xl dark:text-slate-200 flex justify-between">
            <span>
              <input
                id="{{ option.value }}"
                type="checkbox"
                :checked="isSelected(option.value)"
                class="checkbox"
                @input="toggleSelection(option.value)"
              >
            </span>
            <div class="capitalize">
              {{ option.value }}
            </div>
            <div>{{ option.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
