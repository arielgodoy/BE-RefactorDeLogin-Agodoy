
const { model, Schema } = require('mongoose');


const cartSchema = new Schema({
    id: Number,
    products: [
        {
            productId: Number,
            quantity: Number
        }
    ]
});

const CartModel = model('Cart', cartSchema);

class CartsManager {
    constructor() {
        
    }

    async readCarts() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            console.error('Error reading carts from MongoDB:', error);
            return [];
        }
    }

    async getCartById(cid) {
        try {
            console.log(cid); // <-- Aquí deberías imprimir cid, no id
            const cart = await CartModel.findOne({ _id: cid });
            if (!cart) {
                return 'No se encuentra el carrito';
            }
            return cart;
        } catch (error) {
            console.error('Error getting cart by ID from MongoDB:', error);
            return 'Error obteniendo carrito por ID';
        }
    }
    

    async createCart() {
        try {
            const carts = await this.readCarts();
            let newCart;
    
            if (carts.length === 0) {
                newCart = { products: [] }; // Eliminamos el campo 'id' aquí
            } else {
                newCart = { products: [] }; // Eliminamos el campo 'id' aquí también
            }
    
            // Generamos el ID compuesto utilizando la función generaIdcompuesto
            newCart.id = this.generaIdcompuesto(carts.length);
    
            const createdCart = await CartModel.create(newCart);
            return createdCart;
        } catch (error) {
            console.error('Error creating cart in MongoDB:', error);
            return 'Error creando carrito';
        }
    }
    

    async addProductToCart(cid, pid) {
        try {
            const cart = await CartModel.findOne({ id: cid });
            if (!cart) {
                return 'No se encuentra el carrito';
            }

            const productIndex = cart.products.findIndex((product) => product.productId === pid);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ productId: pid, quantity: 1 });
            }

            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            console.error('Error adding product to cart in MongoDB:', error);
            return 'Error añadiendo producto al carrito';
        }
    }

    getCarts() {
        return this.readCarts();
    }

    generaIdcompuesto(largo) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const idCorrelative = largo + 1;
        const combinedId = year * 1000000 + month * 10000 + day * 100 + idCorrelative;
        return combinedId;
    }
}

module.exports = CartsManager;
