
const mongoose = require("mongoose");

module.exports = () => {

    mongoose.connect(process.env.DB_STRING_LOCAL, { useNewUrlParser: true })

    mongoose.connection.on("open", () => {
        console.log("mongoDB : Connected");
    });

    mongoose.connection.on("error", (err) => {

        console.log("mongoDB : error", err);

    });

    // promis tanımlaması
    mongoose.Promise = global.Promise;

};
