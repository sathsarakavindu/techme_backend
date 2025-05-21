
import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
"name":{
        type: String,
        required: true
    },
    "email": {
        required: true,
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    "password": {
        type: String,
        required: true,
    },
    "contact_no":{
        type: String,
        required: true
    },
    "nic":{
        type: String,
        required:true,
    },
    "address":{
        type:String,
        required:true
    },
    "account_type":{
        required:true,
        type:String
    },
    "otp":{
        required: false,
        type: String,
        default: "0000"
    }
});

const Technician =  mongoose.model('technician', technicianSchema);

export default Technician;