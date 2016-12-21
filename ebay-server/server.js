#!/usr/bin/env node
var amqp = require('amqp')
, util = require('util');

var user = require('./routes/user');
var sell = require('./routes/sell');
var buy = require('./routes/buy');
// Import events module
var events = require('events');

// Create an eventEmitter object
var eventEmitter = new events.EventEmitter();
eventEmitter.setMaxListeners(1000);
var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		console.log("in the login queue");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the login queue subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.loginUser(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});


cnn.on('ready', function(){
	console.log("listening on signup_queue");

	cnn.queue('signup_queue', function(q){
		console.log("in the signup_queue queue");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the login queue subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.registerUser(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});



cnn.on('ready', function(){
	console.log("listening on createProfile_queue");

	cnn.queue('createProfile_queue', function(q){
		console.log("in the createProfile_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the login queue subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.createProfile(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on isLoggedIn_queue");

	cnn.queue('isLoggedIn_queue', function(q){
		console.log("in the isLoggedIn_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the login queue subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.canRedirectToHomepage(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on profile_queue");

	cnn.queue('profile_queue', function(q){
		console.log("in the profile_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the login queue subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.profile(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});


cnn.on('ready', function(){
	console.log("listening on allBought_queue");

	cnn.queue('allBought_queue', function(q){
		console.log("in the allBought_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the login queue subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			user.allBought(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});


cnn.on('ready', function(){
	console.log("listening on newAdvertise_queue");

	cnn.queue('newAdvertise_queue', function(q){
		console.log("in the newAdvertise_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the login queue subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			sell.newAdvertise(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on alladvertise_queue");

	cnn.queue('alladvertise_queue', function(q){
		console.log("in the alladvertise_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the alladvertise_queue  subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			sell.alladvertise(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on bid_queue");

	cnn.queue('bid_queue', function(q){
		console.log("in the bid_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the bid_queue  subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			sell.bid(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on myBids_queue");

	cnn.queue('myBids_queue', function(q){
		console.log("in the bid_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the myBids_queue  subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			sell.myBids(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on addToCart_queue");

	cnn.queue('addToCart_queue', function(q){
		console.log("in the addToCart_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the addToCart_queue  subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			buy.addToCart(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
cnn.on('ready', function(){
	console.log("listening on showCart_queue");

	cnn.queue('showCart_queue', function(q){
		console.log("in the showCart_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the showCart_queue  subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			buy.showCart(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
cnn.on('ready', function(){
	console.log("listening on removeCartItem_queue");

	cnn.queue('removeCartItem_queue', function(q){
		console.log("in the removeCartItem_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the removeCartItem_queue  subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			buy.removeCartItem(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});

cnn.on('ready', function(){
	console.log("listening on buyItem_queue");

	cnn.queue('buyItem_queue', function(q){
		console.log("in the buyItem_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the buyItem_queue  subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			buy.buyItem(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
cnn.on('ready', function(){
	console.log("listening on allCart_queue");

	cnn.queue('allCart_queue', function(q){
		console.log("in the allCart_queue ");
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log("in the allCart_queue  subcriber");
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			buy.buyItem(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});