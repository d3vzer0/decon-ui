<script setup>
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

defineProps({
  data: Object // eslint-disable-line
})

const convertOptions = ref(['m365d'])
const convertResult = ref('')
const convertEndpoint = 'https://sigma.optyx.io/api/v1/sigma/convert'

const rawContent = ref('')

const markdown = new MarkdownIt()
function toMarkdown (input) {
  const markdownToHtml = markdown.render(input)
  const cleanHtml = DOMPurify.sanitize(markdownToHtml)
  return cleanHtml
}

function toUpper (input) {
  const newString = input.charAt(0).toUpperCase() + input.slice(1)
  return newString
}

function prettifyJson (input) {
  console.log(input)
  // const jsonObject = JSON.parse(input)
  // return JSON.stringify(jsonObject, null, 2)
}

async function convertSigma (content, target) {
  console.log(1)
  const { data, pending, error, refresh } = await useFetch(convertEndpoint, {
    method: 'POST',
    body: { content: content, target: target },
    onResponse ({ request, response, options }) {
      convertResult.value = response._data.output
    },
    onResponseError({ request, response, options }) {
      convertResult.value = response._data.detail
      console.log(response)
    } 
  })
}

</script>

<template>
  <div class="card card-normal bg-neutral-800 mb-5 text-wrap">
    
    <dialog id="convert_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Converted rule</h3>
        <p class="py-4">{{ convertResult }}</p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <dialog id="content_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Raw content</h3>
        <p class="py-4">{{ prettifyJson(rawContent) }}</p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <div class="card-body">
      <div class="flex justify-between">
        <div>
          <h2 class="font-medium">
            {{ toUpper(data.platform.raw) }} {{ data.kind.raw }}
          </h2>
        </div>
        <div>
          <!-- <summary class="m-1 btn btn-outline btn-secondary btn-xs">
            <a onclick="document.getElementById('content_modal').showModal()"
            @click="rawContent=data.query.raw">view</a>
          </summary> -->
          <div class="dropdown" v-if="data.platform.raw == 'sigma'">
            <div tabindex="0" role="button"  class="m-1 btn btn-outline btn-accent btn-xs">convert</div>
            <ul tabindex="0" class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
              <li v-for="(name, index) in convertOptions" :key="index">
                <a onclick="document.getElementById('convert_modal').showModal()" @click="convertSigma(data.raw_content.raw, name)">{{ name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <h2 class="font-bold text-2xl text-slate-200">
        {{ data.name.raw }}
      </h2>
      <div class="flex text-slate-200">
        <div>{{ data.severity.raw }}</div>
        <div
          v-for="(tactic, index) in data.tactics.raw"
          :key="index"
          class="pl-3"
        >
          {{ tactic }}
        </div>
      </div>
      <p class=" text-slate-200" v-if="data.logsource">Log sources: <span v-for="(name, index) in data.logsource.raw"> {{  name }}</span></p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="text-clip overflow-hidden" v-html="toMarkdown(data.description.raw)" />
      <p class="truncate">
        <a
          :href="data.source.raw"
          target="_blank"
        >{{ data.source.raw }}</a>
      </p>
    </div>
  </div>
</template>
