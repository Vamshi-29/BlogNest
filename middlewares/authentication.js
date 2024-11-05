

const { validateToken } = require("../services/authentication");

function checkforauthcookie(cookiename){
    // console.log("Iam here !!")
    return (req,res,next)=>{

        const tokencookievalue=req.cookies[cookiename] // this is cookie parser inbuilt function will check whether the particular cookie name 
                                                     // is present or not in the browser if presnet then validates !!
        if(!tokencookievalue)
            return next();
        try{
            const userpayload=validateToken(tokencookievalue)
            req.user=userpayload;
            return next();
        }
        catch(error){}
        return next();
    };
}



module.exports={
    checkforauthcookie
};
