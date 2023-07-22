const express = require('express');
const bodyParser = require('body-parser');
//mongoose(untuk koneksi ke monggodb)
const mongoose = require('mongoose');
//multer to upload images
const multer = require('multer');

const path = require('path')




//2 Konfigurasi upload image
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => { //cb callBack
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
        ){
        cb(null, true);
    } else {
        cb(null, false);
    }
} //next buat midleware


const app = express(); //untuk localhost ya
const authRoutes = require('./src/routes/auth')
const blogRoute = require('./src/routes/blog')


//kita tambahkna middleware
app.use(bodyParser.json()) //yang kita terima type JSON

//midleware upload image
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image')); //next atur controller

//midelware untuk akses folder image
app.use('/images', express.static(path.join(__dirname, 'images'))) //membuat folder static agar bisa diakses dari luar (apa itu dirname adalah lokasi project kita berada)


//ketika client mengakses API kita
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') //(* ini untuk semua client atau situs web yang meng aksese nya)
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); //fungsi semua method agar bisa dipakai
    res.setHeader("Access-Control-Allows-Headers", "Content-Type, Authorization"); //ini bisa json, text, js, html, xml
    next();
})

app.use('/v1/auth', authRoutes )
app.use('/v1/blog', blogRoute )

//Cara menggunakan message error kepada Client(menambahkan midelware)
app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message:  message,
        data: data
    });
})  //cara penggunaany masuk ke controller blog

//link ya darr mongodb Atlas dan password (ini cara connect sih ya)
mongoose.connect('mongodb+srv://alwindev:mern-blog@cluster0.erqyqxz.mongodb.net/mern-blog?retryWrites=true&w=majority')
.then(() => { //mern-blog buat nama sendiri
    app.listen(4000, () => console.log('Connection Sukses win'));
})//ini kala berhasil connect server kita -> app.listen(4000);

.catch(err => console.log(err)); //ini kalau gagal
