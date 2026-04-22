// Gonzalo Zamarron Orrantia 
"use strict";

// 1. busco la primera letra que no se repite
export function firstNonRepeating(str) {
    if (str === "") return undefined;

    for (let i = 0; i < str.length; i++) {
        let letra = str[i];
        let veces = 0;

        // cuento cuantas veces aparece esa letra
        for (let j = 0; j < str.length; j++) {
            if (str[j] === letra) {
                veces++;
            }
        }

        // si solo aparece una vez, es el resultado
        if (veces === 1) {
            return letra;
        }
    }
    return undefined;
}

// 2. ordeno el arreglo de menor a mayor
// comparo cada numero con el siguiente y cambiarlos si estan al reves
export function bubbleSort(arr) {
    let lista = [];
    for (let i = 0; i < arr.length; i++) {
        lista[i] = arr[i];
    }
    for (let i = 0; i < lista.length; i++) {
        for (let j = 0; j < lista.length - 1; j++) {
            if (lista[j] > lista[j + 1]) {
                // los cambio de lugar
                let temp = lista[j];
                lista[j] = lista[j + 1];
                lista[j + 1] = temp;
            }
        }
    }
    return lista;
}

// 3-Inevert. regresa un arreglo nuevo pero al reves
export function invertArray(arr) {
    let resultado = [];
    let pos = 0;
    // empiezo desde el ultimo elemento
    for (let i = arr.length - 1; i >= 0; i--) {
        resultado[pos] = arr[i];
        pos++;
    }
    return resultado;
}

// 3-invertArrayInplace. invierte el mismo arreglo sin crear uno nuevo
// inetercambio el primero con el ultimo, luego el segundo con el penultimo, etc
export function invertArrayInplace(arr) {
    let inicio = 0;
    let fin = arr.length - 1;
    while (inicio < fin) {
        let temp = arr[inicio];
        arr[inicio] = arr[fin];
        arr[fin] = temp;
        inicio++;
        fin--;
    }
}

// 4. pone en mayuscula la primera letra de cada palabra
export function capitalize(str) {
    if (str === "") return "";

    // separo las palabras buscando los espacios
    let palabras = [];
    let palabra = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === " ") {
            palabras[palabras.length] = palabra;
            palabra = "";
        } else {
            palabra = palabra + str[i];
        }
    }
    palabras[palabras.length] = palabra;

    // primera letra en mayuscula + el resto en minuscula
    let resultado = "";
    for (let i = 0; i < palabras.length; i++) {
        let p = palabras[i];
        let nueva = p[0].toUpperCase();
        for (let j = 1; j < p.length; j++) {
            nueva = nueva + p[j].toLowerCase();
        }
        if (i === 0) {
            resultado = nueva;
        } else {
            resultado = resultado + " " + nueva;
        }
    }
    return resultado;
}

// 5. maximo comun divisor 
//  divido y me quedo con el residuo hasta que sea 0
export function mcd(a, b) {
    if (a === 0 && b === 0) return 0;
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// 6. cambia ciertas letras por numeros que se parecen
export function hackerSpeak(str) {
    let resultado = "";
    for (let i = 0; i < str.length; i++) {
        let letra = str[i].toLowerCase();
        // si la letra tiene cambio la sustituyo, si no la dejo igual
        if (letra === "a") {
            resultado = resultado + "4";
        } else if (letra === "e") {
            resultado = resultado + "3";
        } else if (letra === "i") {
            resultado = resultado + "1";
        } else if (letra === "o") {
            resultado = resultado + "0";
        } else if (letra === "s") {
            resultado = resultado + "5";
        } else {
            resultado = resultado + str[i];
        }    // etse lo hice basado en lo de 'J4v45c1pt 35 d1v3rt1d0' de lo de la tarea
    }
    return resultado;
}

// 7. regresa todos los numeros que dividen exactamente a n
export function factorize(n) {
    let factores = [];
    if (n === 0) return factores;
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) { // si el residuo es 0, es factor
            factores[factores.length] = i;
        }
    }
    return factores;
}

// 8. quita los repetidos del arreglo
export function deduplicate(arr) {
    let resultado = [];
    for (let i = 0; i < arr.length; i++) {
        let yaExiste = false;
        // reviso si ya esta en el resultado
        for (let j = 0; j < resultado.length; j++) {
            if (resultado[j] === arr[i]) {
                yaExiste = true;
                break;
            }
        }
        if (!yaExiste) {
            resultado[resultado.length] = arr[i];
        }
    }
    return resultado;
}

// 9. regresa la longitud del string mas corto del arreglo
export function findShortestString(arr) {
    if (arr.length === 0) return 0;
    let minimo = arr[0].length;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].length < minimo) {
            minimo = arr[i].length;
        }
    }
    return minimo;
}

// 10. revisa si una palabra se lee igual al reves
export function isPalindrome(str) {
    let alReves = "";
    for (let i = str.length - 1; i >= 0; i--) {
        alReves = alReves + str[i];
    }
    return str === alReves;
}

// 11. ordena los strings de la A a la Z
export function sortStrings(arr) {
    let copia = [];
    for (let i = 0; i < arr.length; i++) {
        copia[i] = arr[i];
    }
    // comparo cada string con el siguiente (bubble sort pero para strings)
    for (let i = 0; i < copia.length; i++) {
        for (let j = 0; j < copia.length - 1; j++) {
            // mayor que compara strings alfabeticamente
            if (copia[j] > copia[j + 1]) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
            }
        }
    }
    return copia;
}

// 12. calcula el promedio y la moda de una lista de numeros
export function stats(arr) {
    if (arr.length === 0) return [0, 0];

    //  sumo todo y divido entre cuantos son
    let suma = 0;
    for (let i = 0; i < arr.length; i++) {
        suma = suma + arr[i];
    }
    let promedio = suma / arr.length;

    //el numero que mas se repite
    let numeros = [];
    let conteos = [];
    for (let i = 0; i < arr.length; i++) {
        let encontrado = false;
        for (let j = 0; j < numeros.length; j++) {
            if (numeros[j] === arr[i]) {
                conteos[j]++;
                encontrado = true;
                break;
            }
        }
        if (!encontrado) {
            numeros[numeros.length] = arr[i];
            conteos[conteos.length] = 1;
        }
    }

    let moda = numeros[0];
    let masVeces = 0;
    for (let i = 0; i < numeros.length; i++) {
        if (conteos[i] > masVeces) {
            masVeces = conteos[i];
            moda = numeros[i];
        }
    }

    return [promedio, moda];
}

// 13. regresa el string que mas se repite en el arreglo
export function popularString(arr) {
    if (arr.length === 0) return "";

    let palabras = [];
    let conteos = [];
    for (let i = 0; i < arr.length; i++) {
        let encontrado = false;
        for (let j = 0; j < palabras.length; j++) {
            if (palabras[j] === arr[i]) {
                conteos[j]++;
                encontrado = true;
                break;
            }
        }
        if (!encontrado) {
            palabras[palabras.length] = arr[i];
            conteos[conteos.length] = 1;
        }
    }

    let masPopular = palabras[0];
    let masVeces = 0;
    for (let i = 0; i < palabras.length; i++) {
        if (conteos[i] > masVeces) {
            masVeces = conteos[i];
            masPopular = palabras[i];
        }
    }
    return masPopular;
}

// 14. revisa si un numero es potencia de 2
//lo divido hasta llegar a 1 y ver si es potencia
export function isPowerOf2(n) {
    if (n <= 0) return false;
    while (n > 1) {
        if (n % 2 !== 0) return false;
        n = n / 2;
    }
    return true;
}

// 15. ordena el arreglo de mayor a menor
export function sortDescending(arr) {
    let copia = [];
    for (let i = 0; i < arr.length; i++) {
        copia[i] = arr[i];
    }
    // al reves que bubble sort, cambio cuando el primero es menor que el segundo
    for (let i = 0; i < copia.length; i++) {
        for (let j = 0; j < copia.length - 1; j++) {
            if (copia[j] < copia[j + 1]) {
                let temp = copia[j];
                copia[j] = copia[j + 1];
                copia[j + 1] = temp;
            }
        }
    }
    return copia;
}