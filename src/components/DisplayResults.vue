<!-- DisplayResults.vue -->
<!-- This component handles the  -->

<template>
  <div class="display-results">
    <h1>Display Results</h1>
    <button @click="$emit('resetApp')">Reset</button>
  </div>
</template>

<script>
import { separateDocuments } from '@/functions/formatDocument';
import { stopWords } from '@/functions/formatDocument';
import { formatDocument } from '@/functions/formatDocument';
import { lemmatize } from '@/functions/formatDocument';
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
  mounted() {
    // console.log('DisplayResults mounted');
    // Call the algorithm
    this.executeAlgorithm();
  },
  // Watch for changes in the files content, they will trigger the algorithm. This happens when
  // the user uploads a new file. Triggers once this component is mounted, and there are mechanisms
  // to force all files to be uploaded at least once before the component is mounted.
  watch: {
    documentsFileContent() {
      // console.log('[CHANGE]: Documents file content changed');
      // Call the algorithm
      this.executeAlgorithm
    },
    stopwordsFileContent() {
      // console.log('[CHANGE]: Stopwords file content changed');
      // Call the algorithm
      this.executeAlgorithm();
    },
    substitutionFileContent() {
      // console.log('[CHANGE]: Substitution file content changed');
      // Call the algorithm
      this.executeAlgorithm();
    }
  },
  methods: {
    executeAlgorithm() {
      console.log('Executing algorithm');
      // Step 0 (build list of documents): ...
      this.documentsLists = this.separateDocuments(this.documentsFileContent);
      console.log('Documents list: ', this.documentsLists);
      // Step 1 (upper to lower, remove punctuation, numbers and whitespaces): ...
      this.documentsLists = this.formatDocument(this.documentsLists);
      console.log('Documents list after format: ', this.documentsLists);
      // Step 2 (apply stop words changes): ...
      this.documentsLists = this.stopWords(this.documentsLists, this.stopwordsFileContent);
      console.log('Documents list after stop words: ', this.documentsLists);
      // Step 3 (apply the lemmatization ...): ...
      this.documentsLists = this.lemmatize(this.documentsLists, this.substitutionFileContent);
      console.log('Documents list after lemmatization: ', this.documentsLists);
    },
    stopWords,
    formatDocument,
    lemmatize,
    separateDocuments
  }
};
</script>