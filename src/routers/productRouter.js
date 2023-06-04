const {getProducts,getProduct,createProduct,deleteProduct,editProduct,updateProductStock} = require('../controllers/productController');

const router = [

    {
        method:'GET',
        path:'/merchants/{id}/products',
        handler: getProducts
    },
    {
        method:'GET',
        path:'/merchants/{Id}/products/{productId}',
        handler: getProduct
    },
    
    {
        method:'POST',
        path:'/merchants/{id}/products',
        handler: createProduct
    },
    {
        method:'DELETE',
        path:'/merchants/{id}/products/{productId}',
        handler: deleteProduct
    },
    {
        method:'PUT',
        path:'/merchants/{id}/products/{productId}',
        handler: editProduct
    },
    {
        method:'PUT',
        path:'/merchants/{id}/products/{productId}/updatestock',
        handler: updateProductStock
    }


]

module.exports = router