<!-- MatrixDisplay.vue -->
<template>
  <div :class="['content-container', { 'wide-container': displayMatrix }]">
    <button @click="toggleDisplay">Mostrar / Ocultar {{ this.matrixName }}</button>
    <table v-if="display" class="matrix-container">
      <thead>
        <tr>
          <!-- Celda vacía para el encabezado de la primera columna (filas de documentos) -->
          <th></th>
          <!-- Crear encabezados basados en el array `columnHeaders` -->
          <th v-for="(header, index) in this.words" :key="`header-${index}`">
            {{ header }}
          </th>
        </tr>
      </thead>
      
      <tbody>
        <!-- Crear las filas de la matriz -->
        <tr v-for="(row, rowIndex) in matrix" :key="`row-${rowIndex}`">
          <!-- Etiqueta de fila -->
          <th>{{ `Document ${rowIndex + 1}` }}</th>
          <!-- Celdas de datos -->
          <td v-for="(cell, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`">
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
export default {
  props: {
    matrixName: {
      type: String,
      required: true
    },
    matrix: {
      type: Array,
      required: true
    },
    words : {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      display: false // Controla la visibilidad de la matriz
    };
  },
  methods: {
    toggleDisplay() {
      console.log('Toggling display');
      this.display = !this.display;
    }
  }
};
</script>