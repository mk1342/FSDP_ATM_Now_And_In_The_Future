const express = require('express');
const router = express.Router();

//* FIX: correct path to controller
const userController = require('../controllers/usercontroller');  //* 
const validateObjectId = require('../middlewares/validateobjectID');  //*

//* CRUD
router.post('/', userController.createUser);       //* POST /users
router.get('/', userController.getAllUsers);       //* GET /users
router.get('/:id', validateObjectId, userController.getUserById);    //* GET /users/:id
router.put('/:id', userController.updateUser);     //* PUT /users/:id
router.delete('/:id', userController.deleteUser);  //* DELETE /users/:id
router.patch('/:id', validateObjectId, userController.updateUser); //* PATCH /users/:id

module.exports = router;
