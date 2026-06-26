const express = require('express');
const router = express.Router();
const { 
    generateIDCard, 
    getMyIDCard, 
    verifyIDCard, 
    getAllIDCards, 
    revokeIDCard 
} = require('../controllers/idCardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateIDCard); // Can restrict to admin if needed
router.get('/my-id', protect, getMyIDCard);
router.get('/verify/:uuid', verifyIDCard); // Public verification

// Admin routes
router.get('/all', protect, admin, getAllIDCards);
router.put('/revoke/:uuid', protect, admin, revokeIDCard);

module.exports = router;
