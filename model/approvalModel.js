import mongoose from "mongoose";

const approvalModel = mongoose.Schema({

    "help_id":{
        type: String,
        required: true
    },
     "technician_name":{
        type: String,
        required: true
    },
    "technician_email": {
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
    "technician_contact_no":{
        type: String,
        required: true
    },
    "technician_nic":{
        type: String,
        required:true,
    },
    "technician_address":{
        type:String,
        required:true
    },
    "user_name":{
        type: String,
        required: true
    },
    "user_email": {
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
    "user_contact_no":{
        type:String,
        required: true
    },
    "user_nic":{
        type: String,
        required:true,
    },
    "user_address":{
        type:String,
        required:true
    },
    "vehicle_name":{
        required: true,
        type: String,
    },
    "vehicle_image_url":{
        type: String,
        default: "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg",
    },
    "vehicle_no":{
        type: String,
        required: true,
        unique: true
    },
    "vehicle_model":{
        type: String,
        required: true,
    },
    "vehicle_type":{
        type: String,
        required: true,
    },
    "vehicle_color":{
        type: String,
        required: true,
    },
});

const ApprovalHelp = mongoose.model('ApprovalHelp', approvalModel);

export default ApprovalHelp;