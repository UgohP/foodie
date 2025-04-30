const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const upload = require("../middleware/upload");
const Category = require("../models/Category");
const Item = require("../models/Item");

router.get("/dashboard", async (req, res) => {
  try {
    const categories = await Category.find();
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
router.post(
  "/item",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      name,
      category,
      newPrice,
      oldPrice,
      description,
      seasonalItem,
      newItem,
    } = req.body;
    const image1 = req.files.image1
      ? "/uploads/" + req.files.image1[0].filename
      : "";
    const image2 = req.files.image2
      ? "/uploads/" + req.files.image2[0].filename
      : "";

    const newItems = new Item({
      name,
      category,
      newPrice,
      oldPrice,
      description,
      image1,
      image2,
      seasonalItem: seasonalItem === "on", // checkbox values
      newItem: newItem === "on",
    });
    await Item.create(newItems);
    res.json({ newItems });
  }
);
router.get("/add", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/addNew", { categories, layout: adminLayout });
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
