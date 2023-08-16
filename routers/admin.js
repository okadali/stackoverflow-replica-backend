const express = require('express');
const {getAccessToRoute,getAdminAccess} = require('../middlewares/auth/auth')
const {blockUser,deleteUser} = require('../controllers/admin');
const { checkUserExist } = require('../middlewares/database/databaseErrorHelpers');
//Block User
//Delete User
const router = express.Router();


router.use([getAccessToRoute,getAdminAccess])
//router.use(checkUserExist); Hatalı :id verisini alamıyor.
router.get('/block/:id',checkUserExist,blockUser);
router.delete('/user/:id',checkUserExist,deleteUser);




module.exports = router


