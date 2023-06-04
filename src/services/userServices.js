

const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');

async function getUser(username) {
    const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE username="${username}"`)
    if (result.length > 0) {
        return result
    }
    return false
}

async function login(merchant,body) {
if (!merchant||!body) {
    return false;
}

const username = body.username
const password =  body.password
const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE merchant_username="${merchant}" AND username="${username}" AND password="${password}" AND role_name="user"`)

if (result.length > 0) {
    return{
        ...result[0]
    }
}

return false
}

async function singup(merchant,body) {
    if (!merchant || !body) {
        return false
    }
    const {username,password,firstname,lastname,date_of_birth,gender,phone} = body;
    const isAvailable = await getUser(username); // buat cek apakah sudah ada atau belum 
    if (!isAvailable) {
    const id = nanoid();
    const query = 
    `INSERT INTO account (id,username,first_name,last_name,password,birthdate,phone,gender_type,role_name,merchant_username)
     VALUES ("${id}","${username}","${firstname}","${lastname}","${password}","${date_of_birth}","${phone}","${gender}","user","${merchant}")`
    const [result,metadata] = await sequelize.query(query)
    if (result == 0) {
        return {
            id : id,
            username : username,
            firstname : firstname,
            lastname : lastname,
            role: "user"
        }
    }
    return false
    }
}

async function remove(merchantUsername,userId) {
    if (!merchantUsername || !userId) {
        return false
    }
    const [result,metadata] = await sequelize.query(`DELETE FROM account WHERE merchant_username="${merchantUsername}" AND id="${userId}"`)
    if (result.affectedRows > 0) {
        return true
    }
    return false
}

// 
async function edit(merchantUsername, userId, body) {
    if (!merchantUsername || !userId || !body) {
      return false;
    }
  
    const fields = ["first_name", "last_name", "username", "password", "birthdate", "phone", "gender_type", "merchant_username"];
    const temp = Object.keys(body);
    const isValid = temp.every(field => fields.includes(field));
  
    if (!isValid) {
      return false;
    }
  
    let updateQuery = "UPDATE account SET ";
    let fieldsQuery = "";
    let conditionQuery = ` WHERE merchant_username = "${merchantUsername}" AND id = "${userId}" AND role_name="user"`;
  
    for (const [prop, value] of Object.entries(body)) {
      fieldsQuery = fieldsQuery + ` ${prop}="${value}"`;
      if(Object.keys(body).indexOf(prop) !== Object.keys(body).length -1){
        fieldsQuery = fieldsQuery + ","
      }
    }
  if (!fieldsQuery) {
    return false
  }
    const query = updateQuery + fieldsQuery + conditionQuery;
    const [result, metadata] = await sequelize.query(query);
    if (result !== 0 && metadata && metadata.affectedRows > 0) {
      return { userId, ...body };
    }
  
    return false;
  }

  async function get(merchantUsername,userId) {
    if (!merchantUsername || !userId) {
        return false
    }
    const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE id="${userId}" AND merchant_username="${merchantUsername}" AND role_name="admin" `)
    if (result.length > 0) {
        return {...result[0]}
    }
    return false;
  }

  

module.exports = {login,singup,remove,edit,get}