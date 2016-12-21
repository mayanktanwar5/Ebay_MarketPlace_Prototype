var mysql = require('./mysql');
var fs = require('fs');
var logger1 = require("../logger/logger");
var productData;
var mq_client = require('../rpc/client');

function newAdvertise(req,res)
{

	var table ="all_advertise";
	var  itemName = req.body.itemName;
	var category = req.body.category;
	var description = req.body.description;
	var auctionPrice = req.body.auctionPrice;
	var fixedPrice =req.body.fixedPrice;
	var fixedQuantity =req.body.fixedQuantity;
	var date = mysql.getDate();
	var time = mysql.getCurrentTime();
	var posted_by = req.user;
	var posted_date =date+" "+time;
	var id = posted_by+date+" "+time;
	logger1.stream.write({"user":req.session.user_id,"action":"add new sale item"});
	data = {"email":req.user,"id":id,"itemName":itemName,"category":category,"description":description,"auctionPrice":auctionPrice,"fixedPrice":fixedPrice,"fixedQuantity":fixedQuantity,"posted_by":posted_by,"posted_date":posted_date,"bought_by":"","bid_price":"","bid_by":""};

		mq_client.make_request("newAdvertise_queue",data,function(err,result){

			console.log("rersult" +JSON.stringify(result));
			if(err)
			{
				throw err;
			}
			else
			{	
				 res.send(result);
			}

		});

}

function alladvertise(req,res)
{

		mq_client.make_request("alladvertise_queue",{bought_by:""},function(err,result){

			console.log("update advertise part or result dekh ");
			console.log(JSON.stringify(result));
			console.log("ERROR"+err);
			if(err)
			{
				throw err;
			}
			else
			{
				
				console.log("sending the result");
				res.send(result);
			}

		});


}

function bid(req,res )
{

	logger1.stream.write({"user":req.user,"action":"bid Items "});
	var bidData= req.body;
	var date =mysql.getDate();
	var timestamp =date+" "+mysql.getCurrentTime();
	console.log("Prinitng the bidding data "+bidData);
	finalbidData ={"adv_id":bidData.adv_id,"adv_item":bidData.adv_item,"adv_desc":bidData.adv_desc,"bid_by":req.user,"mybid":bidData.bid_price,"bid_date":date,"auction_price":bidData.auction_price,"posted_by":bidData.posted_by,"bid_open":"open"};
	var bidlogData ={"timestamp":timestamp,"user-bid-details":finalbidData};
	

		mq_client.make_request("bid_queue",{"finalbidData":finalbidData,"user":req.user},function(err,result){

			if(err)
			{
				throw err;
			}

			else
			{	
				console.log("inserted the bid successfully"+JSON.stringify(result) );
				fs.appendFile("./userTracking/bid.txt", JSON.stringify(bidlogData), function(err) {
    		if(err) {
        		return console.log(err);
    				}
    	  		console.log("The file was saved!");
				}); 	
				res.send(result);
			}

		});

}


function myBids(req,res)
{

		mq_client.make_request("myBids_queue",{"user":req.user},function(err,result){


			if(err)
			{
				throw err;
			}

			else
			{
				res.send(result);
			}

		});

}


exports.newAdvertise=newAdvertise;
exports.alladvertise=alladvertise;
exports.bid=bid;
exports.myBids=myBids;