const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const upload = require("../middleware/upload");
const Category = require("../models/Category");

router.get("/dashboard", async (req, res) => {
  try {
    const categories = await Category.find()
    res.render("admin/index", { categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.post("/category", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const image = "/uploads/" + req.file.filename;

    const newCategory = new Category({ name, image });
    await Category.create(newCategory);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/add", async (req, res) => {
  try {
    res.render("admin/addNew", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/store", async (req, res) => {
  try {
    res.render("admin/store", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/reservations", async (req, res) => {
  try {
    res.render("admin/reservations", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/messages", async (req, res) => {
  try {
    res.render("admin/messages", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
