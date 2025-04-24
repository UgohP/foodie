const express = require("express");
const router = express.Router();
const Category = require('../models/Category') 
router.get("", async (req, res) => {
  try {
    const categories = await Category.find().limit(3)
    res.render('index', {categories})
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
