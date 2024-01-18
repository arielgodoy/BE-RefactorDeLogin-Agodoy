const express = require('express');
const ProductManager = require('../managers/ProductManagerMongo.js');
const { productsModel } = require('../dao/models/products.model.js')
const productManager = new ProductManager();
const router = express.Router();

router
    .get('/', async (req, res) => {
        try {
        const limit = parseInt(req.query.limit) || null; // Puedes ajustar este valor según tus necesidades
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;        
        const sort = req.query.sort || null;
        console.log('Router Products')
        console.log('limit='+limit)
        console.log('Page='+page)
        console.log('pageSize='+pageSize)
        console.log('sort='+sort)

        const allProducts = await productManager.getProducts(limit,page, pageSize,sort);
        
        res.json(allProducts);
        } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
        }
    })
    .get('/:pid', async (req, res) => {
        const id = parseInt(req.params.pid);
        try {            
            const producto = productManager.getProductById(id);
            if (producto) {
                res.json(producto);
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    })

    .put('/:id', (req, res) => {
        const productId = parseInt(req.params.id);

        // Validar si el id está presente y es un número válido
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'ID no válido.' });
        }
        const updatedProductData = req.body;
        productManager.updateProduct(productId, updatedProductData);
        res.json({ message: `Producto con ID ${productId} actualizado con éxito.` });
    })

    .delete('/:id', (req, res) => {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'ID no válido.' });
        }
        //devolvemos respuesta  desde el metodo del deletePorduct ProductManager 
        res.json(productManager.deleteProduct(productId));

    })



    .post('/', (req, res) => {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        productManager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        res.json({ message: 'Producto agregado con éxito.' });
    })


//export default router;
module.exports = router;  

