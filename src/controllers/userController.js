const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const validator = require("../validator/validator");
const jwt = require("jsonwebtoken");

//!-------------------------Register-----------------------------

const register = async (req, res) => {
  try {
    const userDetails = req.body;
    let { fName, lName, email, password, isAdmin } = userDetails;

    //validations for fName
    if (!validator.validateString(fName))
      return res
        .status(400)
        .send({ status: false, message: `First Name is not valid.` });
    if (!validator.checkOnlyLetters(fName))
      return res.status(400).send({
        status: false,
        message: `First Name can't contain number or special character.`,
      });

    //validations for lName
    if (!validator.validateString(lName))
      return res
        .status(400)
        .send({ status: false, message: `Last Name is not valid.` });
    if (!validator.checkOnlyLetters(lName))
      return res.status(400).send({
        status: false,
        message: `Last Name can't contain number or special character.`,
      });

    //validations for email
    if (!validator.validateString(email))
      return res
        .status(400)
        .send({ status: false, message: `Email is not valid.` });
    if (!validator.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: `Enter a valid Email format.` });
    if (await userModel.findOne({ email }))
      return res
        .status(400)
        .send({ status: false, message: `Email already exists.` });

    //validations for password
    if (!validator.validateString(password))
      return res
        .status(400)
        .send({ status: false, message: `Password is not valid.` });
    if (password.length < 8 || password.length > 15)
      return res
        .status(400)
        .send({ status: false, message: `Password must be between 8 and 15` });

    const newUser = await userModel.create(userDetails);
    return res.status(201).send({
      status: true,
      message: `User Created Successfully`,
      data: newUser,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

//!------------------------------------login-----------------------------------

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user)
      return res
        .status(401)
        .send({ status: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).send({
      status: true,
      message: `Login Successfully`,
      token: `Bearer ${token}`,
      isAdmin:user.isAdmin,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//!-----------------------------add member--------------------- 

const addMember = async (req, res) => {
  try {
    const userLoggedIn = req.user;
    if (!userLoggedIn.isAdmin)
      return res
        .status(403)
        .send({ status: false, message: "you are not authorized" });

    let newUserData = req.body;
    let { fName, lName, email, password } = newUserData;

    //validations for fName
    if (!validator.validateString(fName))
      return res
        .status(400)
        .send({ status: false, message: `First Name is not valid.` });
    if (!validator.checkOnlyLetters(fName))
      return res.status(400).send({
        status: false,
        message: `First Name can't contain number or special character.`,
      });

    //validations for lName
    if (!validator.validateString(lName))
      return res
        .status(400)
        .send({ status: false, message: `Last Name is not valid.` });
    if (!validator.checkOnlyLetters(lName))
      return res.status(400).send({
        status: false,
        message: `Last Name can't contain number or special character.`,
      });

    //validations for email
    if (!validator.validateString(email))
      return res
        .status(400)
        .send({ status: false, message: `Email is not valid.` });
    if (!validator.validateEmail(email))
      return res
        .status(400)
        .send({ status: false, message: `Enter a valid Email format.` });
    if (await userModel.findOne({ email }))
      return res
        .status(400)
        .send({ status: false, message: `Email already exists.` });

    //validations for password
    if (!validator.validateString(password))
      return res
        .status(400)
        .send({ status: false, message: `Password is not valid.` });
    if (password.length < 8 || password.length > 15)
      return res
        .status(400)
        .send({ status: false, message: `Password must be between 8 and 15` });

    newUserData.addedBy = req.user._id;
    const newUser = await userModel.create(newUserData);
    return res.status(201).send({
      status: true,
      message: `User Created Successfully`,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//!------------------get all the members added by the admin--------------------------

const showMembers = async (req, res) => {
  try {
    const userLoggedIn = req.user;
    if (!userLoggedIn.isAdmin)
      return res
        .status(403)
        .send({ status: false, message: "you are not authorized" });

    let users = await userModel.find({ addedBy: userLoggedIn._id });

    res.status(200).send({ status: true, data: users });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//!------------------get count of members---------------------------------
const countMembers = async (req, res) => {
  try {
    
    let users = await userModel.find()
    res.status(200).send({ status: true, data: users.length})

  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
    
  }
}

//!------------------get a single memberDetails--------------------------

const showMember = async (req, res) => {
  try {
    const userLoggedIn = req.user;
    if (!userLoggedIn.isAdmin)
      return res
        .status(403)
        .send({ status: false, message: "you are not authorized" });

      let userId = req.params.userId;
      console.log(req.params)
    
      if (!userId) {
          return res.status(400).send({ status: false, message: "userId is Required" });
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter a valid user object id" });
      }
      if (!(await userModel.findOne({_id:userId}))) {
        return res.status(400).send({ status: false, message: "user not found" });
      }

    let user = await userModel.findById(userId);
    
    res.status(200).send({ status: true, data: user });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

//!------------------------update the member----------------------------

const updateMember = async (req, res) => {
  try {
    const userLoggedIn = req.user;
    if (!userLoggedIn.isAdmin)
      return res
        .status(403)
        .send({ status: false, message: "you are not authorized" });

    let userId = req.params.userId;
    if (!userId) {
      return res.status(400).send({ status: false, message: "user not found" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid user object id" });
    }
    if (!(await userModel.findOne({_id:userId}))) {
      return res.status(400).send({ status: false, message: "user not found" });
    }

    let updateData = req.body;
    let {fName,lName,email,password} = updateData
    console.log(updateData)

    if (fName) {
      if (!validator.validateString(fName))
        return res
          .status(400)
          .send({ status: false, message: `First Name is not valid.` });
      if (!validator.checkOnlyLetters(fName))
        return res.status(400).send({
          status: false,
          message: `First Name can't contain number or special character.`,
        });
    }
    if (lName) {
      if (!validator.validateString(lName))
        return res
          .status(400)
          .send({ status: false, message: `First Name is not valid.` });
      if (!validator.checkOnlyLetters(lName))
        return res.status(400).send({
          status: false,
          message: `First Name can't contain number or special character.`,
        });
    }
    if (email) {
      if (!validator.validateString(email))
        return res
          .status(400)
          .send({ status: false, message: `Email is not valid.` });
      if (!validator.validateEmail(email))
        return res
          .status(400)
          .send({ status: false, message: `Enter a valid Email format.` });
      if (await userModel.findOne({ email }))
        return res
          .status(400)
          .send({ status: false, message: `Email already exists.` });
    }
    if (password) {
      if (!validator.validateString(password))
        return res
          .status(400)
          .send({ status: false, message: `Password is not valid.` });
      if (password.length < 8 || password.length > 15)
        return res.status(400).send({
          status: false,
          message: `Password must be between 8 and 15`,
        });
    }

    let updatedData = await userModel.findOneAndUpdate(
      { _id: userId },
      updateData,
      { new: true }
    );
    return res.status(200).send({ status: true, data: updatedData });
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

//!------------------------delete the member----------------------------

const deleteMember = async (req, res) => {
  try {
    const userLoggedIn = req.user;
    if (!userLoggedIn.isAdmin)
      return res
        .status(403)
        .send({ status: false, message: "you are not authorized" });

    let userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).send({ status: false, message: "user not found" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid user object id" });
    }
    if (!(await userModel.findById(userId))) {
      return res.status(400).send({ status: false, message: "user not found" });
    }

    await userModel.deleteOne({ _id: userId });

    return res.status(200).send({ status: true, message: "user deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = {
  register,
  login,
  addMember,
  showMember,
  showMembers,
  countMembers,
  updateMember,
  deleteMember,
};
