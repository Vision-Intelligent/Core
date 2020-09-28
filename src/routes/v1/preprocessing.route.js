const router = require("express").Router();
const admin = require("firebase-admin");
const authorization = require("../../middleware/authorization");
const fs = require("fs");

router.use(authorization);

/**
 * @api {GET} /v1/prep/labelling/labelmap Get label map if it existed
 */
router.get("/labelling/labelmap", async (req, res) => {
  const { bid, outputDir } = req.query;
  // outputDir: buckets/bid/{field}
  // return labels from pbtxt
});

/**
 * @api {POST} /v1/prep/labelling/labelmap Define a label map
 */
router.post("/labelling/labelmap", async (req, res) => {
  const { bid, labels, outputDir } = req.body; // The list of labels

  for (let i = 0; i < labels.length; i++) {
    const { id, name } = labels[i];
    // convert to pbtxt JSON
    // save to ouputDir
  }
});

/**
 * @api {GET} /v1/prep/labelling/annotation Get annotation of a file
 */
router.get("/labelling/annotation", async (req, res) => {
  const { bid, folder, filename } = req.query;
});

/**
 * @api {POST} /v1/prep/labelling/annotation Create an annotation file for a photo
 */
router.post("/labelling/annotation", async (req, res) => {
  const {
    bid,
    folder,
    filename,
    path,
    width,
    height,
    depth,
    objects,
  } = req.body;

  // objects is an array of object

  for (let i = 0; i < objects.length; i++) {
    const { name, bndbox } = objects[i]; // Name is the label
    // Make sure these fields existed
    // bndbox.xmin;
    // bndbox.ymin;
    // bndbox.xmax;
    // bndbox.ymax;
  }

  // Ref: https://medium.com/towards-artificial-intelligence/understanding-coco-and-pascal-voc-annotations-for-object-detection-bb8ffbbb36e3
  // write the annotation file by the structure defined in the link above
});

/**
 * @api {DELETE} /v1/prep/labelling/annotation Delete annotation of a file
 */
router.delete("/labelling/annotation", async (req, res) => {
  const { bid, folder, filename } = req.query;
});

/**
 * @api {GET} /v1/prep/labelling/options Get labelling tool options
 */
router.get("/labelling/options", async (req, res) => {});

/**
 * @api {POST} /v1/prep/labeling/options Set options for labelling tool
 */
router.post("/labelling/options", async (req, res) => {
  const { options } = req.body;
});

module.exports = router;
