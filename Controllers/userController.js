require('dotenv').config();
const User=require('../Models/usermodel')
const Account=require('../Models/Accounts')
const jwt=require("jsonwebtoken");
const zod =require("zod");

const signupBody=zod.object({
  username:zod.string(),
  firstName:zod.string(),
  lastName:zod.string(),
  password:zod.string()
})

const signInBody=zod.object({
  username:zod.string(),
  password:zod.string()
})




//signup 

  const signUpUser = async (req, res) => {

    const {success}=signupBody.safeParse(req.body)
    if(!success){
      return res.status(411).json({
        message:" Incorrect inpute"
      })
    }
    
    const existingUSer=await User.findOne({
      username:req.body.username
    })

    if(existingUSer){
      return res.status(411).json({
        message:"Email already  taken"
      })
    }

    const user=await User.create({
      username:req.body.username,
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      password:req.body.password
    })
    const userId=user._id;

    try {
      await Account.create({
        userId,
        accountName:user.username,
        balance: 1 + Math.random() * 10000
      });
    } catch (err) {
      console.error('Error creating account:', err);
      return res.status(500).json({ message: 'Error creating account' });
    }
    
    const token=jwt.sign({
      userId
    },process.env.JWT_SECRET)

    res.json({
      meassage:"User created succefully",
      token:token
    })
  };


  //user signin 
  const signInUser = async (req, res) => {
    
    const {success}=signInBody.safeParse(req.body);

    if(!success){
      return res.json({
        message:"Incorrect input"
      })
    }
    try{

    
    const existingUSer=await User.findOne({
      username:req.body.username,
      password:req.body.password
    })

    if(!existingUSer){
      return res.status(404).json({
        message:"user not found"
      })
    }
    const userId=existingUSer._id;
    const token =jwt.sign({
      userId
    },process.env.JWT_SECRET)

    res.json({
      message: "Signed in successfully",
      token: token
    });


    
  
  }catch (error) {
      res.status(500).json({ message: 'Error signing in', error });
    }
  };  

  const updateuser=zod.object({
    firstName:zod.string().optional(),
    lastName:zod.string().optional(),
    password:zod.string().optional(),
  })

  // Update user information
  const updateUser = async (req, res) => {
    try {
      // Validate the input using zod
      const { success } = updateuser.safeParse(req.body);
  
      if (!success) {
        return res.status(400).json({
          message: "Error while updating information",
        });
      }
  
      // Update user data
      const result = await User.updateOne(
        { _id: req.userId }, // Query to find the user by ID
        { $set: req.body } // Set the fields from the request body to update
      );
  
      if (result.nModified === 0) {
        return res.status(404).json({
          message: "User not found or no changes made",
        });
      }
  
      res.json({
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Update failed:", error);
      res.status(500).json({
        message: "Server error while updating user",
        error: error.message,
      });
    }
  };

  const getInfo = async (req, res) => {
    try {
      // Assuming the userId is stored in req.userId after JWT verification
      const userId = req.userId;
      console.log(userId);
  
      // Fetch the user from the User model
      const user = await User.findOne({ _id: userId }); // Adjust this to the correct field name
      console.log("User Found:", user);
      if (!user) {
        return res.status(404).json({ message: "User not found" }); // Not found
      }
  
      // Fetch the account from the Account model
      const account = await Account.findOne({ userId: userId }); // Adjust this to the correct field name
      if (!account) {
        return res.status(404).json({ message: "Account not found" }); // Corrected typo in "message"
      }
  
      // Send the user and account info back to the client
      res.json({
        name: `${user.firstName} ${user.lastName}`,
        email: user.username,
        balance: account.balance,
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

  const findUser=async (req,res)=>{
    const filter= req.query.filter||"";
    const loggedInUserId=req.userId;
    try {
      const users = await User.find({
        $or: [
          { firstName: { "$regex": filter, "$options": "i" } },
          { lastName: { "$regex": filter, "$options": "i" } }
        ],
        _id: { $ne: loggedInUserId }
      });
  
      res.json({
        user:users.map(user=>({
          username:user.username,
          firstName:user.firstName,
          lastName:user.lastName,
          _id:user._id
        })) 
      })
    } catch (error) {
      res.status(500).json({ message: "An error occurred while searching for users", error });

    }
    
      
  }
  
  
  module.exports = { signUpUser, signInUser, updateUser,findUser,getInfo };
  