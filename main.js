const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const date = require(__dirname + "/date.js");
const _ = require('lodash');    // converts first letter into capital
let lists = [];
let entries = [];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("resources"));

mongoose.connect("mongodb://localhost:27017/todoDB");

// itemSchema is same as the data type of the entries done i.e., Schemas are user defined datatypes
const itemSchema = mongoose.Schema({
    title:String
});
const Entry = mongoose.model('entry', itemSchema);

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
});
const List = mongoose.model('list', listSchema);

app.get('/:customListName', async (req, res)=>{
    const listName = _.capitalize(req.params.customListName);
    const data = await List.findOne({name: listName});
    if(!data)
    {
        const list = new List({
            name: listName,
            items: []
        });
        list.save();
        res.redirect('/' + listName);
    }
    else
    {
        const itemsArray = await List.find({name: listName});
        // console.log(itemsArray[0]);
        res.render('index',{
            itemList: itemsArray[0].items,
            listType: listName
        });
    }
});

app.get('/', async (req, res)=>{
    let today = date.returnDate();
    const items = await Entry.find({});
    res.render('index', {
        currentDate: today,
        itemList: items,
        listType: "Home"
    });
});

app.post('/', (req, res)=>{
    let entryItem = req.body.newItem;
    let listName = req.body.listType;
    const newItem = new Entry({
        title: entryItem
    });
    if(listName === "Home")
    {
        newItem.save();
        res.redirect('/');
    }
    else 
    {
        List.findOne({name: listName}).then((data)=>{
            data.items.push(newItem);
            data.save();
        });
        res.redirect('/' + listName);
    }
});

app.post('/delete', (req, res)=>{
    let itemID = req.body.myCheckBox;
    let listName = req.body.listName;
    if(listName === "Home")
    {
        Entry.deleteOne({_id : itemID}).then(()=>{
            console.log("Entry deleted successfully");
        });
        res.redirect('/');
    }
    else
    {
        List.findOne({name: listName}).then((data)=>{
            data.items.pull({_id: itemID});
            data.save();
            res.redirect('/' + listName);
        });
    }

});

// OLDER VERSION
// app.get('/', (req, res)=>{
//     let today = date.returnDate();
//     res.render('index', {
//         currentDate: today,
//         itemList: lists,
//         listType: "home"
//     });
// });

// app.post('/', (req, res)=>{
//     let item = req.body.newItem;
//     if(item !== "")
//         lists.push(item);
//     res.redirect('/');
// })

app.listen(3000, ()=>{
    console.log("Server listening at port 3000");
});