//todo: generate user model
// all need to change to generic user model

const mongoose = require('mongoose');

//all models have an ID by default 
//also a __v field for versioning


const userSchema = new mongoose.Schema({

  // Personal Information
  access_code: {
    type: String,
    default: null,
    required: false,
  },
  pin: {
    type: String,
    default: null,
    required: false,
  },

  // Account Details
  Savings_Account: {
    totalValue: { type: Number },
    stocks: { type: Number },
    unitTrusts: { type: Number },
    bonds: { type: Number }
  },

  Checking_Account: {
    totalValue: { type: Number }
  },

  // Recent Investments: Array of Objects
  recentInvestments: [
    {
      name: { type: String },
      type: { type: String },
      quantity: { type: Number },
      date: { type: Date },
      amount: { type: Number }
    }
  ],

  // Funds Transfer Section
  lastFundsTransfer: {
    message: String,
    transactionDetails: {
      reference: String,
      amount: Number,
      fromAccount: String,
      toAccount: String,
      dateTime: Date,
      status: String,
      availableBalance: Number
    }
  },

  // CPF Section
  cpf: {
    memberId: String,
    ordinaryAccount: Number,
    specialAccount: Number,
    medisaveAccount: Number,
    totalBalance: Number
  }

});

module.exports = mongoose.model('User', userSchema);
