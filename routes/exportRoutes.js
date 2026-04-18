const express = require('express');
const { getAllDownloadedFiles, deleteFile } = require('../controllers/exportController');
const authenticate = require('../middleware/auth');
const router = express.Router();

router.get('/history',authenticate, getAllDownloadedFiles);
router.delete('/:id',authenticate, deleteFile);

module.exports = router;
