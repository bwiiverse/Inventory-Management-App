const nano = require('nano')(process.env.COUCHDB_URL);
const { authenticateToken } = require('../middlewares/authMiddleware');

const productsDb = nano.db.use('inventory_products');

// Add a new product (Admin only)
exports.addProduct = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { name, price, stock, category } = req.body;
        if (!name || !price || !stock || !category) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const response = await productsDb.insert({ name, price, stock, category,  createdAt: new Date().toISOString() });
        res.status(201).json({ message: 'Product added successfully.', productId: response.id });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product.', error: error.message });
    }
};

// Get all products (Accessible to all users)
exports.getProducts = async (req, res) => {
    try {
        const products = await productsDb.list({ include_docs: true });
        const formattedProducts = products.rows.map(row => row.doc);

        formattedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products.', error: error.message });
    }
};

// Get All Products Added by an Admin (Admins Only)
exports.getAdminProducts = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const products = await productsDb.find({ selector: { owner: req.user.id } });

        res.status(200).json(products.docs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin products.', error: error.message });
    }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { id } = req.params;
        const { name, price, stock, category} = req.body; // ✅ Ensure _rev is retrieved

        const product = await productsDb.get(id).catch(() => null);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const updatedProduct = {
            _id: id,  // ✅ Ensure correct id is used
            _rev: product._rev,     // ✅ Required for CouchDB update
            name,
            price,
            stock,
            category,
            createdAt: new Date().toISOString()
        };
        const response = await productsDb.insert(updatedProduct);

        res.status(200).json({ message: 'Product updated successfully.', response });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product.', error: error.message });
    }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { id } = req.params;
        const product = await productsDb.get(id).catch(() => null);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const response = await productsDb.destroy(id, product._rev);
        res.status(200).json({ message: 'Product deleted successfully.', response });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product.', error: error.message });
    }
};
