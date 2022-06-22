const express = require("express");
const router = express.Router();
const {Inbox} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware");

router.post('/', validateToken, async(req, res) => {
    const inbox = req.body;
    inbox.senderName = req.user.username;
    inbox.Seen = "NO";
    await Inbox.create(inbox);
    res.json(inbox);
});

router.get('/:receiverName', async(req, res) => {
    const receiverName = req.params.receiverName;
    const listOfInbox = await Inbox.findAll({where: {receiverName: receiverName}});
    res.json(listOfInbox);
});

router.delete("/:id", validateToken, async(req, res) => {
    const id = req.params.id;
    
    await Inbox.destroy({
        where: {
            id: id,
        },
    });

    res.json("deleted succesfully!");
    
});

router.put('/notification', validateToken, async(req, res) => {
    const Seen = req.body.Seen;
    let receiverName = req.user.username;
    await Inbox.update({Seen: Seen}, { where: { receiverName: receiverName } })
    res.json(Seen);
});  

module.exports = router;