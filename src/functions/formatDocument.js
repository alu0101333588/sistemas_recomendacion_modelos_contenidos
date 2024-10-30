export function separateDocuments(documentFileContent) {
  let documents = documentFileContent.split('\n');
	documents =  documents.map(document => document.split(' '));
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
  console.log(substitutionWords);
	// documentContent = documentContent.map(word => {
	// 	word.map(w => {
	// 		substitutionWords.map(substitution => {
	// 			if (w === substitution[0]) {
	// 				w = substitution[1];
	// 			}
	// 		});
	// 	});
	// });
	documentContent = documentContent.map(sentence => {
    return sentence.map(word => {
      return substitutionWords[word] || word; // Sustituye si hay un equivalente, sino devuelve la palabra original
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
  