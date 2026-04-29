import mongoose from "mongoose";
 const taskSchema = new mongoose.Schema({
    title : String,
    status:{
        type: String,
        default :'pending'
    }
 },{timestamps : true});
 export default mongoose.model('Task',taskSchema);