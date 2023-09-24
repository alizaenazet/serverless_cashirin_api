const {ownerLogin,ownerRegister,ownerEdit} = require('../controllers/ownerController');

const router = [
    {
        method:"POST",
        path:"/merchants/{username}/owner/login",
        options:{
            handler: ownerLogin,
            auth:'merchantAuth'
        }
    },
    {
        method:"POST",
        path:"/merchants/{username}/owner/create",
        options:{
            handler: ownerRegister,
            auth:'merchantAuth'
        }
    },
    {
        method:"PUT",
        path:"/merchants/{username}/owner",
        options:{
            handler: ownerEdit,
            auth:'ownerAuth'
        }
    }
]

module.exports = router