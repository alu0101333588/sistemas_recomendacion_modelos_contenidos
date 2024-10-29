<!-- DisplayResults.vue -->
<!-- This component handles the  -->

<template>
  <div class="display-results">
    <h1>Display Results</h1>
    <p>Content of file documents: {{ documentsFileContent }}</p>
    <p>Content of file stopwords: {{ stopwordsFileContent }}</p>
    <p>Content of file substitution: {{ substitutionFileContent }}</p>
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
  // Watch for changes in the files content, they will trigger the algorithm. This happens when
  // the user uploads a new file. Triggers once this component is mounted, and there are mechanisms
  // to force all files to be uploaded at least once before the component is mounted.
  watch: {
    documentsFileContent() {
      console.log('[CHANGE]: Documents file content changed');
      // Call the algorithm
      this.executeAlgorithm
    },
    stopwordsFileContent() {
      console.log('[CHANGE]: Stopwords file content changed');
      // Call the algorithm
      this.executeAlgorithm();
    },
    substitutionFileContent() {
      console.log('[CHANGE]: Substitution file content changed');
      // Call the algorithm
      this.executeAlgorithm();
    }
  },
  methods: {
    executeAlgorithm() {
      console.log('Executing algorithm');
      // Step 1 (function ...): ...
      // Step 2 (function ...): ...
      // Step 3 (function ...): ...
    }
  }
};
</script>