var express = require('express');
var user = require('./../models/user');
var board = require('./../models/board');
var sendcard = require('./../models/sendcard');
var followcard = require('./../models/followcard');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
	board.get(function(error, result){
		if(error) {
			console.log(error);
		} else {
			var url = new Array(['/','Home']);
			return res.render('index', {url:url,title: '首页',user :req.session.user_id,boards: result });
		}
	});

});
router.get('/logout', function(req, res, next) {
	req.session.destroy();
	res.redirect('/');
});
router.get('/:board', function(req, res, next) {
	board.isBoard(req.params.board,function(error, resulta){
		if(error) {
			console.log(error);
		}
		else {
			if(resulta){
				sendcard.get(req.params.board,function(error,resultb ){
					if(error) {
						console.log(error);
					}
					else {
						var url = new Array(['/','Home'],['/'+req.params.board,req.params.board]);
						return res.render('board', {url:url,title:resulta.name,user :req.session.user_id,board: resulta,cards : resultb});
					}
				});
			}
			else{
				var err = new Error('Not Found');
				err.status = 404;
				next(err);
			}
		}
	});
});
router.get('/:board/:sendcardid', function(req, res, next) {
	sendcard.isSendcard(req.params.sendcardid,function(error, resulta){
		if(error) {
			console.log(error);
		}
		else {
			if(resulta){
				followcard.get(req.params.sendcardid,function(error,resultb ){
					if(error) {
						console.log(error);
					}
					else {
						var url = new Array(['/','Home'],['/'+req.params.board,req.params.board],['/'+req.params.board+'/'+req.params.sendcardid,resulta.title]);
						return res.render('card', {url:url,title:resulta.title,user :req.session.user_id,sendcard: resulta,follows : resultb});
					}
				});
			}
			else{
				var err = new Error('Not Found');
				err.status = 404;
				next(err);
			}
		}
	});
});

/* post*/

router.post('/login', function(req, res, next){
	if(!req.session.user_id)
	{
		user.findByName(req.body.username,function(error, result){
			if(error) {
				console.log(error);
			} else {
				if(result){
					if(result.password == req.body.password){
						req.session.user_id = req.body.username;
						res.locals.message = '<div class="alert alert-success">登陆成功</div>';
						res.send(res.locals.message);
					}
					else{
						res.locals.message = '<div class="alert alert-danger">密码错误</div>';
						res.send(res.locals.message);
					}
				}
				else{
					console.log(req.body.username);
					res.locals.message = '<div class="alert alert-danger">该用户名不存在</div>';
					res.send(res.locals.message);
				}
				
			}
		});
	}
	else{
		res.send(res.locals.message);
	}
});

router.post('/register', function(req, res, next){
	if(req.body.password==req.body.confirmPassword){
		var a = {userName : req.body.username,password : req.body.password};
		user.findByName(req.body.username,function(error, result){
			if(error) {
				console.log(error);
			} else {
				if(result){
					res.locals.message = '<div class="alert alert-danger">该用户名已存在</div>';
					res.send(res.locals.message);
				}
				else{
					user.save(a);
					res.locals.message = '<div class="alert alert-success">注册成功</div>';
					res.send(res.locals.message);
				}
				
			}
		});
	}
	else{
		res.locals.message = '<div class="alert alert-danger">请确认密码</div>';
		res.send(res.locals.message);
	}

});
router.post('/:board', function(req, res, next) {
	sendcard.save({boardID : req.params.board,userName : req.session.user_id,title : req.body.title,content : req.body.content});
	return res.redirect('/'+req.params.board);
});
router.post('/:board/:sendcardid', function(req, res, next) {
	followcard.floors(req.params.sendcardid,function(floor){
		followcard.save({floor:floor+2,userName : req.session.user_id,sendcard : req.params.sendcardid,content : req.body.content});
	});
	return res.redirect('/'+req.params.board+'/'+req.params.sendcardid);
});
module.exports = router;
