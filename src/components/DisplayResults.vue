<!-- DisplayResults.vue -->
<!-- This component handles the  -->

<template>
  <div class="display-results">
    <h1>Display Results</h1>
    <button @click="reset">Reset</button>
    <button @click="printResults">Imprimir resultados</button>
    <MatrixDisplay v-if="documentTermMatrix.length > 0" matrixName="Matriz Término-documento" :matrix="documentTermMatrix" :words="allWords"/>
    <MatrixDisplay v-if="tfMatrix.length > 0" matrixName="Matriz TF " :matrix="tfMatrix" :words="allWords" />
    <MatrixDisplay v-if="normalizeMatrix.length > 0" matrixName="Matriz Normalizada" :matrix="normalizeMatrix" :words="allWords" />
  </div>
</template>

<script>
import { separateDocuments } from '@/functions/formatDocument';
import { stopWords } from '@/functions/formatDocument';
import { formatDocument } from '@/functions/formatDocument';
import { lemmatize } from '@/functions/formatDocument';
import  MatrixDisplay  from  '@/components/DisplayMatrix';
export default {
  components: {
    MatrixDisplay
  },
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
    similarityBetweenDocuments: [],
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
    // Call the algorithm
    this.executeAlgorithm();
  },
  // Watch for changes in the files content, they will trigger the algorithm. This happens when
  // the user uploads a new file. Triggers once this component is mounted, and there are mechanisms
  // to force all files to be uploaded at least once before the component is mounted.
  watch: {
    documentsFileContent() {
      this.resetData();
      this.executeAlgorithm();
    },
    stopwordsFileContent() {
      this.resetData();
      this.executeAlgorithm();
    },
    substitutionFileContent() {
      this.resetData();
      this.executeAlgorithm();
    }
  },
  methods: {
    reset() {
      this.resetData();
      // reset the displayMatrixFlag to false
      this.displayMatrixFlag = false;
      // emit the reset event to the parent component
      this.$emit('resetApp');
    },
    resetData() {
      this.documentsLists = [];
      this.documentTermMatrix = [];
      this.dataMatrix = [];
      this.allWords = [];
      this.dfMatrix = [];
      this.tfMatrix = [];
      this.idfMatrix = [];
      this.lengthVector = [];
      this.normalizeMatrix = [];
      this.similarityBetweenDocuments = [];
    },
    executeAlgorithm() {
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
      // Step 10 (calculate the similarity between documents): ...
      this.similarityfunction();
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
          rowDataMatrix.push([wordIndexes, this.allWords[i]]);
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
          if (this.documentTermMatrix[j][i] > 0) {
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
    },
    similarityfunction() {
      let similarity = [];
      for (let i = 0; i < this.normalizeMatrix.length - 1; i++) {
        let row = [];
        for (let j = i + 1; j < this.normalizeMatrix.length; j++) {
          let sum = 0;
          for (let k = 0; k < this.allWords.length; k++) {
            sum += this.normalizeMatrix[i][k] * this.normalizeMatrix[j][k];
          }
          row.push(sum);
        }
        similarity.push(row);
      }
      this.similarityBetweenDocuments = similarity;
    },

    printResults() {
      let results = "";
      // VISUALIZATION OF THE DOCUMENT-TERM MATRIX ACCORDING TO THE CLASSROOM PRESENTATION
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
      let spaces = this.allWords.map(word => word.length);
      spaces = Math.max(...spaces);
      this.dataMatrix.forEach((row, index) => {
        results += `Documento ${index + 1}:\n`;
        results += `ÍNDICE | ${String("TÉRMINO").padStart(spaces, ' ')} |   TF   |   IDF  | TF-IDF\n`;
        row.forEach((element, i) => {
          if (element[0].length > 0) {
            results += `${String(element[0][0]).padStart(6, ' ')} | ${String(element[1]).padStart(spaces, ' ')} | ${this.tfMatrix[index][i].toFixed(4)} | ${this.idfMatrix[i].toFixed(4)} | ${this.normalizeMatrix[index][i].toFixed(4)}\n`;
          }
        });
        results += '\n';
      });

      results += `Similaridad coseno entre cada par de documentos:\n`;
      for (let i = 0; i < this.similarityBetweenDocuments.length; i++) {
        for (let j = 0; j < this.similarityBetweenDocuments[i].length; j++) {
          results += `Documento ${i + 1} y documento ${j + i + 2}: ${this.similarityBetweenDocuments[i][j].toFixed(4)}\n`;
        }
      }
      

      const blob = new Blob([results], { type: 'text/plain' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'result.txt';

      link.click();

      URL.revokeObjectURL(link.href);
      this.downloading = false;
      this.calculateLengthCheck();

    }
  }
};
</script>