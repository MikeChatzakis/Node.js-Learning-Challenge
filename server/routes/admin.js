const express = require('express');
const router = express.Router();
const Post=require('../models/Post');
const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const adminLayout = '../views/layouts/admin'
const jwtSecret=process.env.JWT_SECRET;

/**  
 * GET /
 * Admin - Login Page
*/

const authMiddleware = (req,res,next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message:'Dont have permission'});
    }
    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({ message:'Dont have permission'});
    }
}

/**  
 * GET /
 * Admin - Login Page
*/

router.get('/admin', async (req,res)=>{
    try { 
        const locals = {
            title: "Admin",
            description: "Simple Page created with NodeJs. Express, MongoDB."
        }
        
        res.render('admin/index',{
            locals,
            layout: adminLayout 
        });
    } catch (error) {
        console.log(error);
    }
});

/**  
 * GET /
 * Admin - Check Login
*/

router.post('/admin', async (req,res)=>{
    try { 
       const {username,password} = req.body;
       
       const user=await User.findOne({ username });
       if(!user){
        return res.status(401).json({message: 'Incorrect Credentials'});
       }
       const isPasswordValid= await bcrypt.compare(password,user.password);

       if(!isPasswordValid){
        return res.status(401).json({message: 'Incorrect Credentials'});
       }

       const token = jwt.sign({userId: user._id},jwtSecret);
       res.cookie('token', token, {httpOnly: true});
       
       res.redirect('/dashboard');
       
    } catch (error) {
        console.log(error);
    }
});

/**  
 * GET /
 * Admin - Register
*/

router.post('/register', async (req,res)=>{
    try { 
       const {username,password} = req.body;
       const hashedPassowrd = await bcrypt.hash(password, 10);

        try {
            const user= await User.create({username,password:hashedPassowrd});
            res.status(201).json({message: 'User Created', user});
        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message:'User already in use!'});
            }
            res.status(500).json({message:'Internal Server Error!'});
        }

    } catch (error) {
        console.log(error);
    }
});

/**  
 * GET /
 * Admin - Dashboard
*/

router.get('/dashboard', authMiddleware, async (req,res)=>{
    try {
        const locals = {
            title: 'Dashboard',
            description:'Simple Page Created with nodeJs, Express & MongoDB.'
        }

        const data = await Post.find(); 

        res.render('admin/dashboard',{
            locals,
            data,
            layout: adminLayout
        });


    } catch (error) {
        console.log(error);
    }
});

/**  
 * GET /
 * Admin - Create New Post
*/

router.get('/add-post', authMiddleware, async (req,res)=>{
    try {
        const locals = {
            title: 'Add Post',
            description:'Simple Page Created with nodeJs, Express & MongoDB.'
        }

        const data = await Post.find(); 

        res.render('admin/add-post',{
            locals,
            layout: adminLayout,
            data
        });


    } catch (error) {
        console.log(error);
    }
});

/**  
 * POST /
 * Admin - Create New Post
*/
router.post('/add-post', authMiddleware, async (req,res)=>{
        try {
            const new_post=new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(new_post);
            res.redirect('/dashboard');
            // res.status(201).json({message: 'Post created', new_post});
        } catch (error) {
            console.log(error);
        }
});

/**  
 * GET /
 * Admin - Edit Post
*/

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };
  
      const data = await Post.findOne({ _id: req.params.id });
  
      res.render('admin/edit-post', {
        locals,
        data,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });
  


/**  
 * PUT /
 * Admin - Edit Post
*/

router.put('/edit-post/:id', authMiddleware, async (req,res)=>{
    try {
        await Post.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }
});

/**  
 * DELETE /
 * Admin - Delete Post
*/

router.delete('/delete-post/:id', authMiddleware, async (req,res)=>{
    try {
        await Post.deleteOne({ _id: req.params.id});

        res.redirect(`/dashboard`);

    } catch (error) {
        console.log(error);
    }
});

/**  
 * GET /
 * Admin - Logout
*/

router.get('/logout', (req,res)=>{
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});











module.exports = router;