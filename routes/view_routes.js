const express = require('express');
const path = require('path');
// const authenticateToken = require('../middleware/authenticateToken');
// const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// router.get('/home', authenticateToken, (req, res) => {
//     res.sendFile(path.join(__dirname, '../protected/home.html'));
// });

// router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
//     res.sendFile(path.join(__dirname, '../protected/admin.html'));
// });


// ARTISANS
router.get('/artisan', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/artisan/index.html'));
});

router.get('/artisan/earnings', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/artisan/earnings.html'));
});

router.get('/artisan/products', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/artisan/products.html'));
});

router.get('/artisan/orders', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/artisan/orders.html'));
});

router.get('/artisan/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/artisan/profile.html'));
});

// BUYERS
router.get('/buyer', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/buyer/index.html'));
});

router.get('/buyer/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/buyer/about.html'));
});

router.get('/buyer/artisans', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/buyer/artisans.html'));
});

router.get('/buyer/cart', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/buyer/cart.html'));
});

router.get('/buyer/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/buyer/checkout.html'));
});

router.get('/buyer/marketplace', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/buyer/marketplace.html'));
});

router.get('/buyer/productDetails', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/buyer/productDetails.html'));
});

// ADMIN
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/admin/index.html'));
});

router.get('/admin/adminanalytics', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/admin/adminanalytics.html'));
});

router.get('/admin/adminloan', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/admin/adminloan.html'));
});

router.get('/admin/adminsettings', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/admin/adminsetting.html'));
});

router.get('/admin/adminuser', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/admin/adminuser.html'));
});

router.get('/admin/adminorders', (req, res) => {
    res.sendFile(path.join(__dirname, '../protected/admin/adminorders.html'));
});


module.exports = router;
