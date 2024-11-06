<template>
  <div class="display-matrix">
    <h1>Display Matrix</h1>
    <!-- Display the matrix here -->
    <p>{{ dataMatrix }}</p>
     
  </div>
</template>

<script>
export default {
  // name: 'DisplayMatrix',
  props: {
    dataMatrix: {
      type: Array,
      required: true
    },
    documentTermMatrix: {
      type: Array,
      required: true
    },
    dfMatrix: {
      type: Array,
      required: true
    },
    tfMatrix: {
      type: Array,
      required: true
    },
    idfMatrix: {
      type: Array,
      required: true
    },
    lengthVector: {
      type: Array,
      required: true
    },
    normalizeMatrix: {
      type: Array,
      required: true
    },
    allWords: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // Your component data goes here
    };
  }
};
</script>