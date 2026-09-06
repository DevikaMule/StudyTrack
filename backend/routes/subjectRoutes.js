const express = require("express");
const router = express.Router();
const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../controllers/subjectController");

router.route("/")
  .get(getSubjects)
  .post(createSubject);

router.route("/:id")
  .get(getSubjectById)
  .put(updateSubject)
  .delete(deleteSubject);

module.exports = router;
