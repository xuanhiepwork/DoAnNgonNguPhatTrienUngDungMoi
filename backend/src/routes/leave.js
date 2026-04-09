const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leave');
const { verifyToken, checkRole } = require('../middlewares/is-auth');

router.post('/create', verifyToken, leaveController.createRequest);
router.get('/all', verifyToken, checkRole(['admin']), leaveController.getAllRequests);
router.put('/status/:id', verifyToken, checkRole(['admin']), leaveController.updateStatus);

module.exports = router;