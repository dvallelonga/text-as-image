"use strict";

import { Response, Request, NextFunction } from "express";
import {
    ReasonPhrases,
    StatusCodes,
} from 'http-status-codes';

// Augment the Express Request object in order to get Multer typescript typings to load
// See: https://github.com/expressjs/multer/issues/343#issuecomment-216288176
declare module expressMulter {
    interface Request {
        body: any // Actually should be something like `multer.Body`
        files: any // Actually should be something like `multer.Files`
    }
}
  

/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};


/**
 * Upload source text file (or zip) and a source image file.
 * @route POST /api/text
 */
export const postText = async (req: expressMulter.Request, res: Response, next: NextFunction) => {
    console.log("Request received");

    if(!req || !req.files || !req.files.source_text || !req.files.source_image){
        return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    }

    let sourceText: Express.Multer.File = req.files.source_text[0];
    let sourceImage: Express.Multer.File = req.files.source_image[0];

    let body = `
    <h3>Source Text file info</h3>
    <pre>${JSON.stringify({ originalname: sourceText.originalname, size: sourceText.size }, null, 2)}</pre>
    <h3>Source Image file info</h3>
    <pre>${JSON.stringify({ originalname: sourceImage.originalname, size: sourceImage.size }, null, 2)}</pre>
    `;

    res.render("text-as-image-output", {
        title: "Rendered Page Test",
        body
    });
};

