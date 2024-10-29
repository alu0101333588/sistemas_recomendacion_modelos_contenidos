<template>
  <div class="content-container">
    <div class="file-readers">
      <h1>Sistemas de recomendación basados en el contenido</h1>
      <FileReader fileType="documents" fileReaderTitle="Introduce el fichero con los documentos" @documentsLoad="documentLoadHandler" />
      <FileReader fileType="stopwords" fileReaderTitle="Introduce el fichero con las stopwords" @stopwordsLoad="stopwordsLoadHandler" />
      <FileReader fileType="substitution" fileReaderTitle="Introduce el fichero con las sustituciones para la lematización" @substitutionLoad="substitutionLoadHandler" />
      <button @click="executeAlgorithm">Execute algorithm</button>
    </div>
    <div v-if="showResults">
      <p>Content of file documents: {{ documentsFileContent }}</p>
      <p>Content of file stopwords: {{ stopwordsFileContent }}</p>
      <p>Content of file substitution: {{ substitutionFileContent }}</p>
      <DisplayResults :documentsFileContent="documentsFileContent" :stopwordsFileContent="stopwordsFileContent" :substitutionFileContent="substitutionFileContent" @resetApp="resetHandler" />
    </div>
  </div>
</template>

<script>
import FileReader from './components/FileReader.vue';
import DisplayResults from './components/DisplayResults.vue';

export default {
  name: 'App',
  components: {
    FileReader,
    DisplayResults
  },
  data() {
    return {
      showResults: false,
      documentsFileContent: '',
      stopwordsFileContent: '',
      substitutionFileContent: ''
    };
  },
  methods: {
    documentLoadHandler(content) {
      this.documentsFileContent = content;
      console.log("Received event Documents file content: ", content);
    },
    stopwordsLoadHandler(content) {
      this.stopwordsFileContent = content;
      console.log("Received event Stopwords file content: ", content);
    },
    substitutionLoadHandler(content) {
      this.substitutionFileContent = content;
      console.log("Received event Substitution file content: ", content);
    },
    executeAlgorithm() {
      this.showResults = true;
      console.log("Execute algorithm with the following files content: ");
      console.log("Documents file content: ", this.documentsFileContent);
      console.log("Stopwords file content: ", this.stopwordsFileContent);
      console.log("Substitution words file content: ", this.substitutionFileContent);
    },
    resetHandler() {
      this.showResults = false;
      this.documentsFileContent = '';
      this.stopwordsFileContent = '';
      this.substitutionFileContent = '';
    }
  }
}
</script>

<style src="@/styles/style.css"></style>