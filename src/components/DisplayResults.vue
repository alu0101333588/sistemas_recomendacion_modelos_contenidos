<!-- DisplayResults.vue -->
<!-- This component handles the  -->

<template>
  <div class="display-results">
    <h1>Display Results</h1>
    <button @click="$emit('resetApp')">Reset</button>
    <button @click="executeAlgorithm">Realizar calculos</button>
    <button @click="printResults">Imprimir resultados</button>
    <!-- <DisplayMatrix v-if="displayMatrixFlag" :dataMatrix="dataMatrix" :documentTermMatrix="documentTermMatrix" :dfMatrix="dfMatrix" :tfMatrix="tfMatrix" :idfMatrix="idfMatrix" :lengthVector="lengthVector" :normalizeMatrix="normalizeMatrix" /> -->
  </div>
</template>

<script>
import { separateDocuments } from '@/functions/formatDocument';
import { stopWords } from '@/functions/formatDocument';
import { formatDocument } from '@/functions/formatDocument';
import { lemmatize } from '@/functions/formatDocument';
// import  DisplayMatrix  from  '@/components/DisplayMatrix';
export default {
  // components: {
  //   DisplayMatrix
  // },
  data() {
    return { documentsLists: [],
    documentTermMatrix: [],
    dataMatrix: [],
    allWords: [],
    dfMatrix: [],
    tfMatrix: [],
    idfMatrix: [],
    lengthVector: [],
    normalizeMatrix: [],
    displayMatrixFlag: false
    };
  },
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
      // Step 1 (upper to lower, remove punctuation, numbers and whitespaces): ...
      this.documentsLists = this.formatDocument(this.documentsLists);
      // Step 2 (apply stop words changes): ...
      this.documentsLists = this.stopWords(this.documentsLists, this.stopwordsFileContent);
      // Step 3 (apply the lemmatization ...): ...
      this.documentsLists = this.lemmatize(this.documentsLists, this.substitutionFileContent);
      // Step 4 (calculate the document-term matrix): ...
      this.calculateDocumentTermMatrix();
      // Step 5 (calculate the DF): ...
      this.calculateDF();
      // Step 6 (calculate the TF matrix): ...
      this.calculateTF();
      // Step 7 (calculate the IDF): ...
      this.calculateIDF();
      // Step 8 (calculate the length of the vector of each document): ...
      this.calculateLength();
      // Step 9 (calculate the normalized matrix): ...
      this.calculateNormalizeMatrix();
      this.displayMatrixFlag = true;
      //this.printResults();
    },
    stopWords,
    formatDocument,
    lemmatize,
    separateDocuments,
    calculateDocumentTermMatrix() {
      // Create a list of all the words in the documents without duplicates. This will be used as a reference to build the document-term matrix:
      // The allWords will be the upper side of the matrix (the terms). The documents will be the left side of the matrix (We'll work by rows).
      for (let i = 0; i < this.documentsLists.length; i++) {
        this.allWords = this.allWords.concat(this.documentsLists[i]);
      }
      // Remove duplicates from the allWords array
      this.allWords = [...new Set(this.allWords)];
      for (let j = 0; j < this.documentsLists.length; j++) {
        // We work on a row variable that will be the length of the allWords array, and will store the number of times each word appears in the document
        let row = 0;
        let rowDataMatrix = [];
        for (let i = 0; i < this.allWords.length; i++) {
          // Count the number of times the word appears in the document and then store it in the row (wordCount locally)
          let wordCount = this.allWords.map(word => this.documentsLists[j].filter(w => w === word).length);
          // Store the indexes of the words in the document
          let wordIndexes = this.documentsLists[j].map((word, index) => word === this.allWords[i] ? index : -1).filter(index => index !== -1);
          // Calculate the total number of times the word appears in the document
          // let totalTimesAppeared = wordCount.reduce((a, b) => a + b);
          // Store the word count, the indexes of the words in the document and the word itself in the data matrix
          rowDataMatrix.push([wordCount, wordIndexes, this.allWords[i]]);
          // Prepare the row to be stored in the documentTermMatrix
          row = wordCount;
        }
        this.dataMatrix.push(rowDataMatrix);
        this.documentTermMatrix.push(row);
      }
    },

  calculateDF() {
    // Calculate the Document Frequency (DF) for each word in the allWords array.
    let df = [];
    // For each word in the allWords array, we count the number of documents that contain the word.
    for (let i = 0; i < this.allWords.length; i++) {
      // On each document, first reset the count to 0.
      let count = 0;
      // For each document, check if the word appears in the document (an appearance occurs whenever the number is higher than zero).
      // If it does, increment the count.
      for (let j = 0; j < this.documentTermMatrix.length; j++) {
        console.log('Palabra: ', this.allWords[i], 'Documento: ', j, 'Frecuencia: ', this.documentTermMatrix[j][i]);
        if (this.documentTermMatrix[j][i] > 0) {
          console.log('Palabra: ', this.allWords[i], 'Documento: ', j, 'Frecuencia: ', this.documentTermMatrix[j][i]);
          count++;
        }
      }
      // Once finished with the document, push the count to the df array.
      df.push(count);
    }
    this.dfMatrix = df;
  },
  
  calculateTF() {

    let tf = []; 

    for (let j = 0; j < this.documentTermMatrix.length; j++) {
        let tfRow = []; 

        for (let i = 0; i < this.allWords.length; i++) {
            let frequency = this.documentTermMatrix[j][i];
            let tf = frequency > 0 ? 1 + Math.log10(frequency) : 0;
            tfRow.push(tf);
        }

        tf.push(tfRow); 
    }

    console.log('TF Matrix: ', tf);
    this.tfMatrix = tf;
  },
  calculateIDF() {
    let idf = [];
    for (let i = 0; i < this.allWords.length; i++) {
      let dfWord = this.dfMatrix[i];
      let value = this.documentsLists.length / dfWord;
      let idfValue = Math.log10(value);
      idf.push(idfValue);
    }
    console.log('IDF Matrix: ', idf);
    this.idfMatrix = idf;
  },

  calculateLength() {
    let length = [];
    for (let j = 0; j < this.documentTermMatrix.length; j++) {
      let sum = 0;
      for (let i = 0; i < this.allWords.length; i++) {
        sum += Math.pow(this.tfMatrix[j][i] || 0, 2);
      }
      length.push(Math.sqrt(sum));
    }
    this.lengthVector = length;    
  },
  calculateNormalizeMatrix() {
    let normalizeVector = [];
    for (let j = 0; j < this.documentTermMatrix.length; j++) {
      let row = [];
      for (let i = 0; i < this.allWords.length; i++) {
        row.push(this.tfMatrix[j][i] / this.lengthVector[j]);
      }
      normalizeVector.push(row);
    }
    this.normalizeMatrix = normalizeVector;

  }, 
  calculateLengthCheck() {
    let length = [];
    for (let j = 0; j < this.normalizeMatrix.length; j++) {
      let sum = 0;
      for (let i = 0; i < this.allWords.length; i++) {
        sum += Math.pow(this.normalizeMatrix[j][i] || 0, 2);
      }
      length.push(Math.sqrt(sum));
    }
    console.log('Length check: ', length);
  },
  printResults() {
    let results = "";
    results += "Document Term-Matrix: \n";
    // if (!this.documentTermMatrix.length > 0 || !this.dfMatrix.length > 0 || !this.tfMatrix.length > 0 || !this.idfMatrix.length > 0 || !this.lengthVector.length > 0 || !this.normaliceMatrix.length > 0) {
    //   console.log('No se han calculado las matrices');
    //   return;
    // }
    
    results += "             ";
    results += this.allWords.join(' | ');
    results += "\n";
    // this.documentTermMatrix.forEach((row, index) => {
    //   const formattedRow = row.map((elemento, i) => 
    //     String(elemento).padStart(this.allWords[i].length, ' ')  // Alinea cada número según el ancho de la palabra correspondiente
    //   ).join(' | ');  // Unir las columnas con ' | '
    //   if (index < 10) {
    //     results += `Document 0${index + 1}: ${formattedRow}\n`;
    //   } else {
    //     results += `Document ${index + 1}: ${formattedRow}\n`;
    //   }
    // });
    console.log('DataMAtrix: ', this.dataMatrix);
    this.documentTermMatrix.forEach((row, index) => {
      results += `Document ${index + 1}:\n`;
      results += `INDICE | TÉRMINO | TF | IDF | TF-IDF\n`;
      row.forEach((element, i) => {
        results += `${this.dataMatrix[i][0]} | ${this.allWords[i]} | ${this.tfMatrix[index][i]} | ${this.idfMatrix[i]} | ${this.tfMatrix[index][i] * this.idfMatrix[i]}\n`;
      });
    });

    // Crear un blob con el contenido de la matriz de similitud
    const blob = new Blob([results], { type: 'text/plain' });

    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'result.txt';

    // Simular un clic en el enlace para iniciar la descarga
    link.click();

    // Liberar el objeto URL después de la descarga
    URL.revokeObjectURL(link.href);
    this.downloading = false;
    this.calculateLengthCheck();

  }
  }
};
</script>