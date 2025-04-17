import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({

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