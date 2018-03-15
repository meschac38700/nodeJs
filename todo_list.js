// -- TP : to do list  ----

var express = require('express'); // Framework pour application web
var ejs = require('ejs'); // Template de page HTML
var parser = require('body-parser'); // Parse les champs

var app = express();
app.use(express.static(__dirname )); // Defini la racine de façon statique

app.use(parser.urlencoded({ extended: false })); // Parse l'url en attente d'un string ou d'un tableau
app.use(parser.json()); // Retoune un middleware ne parsant que du JSON

// -- Subdivision des modules par page --
var test = require('./scripts/welcome_page_script'); // fait appel à welcome_page_script.js

var cookieParser = require('cookie-parser');
var session = require('express-session');  // Charge le middleware de sessions

// set the view engine to ejs
app.set('view engine', 'ejs');


// --- Routing pour todolist --

app.get('/',function(req,res){ // -- Racine --
    res.render('pages/index',{ title: 'Welcome'});
})

app.use(cookieParser());

app.use(
    session({
        name:'super_cookie',
        secret: 'topsecret',
        resave: true,
        saveUninitialized: true
    }) //créer une session unique au nom de l'utilisateurs
)

.use(function (req,res,next) {
    //console.log("session ("+req.session.name+")");
    //req.session.name = 'trololo';
    //console.log("session ("+req.session.name+")");
    if(typeof (req.session.todolist) == 'undefined')
    {
        console.log('--Initialise session --')
        req.session.todolist = []; // on initialise par un tableau vide
        console.log("session ("+req.session.name+") initialise todolist array (legnth "+req.session.todolist.length+" ): "+req.session.todolist);
    }
    else
    {
        var arr_length = req.session.todolist.length;
        console.log("session ("+req.session.name+") todolist array ("+arr_length+"): "+req.session.todolist);
        //req.session.todolist[arr_length]=arr_length+1;
    }
    next(); //Appel la fonction suivante , sinon l'application est bloquée

})

app.post('/todoList',function(req,res,next){
    var user ={
        name : req.body.name,
		prenom : req.body.prenom
    };
    req.session.name = user.name;
    console.log("session ("+req.session.name+") ");
    // var ttle = "Welcome ".concat(user.name);
    // console.log(ttle);
    // res.render('pages/todo_list_page',{ title: ttle, name : user.name, todolist : req.session.todolist});
    res.redirect('/todoList');
})

app.get('/todoList', function(req, res) {
    console.log("###############")
    res.render('pages/todo_list_page',{ title: 'todo List', name : req.session.name, todolist : req.session.todolist });
})

app.post('/todoList/add', function(req, res,next) {
    console.log('----*');
    var item ={
        name : req.body.item
    };
    console.log('   ---Add '+item.name);
    var arr_length = req.session.todolist.length;
    req.session.todolist.push(item.name);
    console.log('********');
    res.redirect('/todoList');
})

app.get('/todoList/remove/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
        res.redirect('/todoList');
    }
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(8080);
