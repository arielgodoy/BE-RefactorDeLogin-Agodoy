
const express = require('express');
//const { cartModel } = require('../dao/models/carts.model.js')
const CartManager = require('../managers/CartManagerMongo.js')
const cartManager = new CartManager();
const router = express.Router();

router
    .get('/:cid', async (req,res)=>{
        const {cid} = req.params
        const cart = await cartManager.getCartById(cid) 

        res.send({
            status: 'success',
            payload: cart        
        })
    })

    .get('/', async (req,res)=>{
        const {cid} = req.params
        const cart = await cartManager.getCarts();

        res.send({
            status: 'success',
            payload: cart        
        })
    })


    .post('/', async (req,res)=>{
        const newCart = req.body

        const result = await cartModel.create(newCart)

        
        res.send({
            status: 'success',
            payload: result
        })
    })

module.exports = router