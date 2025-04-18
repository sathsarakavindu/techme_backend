import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    }
});

const User = mongoose.model('users', userSchema);

export default User;