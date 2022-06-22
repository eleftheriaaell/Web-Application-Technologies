const express = require("express");
const router = express.Router();
const {Actions} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware");



router.post("/", validateToken, async (req, res) =>{        
    const action = req; 
    action.Username = req.user.username;
    action.PostId = req.body.id;
    action.Visited = "YES";
    action.Bidded = "NO";
    await Actions.create(action);
}) 

router.put('/bidded', validateToken, async(req, res) => {
    const {Bidded, PostId} = req.body;
    await Actions.update({Bidded: Bidded}, { where: { PostID: PostId, Username: req.user.username } });
    res.json(Bidded);
});  

module.exports = router;