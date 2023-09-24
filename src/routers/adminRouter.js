const {adminRegister,loginAdmin,adminDelete,adminEdit,getAdmin} = require('../controllers/adminController');

const router = [

    {
        method:"POST",
        path:"/merchants/{username}/admins/login",
        options:{
            auth:"merchantAuth",
            handler:loginAdmin
        }
    },
    {
        method:"POST",
        path:"/merchants/{username}/admins/enroll",
        options:{
            auth:"ownerAuth",
            handler:adminRegister
        }
    },
    {
        method:"DELETE",
        path:"/merchants/{username}/admins/{id}",
        options:{
            auth:"owner-admin-auth",
            handler:adminDelete
        }
        
    },
    {
        method:"PUT",
        path:"/merchants/{username}/admins/{id}",
        options:{
            auth:"owner-admin-auth",
            handler:adminEdit
        }
    },
    {
        method:"GET",
        path:"/merchants/{username}/admins/{id}",
        options:{
            auth:"owner-admin-auth",
            handler:getAdmin
        }
    }

]

module.exports = router;