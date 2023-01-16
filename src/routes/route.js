const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require("../controllers/userController")

//user registration
router.post("/register", userController.register )

//user login
router.post("/login", userController.login )

//get members
router.get("/members", passport.authenticate("jwt", { session: false }), userController.showMembers )

//get count of members
router.get("/countMembers",userController.countMembers )

//get a single Member
router.get("/members/:userId", passport.authenticate("jwt", { session: false }), userController.showMember )

//add member
router.post("/addMember",passport.authenticate('jwt', { session: false }),userController.addMember )

//update member
router.put("/updateMember/:userId",passport.authenticate('jwt', { session: false }),userController.updateMember )

//delete member
router.delete("/deleteMember/:userId",passport.authenticate('jwt', { session: false }),userController.deleteMember )




module.exports = router
