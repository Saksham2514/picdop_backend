const Note = require("../model/Note");
const User = require("../model/Users");

const createNote = (req, res) => {
  Note.create(
    {
      productName: req.body.product,
      quantity: req.body.quantity,
      createdBy: req.body.createdBy,
    },
    (err, Note) => {
      if (err) {
        res.send(err);
      } else res.json(Note);
    }
  );
};

const getNotes = async (req, res) => {
  const notes = await Note.aggregate([
    {
      $group: {
        _id: { user: "$createdBy" },
        productName: { $push: "$productName" },
        quantity: { $push: "$quantity" },
        createdAt: { $push: "$createdAt" },
        totalNotes: { $count: {} },
      },
    },
  ]);
  const populatedUserTotals = await User.populate(notes, {
    path: "_id.user",
    select: "name", // Change to the actual field name in the User model,
  });
  res.send(populatedUserTotals);
};

const deleteNote = (req, res) => {
  Note.deleteOne({ _id: req.params.noteId })
    .then(() => res.json({ message: "Order Deleted" }))
    .catch((err) => res.send(err));
};

const getANote = (req, res) => {
  console.log(req.params);
  Note.find({ createdBy: req.body.id })
    .sort({ createdAt: -1 })
    .exec((err, Note) => {
      if (err) {
        res.send(err);
      }
      res.json(Note);
    });
};

module.exports = {
  createNote,
  getNotes,
  getANote,
  deleteNote,
};
