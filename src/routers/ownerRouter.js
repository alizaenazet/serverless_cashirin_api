const {ownerLogin,ownerRegister,ownerEdit} = require('../controllers/ownerController');

const router = [
    {
        method:"POST",
        path:"/merchants/{username}/owner/login",
        handler: ownerLogin
    },
    {
        method:"POST",
        path:"/merchants/{username}/owner/create",
        handler: ownerRegister
    },
    {
        method:"PUT",
        path:"/merchants/{username}/owner",
        handler: ownerEdit
    }
]

module.exports = router