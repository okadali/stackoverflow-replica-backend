const CustomError = require('../../helpers/error/CustomError')
const jwt = require('jsonwebtoken')
const {isTokenIncluded,getAccessTokenFromHeader} = require('../../helpers/auth/tokenHelpers')

const getAccessToRoute = (req,res,next) => {
  // Token
  const {JWT_SECRET_KEY} = process.env
  if(!isTokenIncluded(req)) {
    //401: unauthorized: giriş yapmadan bi sayfaya ulaşım, 403: forbidden ulaşılmasına izin olmayan bir sayfaya ulaşım
    return next(new CustomError("You are not authorized to access this route."),401)
  }
  const accessToken = getAccessTokenFromHeader(req)
  jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded) => {
    if(err) {
      return next(new CustomError("You are not authorized to access this route",401));
    }

    req.user = {
      id: decoded.id,
      name: decoded.name
    }
    next();
  })
}
module.exports = {
  getAccessToRoute
}