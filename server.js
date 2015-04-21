var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var faker = require('faker');
var app = express();
var Schema = mongoose.Schema;

app.set('views', __dirname + '/views');
app.engine('.html',require('ejs').__express);
app.set('view engine','html');

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
mongoose.connect('mongodb://localhost/test');

var UserSchema = new Schema({
    email:{type: String, required: true},
    password:{type: String, required: true},
});
var User = mongoose.model('users', UserSchema);

var sess;

//------------faker data-------
var div = [];
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
    User.findOne({
        email: req.body.email,
        password: req.body.pass
    },function(err, doc) {
        if(err){
            console.log(err);
        }else{
            if(doc===null){
                console.log('dang nhap ko thanh cong');
                res.end('error');
            }
            sess=req.session;
            sess.email=req.body.email;
            res.end('done');
        }
    });
});

app.get('/home',function(req,res){
    sess=req.session;
    if(sess.email){
        res.render('home',{email: sess.email, div: div});
    }else{
        res.redirect('/');
    }
});
app.post('/home', function(req, res) {
    console.log(req.body);
    div.push({
        title: req.body.title,
        comment: req.body.comment
    });
    res.render('home',{email: sess.email, div: div});
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(err)
            console.log(err);
        else
            res.redirect('/');
    });

});
app.post('/create',function (req,res) {
    console.log(req.body.email);
    console.log(req.body.pass);
    // res.send('done');
    User.create({
        email: req.body.email,
        password: req.body.pass
    },function (err, doc) {
        if(err){
            console.log(err);
            res.end('error');
        }else{
            console.log('added: \n' + doc);
            res.end('done');
        }
    });
});
app.listen(3000,function(){
    console.log("App Started on PORT 3000");
});