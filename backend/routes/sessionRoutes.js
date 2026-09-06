const express = require("express");
const router = express.Router();
const {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  completeSession
} = require("../controllers/sessionController");

router.route("/")
  .get(getSessions)
  .post(createSession);

router.route("/:id")
  .get(getSessionById)
  .put(updateSession)
  .delete(deleteSession);

router.patch("/:id/complete", completeSession);

module.exports = router;
