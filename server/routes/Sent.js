const express = require("express");
const router = express.Router();
const {Sent} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware");

router.post('/', validateToken, async(req, res) => {
    const sent = req.body;
    sent.senderName = req.user.username
    await Sent.create(sent);
    res.json(sent);
});

router.get('/:senderName', async(req, res) => {
    const senderName = req.params.senderName;
    const listOfSent = await Sent.findAll({where: {senderName: senderName}});
    res.json(listOfSent);
});

router.delete("/:id", validateToken, async(req, res) => {
    const id = req.params.id;
    
    await Sent.destroy({
        where: {
            id: id,
        },
    });

    res.json("deleted succesfully!");
    
});


module.exports = router;