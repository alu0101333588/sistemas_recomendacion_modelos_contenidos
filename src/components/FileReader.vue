<!-- FileReader.vue -->
<!-- 
This component is a generic file reader that emits an event with the file content so it
will be handled in the parent component according to the file type.
-->

<template>
  <label class="text-reader">
    <h3>{{ fileReaderTitle }}</h3>
    <input type="file" @change="loadTextFromFile">
  </label>
</template>

<script>
export default {
  props: {
    fileReaderTitle: {
      type: String,
      default: 'Upload file'
    },
    fileType: {
      type: String,
      default: 'documents' // It can be 'documents', 'stopwords' or 'lemmatize'.
    }
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => {
        // Emite el evento con el nombre según el tipo de archivo
        this.$emit(`${this.fileType}Load`, e.target.result);
      };

      // Leer el archivo como texto (puedes ajustar según el tipo)
      reader.readAsText(file);
    }
  }
};
</script>