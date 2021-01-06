"use strict";

import { Response, Request, NextFunction } from "express";


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
export const postText = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Request received");
};

