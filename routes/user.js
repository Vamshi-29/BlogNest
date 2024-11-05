
const {Router}=require('express');
const User =require('../models/user')
const router=Router();

router.get('/signin',(req,res)=>{
    return res.render("signin");
})

router.get('/signup',(req,res)=>{
    return res.render("signup");
})

router.post('/signin',async (req, res) =>{
    const {email,password}=req.body;
    try{
        const token=await User.matchpassword(email,password)
        console.log("token",token)
        return res.cookie("token",token).redirect("/")
    }
    catch(err){
        // For this to be shown you need to change in the form as well
        // since we are doing login in Front end form !!
        // here done in nav.ejs
        res.render("signin",{
            error: "User name or password is incorrect"
        })
    }

    
   
})
router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        await User.create({ fullname, email, password });
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(400).render("signup", { error: "Failed to create account. Try again." });
    }
});

router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/")
})

module.exports=router;