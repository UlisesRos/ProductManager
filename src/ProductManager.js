const fs = require('fs/promises')
const path = require('path')


class ProductManager {

    constructor(filename){
        this.filename = filename
        this.filepath = path.join(__dirname, this.filename)
    }

    async addProduct (producto) {
        const data = await fs.readFile(this.filepath, 'utf-8')
        const product = JSON.parse(data)

        const newId = product[product.length - 1]?.id || 0
        
        
        if(!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock){
            console.log('Todos los campos son obligatorios')
        } else if (product.find(prod => prod.title == producto.title || prod.code == producto.code)) {
            console.log('No se puede repetir el title o code de un producto') 
        } else {
            console.log(`El Producto "${producto.title}" fue creado con exito`)

            product.push({
                ...producto,
                id: newId + 1
            })
        }
        
        await fs.writeFile(this.filepath, JSON.stringify(product, null, 2))
    }

    async getProducts () {
        const data = await fs.readFile(this.filepath, 'utf-8')
        const product = JSON.parse(data)

        return product
    }

    async getProductById (id) {
        const data = await fs.readFile(this.filepath, 'utf-8')
        const product = JSON.parse(data)
        
        const productId = product.find(prod => prod.id == id)

        return productId
    }
    
    async updateProduct (id, edit) {
        const data = await fs.readFile(this.filepath, 'utf-8')
        const product = JSON.parse(data)

        let productId = product.find(prod => prod.id == id)
        const productDelete = product.filter(prod => prod.id !== id)
        
        const productEdit = {
            ...productId,
            ...edit
        }

        if(productId){
            await fs.writeFile(this.filepath, JSON.stringify(productDelete, null, 2))
            productDelete.push(productEdit)
        } else{
            console.log("ID INEXISTENTE")
        }

        await fs.writeFile(this.filepath, JSON.stringify(productDelete, null, 2))
    }

    async deleteProduct (id) {
        const data = await fs.readFile(this.filepath, 'utf-8')
        const product = JSON.parse(data)

        const productId = product.find(prod => prod.id == id)

        if(productId){
            const productDelete = product.filter(prod => prod.id !== id)
            await fs.writeFile(this.filepath, JSON.stringify(productDelete, null, 2))
            console.log(`El producto con id: ${productId.id} ha sido eliminado`)
        }
        else {
            console.log("ID INEXISTENTE")
        }
    }

}

module.exports = ProductManager


