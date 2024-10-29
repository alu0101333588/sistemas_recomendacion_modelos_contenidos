<template>
  <div class="display-results">
    <h1>Display Results</h1>
    <button @click="$emit('resetApp')">Reset</button>
  </div>
</template>

<script>
export default {
  props: {
    documentsFileContent: {
      type: String,
      default: ''
    },
    stopwordsFileContent: {
      type: String,
      default: ''
    },
    substitutionFileContent: {
      type: String,
      default: ''
    }
  },
  watch: {
    documentsFileContent() {
      console.log('Documents file content changed');
      // Call the algorithm
    },
    stopwordsFileContent() {
      console.log('Stopwords file content changed');
      // Call the algorithm
    },
    substitutionFileContent() {
      console.log('Substitution file content changed');
      // Call the algorithm
    }
  },
  methods: {
    executeAlgorithm() {
      console.log('Executing algorithm');
    }
  }
};
</script>