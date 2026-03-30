function paso1() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Paso 1");
            resolve();
        }, 1000);
    });
}

function paso2() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Paso 2");
            resolve();
        }, 1000);
    });
}

function paso3() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("Paso 3");
            resolve();
        }, 1000);
    });
}

async function main() {
    await paso1();
    await paso2();
    await paso3();
}

main();