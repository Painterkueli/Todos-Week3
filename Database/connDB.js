const mongoose = require('mongoose');

const conn = async () =>{

    try {
         await mongoose.connect(process.env.MongoDB);
         console.log("DB Connection Successful!!!!!");

    } catch (error) {
        console.error("DB Connection Failed", error);
        process.exit(1);
    }
}

module.exports = conn;