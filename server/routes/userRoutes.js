const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      profilePicture: req.user.profilePicture,
      createdAt: req.user.createdAt,
      role: req.user.role,
      virtualCash: req.account.virtualCash,
    },
  });
});

module.exports = router;
