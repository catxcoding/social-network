const router = require("express").Router();
const { User, Thought } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const allThoughts = await Thought.find();

    res.status(200).json(allThoughts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);

    res.status(200).json(thought);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const selectedUser = await User.findOne({ username: req.body.username });
    if (selectedUser) {
      const createdThought = await Thought.create({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
        userId: selectedUser._id,
      });

      const usernameThought = await User.findOneAndUpdate(
        {
          username: req.body.username,
        },
        {
          $push: { thoughts: createdThought },
        },
        {
          returnOriginal: false,
        }
      );

      res.status(200).json({ message: "Thought created!", createdThought });
    } else res.status(400).json({ message: "Username invalid!" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:thoughtId", async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        thoughtText: req.body.thoughtText,
      },
      {
        returnOriginal: false,
      }
    );

    if (updatedThought) {
      res.status(200).json({ message: "Thought Updated!", updatedThought });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/:thoughtId", async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(
      req.params.thoughtId,
      {
        returnOriginal: false,
      }
    );
    const deletedThoughtArray = await User.findByIdAndUpdate(
      deletedThought.userId,
      { $pull: { thoughts: req.params.thoughtId } },
      { returnOriginal: false }
    );

    if (deletedThought && deletedThoughtArray) {
      res.status(200).json({
        message: "Thought Deleted!",
        deletedThought,
        deletedThoughtArray,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const selectedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        $push: {
          reactions: {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
          },
        },
      },
      { returnOriginal: false }
    );

    if (selectedThought) {
      res.status(200).json({ message: "Reaction created!", selectedThought });
    } else {
      res.status(400).json({ message: "400: Forbidden Request" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        $pull: {
          reactions: {
            reactionId: req.params.reactionId,
          },
        },
      },
      { returnOriginal: false }
    );

    if (deletedThought) {
      res.status(200).json({ message: "Reaction Deleted!", deletedThought });
    } else {
      res.status(400).json({ message: "400: Forbidden Request" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;