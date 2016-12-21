var mysql = require('./mysql');
var bcrypt =require('bcrypt');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";
var passport =require('passport');
var mq_client = require('../rpc/client');



function registerUser(req,res ,next)
{

	console.log("registering user +  "+JSON.stringify(req.user));
	var userData = req.body;
	var email =req.body.email;
	var password = req.body.password;
	var  mobile = req.body.mobile;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var  account_created = mongo.getDate();
	var encrypted = encrypt(req.body.password);
	var userProfile = {"firstname":firstname,"lastname":lastname,"mobile":mobile,"account_created":account_created ,"address1":"","address2":"","birthday":"","country":"","state":"","zipcode":""}
	var logging_details ={"lastLoggedIn":"","loggedInAt":""};



	console.log("prinitng next "+next);
	passport.authenticate('local-signup', function(err, user, info) {
    console.log(" I am  in login authenticate");
    if(err) {
    	console.log("prinitng next "+next);
      return next(err);
    }

    if(info) {
    	
      console.log("user not found");
      return res.send({"msg":"UserNotFound"});
    }
    else{

    	console.log("user from "+user);
    	mq_client.make_request("signup_queue",{"user":{"email": email,"userProfile":userProfile ,"logging_details":logging_details}},function(err ,result){

			
			if(err)
			{
				console.log("Mogo db throw err");
				throw err;

			}
			else 
			{	
					req.logIn(user,function(err) {
    	
				      if(err) {
				        return next(err);
				      }
				    
				      	console.log("session initilized")
				     	 return res.send({"msg":"user Stored successfully","userId":result.ops[0].user.userProfile});
				    		})
				    console.log("response from mongo db "+JSON.stringify(result));
			}

		})

    }
  })(req, res, next);
	
}



function loginUser(req,res ,next)
{
console.log("prinitng next "+next);
passport.authenticate('local', function(err, user, info) {
    console.log(" I am  in login authenticate");
    if(err) {
    	console.log("prinitng err EROR ERROR ERROR ERROR",err);
    	if(err=="Timeout")
    	{
    			return res.send(err);
    	}
      return next(err);
    }

    console.log("prinitng the info message",info);
   if(!user && info.message=="notRegistered") {
    	
      console.log("user not found  notRegistered");
      return res.send({"msg":"404"});
    }
    if(!user && info.message=="IncorrectPassword") {
    	
      console.log("user not found IncorrectPassword");
      return res.send({"msg":"IncorrectPassword"});
    }

    console.log("==============USER=============="+JSON.stringify(user));
    req.logIn(user,function(err) {
    	
      if(err) {
        return next(err);
      }
      console.log(user);
    
      console.log("session initilized")
      console.log(req.user.local.email);
      
      return res.send({"msg":"success",
	 					"userId": "hello"	});
    })
  })(req, res, next);
	
}



  function canRedirectToHomepage(req,res)
{

	console.log("checking status "+req.user);
	//Checks before redirecting whether the session is valid
	if(req.user)
	{
		var email = req.user;

		console.log("checking status  true "+email);
		//mongo.connect(mongoURL,function(connection){

			//var coll = mongo.collection('advertisement');
			//var collUser = mongo.collection('userProfile');
			console.log(" getting data ");
			mq_client.make_request("isLoggedIn_queue",{"email":email},function(err,result){

				if(err)
				{
					throw err;
				}
				else
				{
					console.log("result  ===="+JSON.stringify(result));
					//connection.close();
					//console.log("user last logged in details"+JSON.stringify({"lastLoggedIn":result.user.logging_details.lastLoggedIn,"userProfile":result.user.userProfile}));
					res.send(result);
				}

			})

		//})
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	}
	
};


function logout(req,res)
{
	
	//console.log("Before log out ======================>"+JSON.stringify(req));
	console.log("Before log out ======================>"+JSON.stringify(req.body));

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


function createProfile(req,res)
{
var address1 = req.body.address1;
var address2 = req.body.address2;
var country = req.body.country;
var state = req.body.state;
var city = req.body.city;
var zipCode = req.body.zipCode;
var user_id = req.user;
var birthday =req.body.bday;
var update ={"user_id":req.user,"address1":address1,"address2":address2,"birthday":birthday,"country":country,"state":state,"zipcode":zipCode};

console.log("update the profile at the client side"+JSON.stringify(update));

console.log("inside update");
mq_client.make_request("createProfile_queue",update,function(err,result){
console.log("inside update call");
if(err)
{
	throw err;
}
else
{
	console.log("Updated the data" +JSON.stringify(result));
	res.send(result);
}

})

}

function profile(req,res)
{
	
	
		var coll = mongo.collection("userProfile");

		mq_client.make_request("profile_queue",{"email":req.user},function(err,result){

		if(err)
		{
			throw err;
		}
		
		else
		{
			
			res.send(result);
		}

		})

	

}


function allBought(req,res)
{
	
		var coll = mongo.collection("userProfile");

		mq_client.make_request("allBought_queue",{"email":req.user},function(err,result){

		if(err)
		{
			throw err;
		}
		
		else
		{
			console.log("all bought RESULT "+JSON.stringify(result));
			res.send(result);
		}


		})
	
	
}

exports.allBought=allBought;
exports.profile=profile;
exports.registerUser=registerUser;
exports.loginUser=loginUser;
exports.canRedirectToHomepage=canRedirectToHomepage;
exports.logout=logout;
exports.createProfile=createProfile;