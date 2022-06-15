const express = require('express');
const passport = require('passport');

const controler = require('../controllers/category');
const router = express.Router();

router.get("/", controler.getAll);
router.post("/", passport.authenticate('jwt', {session: false}), controler.create);
router.delete("/:id", passport.authenticate('jwt', {session: false}), controler.remove);
router.patch("/:id", passport.authenticate('jwt', {session: false}), controler.update);

module.exports = router;