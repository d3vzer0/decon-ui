import { defineStore } from 'pinia'

export const useSelectionStore = defineStore('selection', () => {
  const searchInput = ref('') // eslint-disable-line
  const optionsSelected = reactive({}) // eslint-disable-line

  function resetTitle (title) {
    optionsSelected[title] = []
  }

  function changeSelected (title, input) {
    if (optionsSelected[title].includes(input)) {
      const loc = optionsSelected[title].indexOf(input)
      optionsSelected[title].splice(loc, 1)
    } else {
      optionsSelected[title].push(input)
    }
  }

  return { searchInput, optionsSelected, changeSelected, resetTitle }
})
