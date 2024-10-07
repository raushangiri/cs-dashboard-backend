const { createUser, matches } = require("./user.service");
const user = require("../../model/user.model");
// const company = require("../../model/company.model");
// const contact = require("../../model/contactus.model");
// const companydocs = require("../../model/user.forgetpassword.model");
// const enquiry = require("../../model/enquiry.eelms");
// const nodemailer = require("nodemailer");
// const kyc = require("../../model/comapny_kyc_status.model");
// const representative = require("../../model/change_representative.model");
// const adminusers = require("../../model/admin_users.model");
// const managementRole = require("../../model/management_role.model");
// const companyData1 = require("../../model/company_data.model");

const sendEmail = require("./user.service");
const {
  validation,
  loginvalid,
  changerepresentativevalidation,
  emailvalid,
} = require("../user/user.validation");
var publicKEY = process.env.public_key;
let verification_link = process.env.verification_link;
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { object } = require("joi");
require("dotenv").config();
const fs = require("fs");
const email_link = process.env.verified_uri;
var privateKEY = `${process.env.private_key}`;

// const config = require("../../src/config/config")

const createuser1 = async (req, res) => {
  console.log("api called")
  try {
    const { role, name, department, reportingTo } = req.body;

    console.log(req.body,"req.body")
    if (!role || !name) {
      return res.status(400).json({ message: "Role and name are required", status: 400 });
    }

    if (role === 'Team leader' && !department) {
      return res.status(400).json({ message: "Department is required for team leaders", status: 400 });
    }

    if (role !== 'admin' && role !== 'Team leader') {
      if (!department || !reportingTo) {
        return res.status(400).json({ message: "Department and reportingTo are required for roles other than admin and team leader", status: 400 });
      }
    }

    let userId;
    let userExists;
    do {
      userId = Math.floor(1000 + Math.random() * 9000);
      userExists = await user.findOne({ userId: userId.toString() });
    } while (userExists);

    const initialPassword = userId.toString();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(initialPassword, salt);

    const userData = {
      userId: userId.toString(),
      role,
      name,
      password: hashedPassword,
      hasChangedPassword: false,
    };

    if (role === 'Team leader' || role !== 'admin') {
      userData.department = Array.isArray(department) ? department : [department];
    }

    if (role !== 'admin' && role !== 'Team leader') {
      userData.reportingTo = reportingTo;
    }

    const newUser = await user.create(userData);

    return res.status(201).json({
      message: "User created successfully",
      Data: {
        UserId: newUser.userId,
        TemporaryPassword: initialPassword,
      },
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: error.message, status: 500 });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "User ID is required",
      });
    }

    // Find and delete the user by userId
    const deletedUser = await user.findOneAndDelete({ userId: userId.toString() });

    if (!deletedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: `User with ID ${userId} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};


const getalluser = async (req, res) => {
  try {
    // Fetch all users from the User collection, including only the userId, name, and role fields
    const users = await user.find().select('userId name role reportingTo department');

    // Alternatively, you can manually transform each user document to include only the desired fields
    // const users = await User.find();
    // const filteredUsers = users.map(user => ({
    //   userId: user.userId,
    //   name: user.name,
    //   role: user.role
    // }));

    res.status(200).json({Data:users}); // Send the users as a JSON response
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const login = async (req, res) => {
  try {
    const { userId, password, role } = req.body; // Extract role from request body
    const userdata = await user.findOne({ userId, role }); // Match both userId and role

    // Check if user exists
    if (!userdata) {
      return res.status(400).send({ message: "Invalid userId or role" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, userdata.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid userId, password, or role" });
    }

    // Check if the user needs to change their password
    if (!userdata.hasChangedPassword) {
      return res.status(200).send({
        message: "Password change required",
        userId: userdata.userId,
        status: 200,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: userdata.userId, role: userdata.role }, // Include role in token
      "yourSecretKey",
      { expiresIn: "1h" }
    );

    return res.status(200).send({
      message: "Login successful",
      token,
      userId: userdata.userId, // Send back the userId
      role: userdata.role, // Send back the role
      status: 200,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: 500 });
  }
};

const changePassword = async (req, res) => {
  console.log("API called")
  try {
    const { userId, password, newPassword } = req.body;

    // Find the user by userId
    const userdata = await user.findOne({ userId });
console.log(userdata,"2954")
    if (!userdata) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }

    // Compare the provided current password with the stored password
    const isMatch = await bcrypt.compare(password, userdata.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Current password is incorrect", status: 400 });
    }

    // Generate a new hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    userdata.password = hashedNewPassword;
    userdata.hasChangedPassword = true;  // Mark as password changed

    // Save the updated user data
    await userdata.save();

    return res.status(200).send({
      message: "Password updated successfully",
      status: 200,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: 500 });
  }
};

const resetPassword = async (req, res) => {
  try {
    // Step 1: Retrieve userId from request parameters
    const { userId } = req.params;

    // Step 2: Find the user by userId in the database
    const userdata = await user.findOne({ userId:userId });

    if (!userdata) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }

    // Step 3: Convert userId into password format
    // You can adjust the complexity of this conversion logic as needed.
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(userId, salt); // Using userId as the password source

    // Step 4: Update the user's password and hasResetPassword flag
    userdata.password = hashedNewPassword;
    userdata.hasChangedPassword = false;  // Mark as password reset

    // Step 5: Save the updated user data in the database
    await userdata.save();

    // Return success response
    return res.status(200).send({
      message: "Password has been reset successfully",
      status: 200,
    });
  } catch (error) {
    // Handle any server error
    return res.status(500).send({ message: error.message, status: 500 });
  }
};


const findteamleader = async (req, res) => {
  try {
    const teamLeaders = await user.find(
      { role: 'Team leader' },  // Query to find all users with the role 'Team leader'
      { name: 1, userId: 1 }    // Projection to include only 'name' and 'userId'
    );
    
    // Check if no team leaders were found
    if (teamLeaders.length === 0) {
      return res.status(201).send({
        message: "There is no Team Leader",
        status: 201,
      });
    }
  
    // Extract both the name and userId of the team leaders
    const Teamleaderslist = teamLeaders.map(user => ({
      name: user.name,
      userId: user.userId
    }));
  
    // Return the names and userIds in the response
    return res.status(200).send({
      status: 200,
      Teamleaderslist,
    });
  } catch (error) {
    console.error('Error fetching team leaders:', error);
    return res.status(500).send({
      status: 500,
      message: 'Failed to fetch team leaders',
      error: error.message,
    });
  }
}  

const getUserById = async (req, res) => {
  const { userId } = req.params; // Get userId from URL parameters

  try {
    // Find user by userId in the database and exclude password, hasChangedPassword, and createdAt fields
    const userdata = await user.findOne({ userId }).select('-password -hasChangedPassword -createdAt');

    if (!userdata) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Respond with the found user, excluding the specified fields
    res.status(200).json({
      success: true,
      data: userdata,
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const updateUser = async (req, res) => {
  console.log("Update API called");
  try {
    const { userId, role, name, department, reportingTo } = req.body;

    // Check if the userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required", status: 400 });
    }

    // Find if the user exists
    const existingUser = await user.findOne({ userId: userId.toString() });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    // Validate required fields
    if (!role || !name) {
      return res.status(400).json({ message: "Role and name are required", status: 400 });
    }

    if (role === 'Team leader' && !department) {
      return res.status(400).json({ message: "Department is required for team leaders", status: 400 });
    }

    if (role !== 'admin' && role !== 'Team leader') {
      if (!department || !reportingTo) {
        return res.status(400).json({ message: "Department and reportingTo are required for roles other than admin and team leader", status: 400 });
      }
    }

    // Prepare update data without userId
    const updateData = {
      role,
      name,
    };

    // Handle department and reportingTo
    if (role === 'Team leader' || role !== 'admin') {
      updateData.department = Array.isArray(department) ? department : [department];
    }

    if (role !== 'admin' && role !== 'Team leader') {
      updateData.reportingTo = reportingTo;
    }

    // Perform the update operation, without modifying userId
    const updatedUser = await user.findOneAndUpdate({ userId: userId.toString() }, updateData, { new: true });

    if (!updatedUser) {
      return res.status(500).json({ message: "User update failed", status: 500 });
    }

    return res.status(200).json({
      message: "User updated successfully",
      Data: {
        UserId: updatedUser.userId,
        Name: updatedUser.name,
        Role: updatedUser.role,
        Department: updatedUser.department,
        ReportingTo: updatedUser.reportingTo,
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const getUserbyteamleader = async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await user.find({ reportingTo: userId });
    if (users.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `No users found reporting to user with ID: ${userId}`,
      });
    }
    return res.status(200).json({
      status: 200,
      message: `Users reporting to user with ID: ${userId}`,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};




module.exports = {
  createuser1,
  login,
  changePassword,
  resetPassword,
  getalluser,
  deleteUser,
  findteamleader,
  updateUser,
  getUserById,
  getUserbyteamleader
};
