const {merchantLogin,logoutMerchant,uploadImageCollection,getMerchantProfileAccount,editMerchantProfile,
    deleteImageCollection,merchantRegister,merchantUploadLogo,merchantUploadBaner} = require('../controllers/merchantController');


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
        options:{
            auth:"ownerAuth",
            handler: merchantUploadLogo,
            payload: {
                maxBytes: 209715200, // Batas ukuran payload (misalnya, 200 MB)
                output: 'file', // Mengoutputkan payload sebagai file
                parse: true, // Parsing payload secara otomatis
                multipart: true // Mengizinkan tipe konten multipart/form-data
              }
        },
    },
    
    {
        method:"POST",
        path:"/merchants/{username}/profile/baner/upload",
        options:{
            auth:"ownerAuth",
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
        options:{
            handler:editMerchantProfile,
            auth:"ownerAuth"
        }
    },
    {
        method:"POST",
        path:"/merchants/logout",
        options:{
            handler:logoutMerchant,
            auth:"merchantAuth"
        }
    },
    {
        method:"POST",
        path:"/merchants/{username}/uploadImage",
        options:{
            handler:uploadImageCollection,
            auth:"ownerAuth",
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
        path:"/merchants/{username}/deleteImage",
        options:{
            handler:deleteImageCollection,
            auth:"ownerAuth"
        }
    }
    

]

module.exports = router;