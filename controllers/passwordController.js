const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const ForgotPasswordRequests = require('../models/forgotPasswordRequests');
const User = require('../models/user');
const sequelize = require('../utils/db-connection');
const bcrypt = require('bcrypt');
dotenv.config();

const forgotPassword = async (req, res) => {
    const EXPIRY_MINUTES = 15;
    const t = await sequelize.transaction();

    try {
        const { useremail } = req.body;

        if (!useremail) {
            await t.rollback();
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne(
            { where: { useremail } },
            { transaction: t }
        );

        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        // 🔒 Deactivate old links (INSIDE transaction)
        await ForgotPasswordRequests.update(
            { isactive: false },
            { where: { UserId: user.id }, transaction: t }
        );

        const id = uuidv4();
        const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

        await ForgotPasswordRequests.create(
            {
                id,
                isactive: true,
                expiresAt,
                UserId: user.id
            },
            { transaction: t }
        );

        await t.commit(); // ✅ DB work done safely

        // 📧 Email AFTER commit (correct!)
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        await tranEmailApi.sendTransacEmail({
            sender: {
                email: "gunjan.negi.5249@gmail.com",
                name: "Gunjan Negi"
            },
            to: [{ email: useremail }],
            subject: "Password Reset Request",
            textContent: `
You requested a password reset.

This link will expire in ${EXPIRY_MINUTES} minutes:
http://localhost:3000/password/resetpassword/${id}

If you did not request this, please ignore this email.
      `
        });

        return res.status(200).json({ message: "Email sent successfully" });

    } catch (error) {
        await t.rollback();
        console.error("Forgot password error:", error?.response?.body || error);
        return res.status(500).json({ message: "Failed to send email" });
    }
};


const resetpassword = async (req, res) => {
    try {
        const { requestId } = req.params;
        const resetRequest = await ForgotPasswordRequests.findOne({ where: { id: requestId, isactive: true } });
        if (!resetRequest) {
            return res.status(400).json({ message: "Reset link is expired" });
        }
        if (new Date() > resetRequest.expiresAt) {
            request.isactive = false;
            await request.save();

            return res.status(410).json({
                message: "Password reset link has expired"
            });
        }
        return res.status(200).send(`
        <!DOCTYPE HTML>
        <html>
        <head>
        <titl>Reset Password</title>
        </head>
        <body>
        <form method='POST' action='/password/resetpassword/${requestId}'>
        <input type="password" name="password" placeholder="New password" required/>
        <button type='submit'>Reset</button>
        </form>
        </body>
        `)

    } catch (error) {
        console.error("reset password error", error?.response?.body || error)
        res.status(500).json({ message: "Failed to reset password" })

    }
}

const updatePassword = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { password } = req.body;
        const forgotPasswordRequest = await ForgotPasswordRequests.findOne({ where: { id: requestId, isactive: true } })
        if (!forgotPasswordRequest) {
            return res.status(400).json({ message: "Invalid or Expired Request." });
        }
        const user = await User.findByPk(forgotPasswordRequest.UserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.userpassword = await bcrypt.hash(password, 10);
        forgotPasswordRequest.isactive = false;
        await forgotPasswordRequest.save();
        await user.save();

        return res.status(200).send(`
                <!DOCTYPE HTML>
                <html>
                <head></head>
                <body><h1>Password updated successfully.</h1></body>
                </html>`)

    } catch (error) {
        console.error("update password error", error?.response?.body || error);
        res.status(500).json({ message: "Failed to update password" });
    }

}



module.exports = { forgotPassword, resetpassword, updatePassword }
