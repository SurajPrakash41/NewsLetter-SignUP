//same for all
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
require('dotenv').config();

const app=express();

app.use(express.static("public"));//for css and images

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
   res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
	const firstName=req.body.fName;
	const lastName=req.body.lName;
	const email=req.body.email;

  //members :-an array of object
	const data ={
		members:[{
			email_address:email,
			status: "subscribed",
			merge_fields: {
				FNAME: firstName,
				LNAME: lastName
			}

		}]
	};
	const jsonData= JSON.stringify(data);
	const url="https://us20.api.mailchimp.com/3.0/lists/de8d15d082";

  //options
	const options={
		method:"POST",
		auth: "Suraj:"+process.env.API_KEY


	}
  //send data to mailchimp
const request=https.request(url,options,function(response){

	if(response.statusCode===200)
	{
		res.sendFile(__dirname+"/success.html");
	}
	else
	{
		res.sendFile(__dirname+"/failure.html");
	}
     response.on("data",function(data){
			 console.log(JSON.parse(data));
		 })
	})
  //passing the data to mailchimp
	request.write(jsonData);
	request.end();
});


app.post("/failure",function(req,res){
	res.redirect("/");
});










//listen
//dynamic port
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is active on port 3000");
});
