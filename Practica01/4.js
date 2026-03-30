function miFuncion(v) {
    let mayor = v[0];
    let menor = v[0];

    for (let i = 1; i < v.length; i++) {
        if (v[i] > mayor) {
            mayor = v[i];
        }
        if (v[i] < menor) {
            menor = v[i];
        }
    }

    return {
        mayor: mayor,
        menor: menor
    };
}

let obj = miFuncion([3,1,5,4,2]);
console.log(obj);