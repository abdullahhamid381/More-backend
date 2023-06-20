import httpStatusCodes from './httpStatusCodes.js'
import CustomError from './customError.js'


class ValidationError extends CustomError {

    constructor (
        name, 
        statusCode = httpStatusCodes.BAD_REQUEST,
        description = "Validation Error",
        isOperational = false
        ){
            super(name,statusCode, isOperational, description)
        }

}


export default ValidationError