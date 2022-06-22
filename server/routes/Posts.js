const express = require("express");
const router = express.Router();
const {Posts} = require("../models");
const {Categories} = require("../models");
const {Actions} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware");

router.get('/', async(req, res) => {
    const listOfPosts = await Posts.findAll();
    res.json(listOfPosts);
}); 

router.get('/manage/:Seller', async(req, res) => {
    const Seller = req.params.Seller;
    const listOfPosts = await Posts.findAll({where: {Seller: Seller}});
    res.json(listOfPosts);
}); 

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
}); 

router.post('/', validateToken, async(req, res) => {
    const post = req.body.data;
    post.Currently = req.body.data.First_Bid;
    post.Number_of_Bids = "0";
    post.Seller = req.user.username;
    post.Rating_Seller = "7.0";
    post.Photo = req.body.photo;
    await Posts.create(post);
    res.json(post);
}); 

router.delete("/:postId", validateToken, async(req, res) => {
    const postId = req.params.postId;

    await Posts.destroy({
        where: {
            id: postId
        },
    });
    
    res.json("deleted succesfully!");
});

router.put('/name', validateToken, async(req, res) => {
    const {newName, id} = req.body;
    await Posts.update({Name: newName}, { where: { id: id } })
    res.json(newName);
}); 

router.put('/location', validateToken, async(req, res) => {
    const {newLocation, id} = req.body;
    await Posts.update({Location: newLocation}, { where: { id: id } })
    res.json(newLocation);
}); 

router.put('/country', validateToken, async(req, res) => {
    const {newCountry, id} = req.body;
    await Posts.update({Country: newCountry}, { where: { id: id } })
    res.json(newCountry);
}); 

router.put('/description', validateToken, async(req, res) => {
    const {newDescription, id} = req.body;
    await Posts.update({Description: newDescription}, { where: { id: id } })
    res.json(newDescription);
}); 

router.put('/buyprice', validateToken, async(req, res) => {
    const {newByePrice, id} = req.body;
    await Posts.update({Buy_Price: newByePrice}, { where: { id: id } })
    res.json(newByePrice);
}); 

router.put('/firstbid', validateToken, async(req, res) => {
    const {newFirstBid, id} = req.body;
    await Posts.update({First_Bid: newFirstBid}, { where: { id: id } })
    res.json(newFirstBid);
}); 

router.put('/numberofbids', validateToken, async(req, res) => {
    const {newNumberofBids, id} = req.body;
    await Posts.update({Number_of_Bids: newNumberofBids}, { where: { id: id } })
    res.json(newNumberofBids);
}); 

router.put('/started', validateToken, async(req, res) => {
    const {newStarted, id} = req.body;
    await Posts.update({Started: newStarted}, { where: { id: id } })
    res.json(newStarted);
}); 

router.put('/ends', validateToken, async(req, res) => {
    const {newEnds, id} = req.body;
    await Posts.update({Ends: newEnds}, { where: { id: id } })
    res.json(newEnds);
});

router.get('/last', async (req, res) => {
    const records = await Posts.findAll();
    res.json(records);
});

router.put('/count', validateToken, async(req, res) => {
    const {Number_of_Bids, id} = req.body;
    await Posts.update({Number_of_Bids: Number_of_Bids}, { where: { id: id } })
    res.json(Number_of_Bids);
}); 

router.put('/currently', validateToken, async(req, res) => {
    const {Currently, id} = req.body;
    await Posts.update({Currently: Currently}, { where: { id: id } })
    res.json(Currently);
});      

router.get("/recommendations", validateToken, async (req, res) => {       
    const Username = req.user.username;

    let pos = "YES"
    const listOfPosts = await Actions.findAll({where: {Username: Username, Visited: pos}});

    let category = [];

    for(let i = 0; i < listOfPosts.length; i++){
       const cat =  await Categories.findAll({where: {PostId: listOfPosts[i].PostId}})
       for(let j = 0; j < cat.length; j++)
           category.push(cat[j].Category_name);
    }

    let finalCategory = [];
    for(let i = 0; i < category.length; i++ ){
        let flag = 0;
        for(let j = 0; j < finalCategory.length; j++){
            if(finalCategory[j] === category[i]){
                flag = 1;
            }
        }
        if(flag === 0){
            finalCategory.push(category[i]);
        }
    }

    let categories = await Categories.findAll();
    let listOfIds = [];

    for(let i = 0; i < categories.length; i++){
        for(let j = 0; j < finalCategory.length; j++){
            if(categories[i].Category_name === finalCategory[j]){
                listOfIds.push(categories[i].PostId);
                break;
            }
        }
    }

    let finalId = [];
    for(let i = 0; i < listOfIds.length; i++ ){
        let flag = 0;
        for(let j = 0; j < finalId.length; j++){
            if(finalId[j] === listOfIds[i]){
                flag = 1;
            }
        }
        if(flag === 0){
            finalId.push(listOfIds[i]);
        }

    }

    let finalPosts = [];
    const post = await Posts.findAll();
        
    finalPosts = post.filter((val) => {
        for(let j = 0; j < finalId.length; j++){
            if(val.id === Number(finalId[j])){
                return val; 
            }
        }
    })
    
    console.log(finalPosts.length);
    res.json(finalPosts);
  })

module.exports = router;