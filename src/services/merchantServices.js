
const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');

async function getMerchant(username) {
    if (!username) {return null}
    const [result,metadata] = await sequelize.query(`SELECT username FROM merchant WHERE username="${username}"`)
    if (result.length > 0) {
        return result[0]
    }
    return false
}

async function login(username,password) {
    if(!password) return null;

    const [result,metadata] = await sequelize.query(`SELECT id,name as merchant_name FROM merchant WHERE username="${username}" AND password="${password}"`)
    if (result.length > 0) {
        return result[0]
    }
    
    return false

}

async function register(username,password,merchant_name) {
    if (!username||!password||!merchant_name) {
        return false
    }
   const isAvailable = await getMerchant(username);

    if (isAvailable) {return false}
    const id = nanoid();
    const query = `INSERT INTO merchant (id,username,password,name) VALUES ("${id}","${username}","${password}","${merchant_name}")`
    const [result,metadata] = await sequelize.query(query)
    
    if (result == 0) {
        createProfile(username)
        return {
            id,
            merchant_name
        }
    }
    return false;
}

async function uploadBaner(username,url) {

    if (!username) {return false}
    const query = `UPDATE merchant_profile SET baner_url = "${url}" WHERE merchant_username="${username}"`;
    const [result,metadata] = await sequelize.query(query)
    if (result==0) {
        return true
    }
    return false;
}

async function uploadLogo(username,url) {
    if (!username) {return false}
    const queryLogo = `UPDATE merchant_profile SET logo_url = "${url}" WHERE merchant_username="${username}"`
    const [result,metadata] = await sequelize.query(queryLogo)
    if (result==0) {
        return true
    }
    return false
}

async function createProfile(username) {
    if (!username) {
        return false;
    }
    const id = nanoid()
    const query = `INSERT INTO merchant_profile (id,merchant_username) VALUES ("${id}","${username}")`;
    const [result,metadata] = await sequelize.query(query)
    if (result==0) {
        return true
    }
    return false
}

async function getProfileAccount(username) {
    if (!username) {return false}
    const query = `SELECT id,merchant_username,logo_url,baner_url,phone FROM merchant_profile WHERE merchant_username="${username}"`
    const [result,metadata] = await sequelize.query(query)
    if (result.length > 0) {
        return {...result[0]}
    }
    return false
}

async function editProfile(username,body) {
    if (!body||!username) {
        return false
    }
    const fields = ["address","phone"];
    const temp = Object.keys(body);
    const isValid = temp.every(field => fields.includes(field));
  
    if (!isValid) {
      return false;
    }

let updateQuery = "UPDATE merchant_profile SET ";
    let fieldsQuery = "";
    let conditionQuery = ` WHERE merchant_username = "${username}"`;
  
    for (const [prop, value] of Object.entries(body)) {
      fieldsQuery = fieldsQuery + ` ${prop}="${value}"`;
      if(Object.keys(body).indexOf(prop) !== Object.keys(body).length -1){
        fieldsQuery = fieldsQuery + ","
      }
    }
  
    const query = updateQuery + fieldsQuery + conditionQuery;
    const [result, metadata] = await sequelize.query(query);
    if (result !== 0 && metadata && metadata.affectedRows > 0) {
      return { username, ...body };
    }
  
    return false;
}





module.exports = {login,register,uploadBaner,editProfile,uploadLogo,getMerchant,getProfileAccount,createProfile};