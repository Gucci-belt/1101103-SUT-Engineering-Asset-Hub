const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// Public Route (or just authenticated, but user said Public for GET /)
router.get('/', assetController.getAllAssets);

// Protected Admin Routes
// Protected Admin Routes
const upload = require('../middleware/upload');

router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), assetController.createAsset);
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), assetController.updateAsset);
router.delete('/:id', authenticateToken, authorizeAdmin, assetController.deleteAsset);

module.exports = router;
