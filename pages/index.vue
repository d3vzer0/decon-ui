<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="flex shrink">
        <div class="min-w-96">
          <div>
            <input
              v-model="searchInput"
              type="text"
              placeholder="Search here"
              class="input input-bordered w-full max-w-full"
              @keyup.enter="searchRequest.query=searchInput"
            >
            <ul
              v-if="suggestionResults.length > 0"
              tabindex="0"
              class="menu menu-compact dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box max-h-40 flex-nowrap overflow-auto"
            >
              <li
                v-for="(suggestion, index) in suggestionResults"
                :key="index"
              >
                <a @click="confirmSuggestion(suggestion)">{{ suggestion }}</a>
              </li>
            </ul>
          </div>
          <div class="mt-5">
            <InputsSimpleGrid
              :options="platformFacet"
              title="platform"
              :search="false"
            />
          </div>
          <div>
            <div class="flex justify-between">
              <div class="justify-start">
                <div class="text-lg uppercase font-bold text-slate-200 pb-5">
                  {{ pageDetails.total_results }} Results
                </div>
              </div>
              <div>
                <div class="join">
                  <button
                    v-if="searchRequest.page.current>1"
                    class="join-item btn btn-sm"
                    @click="searchRequest.page.current=pageDetails.current-1"
                  >
                    «
                  </button>
                  <button
                    v-if="searchRequest.page.current>1"
                    class="join-item btn btn-sm"
                    @click="searchRequest.page.current=1"
                  >
                    1
                  </button>
                  <button class="join-item btn btn-disabled btn-sm">
                    {{ pageDetails.current }}
                  </button>
                  <button
                    class="join-item btn btn-sm"
                    @click="searchRequest.page.current=pageDetails.total_pages"
                  >
                    {{ pageDetails.total_pages }}
                  </button>
                  <button
                    class="join-item btn btn-sm"
                    @click="searchRequest.page.current=pageDetails.current+1"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ResultsCardView
              v-for="(value, index) in results"
              :key="index"
              :data="value"
            />
          </div>
        </div>
      </div>
    </div> 
    <div class="drawer-side pa-5">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="min-w-72 max-w-96 bg-base-100 pr-10">
          <div
            v-for="(value, key) in facets"
            :key="key"
          >
            <div class="form-control pb-10">
              <InputsCheckbox
                :options="value"
                :title="key"
                :search="false"
              />
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSelectionStore } from '@/stores/selection'
import { storeToRefs } from 'pinia'

// Initialise (global) stores
const store = useSelectionStore()
const { optionsSelected } = storeToRefs(store)

// Initialise refs
const facets = reactive({})
const results = reactive([])
const platformFacet = reactive([])
const pageDetails = reactive({
  current: 1,
  total_pages: 1,
  total_results: 1
})

// Generic Query config
// Yes the searchKey should be public and is not a secret :)
const searchKey = 'Bearer search-atob8dbfbgrneiqcwvbsosb1'
const searchEndpoint = 'https://search.optyx.io/api/as/v1/engines/decon/search.json'

// Need to tidy up and make an abstraction the initial searchRequest
const searchRequest = reactive({
  query: '',
  facets: {
    kind: { type: 'value', size: 10 },
    platform: { type: 'value', size: 10 },
    severity: { type: 'value', size: 10 },
    tactics: { type: 'value', size: 10 },
    techniques: { type: 'value', size: 10 },
    logsource: { type: 'value', size: 10 }
  },
  result_fields: {
    name: { raw: {}, snippet: { fallback: true } },
    description: { raw: {}, snippet: { fallback: true } },
    severity: { raw: {}, snippet: { fallback: true } },
    kind: { raw: {}, snippet: { fallback: true } },
    platform: { raw: {}, snippet: { fallback: true } },
    source: { raw: {}, snippet: { size: 100, fallback: true } },
    tactics: { raw: {}, snippet: { fallback: true } },
    techniques: { raw: {}, snippet: { fallback: true } },
    logsource: { raw: {}, snippet: { fallback: true } }
  },
  search_fields: {
    name: { weight: 5 },
    description: {}
  },
  filters: {
    all: [
    ]
  },
  page: { size: 20, current: 1 }
})

// Search input and suggestions config
const searchInput = ref()
const suggestionEndpoint = 'https://search.optyx.io/api/as/v1/engines/decon/query_suggestion'
const suggestionResults = reactive([])

// Get initial suggestions/results on page load
await getSuggestions('')
await getResults()

// When search input changes, provide new suggestions
watch(searchInput, async (newSearch, oldSearch) => {
  await getSuggestions(newSearch)
})

watch(optionsSelected, async (oldOptions, newOptions) => {
  const allFilters = []
  for (const [filterKey, filterValues] of Object.entries(optionsSelected.value)) {
    if (filterValues.length > 0) {
      const newFilters = []
      for (const value of filterValues.values()) {
        newFilters.push({ [filterKey]: value })
      }
      allFilters.push({ all: newFilters })
    }
    searchRequest.filters.all = allFilters
  }
}, { deep: true }
)

// When suggestion has been selected, query for new results
function confirmSuggestion (suggestion) {
  searchInput.value = suggestion
  suggestionResults.splice(0)
  searchRequest.query = suggestion
}

// Function to get new suggestions based on search input
async function getSuggestions (suggestion) {
  const { suggestionData, suggestionPending, suggestionError, suggestionRefresh } = await useFetch(suggestionEndpoint, {
    method: 'POST',
    headers: {
      Authorization: searchKey
    },
    body: { query: suggestion },
    onResponse ({ request, response, options }) {
      suggestionResults.splice(0)
      response._data.results.documents.forEach((value) => {
        suggestionResults.push(value.suggestion)
      })
    }
  })
}

// Function to get get all results based on filters + search suggestions
async function getResults () {
  const { data, pending, error, refresh } = await useFetch(searchEndpoint, {
    method: 'POST',
    headers: {
      Authorization: searchKey
    },
    body: searchRequest,
    onResponse ({ request, response, options }) {
      pageDetails.current = response._data.meta.page.current
      pageDetails.total_results = response._data.meta.page.total_results

      const totalPages = response._data.meta.page.total_pages
      // There is an API limit of requesting up to page 100 for Elastic
      if (totalPages > 100) {
        pageDetails.total_pages = 100
      } else {
        pageDetails.total_pages = totalPages
      }

      platformFacet.splice(0)
      for (const [key, value] of Object.entries(response._data.facets)) {
        // Static filter for now
        if (key === 'platform') {
          value[0].data.forEach((value) => {
            platformFacet.push(value)
          })
        } else {
          facets[key] = value[0].data
        }
      }

      results.splice(0)
      response._data.results.forEach((value) => {
        results.push(value)
      })
    }
  })
}

</script>
