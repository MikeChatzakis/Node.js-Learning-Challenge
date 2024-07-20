const express = require('express');
const router = express.Router();
const Post=require('../models/Post');

/**  
 * GET /
 * Admin - Login Page
*/

router.get('', async (req,res)=>{
    try { 
        const locals = {
            title: "Admin",
            description: "Simple Page created with NodeJs. Express, MongoDB."
        }
        
        res.render('admin/index',{
            locals 
        });
    } catch (error) {
        console.log(error);
    }
});









module.exports = router;