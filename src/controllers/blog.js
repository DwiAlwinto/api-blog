const {validationResult} = require('express-validator');
const BlogPost = require('../models/blog') //connect database MongoDB
const path = require('path') //ini untuk mendeteksi loksai path image ya
const fs = require('fs') //fs ini file system dari nodejs untuk remove


exports.createBlogPost = (req, res, next) => {
    const errors = validationResult(req);
    //console.log(`error : `, errors);

    if(!errors.isEmpty()){
       const err = new Error('Input Value Tidak Sesuai');
       err.errorStatus = 400;
       err.data = errors.array();
       throw err;
    }

    if(!req.file){ //logic file tidak ada (req.file tidak ada : ini pake negasi)
       const err = new Error('Image Harus di Upload');
       err.errorStatus = 422;
       throw err;
    }

    const title = req.body.title;
    const image = req.file.path;  //(tidak ada path sudah diproses oleh multer)
    const body = req.body.body;

    const Postingan = new BlogPost({ //to buat postingan ini
        title: title,
        body: body,
        image: image,
        author: {uid:1, name: 'AlwinDev'}
    })

    Postingan.save() //to save database MongoDB
    .then(result => { //kalau berhasil
        res.status(201).json({
            message : "Create Blog Post Success",
            data : result,
        });
    })
    .catch(err => { //kalalu gagal
        console.log(`err : `, err);
    }); 


}

//to set GET BLOG POST ALL
exports.getAllBlogPost = (req, res, next) =>{
    const currentPage = req.query.page || 1; //mengambil query dangan nama page
    const perPage = req.query.perPage || 5;//client tidak mengirim page atau query akan muncul 5
    let totalItems;

    BlogPost.find() //ini untuk memamanggil semua data
    .countDocuments() //ini untuk menghitung semua data
    .then( count => {
        totalItems = count;
        return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage)) //(skip itu itu lewat beberapa data)
        .limit(parseInt(perPage)) //(limit data yang kita berika berapa)
    })
    .then(result => {
        res.status(200).json({
            message: 'Data Blog Post Berhasi Dipanggil',
            data: result,
            total_Data: totalItems,
            per_Page : parseInt(perPage), 
            current_Page: parseInt(currentPage), //maksudnya page ke berapa info ke user
        })
    })
    .catch( err => {
        next(err)
    })
}

//get postingan blog berdasarka ID Blog
exports.GetBlogPostId = (req, res, next) => {
    const postId = req.params.postId
    BlogPost.findById(postId)
    .then( result => {
        if(!result) { //ini jika data ketemu
            const error = new Error('Blog Post tidak ditemukan'); //kalau mengirim kan id kalau Id ya salah
            error.errorStatus = 404;
            throw error; //ini akan di cut kalau tidak menemukan data.
        }
        res.status(200).json({
            message: 'Data Post Berhasil Dipanggil',
            data: result,
        })


    })
    .catch( err => {
        next()
    })
}

//put Update BlogPost (secara konsep dengan creat)
exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req);
    //console.log(`error : `, errors);

    if(!errors.isEmpty()){
       const err = new Error('Input Value Tidak Sesuai');
       err.errorStatus = 400;
       err.data = errors.array();
       throw err;
    }

    if(!req.file){ //logic file tidak ada (req.file tidak ada : ini pake negasi)
       const err = new Error('Image Harus di Upload');
       err.errorStatus = 422;
       throw err;
    }

    const title = req.body.title;
    const image = req.file.path;  //(tidak ada path sudah diproses oleh multer)
    const body = req.body.body;
    const postId = req.params.postId; //ini cari dulu
    
    BlogPost.findById(postId)
    .then(post => { //ini promise pertama untuk cari data postingan ya
        if(!post){ //ini kalau error
            const err = new Error('Blog Post tidak ditemukan');
            err.errorStatus = 404;
            throw err;
        }
        //ini kalau berhasil akan di update yang baru
        post.title = title;
        post.body = body;
        post.image = image;

        return post.save(); //ini akan di update (kemudian akan lanjutt di promise result dibawah

    })
    .then( result => { //ini dikirimkan ke client
        res.status(200).json({
            message: 'Update Sukses',
            data: result
        })
    })
    .catch( err => {
        next(err);
    })
}

//delete Blog and Image
exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId;

    BlogPost.findById(postId)
    .then( post => {
        if(!post){
            const err = new Error('Blog Post Tidak Sesuai');
            error.errorStatus = 404;
            throw error;
        }

        removeImage(post.image); //ini delete image ya dulu
        return BlogPost.findByIdAndRemove(postId); //ini lalu remove postingan ya
       
    })
    .then( result => {  //ini respon status ya
        res.status(200).json({
            message: 'Delete Image Success',
            data: result
        })
    })

    .catch( err => {
        next(err)
    })
}

const removeImage = (filePath) =>{
    console.log('filePath', filePath);
    console.log('dir name : ', __dirname); // ini hasi ya:( C:\Users\Alwin CodeJS\Desktop\MERN\mern-api\mern-api\src\controllers)

    filePath = path.join(__dirname, '../..', filePath) //digabungkkan hasil posisi diatas ( C:\Users\Alwin CodeJS\Desktop\MERN\mern-api\mern-api\src\controllers) kita keluar 2x untuk masuk folder image menjadi (C:\Users\Alwin CodeJS\Desktop\MERN\mern-api\mern-api\images\1683227674518-instagram.png)
    //untuk remove image kita butuh file system dari nodejs(import dlu diatas)
    fs.unlink(filePath, err => console.log(err));
}