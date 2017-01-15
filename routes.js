var express = require('express');
var routes = express.Router();
var User = require('./models/user');
var config = require('./config/misc');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var passport    = require('passport');

mongoose.connect(config.database);

require('./config/passport')(passport);

routes.get('/', function(req,res){
    res.send("Hello, the api works fine!");
});

routes.post('/signup', function(req,res){
    if(!req.body.name || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password' });
    }else{
        var newUser = new User({
            name: req.body.name,
            password: req.body.password
        });
        

        User.findOne({name: newUser.name}, function(err, user){
            if(err) {
                res.json({ success: false, msg: 'Internal error.' });     
            }
            if(user) {
                res.json({ success: false, msg: 'Username already exists' });                                              
            }else{
                newUser.save(function(err){
                    if(err){
                        res.json({ success: false, msg: 'Internal error while saving.' });            
                    }
                    res.json({ success: true, msg: 'User created.' });
                });
            }            
        });
    }
});

routes.post('/authenticate', function(req,res){
    console.log(req.body.name);
    User.findOne({
        name: req.body.name
    }, function(err, user){
        if(err) {
            res.json({ success: false, msg: 'Internal error.' });                        
        }else if(!user){
            res.json({ success: false, msg: 'User not found.' });                                    
        }else{
            user.comparePass(req.body.password, function(err, isMatch){
                if(err) {
                    res.json({ success: false, msg: 'Internal error while saving.' });
                }else{ 
                    if(isMatch) {
                        var info = {};
                        info._id = user._id;
                        info.name = user.name;
                        var token = jwt.encode(info, config.secret);
                        res.json({success: true, token: 'JWT ' + token});
                    }else{
                        res.json({success: false, msg: 'Authentication failed. Wrong password.'});
                    }
                }
            });
        }
    });
});

routes.get('/memberinfo', passport.authenticate('jwt', {session: false}), function(req,res){
    res.send("Welcome to the lounge " + req.user.name + "!");
});


module.exports = routes;