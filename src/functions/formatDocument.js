export function separateDocuments(documentFileContent) {
	documentFileContent = documentFileContent.toString();

  // Divide por saltos de línea (tanto \n como \r\n)
  let documents = documentFileContent.split('\n');
	documents =  documents.map(document => document.split(' '));
	// Convert every word to a string of the document
	documents = documents.map(document => document.map(word => String(word)));
  return documents;
}

export function formatDocument(documentContent) {
	let formatedDocument = [];
	let formatedWord = [];
	// upper to lower, remove punctuation, numbers and whitespaces
	documentContent.map(document => {
		formatedWord = [];
		document.map(word => {
			word = word.toLowerCase();
			word = word.replace(/[^a-z]/g, '');
			word = word.replace(/\s/g, '');
			if (word.length > 0) {
				formatedWord.push(word);
			}
		});
		formatedDocument.push(formatedWord);
	});
  return formatedDocument;
}


export function lemmatize(documentContent, substitutionWords) {
  documentContent = documentContent.map(sentence => {
    return sentence.map(word => {
      // Usar Object.prototype.hasOwnProperty.call para evitar conflictos con claves en substitutionWords
      return Object.prototype.hasOwnProperty.call(substitutionWords, word) 
        ? substitutionWords[word] 
        : word;
    });
  });
  return documentContent;
}

export function stopWords(documentContent, stopWords) {
  const stopWordsSet = new Set(
    stopWords
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0)
  );

  let filteredDocuments = documentContent.map(doc => 
    doc.filter(word => !stopWordsSet.has(word))
  );

  return filteredDocuments;
}
  