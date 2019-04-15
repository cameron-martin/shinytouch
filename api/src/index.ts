import express from "express";
import cors from "cors";
import aws from "aws-sdk";
import uuid from "uuid/v4";

const app = express();

app.use(cors());

app.get("/status", (request, response) => {
  response.sendStatus(200);
});

const credentials =
  process.env.NODE_ENV === "production"
    ? undefined
    : {
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: "foo",
          secretAccessKey: "foo"
        },
        // Necessary for localstack
        s3ForcePathStyle: true
      };

const s3 = new aws.S3(credentials);

function getContentLength(request: express.Request) {
  const header = request.headers["content-length"];

  if (!header) return null;

  const length = Number.parseInt(header);

  if (Number.isNaN(length)) return null;

  return length;
}

// REVIEW: Copying this to memory wastes a lot of memory
// We should be able to stream it from the request, but doing so
// gives me strange errors.
// Alternatively, the client could send it straight to s3, I think using cognito user pools.
app.post("/add-example", (request, response) => {
  const { calibrationSessionId } = request.query;

  if (typeof calibrationSessionId !== "string" || !calibrationSessionId) {
    response.status(400).send("Expecting calibration session id");
    return;
  }

  const length = getContentLength(request);

  if (!length) {
    response.status(400).send("Expecting content-length header");
    return;
  }

  const exampleId = uuid();

  s3.upload(
    {
      Body: request,
      Bucket: "calibration-examples",
      Key: `${calibrationSessionId}/${exampleId}.jpg`,
      ContentLength: length
    },
    (err, data) => {
      if (err) {
        response
          .status(500)
          .send("Error saving calibration example: " + err.message);
        return;
      }

      response.sendStatus(201);
    }
  );
});

app.listen(8080);
