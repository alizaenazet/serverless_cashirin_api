const {merchantLogin,getMerchantProfileAccount,editMerchantProfile,
    merchantRegister,merchantUploadLogo,merchantUploadBaner} = require('../controllers/merchantController');


const router = [

    {
        method:"POST",
        path:"/merchants/login/{username}",
        handler: merchantLogin
    },

    {
        method:"POST",
        path:"/merchants/signup",
        handler: merchantRegister
    },
    {
        method:"POST",
        path:"/merchants/{username}/profile/logo/upload",
        config:{
            handler: merchantUploadLogo,
            payload: {
                maxBytes: 209715200, // Batas ukuran payload (misalnya, 200 MB)
                output: 'file', // Mengoutputkan payload sebagai file
                parse: true, // Parsing payload secara otomatis
                multipart: true // Mengizinkan tipe konten multipart/form-data
              }
        }
    },
    {
        method:"POST",
        path:"/merchants/{username}/profile/baner/upload",
        config:{
            handler: merchantUploadBaner,
            payload: {
            maxBytes: 209715200, // Batas ukuran payload (misalnya, 200 MB)
            output: 'file', // Mengoutputkan payload sebagai file
            parse: true, // Parsing payload secara otomatis
            multipart: true // Mengizinkan tipe konten multipart/form-data
            }
            
            }
    },
    {
        method:"GET",
        path:"/merchants/{username}/profile",
        handler:getMerchantProfileAccount
    },
    {
        method:"PUT",
        path:"/merchants/{username}/profile",
        handler:editMerchantProfile,
    }
    

]

module.exports = router;