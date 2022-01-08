const express = require('express');

const fs = require('fs');

const User = require("../models/user.model");

const upload = require("../middlewares/upload");

const router = express.Router();



router.post("/", upload.single("profile_pic"), async (req, res) => {
    try {
        const user = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            profile_pic: req.file.path
        });

        return res.status(201).send(user);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


router.get("/", async (req, res) => {
    try {
        const users = await User.find().lean().exec();

        return res.status(201).send(users);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean().exec();

        return res.status(201).send(user);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


router.patch("/:id", upload.single("profile_pic"), async (req, res) => {
    try {
        if (req.file?.path === undefined) {

            const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();

            return res.status(201).send(user);

        } else {

            const imageObj = await User.findById(req.params.id).lean().exec();

            fs.unlinkSync(imageObj.profile_pic, () => {
                console.log("Delete operation complete.");
            });

            const user = await User.findByIdAndUpdate(req.params.id, {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                profile_pic: req.file.path
            }, {
                new: true
            }).lean().exec();

            return res.status(201).send(user);
        }
    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const imageObj = await User.findById(req.params.id).lean().exec();

        fs.unlinkSync(imageObj.profile_pic);

        const user = await User.findByIdAndDelete(req.params.id).lean().exec();

        return res.status(201).send(user);

    } catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
    }
});


module.exports = router;

