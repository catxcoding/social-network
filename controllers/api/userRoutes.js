const router = require("express").Router();
const { Types } = require("mongoose");
const { User, Thought } = require("../../models");

router.get("/", async (req, res) => {
  const allUsers = await User.find();

  res.status(200).json(allUsers);
});

router.post("/", async (req, res) => {
  try {
    const createdUser = await User.create({
      username: req.body.username,
      email: req.body.email,
    });

    if (createdUser) {
      res.status(200).json(createdUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const selectedUser = await User.findById(req.params.userId);

    res.status(200).json(selectedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        username: req.body.username,
        email: req.body.email,
      },
      {
        returnOriginal: false,
      }
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "404: userID not found!" });
    }
  } catch (error) {
    console.log(500).json(error);
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId, {
      returnOriginal: false,
    });
    const deletedThoughts = await Thought.deleteMany({ userId: req.params.userId })

    if (deletedUser && deletedThoughts) {
      res.status(200).json({ message: "User Deleted!", deletedUser });
    } else {
      res.status(404).json({ message: "404: userID not found!" });
    }
  } catch (error) {
    console.log(500).json(error);
  }
});

router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const friend = await User.findById(req.params.friendId);
    const addFriend = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $push: { friends: friend },
      },
      {
        returnOriginal: false,
      }
    );

    if (addFriend) {
      res.status(200).json({ message: "Friend Added!", addFriend });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const friend = await User.findById(req.params.friendId);
    const removeFriend = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $pull: { friends: friend._id },
      },
      {
        returnOriginal: false,
      }
    );

    if (removeFriend) {
      res.status(200).json({ message: "Friend Deleted", removeFriend });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;