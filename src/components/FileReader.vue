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
      default: 'documents' // It can be 'documents', 'stopwords' or 'substitution'.
    }
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => {
        // Emits the event based on the prop fileType passed to the component (documents, stopwords, substitution)
        this.$emit(`${this.fileType}Load`, e.target.result);
      };

      // Read the file as a string
      reader.readAsText(file);
    }
  }
};
</script>