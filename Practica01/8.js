function Callback(callback){
    setTimeout(()=>{
        callback()
    },2000)
}

Callback(()=>{
    console.log("Callback ejecutado después de 2 segundos")
})