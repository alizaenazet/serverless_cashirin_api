const {getAll,remove,get,edit,create,addProduct} = require('../services/categoryService');
    

    async function getAllCategories(req,h) {
        const merchantId = req.params.id;
        try {
            const result = await getAll(merchantId);
        if (result) {
            const response = h.response({
                status:"succes",
                data:result
            })
            response.code(202)
            return response;
        }
        const response = h.response({
            status:"fail"
        })
        response.code(400)
        return response;
        
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"something wrong"
        })
        response.code(403)
        return response;
        
        }
    }

    async function getCategory(req,h) {
        const merchantId = req.params.id;
        const categoryId = req.params.categoryId
        try {
            const result = await get(merchantId,categoryId)
        if (result) {
            const response = h.response({
                status:"succes",
                data:{...result}
            })
            response.code(200)
            return response;
        }
        const response = h.response({
            status:"fail"
        })
        response.code(400)
        return response;
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"something wrong"
        })
        response.code(403)
        return response;

        }

        
    }

    async function editMerchant(req,h) {
        const merchantId = req.params.id;
        const category = req.params.categoryId;
        const body = req.payload;
        try {
            const result = await edit(merchantId,category,body)
        if (result) {
            const response = h.response({
            })
            response.code(204)
            return response;
        }
        const response = h.response({
            status:"fail"
        })
        response.code(400)
        return response;
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"something wrong"
        })
        response.code(403)
        return response;
        }
    }


    async function createCategory(req,h) {
        const merchanatId = req.params.id;
        const body = req.payload;
        try {
            const result = await create(merchanatId,body);
        if (result) {
            const response = h.response({
                status:"succes",
                data:{...result}
            })
            response.code(201)
            return response
        }
        const response = h.response({
            status:"fail"
        })
        response.code(400)
        return response
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"something wrong"
        })
        response.code(403)
        return response
        }
    }
    async function deleteCategory(req,h) {
        const merchantId = req.params.id;
        const categoryId = req.params.categoryId;
        try {
            const result = await remove(merchantId,categoryId)
        if (result) {
            const response = h.response()
            response.code(204)
            return response;
        }
        const response = h.response({
            status:"fail"
        })
        response.code(400)
        return response;
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"something wrong"
        })
        response.code(403)
        return response;
        }
        
    }

    async function addProductCategory(req,h) {
        const merchantId = req.params.id;
        const categoryId = req.params.categoryId;
        const body = req.payload;
        try {
            const result = await addProduct(merchantId,categoryId,body)
        if(result){
            const response = h.response()
            response.code(204)
            return response;
        }
        const response = h.response({
            status:"fail"
        })
        response.code(400)
        return response;
    } catch (error) {
            const response = h.response({
                status:"something wrong"
            })
            response.code(403)
            return response;
        }
    }

module.exports = {getAllCategories,getCategory,editMerchant,createCategory,deleteCategory,addProductCategory}