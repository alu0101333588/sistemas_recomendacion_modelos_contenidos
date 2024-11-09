# Sistemas de Recomendación: Modelos basados en el contenido

## Instalaciones previas: Dependencias 
Las dependencias que se deben instalar son las siguientes: 
- vue, se debe poseer una versión igual o superior a la 3.5.12: `npm install vue`
- core-js, se debe poseer una versión igual o superior a la 3.8.3: `npm install core-js`
- se debe incluir también @vue/compiler-sfc con 3.5.12 o superior: `npm install @vue/compiler-sfc`

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## Descripción del código 
### Organización en ficheros
El programa se ha agrupado en una serie de componentes separados en diferentes ficheros:
- FileReader.vue: Responsable de la gestión de los archivos de texto adjuntados que contienen los documentos (un fichero .txt en el que cada línea representa un documento diferente), las stopwords y las sustituciones para la lematización.
- DisplayMatrix.vue: Responsable de mostrar las diferentes matrices (Término-documento, TF, matriz normalizada).
- DisplayResults.vue: Responsable de realizar todos los cálculos necesarios (aplicar las stopwords, lematización, Matriz Término-Documento, DF, TF, IDF, matriz normalizada, longitud del vector de cada documento y la similitud entre documentos) y poder vertir los resultados en un documento de texto .txt. 
  
La estructura empleada permite la modularidad del programa, favoreciendo las posibles futuras necesidades de escalabilidad. 

### FileReader
- El código está compuesto de tres partes: el template (interfaz), el script (lógica), y los estilos (apariencia).
  - La interfaz (template): Se encarga de que cuando el usuario sube un archivo .txt con uno de los tres documentos necesarios (listado de documentos, las stopwords y sustituciones para la lematización), pulsando el botón "Seleccionar archivo", se llame a una función capaz de almacenarlo.
  - El script: Emplea el objeto FileReader de JavaScript para leer el archivo como texto y emitir el contenido leído al componente padre.
    - Las propiedades (props) definidas en el componente son las siguientes:
      - `fileReaderTitle`: Va a permitir personalizar el título a mostrar. Si nose proporciona un valor, el título por defecto será 'Upload file'.
      - `fileType`: Sirve para diferenciar el tipo de archivo que se espera cargar. El valor por defecto es 'documents', pero también puede tomar otros valores como 'stopwords' o 'substitution', según el tipo de contenido del archivo que se esté manejando.
      - `fileResetFlag`: Es una bandera que indica si se debe limpiar el archivo cargado. Cuando está en true, se debe resetear el archivo actual.
    - El método `loadTextFromFile` tiene la función de cargar y leer el contenido de del archivo de texto que se le pase.
  - Los estilos (style): Define el diseño visual del componente, en este caso se dispone de un botón para la selección del archivo y un contenedor.


### DisplayMatrix
- La función está diseñada para mostrar los resultados de las diferentes matrices (Término-documento, TF, normalizada).
- La interfaz (*template*): 
  - Se muestra un botón "Mostrar / Ocultar", seguido del nombre de la matriz (`matrixName`), para cambiar la visibilidad de la matriz que se le pasa al componente, alternando el valor de `display`.
  - En el caso de que `display` esté a true:
    - Se renderiza la tabla donde las filas son los documentos y las columnas las palabras.
- El *script*:
  - En **Props** se definen los datos que se espera recibir desde su componente padre:
      - `matrixName`: Nombre de la matriz que se mostrará en el botón de alternar visibilidad. Es tipo `String` y obligatorio.
      - `matrix`: Contiene los datos de la matriz a mostrar. Es tipo `Array` y obligatorio.
      - `words`: Contiene los encabezados de las columnas de la matriz, es decir, las palabras que aparecen en la primera fila de la tabla.
  - En **Data** se encuentran las variables internas del componente que se inicializan cuando éste se crea.
      - `display`: Se encarga de controlar si la matriz debe ser visible o no. Inicialmente está en false, por lo que la tabla no se muestra hasta que el usuario haga clic en el botón. Es de tipo `Boolean`.
  - En **Methods**: Se definen los métodos del componente.
      - `toggleDisplay`: Alterna el valor de `display` entre `true` y `false`, permitiendo que la matriz se muestre o se oculte al hacer clic en el botón.

     
### DisplayResults
- Se encarga de gestionar el análisis y visualización de matrices a partir de la información de los ficheros cargados, es decir, para obtener como resultados la matriz término-documento, TF (frecuencia de término) y una matriz normalizada. Este análisis incluye el procesamiento de documentos, stopwords, y términos de sustitución, para finalmente calcular métricas como la similaridad coseno entre documentos.
- La interfaz (*template*):
  - Se muestra el título "Display Results".
  - Se muestran dos botones:
    - "Reset": Cuando se activa, se invoca método `reset` para reiniciar los datos y la visualización.
    - "Imprimir resultados": Cuando se activa, llama al método `printResults` para generar un archivo de texto con los resultados del análisis.
  - Se hace uso del componente `MatrixDisplay` para mostrar las tres matrices generadas, a partir de los diferentes cálculos:
    - La matriz término-documento (`documentTermMatrix`),
    - La matriz de frecuencia de términos (`tfMatrix`),
    - La matriz normalizada (`normalizeMatrix`).
  - Cada `MatrixDisplay` solo se renderiza si la matriz respectiva tiene datos (`length > 0`).
  - Los nombres y encabezados de columnas (`allWords`) se pasan como props.
- El *script*:
  - **Props**:
    - `documentsFileContent`: Almacena el contenido del fichero con los diferentes documentos en cada línea. Es de tipo `String`.
    - `stopwordsFileContent`: Almacena el contenido del archivo de stopwords. Es de tipo `String`.
    - `substitutionFileContent`: Almacena el contenido del archivo de términos de sustitución. Es de tipo `String`.
  - **Data**:
    - `documentsLists`: Lista con los diferentes documentos.
    - `documentTermMatrix`: Matriz de término-documento, con la cantidad de veces que aparece la palabra en el documento.
    - `dataMatrix`: Matriz que almacena la palabra y su índice.
    - `allWords`: Almacena todas las palabras presentes en los documentos.
    - `dfMatrix`: Matriz con la frecuencia del documento (DF) para cada palabra.
    - `tfMatrix`: Matriz de frecuencia de términos (TF).
    - `idfMatrix`: Matriz de frecuencias inversas de documentos (IDF).
    - `lengthVector`: Longitudes vectoriales de cada documento.
    - `normalizeMatrix`: Matriz normalizada para el cálculo de similaridad.
    - `similarityBetweenDocuments`: Similaridad coseno entre pares de documentos.
    - `displayMatrixFlag`: Controla la visibilidad de matrices en el template.
  - **Methods**:
    - `reset`:
      - Llama a `resetData` para limpiar todos los datos y reiniciar `displayMatrixFlag`.
      - Emite un evento `resetApp` para notificar al componente padre.
    - `resetData`:
      - Restablece los arrays de datos a sus valores iniciales, limpiando todas las matrices y listas.
    - `executeAlgorithm`:
      - Ejecuta paso a paso el procesamiento de documentos, transformándolos y generando las matrices de análisis.
      - Se encarga de llamar de manera secuencial y ordenada a los métodos necesarios para construir las matrices resultantes necesarias:
        1. Se invoca a una serie de funciones, ubicadas en `/src/functions/formatDocument.js`, para tratar inicialmente el fichero de documentos de la siguiente forma:
           - `separateDocuments`: Divide cada línea del archivo (que representa un documento), utilizando saltos de línea (\n), en una posición del array `documents`, es decir, forma un array de arrays, donde cada posición del array es una línea, y cada día a su vez es un array en el que las palabras son las posiciones.
           - `formatDocument`: Convierte las mayúsculas en minúsculas. Luego, elimina caracteres no alfabéticos (como puntuación y números) y cualquier espacio en blanco. Solo las palabras que contienen letras después de esta limpieza se agregan al documento formateado. Finalmente, la función devuelve un array de documentos, donde cada documento es un array de palabras en minúsculas, sin caracteres especiales ni espacios.
           - `lemmatize`: Realiza el proceso de lematización del documento, empleando el conjunto de sustituciones `substitutionWords`.
           - `stopWords`: Elimina las palabras vacías del documento, empleando el fichero `stopWords`.
        2. Se llama a la función `calculateDocumentTermMatrix`, encargada de calcular la Matriz de Términos-Documentos.
        3. Se invoca a `calculateDF`, para calcular la Frecuencia de Documentos (DF).
        4. `calculateTF`, para calcular la matriz de Frecuencia de Término (TF).
        5. `calculateIDF`, para calcular la Frecuencia Inversa de Documentos (IDF).
        6. `calculateLength`, para calcular la longitud del vector de cada documento.
        7. `calculateNormalizeMatrix`, para calcular la matriz normalizada.
        8. `similarityfunction`, para calcular la similitud entre los diferentes documentos.
           
    - `calculateDocumentTermMatrix`: Como ya se ha comentado, se va a encargar de generar la matriz término-documento a partir de una lista de documentos (`documentsLists`). 
      - En primer lugar, se crea una lista de palabras únicas (sin repeticiones). Para ello se concatenan todos los términos de los documentos en un solo array (`allWords`) y se eliminan las palabras duplicadas.
      - Acto seguido, se lleva a cabo la construcción de la matriz término-documento: Para cada documento, se genera una fila (`row`) en la que cada posición representa la frecuencia de cada palabra en ese documento. Esta frecuencia se calcula contando las apariciones de cada término en el documento.
      - Como ya se mencionó, `dataMatrix` va a almacenar la información detallada de cada término, incluyendo sus índices en el documento y el término en sí.
      - `documentTermMatrix` almacena la matriz de frecuencias de cada término en cada documento.
      - El resultado final es una matriz en la que cada fila representa un documento y cada columna representa la frecuencia de un término.
    - `calculateDF`: Calcula la Frecuencia de Documento (DF) para cada palabra en el listado de términos (`allWords`).
      - Para cada término en `allWords`, cuenta en cuántos documentos aparece.
      - Recorre cada fila en `documentTermMatrix`, que representa un documento, y verifica si el término tiene una frecuencia mayor a cero (es decir, si está presente en el documento).
      - Si el término está presente, incrementa el contador.
      - Al finalizar la revisión de todos los documentos para un término, se añade el conteo resultante al array `df`, que posteriormente será vertido su contenido en `dfMatrix`.
    - `calculateTF`: Calcula la Frecuencia de Término (TF) para cada palabra en cada documento.
      - Para cada documento (representado como una fila en `documentTermMatrix`), crea un array `tfRow` que almacenará las frecuencias de término de ese documento.
        - Para cada término en el documento, obtiene la frecuencia de término desde `documentTermMatrix[j][i]`.
        - Aplica la fórmula de frecuencia logarítmica: si la frecuencia es mayor que cero, calcula `1 + log10(frecuencia)`.
        - Si la frecuencia es cero, el valor se establece en 0.
        - Añade el valor calculado a `tfRow`.
      - Al finalizar cada documento, añade `tfRow` al array `tf`, que posteriormente será vertido su contenido en `tfMatrix`.
    - `calculateIDF`: Calcula la Frecuencia Inversa de Documento (IDF) para cada palabra en la lista de términos (`allWords`).
      - Para cada término en `allWords`, se obtiene su frecuencia de documento desde `dfMatrix[i]`.
      - Calcula el valor IDF aplicando la fórmula `log10(N / DF)`, donde:
        - `N` es el número total de documentos (`this.documentsLists.length`).
        - `DF` es la frecuencia de documentos para el término (`dfWord`).
      - Calcula el IDF tomando el logaritmo en base 10 del resultado y lo almacena en `idf`.
      - Al finalizar el cálculo de cada término, asigna el array `idf` a `idfMatrix`.
    - `calculateLength`: Calcula la longitud vectorial de cada documento, necesaria para normalizar los vectores de frecuencia de término.
      - Para cada documento (representado por una fila en `tfMatrix`), inicializa `sum` en 0.
      - Recorre cada término en el documento y obtiene su frecuencia de término (TF) desde `tfMatrix[j][i]`.
      - Eleva al cuadrado el valor de TF y lo suma a `sum`. Esto sigue la fórmula de cálculo de magnitud de un vector.
      - Al finalizar la suma de los cuadrados, calcula la raíz cuadrada de `sum` y añade el resultado al array `length`.
      - Por último, se asigna el contenido array `length` a `lengthVector`.
    - `calculateNormalizeMatrix`: Genera la matriz normalizada para cada documento, dividiendo cada valor de frecuencia de término (TF) entre la longitud vectorial del documento correspondiente.
      - Para cada documento (una fila en `tfMatrix`), se crea un array `row` que almacenará los valores normalizados de TF.
      - Para cada palabra en el documento, se divide el valor de TF (`tfMatrix[j][i]`) entre la longitud del vector del documento (`lengthVector[j]`). Y se añade el valor normalizado a`row`.
      - Al finalizar el procesamiento de cada documento, se añade `row` a `normalizeVector`.
      - Por último, se asigna `normalizeVector` a `normalizeMatrix`.
    - `calculateLengthCheck`: Comprueba la longitud vectorial de cada documento en la matriz normalizada (`normalizeMatrix`), asegurándose de que cada vector tenga una longitud de 1, lo cual es esperado tras la normalización.
      - Para cada documento, inicializa `sum` en 0.
      - Recorre cada término en el documento, eleva al cuadrado su valor normalizado (`normalizeMatrix[j][i]`), y lo suma a `sum`.
      - Calcula la raíz cuadrada de `sum` y añade el resultado al array `length`.
      - Por tanto, el método sirve para garantizar la consistencia de la matriz normalizada.
    - `similarityfunction`: Calcula la similaridad coseno entre cada par de documentos en la matriz normalizada (`normalizeMatrix`).
      - Para cada documento `i` en `normalizeMatrix`, se crea una fila `row` que almacenará la similaridad coseno entre el documento `i` y cada documento subsiguiente `j`.
      - Para cada par de documentos (`i`, `j`), calcula la suma del producto de los valores normalizados de cada término en ambos documentos (`normalizeMatrix[i][k] * normalizeMatrix[j][k]`), acumulando los resultados en `sum`.
      - Una vez calculado `sum` para el par (`i`, `j`), se añade a `row`, representando la similaridad coseno entre estos dos documentos.
      - Al finalizar los cálculos de cada par (`i`, `j`), se agrega `row` al array `similarity`.
      - Por último, se asigna `similarity` a `similarityBetweenDocuments`, conteniendo las similitudes coseno entre todos los pares de documentos.
    - `printResults`: Genera un archivo de texto con los resultados del análisis de los documentos.
      - Para cada documento en `dataMatrix`, agrega al string `results`:
        - Encabezado de columnas (`ÍNDICE | TÉRMINO | TF | IDF | TF-IDF`).
        - Para cada término que aparece en el documento, formatea la línea con el índice, término, y los valores correspondientes de TF, IDF y TF-IDF, obtenidos de `tfMatrix`, `idfMatrix` y `normalizeMatrix`, respectivamente.
      - Para cada par de documentos, agrega una línea con su similaridad coseno formateada a cuatro decimales, obtenida de `similarityBetweenDocuments`.
      - Crea un archivo de texto (`Blob`) con el contenido de `results`.
      - Llama a `calculateLengthCheck()` para verificar la normalización de los datos.
      - Por tanto, va a permitir al usuario descargar un archivo `result.txt` con un resumen detallado del análisis de los documentos, mostrando las frecuencias de términos y las similaridades entre documentos en un formato legible.

## Ejemplo de uso

Para ejecutar el programa se debe iniciar en una terminal "npm run serve", a continuación mediante un navegador web se abre la IP en cuestión con el puerto 8080.

Una vez en el navegador web:
- Se debe adjuntar un archivo que contenga los documentos, un documento por línea (1).
- Se debe adjuntar un fichero que contenga las diferentes stopwords (2).
- Se debe adjuntar un archivo que contenga las sustituciones para la lematización (3).

  
![EjemploUso](/images/ejemplo_uso.png)


Una vez se han introducido los tres ficheros necesarios, se debe pulsar el botón "Ejecutar algoritmo" (4). Acto seguido, aparecen una serie de botones con diferentes acciones posibles:
- Dos botones, "Reset" (5) e "Imprimir resultados" (6), para resetear todo el contenido, es decir, eliminar los ficheros introducidos por el usuario, y para mostrar los resultados en un fichero .txt que se descargará.
- "Mostrar/Ocultar Matriz Término-documento" (7), para mostrar u ocultar en la página la matriz término-documento.
- "Mostrar/Ocultar Matriz TF" (8), para mostrar u ocultar en la página la matriz TF.
- "Mostrar/Ocultar Matriz Normalizada" (9), para mostrar u ocultar en la página la matriz normalizada.




![EjemploUso](/images/ejemplo_uso_2.png)
