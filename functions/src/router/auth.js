const express = require('express');
const router = express.Router();

router.get('/',async (req,res,next)=>{
    console.log("!!!!!!!!!!!!!!!!!!!!!!!");
    res.status(200);
});



module.exports =  router;