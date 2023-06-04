
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

module.exports = {payloadCheck}