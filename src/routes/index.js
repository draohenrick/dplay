const express = require('express');
const router = express.Router();
const webhook = require('./webhook');
const admin = require('./admin');

router.use('/webhook', webhook);
router.use('/admin', admin);

router.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

module.exports = router;
