const express=require('express');
const router= express.Router();
const searchController= require('../controllers/searchController');
const requireUser = require('../middlewares/requireUser');


router.get('/',requireUser,searchController.searchUser);
module.exports= router;