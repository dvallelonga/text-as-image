import request from "supertest";
import app from "../../src/app";
import {
    ReasonPhrases,
    StatusCodes,
} from "http-status-codes";


describe("GET /api", () => {
    it("should return 200 OK", () => {
        return request(app).get("/api")
            .expect(StatusCodes.OK);
    });
});


describe("POST /api/text", () => {
    it("should return 422 Unprocessable when sourceText or sourceImage are not sent in request", () => {
        return request(app).post("/api/text")
            .expect(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it("should return 200 OK when sourceText and sourceImage are sent in request", () => {
        return request(app).post("/api/text")
            .attach("source_text", "test/fixtures/text/source-text.txt")
            .attach("source_image", "test/fixtures/images/source-image.png")
            .expect(StatusCodes.OK);
    });

    it("should return names of uploaded source files in response body of successful requests", (done) => {
        const sourceTextFileName = "source-text.txt";
        const sourceImageFileName = "source-image.png";
        return request(app).post("/api/text")
            .attach("source_text", `test/fixtures/text/${sourceTextFileName}`)
            .attach("source_image", `test/fixtures/images/${sourceImageFileName}`)
            .expect(StatusCodes.OK)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.text).toContain(sourceTextFileName);
                expect(res.text).toContain(sourceImageFileName);
                return done();
            });
    });
});
