var mysql =require('./mysql');
var logger1 = require("../logger/logger");
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";

function addToCart(req,callback)
{


//var email = req.body.email;
//var adv= req.body.adv;
//var quantity = req.body.quantity;

// logger1.stream.write({"user":req.user,"action":"add Items to cart"});
//var table_cart ={"table":"cart","data":{"email":email,"adv":adv,"quantity":quantity}};

console.log("adding the item in cart ");
mongo.connect(mongoURL,function(connection){


	var coll = connection.get.collection("userProfile");
	coll.update({"user.email":req.email},{$push:{"user.myCart":req}},function(err,result){


				if(err)
				{
					callback( err);
				}

				else
				{
					console.log("adding the item in cart  after asding =====> ");
					connection.close();
					callback(null,{"msg":"success"});

				}

	});


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



function showCart(req, callback)
{

	
	logger1.stream.write({"user":req.user,"action":"showCart Item"});

	//var query ="select a.itemName ,a.id ,a.description,a.fixedQuantity ,c.quantity ,a.fixedPrice from cart c , all_advertise a where a.id = c.adv_id  and c.email = '"+req.session.user_id+"'";




mongo.connect(mongoURL,function(connection){


	var coll = connection.get.collection("userProfile");
	console.log("Showing the value of the acrt");
	coll.findOne({"user.email":req.user},{"user.myCart":true},function(err,result){

		
		console.log("Showing the value of the acrt");
		console.log(JSON.stringify(result));
		console.log("LENGTH IS ====>"+JSON.stringify(result.user.myCart.length));

		if(err)
		{
			callback( err);
		}
		else if (result.user.myCart.length<=0)
		{   connection.close();
			callback(null,{"result":"NoItems"});
		}
		
		else
		{
			connection.close();
			console.log("All the items in the cart are "+JSON.stringify(result.user.myCart));
			callback(null,result.user.myCart);
		}


	})


});

}


function removeCartItem(req,callback)

{
	//logger1.stream.write({"user":req.user,"action":"Remover Cart item"});
  //var query = "delete from cart where adv_id= '"+req.body.id+"' and email ='"+req.body.email+"'";

  mongo.connect(mongoURL,function(connection){

  	var coll = connection.get.collection("userProfile");

  	coll.update({"user.email":req.user},{$pull:{"user.myCart":{"id":req.id}}},function(err,result){

  		if(err)
  		{
  			callback( err);
  		}
  		else
  		{
  			callback(null,{"msg":"success"});
  		}

  	})

  });

}

function deleteCartItem(req ,id)

{
	console.log("I am in delete cart item ");
  	console.log("I am in delete cart item ");

  mongo.connect(mongoURL,function(connection){

  	var coll = connection.get.collection("userProfile");
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

function allCart(req ,callback)
{


mongo.connect(mongoURL,function(connection){


	var coll = connection.get.collection("userProfile");
	console.log("Showing the value of the acrt");
	coll.findOne({"user.email":req.user},{"user.myCart":true},function(err,result){

		
		console.log("Showing the value of the acrt");
		console.log(JSON.stringify(result));

		if(err)
		{
			throw err;
		}
		else if (result.user.myCart.length<=0)
		{
			connection.close();
			callback({"result":"NoItems"});
		}
		else
		{
			connection.close();
			console.log("All the items in the cart are "+JSON.stringify(result.user.myCart));
			allCartItem(req,result.user.myCart)
			callback({"result":"success"});
		}


	})


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





function buyItem(req,callback)
{

 // var updateData;
	// logger1.stream.write({"user":req.user,"action":"boughtItem","item_id":req.body.item.id});

	// if(req.body.item.updatedQuantity<=0)
	// {
	// 	updateData=	{"bought_by":"sold","fixedQuantity":req.body.item.updatedQuantity,"id":req.body.item.id};
	// }

	// else if(req.body.item.updatedQuantity>0)
	// {

	// 	updateData=	{"bought_by":"","fixedQuantity":req.body.item.updatedQuantity,"id":req.body.item.id};

	// }
	var updateData = req;

 //var query ="UPDATE all_advertise SET  ? WHERE ? ";
 //var data = {"query":query,"update":updateData};

mongo.connect(mongoURL,function(connection){

	var coll =connection.get.collection("products");

	coll.update({id:updateData.id},{$set:{fixedQuantity:updateData.fixedQuantity,bought_by:updateData.bought_by}},function(err,result){
		
		if(err)
			callback (err);
		else
		{	connection.close();
			setItemsBought(req.user,req.id,req.boughtQuantity,req.updatedQuantity);
			callback(null,{"result":"success"});
		}	
	})

});

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


		var coll =connection.get.collection("products");

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


	var coll = connection.get.collection("userProfile");
	var coll1 = connection.get.collection("products");
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