const { Product } = require('../dao/models/products.model.js');

class ProductManager {
  constructor() {
    
  }
  async addProduct(title, description, price, thumbnail, code, stock, status, category) {
    try {
      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        return { success: false, message: `El código del producto ya existe, Code=${code}` };
      }

      const product = new Product({
        title,
        description,
        code,
        price,
        thumbnail,
        stock,
        status,
        category,
      });

      await product.save();
      return { success: true, message: 'Producto agregado con éxito.' };
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return { success: false, message: 'Error al agregar el producto.' };
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        return { success: true, message: `Producto con ID ${id} eliminado con éxito.` };
      } else {
        return { success: false, message: `No se encontró un producto con ID ${id}.` };
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return { success: false, message: 'Error al eliminar el producto.' };
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const result = await Product.updateOne({ _id: id }, { $set: updatedProduct });
      if (result.modifiedCount > 0) {
        return { success: true, message: `Producto con ID ${id} actualizado con éxito.` };
      } else {
        return { success: false, message: `No se encontró un producto con ID ${id}.` };
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return { success: false, message: 'Error al actualizar el producto.' };
    }
  }

  async getProducts(limit = null,page = 1, pageSize = 10,  sort = null) {
    try {
      let query = Product.find();
      console.log('METODO getProducts')
      console.log('limit='+limit)
      console.log('Page='+page)
      console.log('pageSize='+pageSize)
      console.log('sort='+sort)
        
  
      // Aplica el límite si se proporciona
      if (limit !== null) {
        query = query.limit(limit);
      }  
      // Aplica el ordenamiento si se proporciona
      if (sort === 'asc' || sort === 'desc') {
        const sortDirection = sort === 'asc' ? 1 : -1;
        query = query.sort({ price: sortDirection });     
      }  
      // Calcula el índice de inicio para la paginación
      const startIndex = Math.max((page - 1) * pageSize, 0);  
      // Aplica la paginación usando Mongoose
      console.log('pagesize=' + pageSize);
      query = query.skip(startIndex).limit(pageSize);
  
      const products = await query;
      return Promise.resolve(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return Promise.resolve([]);
    }
  }
  


  async getProductByCode(code) {
    try {
      const product = await Product.findOne({ code });
      return product !== null;
    } catch (error) {
      console.error('Error al verificar producto por código:', error);
      return false;
    }
  }
}

module.exports = ProductManager;
