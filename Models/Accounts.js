const mongoose =require("mongoose");


const accountschema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Make sure this is ObjectId
        ref: 'User' ,
        required: true
    },
    accountName:{
        type: String, 
        required:true, 
        
    },
    balance:{
        type:Number,
        require:true
    }

})

const Account=mongoose.model('Account',accountschema)


module.exports=Account
