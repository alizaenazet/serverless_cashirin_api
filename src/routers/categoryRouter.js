const {getAllCategories,addProductCategory,deleteCategory,getCategory,editMerchant,createCategory} = require('../controllers/categoryController');

const router = [
    {
        method : 'GET',
        path: '/merchants/{id}/categories',
        handler : getAllCategories
    },
    {
        method : 'GET',
        path: '/merchants/{id}/categories/{categoryId}',
        handler : getCategory
    },
    {
        method : 'PUT',
        path: '/merchants/{id}/categories/{categoryId}',
        options:{
            auth:"owner-admin-auth",
            handler : editMerchant
        }
    },
    {
        method : 'POST',
        path: '/merchants/{id}/categories',
        options:{
            auth:"owner-admin-auth",
            handler : createCategory
        }
    },
    {
        method : 'DELETE',
        path: '/merchants/{id}/categories/{categoryId}',
        options:{
            auth:"owner-admin-auth",
            handler : deleteCategory
        }
    },
    {
        method : 'POST',
        path:'/merchants/{id}/categories/{categoryId}/add',
        options:{
            auth:"owner-admin-auth",
            handler : addProductCategory
        }
    }

]

module.exports = router;