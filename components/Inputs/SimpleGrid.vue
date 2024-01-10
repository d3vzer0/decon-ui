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
      class="text-lg uppercase font-bold text-slate-200"
    >
      {{ title }}
    </h2>
    <div class="simplegrid-container-options pt-5 grid xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-2 gap-4">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="bg-neutral-800 mb-5"
      >
        <div class="card-body -m-2 sm:m-0">
          <div class="font-bold sm:text-2xl text-slate-200 flex justify-between sm:p-0">
            <div>
              <input
                id="{{ option.value }}"
                type="checkbox"
                :checked="isSelected(option.value)"
                class="checkbox sm:checkbox-lg"
                @input="toggleSelection(option.value)"
              >
            </div>
            <div class="capitalize inline-block align-text-top">
              {{ option.value }}
            </div>
            <div>{{ option.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
