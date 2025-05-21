
import mongoose from 'mongoose'


const helpSchema = mongoose.Schema({
    "user_name":{
        type: String,
        required: true
    },
    "email":{
        type: String,
        required: true
    },
    "nic": {
         type: String,
         required: true
    },
    "contact_no":{
        type: String,
        required: true,
    },
    "address":{
        type: String,
        required: true,
    }
    ,
    "latitude":{
        type: Number,
        required: true,
    },
    "longitude":{
        type: Number,
        required: true
    },
    "isCompleted":{
        required: true,
        type: Boolean,
        default: false
    },
    "isCancelled": {
        required: true,
        type: Boolean,
        default: false
    }
});

const MakeHelp = mongoose.model('make help', helpSchema);

export default MakeHelp;