const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const upload = require("../middleware/upload");
const Category = require("../models/Category");
const Item = require("../models/Item");
const Reservation = require("../models/Reservation");

router.get("/dashboard", async (req, res) => {
  try {
    const categories = await Category.find();
    const items = await Item.find()
      .populate("category")
      .sort({ _id: -1 })
      .limit(5);
    res.render("admin/index", { categories, items, layout: adminLayout });
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
      isSpecial,
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
      isSpecial: isSpecial === "on",
    });
    await Item.create(newItems);
    res.redirect("/dashboard");
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
    const items = await Item.find().populate("category").sort({ _id: -1 });
    res.render("admin/store", { items, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.get("/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.render("admin/reservations", { reservations, layout: adminLayout });
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
