function paso1(callback) {
    setTimeout(() => {
        callback("Paso 1");
    }, 1000);
}

function paso2(msg, callback) {
    setTimeout(() => {
        callback(msg + " → Paso 2");
    }, 1000);
}

function paso3(msg, callback) {
    setTimeout(() => {
        callback(msg + " → Paso 3");
    }, 1000);
}

paso1((r1) => {
    paso2(r1, (r2) => {
        paso3(r2, (r3) => {
            console.log(r3);
        });
    });
});