const express = require('express');

const fs = require('fs');

const Gallery = require("../models/gallery.model");

const upload = require("../middlewares/upload");

const router = express.Router();


router.post("/", upload.array("pictures", 5), async (req, res) => {
    try {
        const filePaths = req.files.map((file) => file.path);

        const gallery = await Gallery.create({
            pictures: filePaths,
            user_id: req.body.user_id
        });

        return res.status(201).send(gallery);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


router.get("/", async (req, res) => {
    try {
        const gallery = await Gallery.find().lean().exec();

        return res.status(201).send(gallery);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id).lean().exec();

        return res.status(201).send(gallery);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


router.patch("/:id", async (req, res) => {
    try {
        const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();

        return res.status(201).send(gallery);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const imageObj = await Gallery.findById(req.params.id).lean().exec();

        imageObj.pictures.forEach((element) => {

            fs.unlinkSync(element);
        });

        const gallery = await Gallery.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(201).send(gallery);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


module.exports = router;

