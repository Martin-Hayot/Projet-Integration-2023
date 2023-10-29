const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Authentication", () => {
	var cookies = {};
	var oldcookies = [];
	beforeAll(async () => {
		await mongoose.disconnect();
		const mongoServer = await MongoMemoryServer.create();

		await mongoose.connect(mongoServer.getUri());
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	});
	describe("local authentication", () => {
		describe("POST /api/auth/signup", () => {
			it("should return 201 Created", async () => {
				const response = await supertest(app).post("/api/auth/signup").send({
					firstname: "test",
					lastname: "test",
					email: "test@test.com",
					password: "martin123321",
				});
				expect(response.status).toBe(201);
				expect(response.body.message).toBe("User created successfully");
			});
			it("should return 400 Bad Request", async () => {
				const response = await supertest(app).post("/api/auth/signup").send({
					firstname: "",
					lastname: "",
					email: "",
					password: "",
				});
				expect(response.status).toBe(400);
				expect(response.body.message).toBe("All entries are required");
			});
			it("should return 409 Conflict", async () => {
				const response = await supertest(app).post("/api/auth/signup").send({
					firstname: "test",
					lastname: "test",
					email: "test@test.com",
					password: "martin123321",
				});
				expect(response.status).toBe(409);
				expect(response.body.message).toBe("User already exists");
			});
		});

		describe("POST /api/auth/login", () => {
			it("should return 200 OK", async () => {
				const response = await supertest(app).post("/api/auth/login").send({
					email: "test@test.com",
					password: "martin123321",
				});
				expect(response.status).toBe(200);
				// check if cookies are set
				expect(response.headers["set-cookie"]).toBeDefined();
				console.log(response.headers["set-cookie"]);

				// check if i have a accessToken cookie
				expect(response.headers["set-cookie"][0]).toContain("accessToken");

				// check if i have a refreshToken cookie
				expect(response.headers["set-cookie"][1]).toContain("refreshToken");
				cookies = response.headers["set-cookie"];
			});
			it("should return 400 Bad Request", async () => {
				const response = await supertest(app).post("/api/auth/login").send({
					email: "",
					password: "",
				});
				expect(response.status).toBe(400);
				expect(response.body.message).toBe("Email and password are required");
			});
			it("should return 401 Unauthorized", async () => {
				const response = await supertest(app).post("/api/auth/login").send({
					email: 54,
					password: "martin123321",
				});
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("User not found");
			});
		});
	});

	describe("Refresh token and access token tests on protected routes", () => {
		describe("GET /api/user", () => {
			it("jwt tokens valid, should return 200 OK", async () => {
				const response = await supertest(app)
					.get("/api/user")
					.set("Cookie", cookies);
				expect(response.status).toBe(200);
			});
			it("jwt tokens not in the request, should return 401 Unauthorized", async () => {
				const response = await supertest(app).get("/api/user");
				expect(response.status).toBe(401);
			});
			it("access token expired but refresh is still valid, should return 200 OK", async () => {
				const accessToken = jwt.verify(
					cookies[0].split(";")[0].split("=")[1],
					process.env.ACCESS_TOKEN_SECRET
				);
				const refreshToken = jwt.verify(
					cookies[1].split(";")[0].split("=")[1],
					process.env.REFRESH_TOKEN_SECRET
				);
				const accessToken1 = jwt.sign(
					{ userId: accessToken.userId, email: "test@test.com" },
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: 1 }
				);
				const refreshToken1 = jwt.sign(
					{ userId: refreshToken.userId, email: "test@test.com" },
					process.env.REFRESH_TOKEN_SECRET,
					{ expiresIn: "30d" }
				);
				await sleep(2000);
				cookies[0] = `accessToken=${accessToken1}; Path=/; HttpOnly; Expires=Mon, 28 Oct 2024 18:03:33 GMT`;
				cookies[1] = `refreshToken=${refreshToken1}; Path=/; HttpOnly; Expires=Mon, 28 Oct 2024 18:03:33 GMT`;
				oldcookies = cookies;
				const response = await supertest(app)
					.get("/api/user")
					.set("Cookie", cookies);
				expect(response.status).toBe(200);
				const accessToken2 = response.headers["set-cookie"][0]
					.split(";")[0]
					.split("=")[1];
				const refreshToken2 = response.headers["set-cookie"][1]
					.split(";")[0]
					.split("=")[1];
				const searchUser = await User.find();
				console.log(searchUser);
				expect(accessToken2).not.toBe(accessToken1);
				expect(refreshToken2).not.toBe(refreshToken1);
				console.log(refreshToken1);
				console.log(refreshToken2);
			});
			it("refresh token reuse detection, should return 401 Unauthorized", async () => {
				const response = await supertest(app)
					.get("/api/user")
					.set("Cookie", oldcookies);
				expect(response.status).toBe(401);
			});
		});
	});
});
