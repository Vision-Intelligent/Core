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
    const { id, name, description } = req.body;

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
        res.status(404).send({
            message: "Name is required"
        });
        return;
    }
    try {
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
        } else {
            // Save the project to firestore
            await admin.firestore().collection("projects").doc(id).set({
                id: id,
                name: name,
                description: description,
                ownerId: req.user.uid
            }).then(
                res.status(201).send({
                    message: "OK",
                })
            ).catch((err) => {
                console.error("Hello, somethings wrong here: ", err);
                res.status(400).send({
                    message: "Bad request"
                });
            });
        }
    } catch (error) {
        console.log("create wrong ", error);
    }



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

/*
@api {DELETE} /v1/projects/invite Delete the invitation
*/
router.delete("/invite", (req, res) => {
  const { invitationId } = req.query;
});

/*
@api {POST} /v1/projects/invite/accept Accept the invitation
*/
router.post("/invite/accept", (req, res) => {
  const { invitationId } = req.query;
  // Get the invitation data from its id

  //Remember to put the collaborator data into collaborator collection
});

/*
@api {GET} /v1/projects/collaborators Get the list of collaborators
*/
router.get("/collaborators", (req, res) => {});

module.exports = router;
