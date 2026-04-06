const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verifyToken, checkRole } = require('../middlewares/is-auth');


router.post('/register', userController.register);
router.post('/login', userController.login);

router.put('/change-password', verifyToken, userController.changePassword);

router.post('/enable', userController.enableUser);
router.post('/disable', userController.disableUser);


module.exports = router;