const express = require('express')
const router = express.Router();

const posterDataLayer = require('../../dal/posters');

router.get('/', async function(req,res){
    const posters = await posterDataLayer.getAllPosters();
    res.json(posters)
})

module.exports = router