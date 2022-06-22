const express = require("express");
const router = express.Router();
const {Bids} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware");

router.get('/json', async (req, res) => {
    const PostId = String(req.body.PostId);
    const bids = await Bids.findAll({where: {PostId: PostId}}); 
    res.json(bids);
});

router.post("/", validateToken, async (req, res) =>{        
    const bid = req.body.data;
    const username = req.user.username;
    bid.Bidder = username;
    bid.Rating_Bidder = "7.5/10"
    bid.Time = req.body.Time;
    bid.PostId = req.body.PostId;
    await Bids.create(bid);
    res.json(bid);
}) 

module.exports = router;