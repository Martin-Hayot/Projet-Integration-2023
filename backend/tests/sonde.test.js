const supertest = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");


describe("Sonde", () => {
    var cookies = {};
    var aquariumId = "";
    var diagnosticId = "";
    beforeAll(async () => {
        await mongoose.disconnect();
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());

        await supertest(app)
            .post("/api/auth/signup")
            .send({
                firstname: "test",
                lastname: "test",
                email: "test@test.com",
                password: "martin123321",
            });

        const response = await supertest(app)
            .post("/api/auth/login")
            .send({
                email: "test@test.com",
                password: "martin123321",
            });

        cookies = response.headers["set-cookie"];
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });



    describe("test sonde", () => {
        describe("POST /api/aquarium", () => {
            it("jwt tokens valid & information entered, should return 200 OK", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium")
                    .set("Cookie", cookies)
                    .send({
                        name: "Mon aquarium de 2m²",
                    });
                expect(response.status).toBe(201);
            });

            it("user not authenticate, should return 401 Unauthorized", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium")
                    .send({
                        name: "Mon aquarium de 2m²",
                    });
                expect(response.status).toBe(401);
            });

            it("missing field, should return 400 error", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium")
                    .set("Cookie", cookies)
                    .send({
                    });
                expect(response.status).toBe(400);
            });
        });
        describe("GET /api/aquarium", () => {
            it("test get all the aquarium for the user, should return 200 OK", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium")
                    .set("Cookie", cookies);
                expect(response.status).toBe(200);
            });

            it("user not authenticate, should return 401 Unauthorized", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium")
                expect(response.status).toBe(401);
            });

            it("test the information receive, should return the previously created aquarium", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium")
                    .set("Cookie", cookies);
                expect(response.body[0].name).toBe("Mon aquarium de 2m²");
                console.log(response.body);
                aquariumId = response.body[0]._id;
            });
        });

        describe("POST /api/aquarium/diagnostic", () => {
            it("jwt tokens valid & information entered, should return 200 OK", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium/diagnostic")
                    .set("Cookie", cookies)
                    .send({
                        aquariumId: aquariumId,
                        date: "2023-11-02T15:36:48.384Z",
                    });
                expect(response.status).toBe(201);
            });

            it("user not authenticate, should return 401 Unauthorized", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium/diagnostic")
                    .send({
                        aquariumId: aquariumId,
                        date: "2023-11-02T15:36:48.384Z",
                    });
                expect(response.status).toBe(401);
            });

            it("missing field, should return 400 error", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium/diagnostic")
                    .set("Cookie", cookies)
                    .send({
                        aquariumId: aquariumId,
                    });
                expect(response.status).toBe(400);
            });

            it("wrong formated field, should return 400 error", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium/diagnostic")
                    .set("Cookie", cookies)
                    .send({
                        aquariumId: aquariumId,
                        date: "12-2011-02T15:36:48.384Z",
                    });
                expect(response.status).toBe(500);
            });
        });

        describe("GET /api/aquarium/diagnostic", () => {
            it("test get all the aquarium for the user, should return 200 OK", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium/" + aquariumId + "/diagnostic/")
                    .set("Cookie", cookies)
                expect(response.status).toBe(200);
            });

            it("user not authenticate, should return 401 Unauthorized", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium/" + aquariumId + "/diagnostic/")
                expect(response.status).toBe(401);
            });

            it("test the information receive, should return the previously created diagnostic", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium/" + aquariumId + "/diagnostic/")
                    .set("Cookie", cookies)
                expect(response.body[0].aquariumId).toBe(aquariumId);
                expect(response.body[0].date).toBe("2023-11-02T15:36:48.384Z");
                diagnosticId = response.body[0]._id;
            });
        });

        describe("POST /api/aquarium/diagnostic/data", () => {
            it("jwt tokens valid & information entered, should return 200 OK", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium/diagnostic/data")
                    .set("Cookie", cookies)
                    .send({
                        diagnosticId: diagnosticId,
                        measure: 1200,
                        frequency: 200,
                    });
                expect(response.status).toBe(201);
            });

            it("user not authenticate, should return 401 Unauthorized", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium/diagnostic/data")
                    .send({
                        diagnosticId: diagnosticId,
                        measure: 1200,
                        frequency: 200,
                    });
                expect(response.status).toBe(401);
            });

            it("missing field, should return 400 error", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium/diagnostic/data")
                    .set("Cookie", cookies)
                    .send({
                        diagnosticId: diagnosticId,
                        measure: 1200,
                    });
                expect(response.status).toBe(400);
            });

            it("wrong formated field, should return 400 error", async () => {
                const response = await supertest(app)
                    .post("/api/aquarium/diagnostic/data")
                    .set("Cookie", cookies)
                    .send({
                        diagnosticId: diagnosticId,
                        measure: 1200,
                        frequency: "abc",
                    });
                expect(response.status).toBe(500);
            });
        });

        describe("GET /api/aquarium/data", () => {
            it("test get all the aquarium for the user, should return 200 OK", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium/" + aquariumId + "/diagnostic/" + diagnosticId + "/data/")
                    .set("Cookie", cookies)
                expect(response.status).toBe(200);
            });

            it("user not authenticate, should return 401 Unauthorized", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium/" + aquariumId + "/diagnostic/" + diagnosticId + "/data/")
                expect(response.status).toBe(401);
            });

            it("test the information receive, should return the previously created data", async () => {
                const response = await supertest(app)
                    .get("/api/aquarium/" + aquariumId + "/diagnostic/" + diagnosticId + "/data/")
                    .set("Cookie", cookies)
                expect(response.body[0].diagnosticId).toBe(diagnosticId);
                expect(response.body[0].measure).toBe(1200);
                expect(response.body[0].frequency).toBe(200);
            });
        });
    });
});
