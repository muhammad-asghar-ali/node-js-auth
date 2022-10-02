const mongoose = require('mongoose');

module.exports.connect = () => {
    mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true, minPoolSize: 50 });
    mongoose.connection
        .once('open', () => { console.log("connection open"); })
        .on('error', err => {
            console.log(err);
            console.log('DB is not connected');
            throw err;
        })
}