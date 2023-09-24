const {getTransaction,getTransactions} = require('../controllers/transactionController');

const router = [
    {
        method:"GET",
        path:"/merchants/{id}/transactions/{date}",
        options:{
            auth:"owner-admin-auth",
            handler:getTransaction
        }
    },
    {
        method:"GET",
        path:"/merchants/{id}/transactions",
        options:{
            auth:"owner-admin-auth",
            handler:getTransactions
        }
    }
]

module.exports = router;