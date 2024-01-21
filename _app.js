const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var items = [];

// to enable the ejs to be used
// here, views directory is the directory by default searched for the templates
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const date = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const today = date.toLocaleDateString("en-IN", options);
    res.render('lists', {
        todaysDay: today,
        itemsAdded: items
    });
});

app.post('/', (req, res)=>{
    var item = req.body.item;
    items.push(item);
    res.redirect('/');  // this is important as .render function can't be used here and all the data present inside items[] is displayed when redirected to home route as get request, the flow of execution is "get route --> post route --> get route"
});

app.listen(3000, () => {
    console.log("Server listening at port 3000");
}); 