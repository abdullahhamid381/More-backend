import httpStatusCodes from './httpStatusCodes.js'
import CustomError from './customError.js'


class BadRequest extends CustomError {

    constructor (
        name, 
        statusCode = httpStatusCodes.BAD_REQUEST,
        description = "Bad Request",
        isOperational = false
        ){
            super(name,statusCode, isOperational, description)
        }

}


export default BadRequest