import { defineStore } from 'pinia'

export const useSigmaStore = defineStore('sigma', () => {

  const targetList = ref(['m365d', 'splunk', 'lucene']) // eslint-disable-line

  function changeTargets (targets) {
    targetList = targets
  }

  return { targetList, changeTargets }
})
