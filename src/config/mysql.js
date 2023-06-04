const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    dialect:'mysql',
    host:'cashierinapp.clwrabh9dzl6.ap-southeast-3.rds.amazonaws.com',
    port:'3306',
    username:'cashierin_admin',
    password:'cashierinadmin',
    database:'cashierin'
});

sequelize.authenticate()
.then(()=> console.log("connecting succes"))
.catch((error) => console.log(error));

module.exports = sequelize;