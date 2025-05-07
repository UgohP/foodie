const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const upload = require("../middleware/upload");
const Category = require("../models/Category");
const Item = require("../models/Item");
const Reservation = require("../models/Reservation");

//route to GET the dashboard page
router.get("/dashboard", async (req, res) => {
  try {
    const catCount = await Category.countDocuments();
    const itemCount = await Item.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const categories = await Category.find();
    const items = await Item.find()
      .populate("category")
      .sort({ _id: -1 })
      .limit(5);
    res.render("admin/index", {
      categories,
      catCount,
      itemCount,
      reservationCount,
      items,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

//route to GET addNew page
router.get("/addNew", async (req, res) => {
  try {
    res.render("admin/addNew", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//route to GET the add category page
router.get("/addCat", async (req, res) => {
  try {
    res.render("admin/addCat", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//route to GET all the categories page
router.get("/categoryAdmin", async (req, res) => {
  try {
    const categories = await Category.find().sort({ _id: -1 });
    res.render("admin/categoryAdmin", { categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//route to GET a PARTICULAR category
router.get("/viewCat/:id", async (req, res) => {
  try {
    const categories = await Category.findById({ _id: req.params.id });
    res.render("admin/viewCat", { categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//route to GET (create) a category
router.post("/addCat", upload.single("image"), async (req, res) => {
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

//route to GET the edit category page
router.get("/edit-cat/:id", async (req, res) => {
  try {
    const categories = await Category.findOne({ _id: req.params.id });
    res.render("admin/editCat", { categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// route to EDIT (update) the category
router.put("/edit-cat/:id", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    const updatedData = { name };

    if (req.file) {
      updatedData.image = "/uploads/" + req.file.filename;
    }

    await Category.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect("/categoryAdmin");
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).send("Update failed.");
  }
});

//route to GET the delete category page
router.get("/delete-cat/:id", async (req, res) => {
  try {
    const categories = await Category.findById({ _id: req.params.id });
    res.render("admin/deleteCat", { layout: adminLayout, categories });
  } catch (error) {
    console.log(error);
  }
});

//route to DELETE a category
router.delete("/delete-cat/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    await Item.deleteMany({ category: categoryId });
    await Category.findByIdAndDelete(categoryId);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//route to GET all the items page
router.get("/itemsAdmin", async (req, res) => {
  try {
    const items = await Item.find().populate("category").sort({ _id: -1 });
    res.render("admin/itemAdmin", { items, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//route to GET the add item page
router.get("/addItem", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/addItem", { categories, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//route to POST (create) an item
router.post(
  "/addItem",
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

//route to get the EDIT item page
router.get("/edit-item/:id", async (req, res) => {
  try {
    const categories = await Category.find();
    const items = await Item.findById(req.params.id).populate("category");
    res.render("admin/editItem", { categories, items, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//route to EDIT an item
router.put(
  "/edit-item/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
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

      const updatedData = {
        name,
        category,
        newPrice,
        oldPrice,
        description,
        seasonalItem: seasonalItem === "on", // checkbox values
        newItem: newItem === "on",
        isSpecial: isSpecial === "on",
      };
      if (req.files.image1) {
        updatedData.image1 = "/uploads/" + req.files.image1[0].filename;
      }
      if (req.files.image2) {
        updatedData.image2 = "/uploads/" + req.files.image2[0].filename;
      }
      await Item.findByIdAndUpdate(req.params.id, updatedData);
      res.redirect("/itemsAdmin");
    } catch (error) {
      console.log(error);
    }
  }
);

//route to GET the delete item page
router.get("/delete-item/:id", async (req, res) => {
  try {
    const items = await Item.findById({ _id: req.params.id });
    res.render("admin/deleteItem", { layout: adminLayout, items });
  } catch (error) {
    console.log(error);
  }
});

//route to DELETE an item
router.delete("/delete-item/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//route to GET the reservation-admin page
router.get("/reservationAdmin", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.render("admin/reservations", { reservations, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//route to GET the blog-admin page
router.get("/blogAdmin", async (req, res) => {
  try {
    res.render("admin/blog", { layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
