const Account=require('../Models/Accounts');
const User=require('../Models/usermodel')
const jwt=require("jsonwebtoken");
const zod =require("zod");

const { default: mongoose } = require('mongoose');

const balance=async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    })
    if(!account){
        return res.json({
            message:"Accountnot found"
        })
    }
    res.json({
        balance:account.balance
    })
    
}

const transfer = async (req, res) => {
    try {
        
        const { amount, to } = req.body;

        // Validate recipient's userId (to)
        if (!mongoose.Types.ObjectId.isValid(to)) {
            return res.status(400).json({ message: "Invalid recipient userId" });
        }

        // Fetch the sender's account
        const account = await Account.findOne({ userId: req.userId });
        if (!account || account.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Fetch the recipient's account
        const toAccount = await Account.findOne({ userId: to });
        if (!toAccount) {
            return res.status(400).json({ message: "Invalid account" });
        }

        // Update balances
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        );

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        );

        // Send success response
        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        console.error("Transfer failed:", error);
        res.status(500).json({ message: "Transfer failed", error });
    }
};

module.exports={balance,transfer}

