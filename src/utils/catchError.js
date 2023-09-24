const Boom = require('@hapi/boom');

function catchError(error) {
    if (Boom.isBoom(error)) {
        return error;
    }else{
    throw Boom.badRequest("something wrong : \n" + error.message,error) 
    }
}

module.exports = catchError;