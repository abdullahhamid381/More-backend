import httpStatusCodes from './httpStatusCodes.js'
import CustomError from './customError.js'


class Forbidden extends CustomError {

    constructor (
        name, 
        statusCode = httpStatusCodes.FORBIDDEN,
        description = "Forbidden Request",
        isOperational = false
        ){
            super(name,statusCode, isOperational, description)
        }

}


export default Forbidden