<script setup>
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

defineProps({
  data: Object // eslint-disable-line
})

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
</script>

<template>
  <div class="card card-normal bg-neutral-800 mb-5 text-wrap">
    <div class="card-body">
      <h2 class="font-medium">
        {{ toUpper(data.platform.raw) }} {{ data.kind.raw }}
      </h2>
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
