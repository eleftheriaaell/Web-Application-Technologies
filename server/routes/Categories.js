const express = require("express");
const { validateToken } = require("../middlewares/AuthMiddleware");
const router = express.Router();
const { Categories } = require("../models");

router.post("/", validateToken, async (req, res) =>{        
    const category = req.body;
    await Categories.create(category);
    res.json(category);
})

router.get('/json', async(req, res) => {
    const PostId = String(req.body.PostId);
    const listOfCategories = await Categories.findAll({where: {PostId: PostId}});
    res.json(listOfCategories);
});

router.post('/sortby', async(req, res) => {
    const listOfCatSort = await Categories.findAll();
    res.json(listOfCatSort);
});

module.exports = router;