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
        handler : editMerchant
    },
    {
        method : 'POST',
        path: '/merchants/{id}/categories',
        handler : createCategory
    },
    {
        method : 'DELETE',
        path: '/merchants/{id}/categories/{categoryId}',
        handler : deleteCategory
    },
    {
        method : 'POST',
        path:'/merchants/{id}/categories/{categoryId}/add',
        handler : addProductCategory
    }

]

module.exports = router;