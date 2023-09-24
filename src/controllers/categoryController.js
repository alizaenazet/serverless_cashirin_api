const {getAll,remove,get,edit,create,addProduct} = require('../services/categoryService');
const catchError = require('../utils/catchError');
    

    async function getAllCategories(req,h) {
        const merchantId = req.params.id;
        try {
            const result = await getAll(merchantId);
            const response = h.response({
                status:"succes",
                data:result
            })
            response.code(202)
            return response;
    } catch (error) {
        console.log(error);
        return catchError(error)
        }
    }

    async function getCategory(req,h) {
        const merchantId = req.params.id;
        const categoryId = req.params.categoryId
        try {
            const result = await get(merchantId,categoryId)
            const response = h.response({
                status:"succes",
                data:{...result}
            })
            response.code(202)
            return response;
    } catch (error) {
        console.log(error);
        return catchError(error)
        }
    }

    async function editMerchant(req,h) {
        const merchantId = req.params.id;
        const category = req.params.categoryId;
        const body = req.payload;
        try {
            const result = await edit(merchantId,category,body)
            const response = h.response({
            })
            response.code(204)
            return response;
    } catch (error) {
        console.log(error);
        return catchError(error)
        }
    }


    async function createCategory(req,h) {
        const merchanatId = req.params.id;
        const body = req.payload;
        try {
            const result = await create(merchanatId,body);
            const response = h.response({
                status:"succes",
                data:{...result}
            })
            response.code(201)
            return response
    } catch (error) {
        console.log(error);
        return catchError(error)
        }
    }
    async function deleteCategory(req,h) {
        const merchantId = req.params.id;
        const categoryId = req.params.categoryId;
        try {
         await remove(merchantId,categoryId)
            const response = h.response()
            response.code(204)
            return response;
    } catch (error) {
        console.log(error);
       return catchError(error)
        }
        
    }

    async function addProductCategory(req,h) {
        const merchantId = req.params.id;
        const categoryId = req.params.categoryId;
        const body = req.payload;
        try {
        await addProduct(merchantId,categoryId,body)
            const response = h.response()
            response.code(204)
            return response;
    } catch (error) {
            return catchError(error)
        }
    }

module.exports = {getAllCategories,getCategory,editMerchant,createCategory,deleteCategory,addProductCategory}