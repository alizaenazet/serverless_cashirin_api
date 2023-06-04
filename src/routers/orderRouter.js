const {getOrder,getAllOrders,finishOrder,createOrder} = require('../controllers/orderController');

const router = [
    {
        method:"GET",
        path: "/merchants/{username}/orders/{id}",
        handler: getOrder
    },
    {
        method:"GET",
        path: "/merchants/{username}/orders",
        handler: getAllOrders
    },
    {
        method:"PUT",
        path: "/merchants/{username}/orders/{id}/finish",
        handler: finishOrder
    },
    {
        method:"POST",
        path: "/merchants/{id}/orders/create",
        handler: createOrder
    }
]

module.exports = router;