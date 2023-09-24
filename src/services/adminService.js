
const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck, payloadCheckProperties } = require('../utils/payloadcheck');
const Boom  = require('@hapi/boom');
const { generateTokenFb } = require('../config/firebaseAdmin');




async function register(merchantUsername,body) {
    const {username,password,firstname,lastname,date_of_birth,gender,phone} = body;
    payloadCheckProperties(body,["username","password","firstname","lastname","date_of_birth","gender","phone"],"must be included")
    const id = nanoid();
    const query = 
    `INSERT INTO account (id,username,first_name,last_name,password,birthdate,phone,gender_type,role_name,merchant_username)
     VALUES ("${id}","${username}","${firstname}","${lastname}","${password}","${date_of_birth}","${phone}","${gender}","admin","${merchantUsername}")`
    const [result,metadata] = await sequelize.query(query)
    if (result == 0) {
        return {
            id : id,
            username : username,
            firstname : firstname,
            lastname : lastname,
            role: "admin"
        }
    }
    throw Boom.badImplementation("Register fail")
    }

    async function login(merchantUsername,body) {
        if (!merchantUsername) throw Boom.badRequest("username not included");
        const {username,password} =  payloadCheckProperties(body,["username","password"],"must be included");
        const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE merchant_username="${merchantUsername}" AND username="${username}" AND password="${password}" AND role_name="admin"`)
        if (result.length > 0) {
            const account = result[0]
            const token = await generateTokenFb(account.id,"admin")
            return {
                token:token,
                account:{...result[0]}
            }
        }
        throw Boom.unauthorized("invalid username/password")
    }


    async function remove(params) {
        const {username,id} = payloadCheckProperties(params,["username","id"],"must be included")
        merchantUsername=username
        adminId=id
        const [result,metadata] = await sequelize.query(`DELETE FROM account WHERE merchant_username="${merchantUsername}" AND id="${adminId}"`)
        if (result.affectedRows > 0) {
            return true
        }
        throw Boom.badRequest("admin not found")
    }

    async function edit(params,body) {
        const {username,id} = payloadCheckProperties(params,["username","id"],"params not included");
    const fields = ["first_name", "last_name", "password", "birthdate", "phone", "gender_type"];
    const temp = Object.keys(body);
    const isValid = temp.every(field => fields.includes(field));
  
    if (!isValid) {
        throw Boom.badRequest("invalid properties")
    }
  
    let updateQuery = "UPDATE account SET ";
    let fieldsQuery = "";
    let conditionQuery = ` WHERE merchant_username = "${username}" AND id="${id}" AND role_name="admin"`;
  
    for (const [prop, value] of Object.entries(body)) {
      fieldsQuery = fieldsQuery + ` ${prop}="${value}"`;
      if(Object.keys(body).indexOf(prop) !== Object.keys(body).length -1){
        fieldsQuery = fieldsQuery + ","
      }
    }
  
    const query = updateQuery + fieldsQuery + conditionQuery;
    const [result, metadata] = await sequelize.query(query);
    if (result !== 0 && metadata && metadata.affectedRows > 0) {
      return { id, ...body };
    }
    throw Boom.notImplemented("nothing is updated")

    }

    async function get(params) {
        const {username,id} = payloadCheckProperties(params,["username","id"],"params not included")
        const merchantUsername=username
        const adminId=id
        const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE id="${adminId}" AND merchant_username="${merchantUsername}" AND role_name="admin"`)
        if (result.length > 0) {
            return {...result[0]}
        }
    throw Boom.badRequest("admin account not found")
    }

    module.exports = {register,login,remove,edit,get}