const mongoose = require("mongoose");

const connectDB = (url) => {
    return mongoose
        .connect(url)
        .then(() => {
            console.log("connected to Jobify_Data_Base successfully");
        })
        .catch((err) => {
            console.log(err, "could not connect to Jobify db");
        });
};
module.exports = connectDB;
