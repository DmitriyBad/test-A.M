const express = require('express');
const passport = require('passport');
const controler = require('../controllers/product');
const router = express.Router();

router.get("/", controler.getProduct);
router.get("/:categoryId", controler.getByCategoryId);
router.post("/upload", passport.authenticate('jwt', {session: false}), controler.upload);
router.post("/", passport.authenticate('jwt', {session: false}), controler.create);
router.patch("/:id", passport.authenticate('jwt', {session: false}), controler.update);
router.delete("/:id", passport.authenticate('jwt', {session: false}), controler.remove);


module.exports = router;