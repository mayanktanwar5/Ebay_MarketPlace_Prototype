var mysql = require('./mysql');
var bcrypt =require('bcrypt');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";
var passport =require('passport');

function registerUser(req,callback)
{

	mongo.connect(mongoURL, function(connection){

		console.log("Connected to mongo db");
		var coll = connection.get.collection('userProfile');
		var collUser = connection.get.collection('user'); 

		coll.insert(req,function(err ,result){

			
			console.log("Mogo db insides"+JSON.stringify(result));
			if(err)
			{
				return callback(err);
			}
			else 
			{
				connection.close();
				return callback(null,result);
			}

		})

	})
	
}

function loginUser(req ,callback)
{
	
mongo.connect(mongoURL, function(connection){

var coll = connection.get.collection('user'); 

coll.findOne({
          "local.email":req.email 
        },function(err,user){

        	if(err)
        	{
        		connection.close();
        		return callback(err);
        	}

        	else
        	{	
        		console.log(user);
        		if(user)
        		{
        			lastloggedin(req.email);
        		}
        		connection.close();
        		return callback(null ,user);
        	}	

        })		

})
	
}


function lastloggedin(email)
{
	console.log("lastloggedin main aa gya"+JSON.stringify(email));
	mongo.connect(mongoURL, function(connection){

	var coll = connection.get.collection('userProfile');
	coll.findOne({"user.email":email},function(err,userDetail){

		if (err)
		{
			throw err;
		}
		else if(userDetail)
		{
			lastLoggedInValue =userDetail.user.logging_details.loggedInAt;
	console.log("userDetail "+JSON.stringify(userDetail));
	console.log("last logged in value =====> "+lastLoggedInValue)
	lastloggedInAt(email, lastLoggedInValue);
		}

	})
	loggedInAt(email);
	connection.close();
	});

}

function loggedInAt(email)
{
 
	 var loggedInAt= mongo.getDate() +" "+ mongo.getCurrentTime();
	 mongo.connect(mongoURL, function(connection){
	 var coll = connection.get.collection('userProfile');
		 coll.update({"user.email":email} ,{$set:{"user.logging_details.loggedInAt":loggedInAt}},function(err,result){

				if(err)
				{
					throw err;
				}
				else
				{
					console.log(" updated  logged in at data");
					connection.close();
				}

		});
});

}

function lastloggedInAt(email, lastLoggedIn)
{
	console.log("last loggind in main hun bhaisahb");
	mongo.connect(mongoURL, function(connection){
 	var coll = connection.get.collection('userProfile');
 
 coll.update({"user.email":email} ,{$set:{"user.logging_details.lastLoggedIn":lastLoggedIn}},function(err,result){

		if(err)
		{
			throw err;
		}
		else
		{
			console.log(" updated last logged in data");
			connection.close();
		}

		})
})

}

  function canRedirectToHomepage(req,callback)
{

		var email = req.email;

		console.log("checking status  true "+email);
		mongo.connect(mongoURL,function(connection){

			//var coll = mongo.collection('advertisement');
			var collUser = connection.get.collection('userProfile');
			console.log(" getting data ");
			collUser.findOne({"user.email":req.email},function(err,result){

				if(err)
				{
					callback(err);
				}
				else
				{
						
					connection.close();
					callback(null,	{"lastLoggedIn":result.user.logging_details.lastLoggedIn,"userProfile":result.user.userProfile});
				}

			})

		})
	
};


function logout(req,res)
{
	
	//winston.info(req.session.user_id);
   	req.session.destroy();
   	res.send(true);
		
}

function encrypt(string)
{

return bcrypt.hashSync(string,bcrypt.genSaltSync(10));

}

function comparePassword(string ,dbstring)
{
	return( bcrypt.compareSync(string,dbstring));
}


function createProfile(req,callback)
{
var address1 = req.address1;
var address2 = req.address2;
var country = req.country;
var state = req.state;
//var city = req.city;
var zipCode = req.zipcode;
var user_id = req.user_id;
var birthday =req.birthday;
console.log("I am inside the createProfile of the SERVER");
console.log("REQUEST"+JSON.stringify(req));	
console.log(req.user_id);
var update1 ={"user.userProfile.address1":address1};
//update1.user =req.user_id;
console.log("prinitng the update profile data "+JSON.stringify(update1));
var update ={"user.userProfile.address1":address1,"user.userProfile.address2":address2,"user.userProfile.birthday":birthday,"user.userProfile.country":country,"user.userProfile.state":state,"user.userProfile.zipcode":zipCode};
console.log("prinitng the update profile data "+JSON.stringify(update));
mongo.connect(mongoURL, function(connection){

var coll =connection.get.collection("userProfile");
console.log("inside update");
coll.update({"user.email":user_id},{$set:update},function(err,result){
console.log("inside update call");
if(err)
{
	callback( err);
}
else
{
	console.log("Updated the profile data" +JSON.stringify(result));
	connection.close();
	console.log("came after closing the collection");
	callback(null,{"msg":"200"});
}

})

});
}


function profile(req,callback)
{
	mongo.connect(mongoURL, function(connection){


		var coll = connection.get.collection("userProfile");

		coll.findOne({"user.email":req.email},{"user.product":true,"user.userProfile":true},function(err,result){

		if(err)
		{
			callback(err);
		}
		
		else
		{
			callback(null,{"profile":result.user.userProfile,"product":result.user.product});
		}


		})

	});

}


function allBought(req,callback)
{
	mongo.connect(mongoURL, function(connection){

		var coll = connection.get.collection("userProfile");

		coll.findOne({"user.email":req.email},{"user.allBought":true},function(err,result){

		if(err)
		{
			callback(err);
		}
		else if(result.user.allBought.length>0)
		{
			connection.close();
			callback(null,result.user.allBought);
		}
		else
		{	connection.close();
			callback(null,"noData");
		}

		})
	});
}

exports.allBought=allBought;
exports.profile=profile;
exports.registerUser=registerUser;
exports.loginUser=loginUser;
exports.canRedirectToHomepage=canRedirectToHomepage;
exports.logout=logout;
exports.createProfile=createProfile;