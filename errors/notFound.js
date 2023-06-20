import httpStatusCodes from './httpStatusCodes.js'
import CustomError from './customError.js'


class NOTFOUND extends CustomError {

    constructor (
        name, 
        statusCode = httpStatusCodes.NOT_FOUND,
        description = "Not Found",
        isOperational = true
        ){
            super(name,statusCode, isOperational, description)
        }

}


export default NOTFOUND