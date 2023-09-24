const {getProducts,getProduct,createProduct,deleteProduct,editProduct,updateProductStock} = require('../controllers/productController');

const router = [

    {
        method:'GET',
        path:'/merchants/{username}/products',
        handler: getProducts
    },
    {
        method:'GET',
        path:'/merchants/{username}/products/{productId}',
        handler: getProduct
    },
    
    {
        method:'POST',
        path:'/merchants/{id}/products',
        options:{
            auth:"owner-admin-auth",
            handler: createProduct
        }
    },
    {
        method:'DELETE',
        path:'/merchants/{id}/products/{productId}',
        options:{
            auth:"owner-admin-auth",
            handler: deleteProduct
        }
    },
    {
        method:'PUT',
        path:'/merchants/{id}/products/{productId}',
        options:{
            auth:"owner-admin-auth",
            handler: editProduct
        }
    },
    {
        method:'PUT',
        path:'/merchants/{id}/products/{productId}/updatestock',
        options:{
            auth:"owner-admin-auth",
            handler: updateProductStock
        }
    }


]

module.exports = router