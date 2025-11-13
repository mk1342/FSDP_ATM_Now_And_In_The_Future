//filler
const User = require("../models/User");

router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});