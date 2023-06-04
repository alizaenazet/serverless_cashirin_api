const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck } = require('../utils/payloadcheck');

async function login(merchantUsername,body) {
    if (!merchantUsername,!payloadCheck(body)) {
        return false
    }

    const username = body.username;
    const password = body.password;

    const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE merchant_username="${merchantUsername}" AND username="${username}" AND password="${password}" AND role_name="owner"`)
    if (result.length > 0) {
        return {...result}
    }

    return false;

}

async function register(merchantUsername,body) {
    if (!merchantUsername||!payloadCheck(body)) {
        return false;
    }
    const id = nanoid()
    const {username,password,firstname,lastname,date_of_birth,gender,phone} = body;
    const query = 
    `INSERT INTO account (id,username,first_name,last_name,password,birthdate,phone,gender_type,role_name,merchant_username)
     VALUES ("${id}","${username}","${firstname}","${lastname}","${password}","${date_of_birth}","${phone}","${gender}","owner","${merchantUsername}")`
    const [result,metadata] = await sequelize.query(query)
    if (result == 0) {
        return {
            id : id,
            username : username,
            firstname : firstname,
            lastname : lastname,
            role: "owner"
        }
    }
    return false
    
}

async function edit(merchantUsername,body) {
    if (!merchantUsername || !payloadCheck(body)) {
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
    let conditionQuery = ` WHERE merchant_username = "${merchantUsername}" AND role_name="owner"`;
  
    for (const [prop, value] of Object.entries(body)) {
      fieldsQuery = fieldsQuery + ` ${prop}="${value}"`;
      if(Object.keys(body).indexOf(prop) !== Object.keys(body).length -1){
        fieldsQuery = fieldsQuery + ","
      }
    }
  
    const query = updateQuery + fieldsQuery + conditionQuery;
    const [result, metadata] = await sequelize.query(query);
    if (result !== 0 && metadata && metadata.affectedRows > 0) {
      return { ...body };
    }
  
    return false;
}


module.exports = {login,register,edit}