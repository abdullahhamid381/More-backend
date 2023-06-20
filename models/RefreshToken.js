import mongoose from 'mongoose';

const refreshSchema = new mongoose.Schema({
    refreshToken:{
        type:String,
        required:true,
        unique:true,
        expires: 3600*24*30
    },
    userId:{type:String,required:true}
},{timestamps:true})


const RefreshToken = mongoose.model('RefreshToken',refreshSchema);

export default RefreshToken;