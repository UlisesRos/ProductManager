const express = require('express')
const ProductManager = require('./ProductManager')

const app = express()

const productManager = new ProductManager('productos.json')
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send(`
    <h1 style="color: blue; text-align: center">Bienvenidos a ProductManager</h1>
    `)
})

app.get('/products', async (req, res) => {
    const { limit } = req.query
    const products = await productManager.getProducts()

    let filtrados = []

    if(limit) {
        if(limit > products.length){
            res.send(products)
        } else {
            for(let i = 0; i < limit; i++){
                filtrados.push(products[i])
            }
    
            res.send(filtrados)
        }
    }
    else{
        res.send(products)
    }

})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await productManager.getProductById(id)

    if(!product){
        res.status(404).send({
            Error: `El producto con el ID: ${id} es inexistente. Pruebe ingresando otro ID`
        })
    }
    else {
        res.send(product)
    }

})


const port = 8080
app.listen(port, () => {
    console.log(`Servidor leyendose desde http://localhost:${port}`)
})