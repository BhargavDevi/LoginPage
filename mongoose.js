const mongoose = require("mongoose")
const connect = mongoose.connect("mongodb+srv://1si23is012:QwHRjM2FmU45wm3@spacetourism.bjwoq.mongodb.net/hack", {
    // useNewUrlParser: true,
    //  useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
})

    .then(() => {
        console.log("mongoos connected")
    })
    .catch(() => {
        console.log("mongoos not connected")
    })


const logInSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true // Ensuring username is unique
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensuring email is unique
    },
    tel: {
        type: Number,
        required: true
    },
    password1: {
        type: String,
        required: true
    },
    // profilePic: {
    //     type: String,
    //     required: true
    // },
    // accessLevel: {
    //     type: String,
    //     required: true
    // },
    // responsibility: {
    //     type: String,
    //     required: true
    // },
    // bio: {
    //     type: String,
    //     required: true
    // },

});

const collect = mongoose.model("login", logInSchema);

module.exports = collect;
