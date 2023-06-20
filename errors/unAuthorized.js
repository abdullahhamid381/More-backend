import httpStatusCodes from './httpStatusCodes.js'
import CustomError from './customError.js'


class UnAuthorized extends CustomError {

    constructor (
        name, 
        statusCode = httpStatusCodes.UNAUTHORIZED,
        description = "UnAuthorized",
        isOperational = false
        ){
            super(name,statusCode, isOperational, description)
        }

}


export default UnAuthorized