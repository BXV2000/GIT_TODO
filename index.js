const express = require('express');
const app = express();
const firebase = require('firebase');
require("firebase/firestore");
const bodyParser = require('body-parser');
const { json } = require('express');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

var firebaseConfig = {
    apiKey: "AIzaSyC150_fVHXYjncxVUoP4LkeJdjEUq05Cyg",
    authDomain: "vinhz-aca33.firebaseapp.com",
    databaseURL:
      "https://vinhz-aca33-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "vinhz-aca33",
    storageBucket: "vinhz-aca33.appspot.com",
    messagingSenderId: "1084339989774",
    appId: "1:1084339989774:web:9ac670f80c35d763753b5f",
    measurementId: "G-P03RYLTYLC",
  };
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();




app.set("view engine","ejs");



var todoList = [];

function getTodoList() {
    todoList = [];
    var counter = 0;
    db.collection("todo2").get().then((snap) => {
        snap.forEach((doc) => {
            todoList.push(doc.data());
            todoList[counter].id = doc.id;
            counter++;
        });
        console.log(todoList);
    })  
}

function getTodoListFake(callback) {
    todoList = [];
    var counter = 0;
    db.collection("todo2").get().then((snap) => {
        snap.forEach((doc) => {
            todoList.push(doc.data());
            todoList[counter].id = doc.id;
            counter++;
        });
        console.log(todoList);
    }).then(()=>{
        callback();
    })
}

getTodoList();

app.post("/delete",(req,res)=>{
    db.collection("todo2").doc(req.body.todoId).delete()
    .then(()=>{
        getTodoListFake(()=>{
            res.redirect("/")
        })
    })
})

app.post("/update",(req,res)=>{
    console.log(req.body.todoId);
    db.collection("todo2").doc(req.body.todoId).update({
        status: !JSON.parse( req.body.todoStatus),
    })
    .then(()=>{
        getTodoListFake(()=>{
            res.redirect("/")
        })
    })
})

app.post('/',(req,res)=>{
    db.collection("todo2").add({
        status: true,
        time: firebase.firestore.FieldValue.serverTimestamp(),
        todo: req.body.content
    })
    .then(()=>{
        getTodoListFake(()=>{
            res.redirect("/")
        })
    })
})
    


app.get('/',(req,res)=>{
    res.render("todo",{todos:todoList});
})



app.listen(3000,()=>{
    console.log("Listening to port 3000");
});
