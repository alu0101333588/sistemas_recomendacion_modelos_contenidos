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
      <FileReader fileType="documents" fileReaderTitle="Introduce el fichero con los documentos" @documentsLoad="documentLoadHandler" :fileResetFlag="fileResetFlag" />
      <FileReader fileType="stopwords" fileReaderTitle="Introduce el fichero con las stopwords" @stopwordsLoad="stopwordsLoadHandler"  :fileResetFlag="fileResetFlag" />
      <FileReader fileType="substitution" fileReaderTitle="Introduce el fichero con las sustituciones para la lematización" @substitutionLoad="substitutionLoadHandler" :fileResetFlag="fileResetFlag" />
      <!-- Button to execute the algorithm and call the DisplayResults component. Needs to get all the files first. -->
      <button @click="validateDocuments">Execute Algorithm</button>
      <p v-if="missingFilesFlag">Upload all files before executing the algorithm!</p>
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
      missingFilesFlag: false,
      documentsFileContent: '',
      stopwordsFileContent: '',
      substitutionFileContent: '',
      fileResetFlag: false, // Flag to reset the FileReader so the user can upload the same file again.
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
    validateDocuments() {
      if (!this.documentsFileContent || !this.stopwordsFileContent || !this.substitutionFileContent) {
        console.error("[ERROR]: All files must be uploaded before executing the algorithm");
        // console.log("[EXE]: Execute algorithm with the following files content: ");
        // console.log("[EXE]: Documents file content: ", this.documentsFileContent);
        // console.log("[EXE]: Stopwords file content: ", this.stopwordsFileContent);
        // console.log("[EXE]: Substitution words file content: ", this.substitutionFileContent);
        this.missingFilesFlag = true;
        return;
      }
      this.showResults = true;
      this.missingFilesFlag = false;
      // console.log("[EXE]: Execute algorithm with the following files content: ");
      // console.log("[EXE]: Documents file content: ", this.documentsFileContent);
      // console.log("[EXE]: Stopwords file content: ", this.stopwordsFileContent);
      // console.log("[EXE]: Substitution words file content: ", this.substitutionFileContent);
    },
    resetHandler() {
      console.log("Launching reset handler");
      this.showResults = false;
      this.documentsFileContent = '';
      this.stopwordsFileContent = '';
      this.substitutionFileContent = '';
      this.fileResetFlag = !this.fileResetFlag; // Change the flag to reset the FileReader components so
                                                // the watcher in the FileReader component can reset the input value.
    }
  }
}
</script>

<style src="@/styles/style.css"></style>