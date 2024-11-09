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
- La función está diseñada para permitir al usuario seleccionar la métrica de similitud, el tipo de predicción y el número de vecinos necesarios para realizar cálculos a partir de una matriz de utilidad.

- La interfaz (*template*):
  - Se muestra el título "Selecciona la métrica y el tipo de predicción".
  - Tipo de Métrica (*selectedMetric*):
    - Se presenta un menú desplegable de opciones que permite al usuario seleccionar la métrica de similitud (Pearson, Coseno, o Euclidiana) que desea obtener.
  - Número de vecinos (*neighbors*): 
    - Un campo de entrada permite al usuario definir el número de vecinos (se establece un mínimo de 1).
  - Tipo de predicción (*predictionType*):
    - Un segundo menú desplegable permite elegir entre predicciones simples o basadas en la diferencia con la media.
  - Visualización de las opciones escogidas:
    - Se muestra un cuadro de texto con un resumen de las opciones seleccionadas (métrica, número de vecinos y tipo de predicción).
    - En caso de que no se seleccionen opciones, se muestran valores predeterminados ("Ninguna seleccionada" o "No especificado").
- El *script*:
  - **Data**:
    - *selectedMetric*: Guarda el nombre de la métrica de similitud seleccionada (inicialmente vacía).
    - *selectedPredictionType*: Guarda el nombre del tipo de predicción seleccionada (inicialmente vacío).
    - *numNeighbors*: Almacena el número de vecinos introducido por el usuario (inicialmente null).
  - **Methods**:
    - *emitSelection*: El método es llamado cada vez que el usuario cambia una de las opciones (métrica, vecinos, tipo de predicción).
      - Emite un evento *updateMetrics* con las selecciones actuales (selectedMetric, selectedPredictionType y numNeighbors), lo que permite que el componente padre actualice su configuración de cálculo.

## Ejemplo de uso

Para ejecutar el programa se debe iniciar en una terminal "npm run serve", a continuación mediante un navegador web se abre la IP en cuestión con el puerto 8080.

Una vez en el navegador web:
- Se debe adjuntar un archivo que contenga los documentos, un documento por línea (1).
- Se debe adjuntar un fichero que contenga las diferentes stopwords (2).
- Se debe adjuntar un archivo que contenga las sustituciones para la lematización (3).

  
![EjemploUso](/images/ejemplouso.png)


Una vez se han introducido los tres ficheros necesarios, se debe pulsar el botón "Ejecutar algoritmo" (4). Acto seguido, aparecen una serie de botones con diferentes acciones posibles:
- Dos botones, "Reset" e "Imprimir resultados" (5), para resetear todo el contenido, es decir, eliminar los ficheros introducidos por el usuario, y para mostrar los resultados en un fichero .txt que se descargará.
- "Mostrar/Ocultar Matriz Término-documento" (6), para mostrar u ocultar en la página la matriz término-documento.
- "Mostrar/Ocultar Matriz TF" (7), para mostrar u ocultar en la página la matriz TF.
- "Mostrar/Ocultar Matriz Normalizada" (8), para mostrar u ocultar en la página la matriz normalizada.




![EjemploUso](/images/ejemplouso2.png)

