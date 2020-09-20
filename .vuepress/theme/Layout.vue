<template>
  <div class="page-wrapper mb-4">
    <component v-if="page" :is="page" :key="page">test</component>
  </div>
</template>
<script>
export default {
  components: {},
  computed: {
    page() {
      return this.$page.frontmatter.component || null;
    },
  },
};
</script>
<style src="../scss/main.scss" lang="scss"></style>
