function miFuncion(texto){

    let conteo = {a:0,e:0,i:0,o:0,u:0}
    texto = texto.toLowerCase()

    for(let vocal of texto){
        if(conteo.hasOwnProperty(vocal)){
            conteo[vocal]++
        }
    }

    return conteo
}

let obj = miFuncion("euforia")
console.log(obj)