const mongoose = require('mongoose');
//	Connect To DB
mongoose.connect('mongodb+srv://abubakar_malik:node.js.es6@cluster0-ujxkl.mongodb.net/store',{useNewUrlParser: true },(err) =>{
	if (!err) {
		console.log("Connected to MongoDB");
	}else{
		console.log("Error in Connecting to DB "+err);
	}
});