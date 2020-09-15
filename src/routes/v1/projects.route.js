const router = require("express").Router();
const authorization = require("../../middleware/authorization");
const admin = require("firebase-admin");

router.use(authorization);

/*
@apiName GET 
@apiDescription Get existed projects of the user
@apiVersion  1.0.0
*/
router.get("/", async (req, res) => {
  try {
    let projectDoc = await admin
      .firestore()
      .collection("projects")
      .where("ownerId", "==", req.user.uid)
      .get();
    let projects = projectDoc.docs.map((doc) => doc.data());
    res.status(200).send({
      projects: projects,
    });
  } catch (e) {
    res.status(500).send({
      ...e,
    });
  }
});

/*
@api {POST} /v1/projects Create new project
 */
router.post("/", async (req, res) => {
  const { id, name, description, ownerId } = req.body;

  // name: not null
  // ownerId: not null

  // Check the id
  // id: not null, unique, human-friendly
  if (id === undefined) {
    res.status(404).send({
      message: "Id is required",
    });
    return;
  }
  if (name === undefined) {
  }
  let existedProjectDoc = await admin
    .firestore()
    .collection("projects")
    .where("id", "==", id)
    .get();
  if (existedProjectDoc.docs.length != 0) {
    res.status(404).send({
      message: "Id [" + id + "] already existed",
    });
    return;
  }

  // Save the project to firestore
});

/*
@api {PUT} /v1/projects Update the project
*/
router.put("/", (req, res) => {
  const { pid, name, description } = req.body;
  // Update only name and description
});

/*
@api {DELETE} /v1/projects Delet the project
*/
router.delete("/", (req, res) => {
  const { pid } = req.query;
});

/*
@api {POST} /v1/projects/invite Create the invitation
*/
router.post("/invite", (req, res) => {
  const { pid, to } = req.query;
  // to: not null, the collaborator's id
});

module.exports = router;
