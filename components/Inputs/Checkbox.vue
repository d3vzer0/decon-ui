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
const { searchInput, optionsSelected } = storeToRefs(store)
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
  <div class="checkbox-container">
    <h2
      v-if="title"
      class="text-lg uppercase font-bold text-slate-200"
    >
      {{ title }}
    </h2>
    <div
      v-if="search"
      class="pt-2 checkbox-container-search"
    >
      <input
        v-model="searchInput"
        type="text"
        placeholder="Search"
        class="input input-bordered input-success w-full max-w-xs"
      >
    </div>
    <div class="checkbox-container-options pt-5">
      <ul>
        <li
          v-for="(option, index) in options"
          v-show="option.value.includes(searchInput)"
          :key="index"
          class="pb-4"
        >
          <span>
            <span>
              <input
                id="{{ option.value }}"
                type="checkbox"
                :checked="isSelected(option.value)"
                class="checkbox"
                @input="toggleSelection(option.value)"
              >
            </span>
            <span class="px-5 align-top capitalize">{{ option.value }}</span>
            <span class="align-top float-right">{{ option.count }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
