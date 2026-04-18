const FileDownloaded = require("../models/fileDownloaded");

const getAllDownloadedFiles = async (req, res) => {
    try {
        const userId = req.user.id;
        const files = await FileDownloaded.findAll({ where: { UserId: userId } });
        res.status(200).json({
            success: true,
            data: files,
            message: "Data is successfully fetched"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

};

const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const deletedCount = await FileDownloaded.destroy({
            where: { id, UserId: userId }  // ES6 shorthand
        });
        
        // Check if file was actually found and deleted
        if (deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "File successfully deleted"
        });
    } catch (err) {
        console.error('Delete file error:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


module.exports = {getAllDownloadedFiles, deleteFile};