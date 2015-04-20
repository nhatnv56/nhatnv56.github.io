var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var faker = require('faker');
var app = express();

app.set('views', __dirname + '/views');
app.engine('.html',require('ejs').__express);
app.set('view engine','html');

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));

var sess;
//------------faker data-------
// var paragraphs = [];
// var sentence = [];
div = [];
for(var i = 12; i>0; i--){
    div.push({
        comment: faker.lorem.paragraphs(),
        title: faker.lorem.sentence()
    });
}
//------------faker data-------
app.get('/',function(req,res){
    sess=req.session;
    if(sess.email){
        res.redirect('/home');
    }else{
        res.render('index');
    }
});

app.post('/login',function(req,res){
    sess=req.session;
    sess.email=req.body.email;
    res.end('done');
});

app.get('/home',function(req,res){
    sess=req.session;
    if(sess.email){
        res.render('home',{email: sess.email, div: div});
    }else{
        res.write('<h1>Please login first.</h1>');
        res.end('<a href="/">Login</a>');
    }
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(err)
            console.log(err);
        else
            res.redirect('/');
    });

});
app.listen(3000,function(){
    console.log("App Started on PORT 3000");
});