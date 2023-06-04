const {userLogin,userSingup,userDelete,userEdit,userGet} = require('../controllers/userController');

const router = [
    {
        method:"POST",
        path:"/merchants/{username}/users/login",
        handler:userLogin
    },
    {
        method:"POST",
        path:"/merchants/{username}/users/enroll",
        handler:userSingup
    },
    {
        method:"DELETE",
        path:"/merchants/{username}/users/{id}",
        handler:userDelete
    },
    {
        method:"PUT",
        path:"/merchants/{username}/users/{id}",
        handler:userEdit
    },
    {
        method:"GET",
        path:"/merchants/{username}/users/{id}",
        handler:userGet
    }
]

module.exports = router;