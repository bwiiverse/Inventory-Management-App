const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const authorizeAdmin = require('../middlewares/adminMiddleware');

router.get('/', authenticateToken, productController.getProducts);
router.get('/admin', authenticateToken, authorizeAdmin, productController.getAdminProducts);
router.post('/', authenticateToken, authorizeAdmin, productController.addProduct);
router.put('/:id', authenticateToken, authorizeAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeAdmin, productController.deleteProduct);

module.exports = router;
