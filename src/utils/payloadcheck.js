const Boom = require('@hapi/boom');



function payloadCheck(payload,...optionalProperties) {
    if (!payload) {return false}
    for(let prop in payload){
        let value = payload[prop];
        const isOptional = optionalProperties.includes(prop);
        if (!value && !isOptional) {
            payload[prop] = false;    
        }
    }
    return payload;
}

function payloadCheckProperties(payload,properties,message) {
    let notRequiredProperties = [];
    for (let i = 0; i < properties.length; i++) {
        const propertyName = properties[i];
        if (!payload.hasOwnProperty(propertyName)) {
            notRequiredProperties.push(propertyName)
        }
      }
      if (notRequiredProperties.length > 0 ) {
        throw Boom.badRequest(notRequiredProperties.join(", ") + " " + message)
      }
      return payload;
}

module.exports = {payloadCheck,payloadCheckProperties}