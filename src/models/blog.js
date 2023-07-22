const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPost = new Schema({
    title: {
        type : String,
        require : true,
    },
    // to image next step 
    body: {
        type : String,
        require: true,
    },
    image: { //yang disimpan ke mongoDB  hanya url image/path dari image ya saja type string, tapi kalau file image ya di simpan di Project NodeJS kita
        type: String,
        require: true

    },
    author: {
        type: Object,
        require: true,
    }
}, {
    timestamps: true //to saat database create atau update(kapan databse itu dibuat dan kapa di update ini bisa dibuatkan oleh mongoose dengan nambakna timestamps: true) id sudah auto di buat  oleh mongoose
})


module.exports = mongoose.model('BlogPost', BlogPost) //1.nama model(bebas di bauat database mongodb atlas) 2.Model dibuat di atas