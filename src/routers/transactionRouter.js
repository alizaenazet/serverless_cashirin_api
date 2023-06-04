const {getTransaction,getTransactions} = require('../controllers/transactionController');

const router = [
    {
        method:"GET",
        path:"/merchants/{id}/transactions/{date}",
        handler:getTransaction
    },
    {
        method:"GET",
        path:"/merchants/{id}/transactions",
        handler:getTransactions
    }
]

module.exports = router;