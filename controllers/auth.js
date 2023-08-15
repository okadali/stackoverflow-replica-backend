const User = require('../models/User')
const CustomError = require('../helpers/error/CustomError')
const asyncErrorWrapper = require('express-async-handler')
const {sendJwtToClient} = require('../helpers/auth/tokenHelpers')
const {validateUserInput,comparePassword} = require('../helpers/input/inputHelpers')

const register = asyncErrorWrapper( async (req,res,next) => {
  const {name,email,password,role} = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role
  });
  sendJwtToClient(user,res)
});

const login = asyncErrorWrapper(async (req,res,next) => {
  const {email,password} = req.body;

  if(!validateUserInput(email,password)) {
    return next(new CustomError("Please check your inputs",400));
  }

  const user = await User.findOne({email}).select("+password");

  if(!comparePassword(password,user.password)) {
    return next(new CustomError("Please check your credentials",400));
  }

  sendJwtToClient(user,res)
})

const logout = asyncErrorWrapper(async (req, res, next) => {
  const {JWT_COOKIE_EXPIRE,NODE_ENV} = process.env;

  return res.status(200)
  .cookie({
    httpOnly:true,
    exires: new Date(Date.now()),
    secure: NODE_ENV === "development" ? false : true
  })
  .json({
    success: true,
    message: "Logout Successfull"
  })
})

const getUser = (req,res,next) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
      name: req.user.name
    }
  })
};

const imageUpload = asyncErrorWrapper(async (req,res,next) => {
  //Image Upload Success
  const user = await User.findByIdAndUpdate(req.user.id,{
    'profile_image' : req.savedProfileImage
  },{
    new: true,
    runValidators: true
  })


  res.status(200)
  .json({
    success: true,
    data: user,
    message: "Image upload successfull"
  })
});

// Forgot Password
const forgotPassword = asyncErrorWrapper(async (req,res,next) => {
  const resetEmail = req.body.email;
  const user = await User.findOne({email: resetEmail});
  if(!user) {
    return next(new CustomError("There is no user with that email",400));
  }

  const resetPasswordToken = user.getResetPasswordTokenFromUser();

  await user.save();
  res.json({
    success: true,
    message: "Token sent to your email",
    token: resetPasswordToken
  })
});

const resetPassword = asyncErrorWrapper(async (req,res,next) => {

  const {resetPasswordToken} = req.query;
  const {password} = req.body;

  if(!resetPasswordToken) {
    return next(new CustomError('Please provide a valid token',400));
  }
  let user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: {$gt : Date.now()} // resetPasswordExpire degeri gt (greater than) date.now() ise
  })

  if(!user) {
    return next(new CustomError('Invalid Token or Session Expired',404));
  }

  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  return res.status(200)
  .json({
    success: true,
    message:'reset password success'
  })
})

module.exports = {
  register,getUser,login,logout,imageUpload,forgotPassword,resetPassword
}