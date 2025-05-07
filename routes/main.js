const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Item = require("../models/Item");
const Reservation = require("../models/Reservation");

//route to GET the homepage
router.get("", async (req, res) => {
  try {
    const categories = await Category.find().limit(3);
    const items = await Item.find().limit(6);
    const special = await Item.aggregate([
      { $match: { isSpecial: true } },
      { $sample: { size: 3 } },
    ]);
    res.render("index", { categories, items, special });
  } catch (error) {
    console.log(error);
  }
});

//route to GET all the categories page
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("categories", { categories });
  } catch (error) {
    console.log(error);
  }
});

//route to get all the items in a particular category
router.get("/category-item/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const items = await Item.find({ category: categoryId }).populate(
      "category"
    );
    const category = await Category.findById(categoryId);
    console.log("Category Item:", category);
    res.render("categoryItem", { items, category });
  } catch (error) {
    console.log(error);
  }
});

//route to GET all the menus(items) page
router.get("/menus", async (req, res) => {
  try {
    const items = await Item.find();
    res.render("menus", { items });
  } catch (error) {
    console.log(error);
  }
});

//route to GET a particular item
router.get("/item/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById({ _id: itemId });
    res.render("item", { item });
  } catch (error) {
    console.log(error);
  }
});

//route to GET the reservation page
router.get("/reservation", async (req, res) => {
  try {
    res.render("reservation");
  } catch (error) {
    console.log(error);
  }
});

//route to POST (create) a reservation
router.post("/reservation", async (req, res) => {
  try {
    const { name, phone, persons, date, time, description } = req.body;
    const newReservation = new Reservation({
      name,
      phone,
      persons,
      date,
      time,
      description,
    });
    await Reservation.create(newReservation);
    res.json({ newReservation });
  } catch (error) {
    console.log(error);
  }
});

//route to GET the about page
router.get("/about", async (req, res) => {
  try {
    res.render("about");
  } catch (error) {
    console.log(error);
  }
});

//route to GET the blogs page
router.get("/blogs", async (req, res) => {
  try {
    res.render("blog");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
