import { Request, Response } from "express";

/**
 * Examples page.
 * @route GET /
 */
export const getExamples = (req: Request, res: Response) => {
    res.render("examples", {
        title: "Examples"
    });
};
