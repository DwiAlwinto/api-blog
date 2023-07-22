const express = require('express');

const router = express.Router();

const blogController = require('../controllers/blog')

const {body} = require('express-validator') //ini untuk express validator

//[POST] : v1/blog/post
router.post('/post', [
    body('title').isLength({min: 5}).withMessage('Input title yang anda masukan minimu 5 karater'),
    body('body').isLength({min:5}).withMessage('Input body yang anda masukan minimun 5 karakter')],
    blogController.createBlogPost )

//[GET] 
router.get('/posts', blogController.getAllBlogPost) // (?page = ini query parameters dan  &perPage= adalah berapa data yg kita ingin panggil)
//Mengambil root sesuai ID tertentu
router.get('/post/:postId', blogController.GetBlogPostId)

//Update BlogPost
router.put('/post/:postId', [ //ini untuk validasi
    body('title').isLength({min: 5}).withMessage('Input title yang anda masukan minimu 5 karater'),
    body('body').isLength({min:5}).withMessage('Input body yang anda masukan minimun 5 karakter')],
    blogController.updateBlogPost)

//DELETE BLOG DAN IMAGE
router.delete('/post/:postId', blogController.deleteBlogPost)

module.exports = router