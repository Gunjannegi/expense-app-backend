const { Body } = require("sib-api-v3-sdk");
const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/db-connection");
const S3Services = require("../services/s3Services");
const UserServices = require('../services/userServices');
const FileDownloaded = require("../models/fileDownloaded");
const addExpense = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const userId = req.user.id;
        const { description, amount, date, category, note } = req.body;

        const expense = await Expense.create(
            { description, amount, date, category, note, UserId: userId },
            { transaction: t }
        );

        await User.increment(
            { totalExpense: Number(amount) },
            { where: { id: userId }, transaction: t }
        );

        await t.commit();

        return res.status(201).json({
            message: "Expense is successfully added",
            data: expense,
        });

    } catch (err) {
        await t.rollback();
        return res.status(500).json({
            message: "Failed to add expense",
            error: err.message,
        });
    }
};

const updateExpense = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!userId) {
            await t.rollback();
            return res.status(400).json({ message: "Unauthorized" });
        }

        const expense = await Expense.findOne({
            where: { id, UserId: userId },
            transaction: t
        });

        if (!expense) {
            await t.rollback();
            return res.status(404).json({ message: "Expense not found" });
        }

        await expense.update(req.body, { transaction: t });

        await t.commit();
        return res.status(200).json({
            message: "Expense updated successfully",
            expense
        });

    } catch (err) {
        await t.rollback();
        return res.status(500).json({ message: "Failed to update expense" });
    }
};

const getAllExpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit
        const { count, rows } = await Expense.findAndCountAll({
            where: { UserId: userId },
            limit: limit,
            offset: offset,
            order: [['date', 'DESC']]
        });
        return res.status(200).send({ message: "Expenses are fetched successfully", data: rows, pagination: { totalPages: Math.ceil(count / limit), currentPage: page, limit: limit, totalNumberOfExpenses: count } })
    } catch (err) {
        return res.status(500).send(err)
    }
};

const deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const userId = req.user.id
        if (!userId) {
            t.rollback();
            return res.status(400).send({ message: "Missing userId in headers" })
        }
        const expense = await Expense.findOne({ where: { id, UserId: userId }, transaction: t });
        if (!expense) {
            t.rollback();
            return res.status(404).send({ message: "Expense not found" });
        }

        await expense.destroy({ transaction: t });

        await User.decrement({ totalExpense: Number(expense.amount) }, { where: { id: userId }, transaction: t });
        await t.commit();
        return res.status(200).send({ message: "Expense is deleted successfully." });

    } catch (err) {
        await t.rollback()
        return res.status(500).send(err)
    }
};


const downloadExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenses = await UserServices.getExpense(req); 
        console.log(expenses)
        // Expense.findAll({ where: { UserId: userId } });
        const stringifiedExpenses = JSON.stringify(expenses);
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
        await FileDownloaded.create({url:fileUrl, UserId:userId});
        res.status(200).json({ fileUrl, success: true })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({message:err});
    }

};

module.exports = { addExpense, getAllExpenses, updateExpense, deleteExpense, downloadExpense }