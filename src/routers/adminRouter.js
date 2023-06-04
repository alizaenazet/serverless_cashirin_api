const {adminRegister,loginAdmin,adminDelete,adminEdit,getAdmin} = require('../controllers/adminController');

const router = [

    {
        method:"POST",
        path:"/merchants/{username}/admins/login",
        handler:loginAdmin
    },
    {
        method:"POST",
        path:"/merchants/{username}/admins/enroll",
        handler:adminRegister
    },
    {
        method:"DELETE",
        path:"/merchants/{username}/admins/{id}",
        handler:adminDelete
    },
    {
        method:"PUT",
        path:"/merchants/{username}/admins/{id}",
        handler:adminEdit
    },
    {
        method:"GET",
        path:"/merchants/{username}/admins/{id}",
        handler:getAdmin
    }

]

module.exports = router;