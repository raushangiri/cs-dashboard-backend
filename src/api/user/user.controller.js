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
  try {
    const { role, name, department, reportingTo } = req.body;
    if (!role || !name) {
      return res.status(400).json({ message: "Role and name are required", status: 400 });
    }
    if (role === 'team_leader' && !department) {
      return res.status(400).json({ message: "Department is required for team leaders", status: 400 });
    }
    if (role !== 'admin' && role !== 'team_leader') {
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
    if (role === 'team_leader' || role !== 'admin') {
      userData.department = Array.isArray(department) ? department : [department]; 
    }
    if (role !== 'admin' && role !== 'team_leader') {
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
    const users = await user.find().select('userId name role');

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
    const { userId, password } = req.body;
    const userdata = await user.findOne({ userId });

    if (!userdata) { // Should check for `userdata` instead of `user`
      return res.status(400).send({ message: "Invalid userId" });
    }

    const isMatch = await bcrypt.compare(password, userdata.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid userId or password" });
    }

    if (!userdata.hasChangedPassword) {
      return res.status(200).send({
        message: "Password change required",
        userId: userdata.userId, // Corrected to `userdata.userId`
        status: 200,
      });
    }

    const token = jwt.sign(
      { userId: userdata.userId, role: userdata.role }, // Corrected to `userdata`
      "yourSecretKey",
      { expiresIn: "1h" }
    );

    return res.status(200).send({
      message: "Login successful",
      token,
      status: 200,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: 500 });
  }
};



const changePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const userdata = await user.findOne({ userId });

    if (!userdata) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    userdata.password = hashedPassword;
    userdata.hasChangedPassword = true;  // Mark as password changed
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
    const { userId } = req.body;

    // Find the user by userId
    const userdata = await user.findOne({ userId });

    if (!userdata) {
      return res.status(400).send({ message: "User not found", status: 400 });
    }

    // Reset the password to the userId
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userId, salt);

    userdata.password = hashedPassword;
    userdata.hasChangedPassword = false; // Reset the password change status

    // Save the updated user data
    await userdata.save();

    return res.status(200).send({
      message: "Password reset successfully",
      status: 200,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message, status: 500 });
  }
};

module.exports = {
  createuser1,
  login,
  changePassword,
  resetPassword,
  getalluser,
  deleteUser
};
