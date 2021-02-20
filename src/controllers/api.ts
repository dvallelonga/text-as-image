"use strict";

import { Response, Request, NextFunction } from "express";
import {
    ReasonPhrases,
    StatusCodes,
} from "http-status-codes";
import { Text, buildCharacterMatrix, CharacterMatrix } from "../services/text-service";
import { Image, ImageDimensions, RGBA } from "../services/image-service";

// Augment the Express Request object in order to get Multer typescript typings to load
// See: https://github.com/expressjs/multer/issues/343#issuecomment-216288176
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace expressMulter {
    interface Request {
        body: any; // Actually should be something like `multer.Body`
        files: any; // Actually should be something like `multer.Files`
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

    const sourceText: Express.Multer.File = req.files.source_text[0];
    const sourceImage: Express.Multer.File = req.files.source_image[0];

    const image = new Image(sourceImage.buffer);
    const text = new Text(sourceText.buffer);

    const characterMatrix = await Promise.resolve()
    .then(() => {
        return Text.stripWhitespace(text.getValue());
    })
    .then(async (strippedContent: string) => {
        const imageDimensions: ImageDimensions = await image.getDimensions();
        const characterMatrix: CharacterMatrix = buildCharacterMatrix(strippedContent, imageDimensions);
        return characterMatrix;
    })
    .then(async (characterMatrix: CharacterMatrix) => {
        const colorMappedMatrix = await characterMatrix.map(async (row, rowIndex) => {
            console.log(`row[${rowIndex}]`);
            const characters = row.split("");
            const mappedCharPromises = characters.map(async (char, columnIndex) => {
                const cellRGBA: RGBA =  await image.getPixelColorAtCoordinate(columnIndex, rowIndex);
                console.log(`\t columnIndex[${columnIndex}]`);
                return `<span style="color: rgba(${cellRGBA.r}, ${cellRGBA.g}, ${cellRGBA.b}, ${cellRGBA.a / 255});">${char}</span>`;
            });

            return await Promise.all(mappedCharPromises)
            .then(mappedChars => {
                const mappedRow = mappedChars.join("");
                return mappedRow;
            });
        }); 

        return Promise.all(colorMappedMatrix);
    });



    const characterMatrixMarkup = characterMatrix.join("<br>");

    const body = `
    <h4>Source Text file info</h4>
    <pre>${JSON.stringify({ originalname: sourceText.originalname, size: sourceText.size }, null, 2)}</pre>
    <h4>Source Image file info</h4>
    <pre>${JSON.stringify({ originalname: sourceImage.originalname, size: sourceImage.size }, null, 2)}</pre>
    <h3>Character Matrix (${characterMatrix[0].length} x ${characterMatrix.length})</h3>
    <div class="text-output">${characterMatrixMarkup}</div>
    `;

    res.render("text-as-image-output", {
        title: "Rendered Page Test",
        body
    });
};

