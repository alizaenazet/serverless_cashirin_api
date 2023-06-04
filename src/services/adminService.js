
const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck } = require('../utils/payloadcheck');




async function register(merchantUsername,body) {
    const {username,password,firstname,lastname,date_of_birth,gender,phone} = body;
    if(!payloadCheck(body)){return false}
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
    return false
    }

    async function login(merchantUsername,body) {
        if (!merchantUsername || !payloadCheck(body)) {
            return false
        }
        console.log("tes cuy");
        const username = body.username;
        const password =body.password;
        const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE merchant_username="${merchantUsername}" AND username="${username}" AND password="${password}" AND role_name="admin"`)
        if (result.length > 0) {
            return {...result[0]}
        }
        return false
    }


    async function remove(merchantUsername,adminId) {
        if (!merchantUsername || !adminId) {
            return false
        }
        const [result,metadata] = await sequelize.query(`DELETE FROM account WHERE merchant_username="${merchantUsername}" AND id="${adminId}"`)
        if (result.affectedRows > 0) {
            return true
        }
        return false
    }

    async function edit(merchantUsername,adminId,body) {
        if (!merchantUsername||!adminId||!payloadCheck(body)) {
            return false
        }


    const fields = ["first_name", "last_name", "username", "password", "birthdate", "phone", "gender_type", "merchant_username"];
    const temp = Object.keys(body);
    const isValid = temp.every(field => fields.includes(field));
  
    if (!isValid) {
      return false;
    }
  
    let updateQuery = "UPDATE account SET ";
    let fieldsQuery = "";
    let conditionQuery = ` WHERE merchant_username = "${merchantUsername}" AND id="${adminId}" AND role_name="admin"`;
  
    for (const [prop, value] of Object.entries(body)) {
      fieldsQuery = fieldsQuery + ` ${prop}="${value}"`;
      if(Object.keys(body).indexOf(prop) !== Object.keys(body).length -1){
        fieldsQuery = fieldsQuery + ","
      }
    }
  
    const query = updateQuery + fieldsQuery + conditionQuery;
    const [result, metadata] = await sequelize.query(query);
    if (result !== 0 && metadata && metadata.affectedRows > 0) {
      return { adminId, ...body };
    }
  
    return false;

    }

    async function get(merchantUsername,adminId) {
        if (!merchantUsername || !adminId) {
            return false
        }
        const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE id="${adminId}" AND merchant_username="${merchantUsername}" AND role_name="admin"`)
        if (result.length > 0) {
            return {...result[0]}
        }
        return false;

    }

    module.exports = {register,login,remove,edit,get}