<!-- App.vue -->
<!--
This is the main component that handles the file upload and the algorithm execution. 
 It also does the function of bridging the FileReader and DisplayResults components. 
 -->

<template>
  <div class="content-container">
    <!-- Section for the file readers -->
    <div class="file-readers">
      <h1>Sistemas de recomendación basados en el contenido</h1>
      <FileReader fileType="documents" fileReaderTitle="Introduce el fichero con los documentos" @documentsLoad="documentLoadHandler" />
      <FileReader fileType="stopwords" fileReaderTitle="Introduce el fichero con las stopwords" @stopwordsLoad="stopwordsLoadHandler" />
      <FileReader fileType="substitution" fileReaderTitle="Introduce el fichero con las sustituciones para la lematización" @substitutionLoad="substitutionLoadHandler" />
      <!-- Button to execute the algorithm and call the DisplayResults component. Needs to get all the files first. -->
      <button @click="executeAlgorithm">Execute algorithm</button>
      <p v-if="filesFlag">Upload all files before executing the algorithm!</p>
    </div>
    <!-- Section for the results. When it's mounted in the DOM, a change in the files content will trigger the algorithm. -->
    <div v-if="showResults && documentsFileContent && stopwordsFileContent && substitutionFileContent">
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
      filesFlag: false,
      documentsFileContent: '',
      stopwordsFileContent: '',
      substitutionFileContent: ''
    };
  },
  methods: {
    documentLoadHandler(content) {
      this.documentsFileContent = content;
      console.log("[LOAD]: Received event Documents file content: ", content);
    },
    stopwordsLoadHandler(content) {
      this.stopwordsFileContent = content;
      console.log("[LOAD]: Received event Stopwords file content: ", content);
    },
    substitutionLoadHandler(content) {
      this.substitutionFileContent = content;
      console.log("[LOAD]: Received event Substitution file content: ", content);
    },
    executeAlgorithm() {
      if (!this.documentsFileContent || !this.stopwordsFileContent || !this.substitutionFileContent) {
        console.error("[ERROR]: All files must be uploaded before executing the algorithm");
        this.filesFlag = true;
        return;
      }
      this.showResults = true;
      this.filesFlag = false;
      console.log("[EXE]: Execute algorithm with the following files content: ");
      console.log("[EXE]: Documents file content: ", this.documentsFileContent);
      console.log("[EXE]: Stopwords file content: ", this.stopwordsFileContent);
      console.log("[EXE]: Substitution words file content: ", this.substitutionFileContent);
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