//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://albin:albinkmathew@cluster0.epqnhhk.mongodb.net/todolistDB");

const itemsSchema ={
  name: String
};


const Item =mongoose.model("item", itemsSchema);

const item1 =new Item({
  name:"welcome to your todo  list!"
});
const item2 =new Item({
  name:"Hit the + button to ad a new item"
});
const item3 =new Item({
  name:"<-- Hit this to delete an item"
});

const defaultItems =[item1,item2,item3];

const listSchema ={
  name:String,
  items:[itemsSchema]
};
const List = mongoose.model("list",listSchema);

// Item.insertMany(defaultItems)
//   .then(function() {
//     console.log("successfully saved");
//   })
//   .catch(function(err) {
//     console.log("error occurred", err);
//   });

  app.get("/", function(req, res) {
    Item.find({})
      .then(foundItems => {
        res.render("list", {listTitle: "Today", newListItems: foundItems});
      })
      .catch(err => {
        console.log(err);
      });
  });
  

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  });
  item.save();
 
  res.redirect("/");
});



app.get("/delete",function(req,res){
  const checkedItem = req.query.checkbox;

  
  Item.findByIdAndRemove(checkedItem).exec()
  .then(() => {
    console.log('successfully deleted');
    res.redirect("/");
  })
  .catch(err => {
    console.error(err);
    res.status(500).send("Internal Server Error");
  });

});




app.get("/:customListName", function(req,res){
  const customListname=req.params.customListName
   

  const list =new List({
    name:customListname,
    items:defaultItems
  });
   
  list.save()
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
