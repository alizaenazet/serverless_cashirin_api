const Hapi = require('@hapi/hapi');
const merchantRoutes = require('./routers/merchantRouter');
const userRoutes = require('./routers/userRouter');
const adminRoutes = require('./routers/adminRouter');
const ownerRoutes = require('./routers/ownerRouter');
const orderRoutes = require('./routers/orderRouter');
const productRoutes = require('./routers/productRouter');
const categoryRoutes = require('./routers/categoryRouter');
const transactionRoutes  = require('./routers/transactionRouter');


const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3050,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    
    });
    server.route(merchantRoutes)
    server.route(userRoutes)
    server.route(adminRoutes)
    server.route(ownerRoutes)
    server.route(orderRoutes)
    server.route(productRoutes)
    server.route(categoryRoutes)
    server.route(transactionRoutes)

    await server.start();
    console.log(`server version ${server.version}`);
    console.log(`server perjalan pada ${server.info.uri}`);
};

init()

