const {userLogin,userSingup,userDelete,userEdit,userGet} = require('../controllers/userController');

const router = [
    {
        method:"POST",
        path:"/merchants/{username}/users/login",
        options:{
            auth:"merchantAuth",
            handler:userLogin
        }
    },
    {
        method:"POST",
        path:"/merchants/{username}/users/enroll",
        options:{
            auth:"ownerAuth",
            handler:userSingup
        }
    },
    {
        method:"DELETE",
        path:"/merchants/{username}/users/{id}",
        options:{
            auth:"owner-user-auth",
            handler:userDelete
        }
    },
    {
        method:"PUT",
        path:"/merchants/{username}/users/{id}",
        options:{
            auth:"owner-user-auth",
            handler:userEdit
        }
    },
    {
        method:"GET",
        path:"/merchants/{username}/users/{id}",
        options:{
            auth:"allRole",
            handler:userGet
        }
    }
]

module.exports = router;