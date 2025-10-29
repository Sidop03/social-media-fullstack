const userController = require('../controllers/userController');
const requireUser = require('../middlewares/requireUser');
const router= require('express').Router();

router.post('/follow',requireUser,userController.followOrUnfollowUserController);
router.get('/getFeedData',requireUser,userController.getFeedData);
router.delete('/',requireUser,userController.deleteMyProfileController);
router.get('/getMyPost',requireUser,userController.getMyPostController);
router.get('/getMyInfo',requireUser,userController.getMyInfo);
router.put('/updateMyProfile',requireUser,userController.updateMyProfile);
router.post('/getUserProfile',requireUser,userController.getUserProfile);

module.exports= router;