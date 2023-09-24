const {getOrder,paymentNotifications,getAllOrders,finishOrder,createOrder} = require('../controllers/orderController');

const router = [
    {
        method:"GET",
        path: "/merchants/{username}/orders/{id}",
        handler: getOrder
    },
    {
        method:"GET",
        path: "/merchants/{username}/orders",
        options:{
            auth:"owner-user-auth",
            handler: getAllOrders
        }
    },
    {
        method:"PUT",
        path: "/merchants/{username}/orders/{id}/finish",
        options:{
            auth:"owner-user-auth",
            handler: finishOrder
        }
    },
    {
        method:"POST",
        path: "/merchants/{id}/orders/create",
        options:{
            auth:"owner-user-auth",
            handler: createOrder
        }
    },
    {
        method:"POST",
        path:"/order/paymentNotifications",
        handler: paymentNotifications
    }
]

module.exports = router;