<!-- DisplayResults.vue -->
<!-- This component handles the  -->

<template>
  <div class="display-results">
    <h1>Display Results</h1>
    <button @click="$emit('resetApp')">Reset</button>
    <button @click="calculateDocumentTermMatrix">Calcular matriz término-documento</button>
    <button @click="calculateDF">Calcular DF</button>
    <button @click="calculateTF">Calcular TF</button>
    <button @click="calculateIDF">Calcular IDF</button>
    <button @click="calculateLength">Calcular longitud</button>
    <button @click="calculateNormaliceVector">Calcular vector normalizado</button>
  </div>
</template>

<script>
import { separateDocuments } from '@/functions/formatDocument';
import { stopWords } from '@/functions/formatDocument';
import { formatDocument } from '@/functions/formatDocument';
import { lemmatize } from '@/functions/formatDocument';
export default {
  data() {
    return { documentsLists: [],
    documentTermMatrix: [],
    dataMatrix: [],
    allWords: [],
    dfMatrix: [],
    tfMatrix: [],
    idfMatrix: [],
    lengthVector: [],
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
    separateDocuments,
  // Método para calcular la matriz término-documento
  calculateDocumentTermMatrix() {
    console.log('Calculando matriz término-documento');
    
    // Create a list of all the words in the documents without duplicates. This will be used as a reference to build the document-term matrix:
    // The allWords will be the upper side of the matrix (the terms). The documents will be the left side of the matrix (We'll work by rows).
    for (let i = 0; i < this.documentsLists.length; i++) {
      this.allWords = this.allWords.concat(this.documentsLists[i]);
    }
    
    // Eliminar duplicados
    this.allWords = [...new Set(this.allWords)];
    console.log('All words: ', this.allWords);

    for (let j = 0; j < this.documentsLists.length; j++) {
      // We work on a row variable that will be the length of the allWords array, and will store the number of times each word appears in the document
      let row = [];
      let rowDataMatrix = [];
      for (let i = 0; i < this.allWords.length; i++) {
        // Count the number of times the word appears in the document and then store it in the row (wordCount locally)
        let wordCount = this.allWords.map(word => this.documentsLists[j].filter(w => w === word).length);
        // Store the indexes of the words in the document
        let wordIndexes = this.documentsLists[j].map((word, index) => word === this.allWords[i] ? index : -1).filter(index => index !== -1);
        // Calculate the total number of times the word appears in the document
        let totalTimesAppeared = wordCount.reduce((a, b) => a + b);
        // Store the word count, the indexes of the words in the document and the word itself in the data matrix
        rowDataMatrix.push([totalTimesAppeared, wordIndexes, this.allWords[i]]);
        // Prepare the row to be stored in the documentTermMatrix
        row = wordCount;
      }
      this.dataMatrix.push(rowDataMatrix);
      this.documentTermMatrix.push(row);
    }
    console.log('Matriz término-documento: ', this.documentTermMatrix);
    console.log('Data matrix: ', this.dataMatrix);
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
    console.log('Matriz Termino-Documento: ', this.documentTermMatrix);
    console.log('DF: ', df);
    this.dfMatrix = df;
  },
  
  calculateTF() {

    let tf = []; 

    for (let j = 0; j < this.documentTermMatrix.length; j++) {
        let tfRow = []; 

        for (let i = 0; i < this.allWords.length; i++) {
            let frequency = this.documentTermMatrix[j][i];
            console.log('Frecuencia: ', frequency);
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
      console.log('DF: ', this.dfMatrix[i]);
      let dfWord = this.dfMatrix[i];
      let idfValue = Math.log10(this.documentsLists.length / dfWord);
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
    console.log('Length: ', length);
    this.lengthVector = length;
    
  },
  calculateNormaliceVector() {
    let normaliceVector = [];
    for (let j = 0; j < this.documentTermMatrix.length; j++) {
      let row = [];
      for (let i = 0; i < this.allWords.length; i++) {
        console.log('TF: ', this.tfMatrix[j][i], 'Length: ', this.lengthVector[i]);
        row.push(this.tfMatrix[j][i] / this.lengthVector[i]);
      }
      normaliceVector.push(row);
    }
    console.log('Normalice Vector: ', normaliceVector);
  }
  }
};
</script>