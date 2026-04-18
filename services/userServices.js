const getExpense = (req, where) =>{
    return req.user.getExpenses(where);
};

module.exports = {getExpense};