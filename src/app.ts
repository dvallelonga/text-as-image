import express from "express";
import multer  from "multer";
import bodyParser from "body-parser";
import path from "path";

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as examplesController from "./controllers/examples";
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Create file upload handler
const upload = multer();


// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
app.get("/", homeController.index);

/**
 * Examples routes.
 */
app.get("/examples", examplesController.getExamples);

/**
 * API routes.
 */
app.get("/api", apiController.getApi);

const fileUploadMiddleware = upload.fields([
    { name: 'source_text', maxCount: 1 },
    { name: 'source_image', maxCount: 1 }
]);
app.post("/api/text", fileUploadMiddleware, apiController.postText);
export default app;
