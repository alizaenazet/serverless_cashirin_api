const Hapi = require('@hapi/hapi');
const merchantRoutes = require('./routers/merchantRouter');
const userRoutes = require('./routers/userRouter');
const adminRoutes = require('./routers/adminRouter');
const ownerRoutes = require('./routers/ownerRouter');
const orderRoutes = require('./routers/orderRouter');
const productRoutes = require('./routers/productRouter');
const categoryRoutes = require('./routers/categoryRouter');
const transactionRoutes  = require('./routers/transactionRouter');
const refreshTokenRoute  = require('./routers/refreshToken');
const {refreshTokenScheme,allRoleScheme,ownerUserScheme, merchantScheme,userScheme,ownerAdminScheme,ownerScheme} = require('./utils/strategyOptionJwt');
const Jwt = require('@hapi/jwt');



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

    await server.register(Jwt);
    await server.register({
        plugin: require('hapi-auth-multiple-strategies')
      })
    server.auth.scheme('customeMerchantSchema', merchantScheme);
    server.auth.scheme('customeUsertSchema', userScheme);
    server.auth.scheme('customeOwnerSchema', ownerScheme);
    server.auth.scheme('customeOwnerUserScheme', ownerUserScheme);
    server.auth.scheme('customeRefreshTokenSchema', refreshTokenScheme);
    server.auth.scheme('customeOwnerAdminScheme', ownerAdminScheme);
    server.auth.scheme('customeAllRoleScheme', allRoleScheme);
    server.auth.strategy('merchantAuth','customeMerchantSchema')
    server.auth.strategy('refreshAuth','customeRefreshTokenSchema')
    server.auth.strategy('userAuth','customeUsertSchema')
    server.auth.strategy('ownerAuth','customeOwnerSchema')
    server.auth.strategy("owner-user-auth","customeOwnerUserScheme")
    server.auth.strategy("owner-admin-auth","customeOwnerAdminScheme")
    server.auth.strategy("allRole","customeAllRoleScheme")
    server.route(merchantRoutes)
    server.route(userRoutes)
    server.route(adminRoutes)
    server.route(ownerRoutes)
    server.route(orderRoutes)
    server.route(productRoutes)
    server.route(categoryRoutes)
    server.route(transactionRoutes)
    server.route(refreshTokenRoute)
    // server.auth.default('jwt');
    await server.start();
    console.log(`server version ${server.version}`);
    console.log(`server perjalan pada ${server.info.uri}`);
};

try {
    init()
} catch (error) {
    console.log(error);
}

