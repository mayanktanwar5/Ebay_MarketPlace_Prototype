var mysql= require('mysql');

var conPool = mysql.createConnection({

	host : 'localhost', //host where mysql server is running 
	user : 'root', //user for the mysql application
	database : 'test',	
	password : 'Krishna21', //password for the mysql application
	port : 3306//port, it is 3306 by default for mysql

	});



var mypool = [];
  var  myconnectionPool ={
   
   	createConnection : function(maxCon){
   		for(var i=0;i<maxCon;i++)
   		{
   			mypool.push({"query" :conPool ,release: function(){mypool.push(this) ;}});
   		}
   	},
    getConnection: function(callback){
    		
   			if(mypool.length>0)
   			{
   				    var existConn = mypool.pop();
   					callback(existConn);

   			}
   			else
   			{
   				var countwait=0;
   				
   				setTimeout(function(){

   					if(mypool.length>0)
   				{
   					var existConn = mypool.pop();	
   					callback(existConn);
   				

   				}
   				},1000);

   			}

  		 }

 };





myconnectionPool.createConnection(500);


var getConnection = function(callback) {
    myconnectionPool.getConnection(function( connection) {
        callback( connection);
    });
};	

function fetchData(callback,data){

	var emailId =data.email;
	var password=data.password;
	var sqlQuery = "select * from users_data where email = '"+emailId+"' ;"; 

	getConnection(function(connection){
	connection.query.query(sqlQuery, function(err, rows, fields) { 
		if(err)
		{
			
			throw err;
		}
	else
	{ 
		
		callback(err, rows);
	}
	});
	//setTimeout(function(){connection.release();},2000)
	
	connection.release();


	});
	
	}


	function fetchUserData(callback,data){
	
	
	
	var email =data.email;
	var table = data.table;
	var column =data.column;
	var sqlQuery = "select * from "+table+" where " +column+" = '"+email+"';"; 
	getConnection(function(connection){
	connection.query.query(sqlQuery, function(err, rows, fields) { 
		if(err)
		{
			throw err;
		}
	else
	{ 
		callback(err, rows);
	}
	});
	connection.release();
	//setTimeout(function(){connection.release();},2000)
	});
	
	}

	function fetchAllData(callback,data){
	var email =data.email;
	var table = data.table;
	var column =data.column;
	var sqlQuery = data; 
	
	getConnection(function(connection){
	connection.query.query(sqlQuery, function(err, rows, fields) { 
		if(err)
		{
			throw err;
		}
	else
	{ 
		callback(err, rows);
	}
	});
	
	connection.release();
	//setTimeout(function(){connection.release();},2000)


	});
	
	}




function insertData(callback,data)
	{

		var insertData = data.data;
		var table =data.table;
		getConnection(function(connection){
		 connection.query.query('INSERT INTO '+table+' SET ?',insertData ,function(err,res) {
		if(err)
			{
		
				callback(err,res);
			}
			else
			{
		
			callback(err,res);
			}

			});
			connection.release();
			//setTimeout(function(){connection.release();},2000)

		 	});
		
	}	

	function getDate()
	{

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	dd='0'+dd
	} 

	if(mm<10) {
	mm='0'+mm
	} 

	today = mm+'/'+dd+'/'+yyyy;
	return today;
	}

	function getCurrentTime()
	{


     var d = new Date(); // for now
	 var h=d.getHours(); // => 9
	 var m =d.getMinutes(); // =>  30
	 var s =d.getSeconds();

	if(h<10)
	{
		h='0'+h;
	}
	if(m<10)
	{
		m='0'+m;
	}
	if(s<10)
	{
		s='0'+s;
	}

	var time = h+":"+m+":"+s;
	return time;
	}

	function updateData(callback,data)

	{	
		email=data.user_id;
		updateData =data.profile;
		var table =data.table;

      getConnection(function(connection){
      	connection.query.query('UPDATE '+table+' SET ? WHERE ?',[updateData,{"email":email}], function(err,res){

      	if(err)
			{
				throw err;
			}

			callback(err,res);


      	});
      	connection.release();
      	//setTimeout(function(){connection.release();},2000)

      })

	}


	function updateAllData(callback,data){
		
      getConnection(function(connection){
      	connection.query.query(data.query, data.update,function(err,res){

      	if(err)
			{
				throw err;
			}

			callback(err,res);


      	});
      	connection.release();
      	//setTimeout(function(){connection.release();},2000)

      })

	}


	function getUserId(callback,data)
	{

	var emailId =data.email;
	var password=data.password;
	var sqlQuery = "select user_id from user_data1 where email = '"+emailId+"' and password = '"+password+"';"; 
	getConnection(function(connection){
	connection.query.query(sqlQuery, function(err, rows, fields) { 
		if(err)
		{
			
			throw err;
		}
	else
	{ // return err or result 
		
		
		callback(err, rows);
	}
	});
	
	connection.release();
	//setTimeout(function(){connection.release();},2000)


	});
	

	}

	exports.fetchData=fetchData;
	exports.insertData=insertData;
	exports.updateData=updateData;
	exports.getUserId=getUserId;
	exports.getDate=getDate;
	exports.getCurrentTime=getCurrentTime;
	exports.fetchUserData=fetchUserData;
	exports.fetchAllData=fetchAllData;
	exports.updateAllData=updateAllData;
