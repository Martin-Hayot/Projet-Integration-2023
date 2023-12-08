const supertest = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

describe("Profile", () => {
    var cookies = {};
    beforeAll(async () => {
        await mongoose.disconnect();
        const mongoServer = await MongoMemoryServer.create();

        await mongoose.connect(mongoServer.getUri());

        await supertest(app).post("/api/auth/signup").send({
            firstname: "test",
            lastname: "test",
            email: "test@test.com",
            password: "martin123321",
        });

        const response = await supertest(app).post("/api/auth/login").send({
            email: "test@test.com",
            password: "martin123321",
        });

        cookies = response.headers["set-cookie"];
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe("Profile Updates", () => {
        describe("PUT /api/profile", () => {
            it("should return 400, new password must be different", async () => {
                const response = await supertest(app)
                    .patch("/api/user/profile")
                    .set("Cookie", cookies)
                    .send({
                        firstname: "test",
                        lastname: "test",
                        email: "test@test.com",
                        password: "martin123321",
                    });
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "New password cannot be the same as old password!"
                );
            });
            it("should return 200 OK", async () => {
                const response = await supertest(app)
                    .patch("/api/user/profile")
                    .set("Cookie", cookies)
                    .send({
                        firstname: "test",
                        lastname: "test",
                        email: "test@test.com",
                        password: "123321",
                    });
                expect(response.status).toBe(200);
                expect(response.body.message).toBe(
                    "User updated successfully!"
                );
            });
            it("should return 400 Bad Request", async () => {
                const response = await supertest(app)
                    .patch("/api/user/profile")
                    .set("Cookie", cookies)
                    .send({
                        firstname: "",
                        lastname: "",
                        email: "",
                        password: "",
                    });
                expect(response.status).toBe(400);
                expect(response.body.message).toBe("All entries are required!");
            });
        });
        describe("PUT /api/profile/picture", () => {
            it("should return 200 OK", async () => {
                const response = await supertest(app)
                    .put("/api/user/profile/picture")
                    .set("Cookie", cookies)
                    .send({
                        profilePicture: "test",
                    });
                expect(response.status).toBe(200);
                expect(response.body.message).toBe(
                    "Profile picture updated successfully!"
                );
            });
            it("should return 400 Bad Request", async () => {
                const response = await supertest(app)
                    .put("/api/user/profile/picture")
                    .set("Cookie", cookies)
                    .send({
                        profilePicture: "",
                    });
                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "Profile picture is required!"
                );
            });
        });
    });
});
