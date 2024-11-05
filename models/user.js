const {Schema,model}= require('mongoose');
const { error } = require('node:console');
const {createHmac,randomBytes} = require('node:crypto');
const { createTokenForUser } = require('../services/authentication');
const userSchema=new Schema({
    fullname :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImageURL:{
        type:String,
        default:"/images/default.png" 
    },
    role:{
        type:String,
        // enum works in a way that 
        // If we try to assign any other  any other than in enum 
        // then nodejs will through an error !
        enum:['USER','ADMIN'],
        default:"USER"
    }

},{timestamps:true});

// When ever user try to save password then this below function will run !
userSchema.pre("save",function(next){
    const user=this;
    // If password is not modified then no need
    if(!user.isModified('password'))
        return ;
    // We will try to hash the password using built in functions
    
    // We are creating a random string of 16 len using random byte
   const salt=randomBytes(16).toString();

    // After this we are hasing using createHmac by sha256 algo 
    // we can use any other algo in place of sha256 as well!
    const hashedPassword=createHmac('sha256',salt)
    .update(user.password) 
    .digest("hex");
    
    // we are updating the hash and password !
    this.salt=salt;
    this.password=hashedPassword;

    next();
})

// You can create a function in mongoDb by this and can call this function 
userSchema.static("matchpassword",async function(email,password){
    const user=await this.findOne({email})
    if(!user)
        throw new Error('User Not Found')

    const salt=user.salt 
    const hashedpassword=user.password
    // We can't get original password once hashed in order to check for correct password \
    // we will use the same salt created for the user (olderone) and hash with the current password 
    // if both hashed (previous and currect are same then true check code below for better understanding)
    const userhashedpassword=createHmac('sha256',salt)
    .update(password) // will hash currect password (parameter one)
    .digest("hex");

    if(userhashedpassword!==hashedpassword){
        throw new Error('Password Incorrect')
    }

    const token=createTokenForUser(user);
    return token
    // return {...user,password:undefined,salt:undefined}

})
const User=model('user',userSchema);

module.exports=User
