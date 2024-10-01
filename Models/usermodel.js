
const mongoose =require ("mongoose")

const userSchema = new mongoose.Schema({
    username: { 
      type: String, 
      required: [true, 'Username is required'], 
      unique: true, 
      minlength: [3, 'Username must be at least 3 characters long'] 
    },
    firstName: { 
      type: String, 
      required: [true, 'First name is required'], 
      trim: true 
    },
    lastName: { 
      type: String, 
      required: [true, 'Last name is required'], 
      trim: true 
    },
    
    password: { 
      type: String, 
      required: [true, 'Password is required'], 
      minlength: [6, 'Password must be at least 6 characters long'] 
    },
  }, { timestamps: true });
  
  const User = mongoose.model('User', userSchema);
  module.exports = User;