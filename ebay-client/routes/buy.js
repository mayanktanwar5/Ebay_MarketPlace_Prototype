var mysql =require('./mysql');
var logger1 = require("../logger/logger");
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";
var mq_client = require('../rpc/client');

function addToCart(req,res)
{

var adv= req.body.adv;
var quantity = req.body.quantity;


console.log("adding the item in cart ");


var data = {"email":req.user,"id":adv.id,"itemName":adv.itemName,"description":adv.description,"fixedQuantity":adv.fixedQuantity,"fixedPrice":adv.fixedPrice,"quantity":quantity};
console.log("prinitng the cart data"+JSON.stringify(data));
	
	mq_client.make_request("addToCart_queue",data,function(err,result){

				if(err)
				{

					throw err;
				}

				else
				{
					console.log("adding the item in cart  after asding =====> ");
					res.send(result);

				}

	});


}

function checkItemAvailable(adv_id){

var  query= "select * from all_advertise where  id = '"+adv_id+"' and bought_by IS NULL";
var status ;
mysql.fetchAllData(function(err,dbres){


if(err)
{

	throw err;
}
else if (dbres.length>0)

{

status = true;
}
else
{
	status= false;
}

},query);

return staus;

};



function showCart(req, res)
{

	
	//logger1.stream.write({"user":req.user,"action":"showCart Item"});


	var coll = mongo.collection("userProfile");
	console.log("Showing the value of the acrt");
	mq_client.make_request("showCart_queue",{"user":req.user},function(err,result){

		
		console.log("Showing the value of the acrt");
		console.log(JSON.stringify(result));

		if(err)
		{
			throw err;
		}
		else if (result.result=="NoItems")
		{   
			console.log("sending the no itesm result");
			res.send("NoItems");

		}
		else
		{
			
			console.log("All the items in the cart are "+JSON.stringify(result));
			res.send(result);
		}


	})


}


function removeCartItem(req,res)

{
	//logger1.stream.write({"user":req.user,"action":"Remover Cart item"});
  //var query = "delete from cart where adv_id= '"+req.body.id+"' and email ='"+req.body.email+"'";

  //mongo.connect(mongoURL,function(connection){

  	//var coll = mongo.collection("userProfile");

  	mq_client.make_request("removeCartItem_queue",{"user":req.user,"id":req.body.id},function(err,result){

  		if(err)
  		{
  			throw err;
  		}
  		else
  		{
  			res.send(result);
  		}

  	})

  //});

}

function deleteCartItem(req ,id)

{
	console.log("I am in delete cart item ");
  	console.log("I am in delete cart item ");

  mongo.connect(mongoURL,function(connection){

  	var coll = mongo.collection("userProfile");
  	console.log("I am in delete cart item "+req);
  	console.log("I am in delete cart item "+id);

  	coll.update({"user.email":req},{$pull:{"user.myCart":{"id":id}}},function(err,result){

  		if(err)
  		{
  			throw err;
  		}
  		else
  		{
  			connection.close();
  			//res.send({"msg":"success"});
  		}

  	})

  });


}

function allCart(req ,res)
{


console.log("Showing the value of the acrt");
	mq_client.make_request("allCart_queue",{"user":req.user},function(err,result){

		
		console.log("Showing the value of the acrt");
		console.log(JSON.stringify(result));

		if(err)
		{
			throw err;
		}
		else if (result.result=="NoItems")
		{
			
			res.send("NoItems");
		}
		else if (result.result=="success")
		{
			
			console.log("All the items in the cart are "+JSON.stringify(result));
			res.send("success");
		}


	});
		}



function allCartItem(req,dbres)
{
		console.log("what is the alll ====> item "+JSON.stringify(dbres));

	for(db in dbres)
	{

		console.log("what is the current item "+JSON.stringify(dbres[db]));
		var updatedQuantity = dbres[db].fixedQuantity -dbres[db].quantity;
		updateCart(dbres[db].email,dbres[db].id,dbres[db].quantity,updatedQuantity)		
	}



}





function buyItem(req,res)
{

 var updateData;
	logger1.stream.write({"user":req.user,"action":"boughtItem","item_id":req.body.item.id});

	if(req.body.item.updatedQuantity<=0)
	{
		updateData=	{"user":req.user,"bought_by":"sold","boughtQuantity":req.body.item.boughtQuantity,"fixedQuantity":req.body.item.updatedQuantity,"id":req.body.item.id};
	}

	else if(req.body.item.updatedQuantity>0)
	{

		updateData=	{"user":req.user,"boughtQuantity":req.body.item.boughtQuantity,"bought_by":"","fixedQuantity":req.body.item.updatedQuantity,"id":req.body.item.id};

	}

	mq_client.make_request("buyItem_queue",updateData,function(err,result){
		
		if(err)
			throw err;
		else if(result.result=="success")
		{	
			res.send("success");
		}	
	})

}



function getItem (req ,res)
{


var query = "select * from all_advertise where id ='"+req.id+"'";

mysql.fetchAllData(function(err,dbres){

if(err)

{

	throw err;
}
else if(dbres.length>0)
{
	res.send(dbres);
}


},query)

}



function updateCart(req,id,boughtquantity,updatedQuantity)
{
	var updateData;
	console.log("updated Quantity is ====>"+updatedQuantity);
	console.log("Bought Quantity is ====>"+boughtquantity);
	console.log("id Quantity is ====>"+id);
	console.log("user Quantity is ====>"+req);



	if(updatedQuantity<=0)
	{


	updateData=	{"bought_by":"sold","fixedQuantity":updatedQuantity}
	console.log("update date should be zero"+updateData);
	;
	}

	else if(updatedQuantity>0)
	{

		updateData=	{"bought_by":"","fixedQuantity":updatedQuantity};
		console.log("update date should be zero"+updateData);
	}

	mongo.connect(mongoURL,function(connection){


		var coll =mongo.collection("products");

		coll.update({"id":id},{$set:{"bought_by":updateData.bought_by,"fixedQuantity":updateData.fixedQuantity}},function(err,result){

			if(err)
			{
				throw  err;
			}
			else
			{
				connection.close();
			setItemsBought(req,id,boughtquantity,updatedQuantity);
 			deleteCartItem(req,id);
			}


		});
	});

}


function setItemsBought(req,id,boughtquantity,updatedQuantity)
{

console.log("I am in the setItemsbought");

var table_cart ;
var data;
mongo.connect(mongoURL,function(connection){


	var coll = mongo.collection("userProfile");
	var coll1 = mongo.collection("products");
	var products ;

	coll1.findOne({"id":id},function(err,result){

		if(err)
		{
			throw err;
		}
		else
		{
			products =result;
			console.log(" ========>listing the item ========>"+JSON.stringify(products));
			console.log("products firstname"+products.firstname);
			 data={"itemName":products.itemName,"description":products.description,"id":products.id,"bought_by":req,"firstname":products.firstname,"lastname":products.lastname,"state":products.state,"fixedPrice":products.fixedPrice,"bid_price":products.bid_price,"auction_price":products.auctionPrice,"quantity":boughtquantity,"bought_date":mysql.getDate()};
			console.log(" ========>listing the item ========>"+JSON.stringify(data));
				coll.update({"user.email":req},{$push:{"user.allBought":data}},function(err,result){


					if (err)
					{
						throw err;
					}
					else
					{
						connection.close();

					}

				});
		}

	});




});

}


exports.getItem=getItem;
exports.buyItem =buyItem;
exports.allCart=allCart;
exports.addToCart=addToCart;
exports.showCart=showCart;
exports.removeCartItem=removeCartItem;