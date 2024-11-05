const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const router = Router();
const Blog=require('../models/blog')
const Comment=require('../models/comment')
// In a form have upload image option to save that image we need to use multer
// We use multer to save images in a location (Watch multer tutorial)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads/'));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/; // Acceptable file extensions
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    });
});

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdby');
        const comments = await Comment.find({ blogId: req.params.id }).populate('createdby');
        console.log("comments", comments);
        
        return res.render('blog', {
            user: req.user,
            blog,
            comments
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the blog and comments.");
    }
});


router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdby: req.user._id, // Ensure lowercase "createdby" here
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});


router.post('/', upload.single('coverImage'), async (req, res) => {
    const {title,body}=req.body
    const blog=await Blog.create({
        body,
        title,
        createdby : req.user._id,
        coverimageurl:`/uploads/${req.file.filename}`
    })
    //console.log(req.body);
    console.log(req.file); 
    return res.redirect('/');
});

module.exports = router;

