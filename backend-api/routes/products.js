const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary")

const Product = require("../models/Product");
const upload = multer({ dest: "uploads/"})

//Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

//Create product
router.post("/", async (req, res) => {
    const product = new Product({
        upc: req.body.upc, 
        name: req.body.name,
        brand: req.body.brand,
        category: req.body.category,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description
    });

    try {
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Update product
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
})

//Delete Product
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Product deleted",
            product: deletedProduct
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

//GET single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


//upload image
router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "retail-product-lookup"
        });

        res.json({
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Image upload failed"
        });
    }
})

module.exports = router;