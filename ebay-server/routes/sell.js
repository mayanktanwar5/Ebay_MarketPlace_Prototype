var mysql = require('./mysql');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";
var productData;

function newAdvertise(req,callback)
{

	var  itemName = req.itemName;
	var category = req.category;
	var description = req.description;
	var auctionPrice = req.auctionPrice;
	var fixedPrice =req.fixedPrice;
	var fixedQuantity =req.fixedQuantity;
	var date = mysql.getDate();
	var time = mysql.getCurrentTime();
	var posted_by = req.email;
	var posted_date =date+" "+time;
	var id = posted_by+date+" "+time;

	data = {"id":id,"itemName":itemName,"category":category,"description":description,"auctionPrice":auctionPrice,"fixedPrice":fixedPrice,"fixedQuantity":fixedQuantity,"posted_by":posted_by,"posted_date":posted_date,"bought_by":"","bid_price":"","bid_by":""};

	mongo.connect(mongoURL,function(connection){

		console.log("advertise part ");
		console.log("advertise part  user kaun hia"+req.user);
		var coll = connection.get.collection('userProfile');

		coll.findOne({"user.email":req.email},function(err,result){

			console.log("rersult" +JSON.stringify(result));
			if(err)
			{
				throw err;
			}
			else
			{	
				
				 productData = {"firstname":result.user.userProfile.firstname,"lastname":result.user.userProfile.lastname,"state":result.user.userProfile.state,"id":id,"itemName":itemName,"category":category,"description":description,"auctionPrice":auctionPrice,"fixedPrice":fixedPrice,"fixedQuantity":fixedQuantity,"posted_by":posted_by,"posted_date":posted_date,"bought_by":"","bid_price":"","bid_by":""};
				 console.log("=======================  PRODUCT DATA ===============================",productData);
			}

		});	


		coll.update({"user.email":req.email},{$push:{"user.product":data}},function(err,result){

			console.log("update advertise part ");
			if(err)
			{
				throw err;
			}
			else
			{
				console.log("=======================  PRODUCT DATA ===============================  after ===============",productData);
				console.log(" Bhai kya result de arah hai"+JSON.stringify(result));
				//connection.close();

				var coll1 = connection.get.collection('products');
		coll1.insert(productData,function(err,result){

			console.log("update advertise part ");
			if(err)
			{
				callback (err);
			}
			else
			{
				console.log(" Bhai kya result de arah hai"+JSON.stringify(result));
				console.log("=======================  PRODUCT DATA ===============================  INSIDE============= ",productData);
				connection.close();
				return	callback(null,{"msg":"success"});
				
			}

		});
				
			}

		});
		
		

	})


	// mongo.connect(mongoURL,function(connection){

	// 	console.log("advertise part product entry ");
	// 	console.log("advertise part  user kaun hia product entry"+req.user);
		

	// 	coll.insert(productData,function(err,result){

	// 		console.log("update advertise part ");
	// 		if(err)
	// 		{
	// 			throw err;
	// 		}
	// 		else
	// 		{
	// 			console.log(" Bhai kya result de arah hai"+JSON.stringify(result));
	// 			connection.close();
				
	// 		}

	// 	});

	// })

}

function alladvertise(req,callback)
{

	mongo.connect(mongoURL,function(connection){

		console.log("show all advertise  product entry ");
		//console.log("advertise part  user kaun hia product entry"+req.user);
		var coll = connection.get.collection('products');

		coll.find({bought_by:req.bought_by}).toArray(function(err,result){

			console.log("update advertise part or result dekh ");
			console.log(JSON.stringify(result));
			console.log("ERROR"+err);
			if(err)
			{
				callback(err);
			}
			else
			{
				//console.log(" Bhai kya result de arah hai"+JSON.stringify(result));
				connection.close();
				callback(null,result);
				checkBiddingClosed();
				
			}

		});

	})

}

function bid(req,callback )
{

	
	var bidData= req.finalbidData;
	var date =mysql.getDate();
	var timestamp =date+" "+mysql.getCurrentTime();
	finalbidData ={"adv_id":bidData.adv_id,"adv_item":bidData.adv_item,"adv_desc":bidData.adv_desc,"bid_by":req.user,"mybid":bidData.mybid,"bid_date":date,"auction_price":bidData.auction_price,"posted_by":bidData.posted_by,"bid_open":"open"};
	var bidlogData ={"timestamp":timestamp,"user-bid-details":finalbidData};
	

	mongo.connect(mongoURL,function(connection){

		var coll = connection.get.collection('all_bids');
		coll.insert(finalbidData,function(err,result){

			if(err)
			{
				callback(err);
			}

			else
			{	
				connection.close();
				console.log("inserted the bid successfully"+JSON.stringify(result) );
				callback(null,{"msg":"success","data":result });
			}

		});

	 });	


		mongo.connect(mongoURL,function(connection){

		var coll1 = connection.get.collection('userProfile');
		coll1.update({"user.email":bidData.posted_by},{$push:{"user.bidder":finalbidData}},function(err,result){


			if(err)
			{

				throw err;
			}
			else
			{

				console.log("updated the BIDDER data ");
				connection.close();
			}


		});

		});


		mongo.connect(mongoURL,function(connection){

		var coll2 = connection.get.collection('userProfile');
		coll2.update({"user.email":req.user},{$push:{"user.bids":finalbidData}},function(err,result){

			if(err)
			{

				throw err;
			}
			else
			{

				console.log("updated the MYBIDS data ");
				connection.close();
			}

		});

		});
		

}


function myBids(req,callback)
{
	
	mongo.connect(mongoURL,function(connection){

		var coll2 = connection.get.collection('userProfile');

		coll2.findOne({"user.email":req.user},function(err,result){


			if(err)
			{
				callback (err);
			}

			else
			{
				connection.close();
				console.log("ALL the bids"+JSON.stringify(result.user.bids));
				callback(null,result.user.bids);
			}

		});


	});


}

function checkBiddingClosed()
{

mongo.connect(mongoURL,function(connection){

var coll = connection.get.collection("products");
coll.find({auctionPrice:{$gt :0},bought_by:""}).toArray(function(err,results){

console.log("results ===> CHECKING BIDDING CLOSED"+JSON.stringify(results));
for (db in results)
{
 	console.log("checking the single value +++++++++=====>"+JSON.stringify(results[db]));
	if(!addDays(results[db].posted_date,1))
	{

		getMaxBid(results[db].id);
		

	}
}
connection.close();

})


});


}


function getMaxBid(id)
{


mongo.connect(mongoURL,function(connection){

	var coll = connection.get.collection("all_bids");

	coll.aggregate([{$match:{adv_id:id}},
    {$group:{_id:"$adv_id",maxBid:{$max:"$mybid"}}}],
    function(err,result){

    	console.log(" The MAX BID ID IS ========================> " +JSON.stringify(result[0].maxBid));
    	if(err)
    	{
    		throw err;
    	}
    	else
    	{
    		coll.findOne({"adv_id":id,"mybid":result[0].maxBid},function(err,result1){

    			if(err)
    			{
    				throw err;
    			}
    			else
    			{
    				console.log("Getting the all bid data for max bid"+JSON.stringify(result1));
    				connection.close();
    				setMaxBid(result1);
    				
    			}

    		});
    	}

	})

});


}


function setMaxBid(bid)
{

var updateData = [{"bid_price":bid.bid_price,"bid_by":bid.bid_by},{"id":bid.adv_id},{"id":bid.adv_id}];
var query ="UPDATE all_advertise SET  ? WHERE ? ";
var data = {"query":query,"update":updateData};

closeAdv(bid);

mongo.connect(mongoURL,function(connection){


	var coll = connection.get.collection("userProfile");
	var coll1 = connection.get.collection("products");


	coll1.update({"id":bid.adv_id},{$set:{"bid_price":bid.myBid,"bid_by":bid.bid_by}},function(err,result){



		if(err)
		{
			throw err;
		}

		else
		{

			coll.update({"user.email":bid.posted_by ,"user.product.id":bid.adv_id},{$set:{"user.product.$.bid_by":bid.bid_by}},function(err,result1){

				if(err)
				{
					throw err;
				}
				else

				{
					connection.close();
					console.log("updated the value===========> "+JSON.stringify(result));
				}

			});

		}
	});


});


}



function closeAdv(bid)

{

 mongo.connect(mongoURL,function(connection){

 	var coll = connection.get.collection("all_bids");
 	var coll1 = connection.get.collection("userProfile");

 	coll.updateMany({"adv_id":bid.adv_id},{$set:{"bid_open":"close"}},function(err,result){


 		if(err)
 		{
 			throw err;
 		}
 		else
 		{
 			console.log("updated the all_bids");
 		}
 	})




 	coll1.update({"user.email":bid.bid_by,"user.bids.adv_id":bid.adv_id},{$set:{"user.bids.$.won_by":bid.bid_by}},function(err,result){
 		
 		if(err)
 		{
 			throw err;
 		}
 		else
 		{
 			
 		}
 	})


 	coll1.update({"user.email":bid.posted_by,"user.bidder.adv_id":bid.adv_id},{$set:{"user.bidder.$.won_by":bid.bid_by}},function(err,result){
 		
 		if(err)
 		{
 			throw err;
 		}
 		else
 		{
 			connection.close();
 		}
 	})

 });


}


function addDays (date, days) {
    var result = new Date(date);
    var currentDate = new Date();
    result.setDate(result.getDate() + days);
    return currentDate<result;
}



exports.newAdvertise=newAdvertise;
exports.alladvertise=alladvertise;
exports.bid=bid;
exports.myBids=myBids;