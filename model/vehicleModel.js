import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({

    image_url:{
        type: String,
        default: "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_40962406.jpg",
    },

    vehicle_no:{
        type: String,
        required: true,
        unique: true
    },
    model:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    color:{
        type: String,
        required: true,
    },

});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;