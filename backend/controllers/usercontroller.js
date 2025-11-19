//* FIX: require the model with correct path
const User = require('../models/usermodel');  //* 
//const id = req.params.id.trim();   //*

// POST /users
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /users
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const cleanId = req.params.id.trim();   //* fix
    const user = await User.findById(cleanId);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /users/:id
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// PUT /users/:id
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};
