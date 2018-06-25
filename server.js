var express = require('express');
var path = require('path'); 
var fs = require('fs'); 
var app = express();
var mongo = require('mongodb');
var new_db = "mongodb://localhost:27017/agfgf";
var bodyParser = require('body-parser');
var crypto = require('crypto');
//Creating the database
//The GET method is used to retrieve information from the given server using a given URI
app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});//Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.
	return res.redirect('/public/index.html'); //express route 
}).listen(3000);

console.log("Server listening at : 3000");
app.use('/public', express.static(__dirname + '/public'));//middleware
app.use( bodyParser.json() );
/*To handle HTTP POST request in Express.js version 4 and above, you need to install middleware module called body-parser.

body-parser extract the entire body portion of an incoming request stream and exposes it on  req.body.*/
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));
/*app.use(bodyParser.json()) basically tells the system that you want json to be used.

bodyParser.urlencoded({extended: ...}) basically tells the system whether you want to use
 a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing
 that can deal with nested objects (i.e. true).*/
var getHash = ( pass , phone ) => {
				
				var hmac = crypto.createHmac('sha512', phone);
				
				//passing the data to be hashed
				data = hmac.update(pass);
				//Creating the hmac in the required format
				gen_hmac= data.digest('hex');
				//Printing the output on the console
				console.log("hmac : " + gen_hmac);
				return gen_hmac;
}

// Sign-up function starts here. . .

//post method is used for sned the data to the server
app.post('/sign_up' ,function(req,res){
	var name = req.body.name; //req.to recieve input data
	var email= req.body.email;
	var pass = req.body.password;
		var phone = req.body.phone;
	var password = getHash( pass , phone ); 		//encrpted password		

	
	var data = {
		"name":name,
		"email":email,
		"password": password, 
		"phone" : phone
	}
	
	mongo.connect(new_db , function(error , db){
		if (error){
			throw error;
		}
		console.log("connected to database successfully");
		//CREATING A COLLECTION IN MONGODB USING NODE.JS
		db.collection("details").insertOne(data, (err , collection) => {
			if(err) throw err;
			console.log("Record inserted successfully");
            console.log(collection);
            

		});
	});
	
	console.log("DATA is " + JSON.stringify(data) );
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/success.html'); 
	
	/** 
	var filePath = path.join(__dirname, 'public/success.html');
    var stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stat.size
    });
    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);	
	*/ 

});