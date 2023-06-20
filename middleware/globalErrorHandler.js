import CustomError from '../errors/customError.js';

const errorHandler = (err, req, res, next)=>{
    if(err instanceof CustomError){
        return res.status(err.statusCode).json({status:"ERROR",error:err});
    }
    res.status(err.status || 500).json({status:"ERROR",error:{message:err.message || "Some error occured!"}})
}


export default errorHandler;
