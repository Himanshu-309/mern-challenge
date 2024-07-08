const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  sold: { type: Boolean, required: true },
  dateOfSale: { type: Date, required: true }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

// Check if the model is already defined, otherwise define it
// const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema, 'transactions');

// module.exports = Transaction;
