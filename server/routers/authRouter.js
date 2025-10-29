const router= require('express').Router();
const authController= require('../controllers/authController');

router.post('/signup',authController.signupController);
router.post('/login',authController.loginController);
router.get('/refresh',authController.RefreshAccessTokenController);
router.post('/logout',authController.logOutController);

module.exports= router;