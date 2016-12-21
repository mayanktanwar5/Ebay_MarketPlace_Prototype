var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("User Login unit test",function(){

  

  it("Should able to login ",function(done){

    
    server
    .post("/login").send({"password":"Mayank21","email":"vishu5@gmail.com"})
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      
       res.status.should.equal(200);
       res.body.msg.should.equal("success");
      
      
      done();
    });
  });

});

describe("User Login unit test",function(){

  

  it("Should not able to login ",function(done){

    
    server
    .post("/login").send({"password":"Mayank1","email":"vishu5@gmail.com"})
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      
      
       res.status.should.equal(200);
       res.body.msg.should.equal("IncorrectPassword");
      
      
      done();
    });
  });

});

describe("User post advertisement unit test",function(){

  

  it("Should able to add advertisements ",function(done){

    
    server
    .post("/sell").send({"itemName":"Microwave Oven","category":"electronics Appliance","description":"brand new","fixedPrice":"200","fixedQuantity":"5"})
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      
      
       res.status.should.equal(200);
       res.body.msg.should.equal("success");
      
      
      done();
    });
  });

});

describe("User add to  cart unit test",function(){

  

  it("Should able to add advertisements to cart ",function(done){

    
    server
    .post("/addToCart").send({"email":"vishu5@gmail.com","adv_id":"vishu5@gmail.com10/07/2016 00:37:03" ,"quantity":"1"})
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      
       res.status.should.equal(200);
       res.body.msg.should.equal("success");
      
      
      done();
    });
  });

});


describe("User can bid  test",function(){

  

  it("Should able to bid advertisements  ",function(done){

    
    server
    .post("/bid").send({"bid_by":"vishu5@gmail.com","adv_id":"vishu5@gmail.com10/15/2016 23:37:43","posted_by":"vishu5@gmail.com","auction_price":"20","bid_price":"25","adv_item":"Fifa15","adv_desc":"Player"})
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      
       res.status.should.equal(200);
       res.body.msg.should.equal("success");
      
      
      done();
    });
  });

});


describe("User remove items from cart unit test",function(){

  it("Should able to remove advertisements from cart ",function(done){

    
    server
    .post("/removeCartItem").send({"id":"vishu5@gmail.com10/07/2016 00:37:03","email":"vishu5@gmail."})
    .expect("Content-type",/json/
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      
       res.status.should.equal(200);
       res.body.msg.should.equal("success");
      
  
      done();
    });
  });

});

