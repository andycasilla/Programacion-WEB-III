/*2. Crear una función que invierta el orden de las palabras en una frase.
let cad = miFuncion(“abcd”)
console.log(obj) // dcba*/

function miFuncion(cad) {
    let res = "";
    let n = cad.length;

    for (let i = n - 1; i >= 0; i--) {
        res = res + cad[i];
    }

    return res;
}

let cad = miFuncion("abcd");
console.log(cad);