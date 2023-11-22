const supertest = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

describe("Contact API", () => {
	let cookies = {};
	let notAdminCookies = {};
	let categoryId = 0;

	beforeAll(async () => {
		await mongoose.disconnect();
		const mongoServer = await MongoMemoryServer.create();

		await mongoose.connect(mongoServer.getUri());
		await supertest(app).post("/api/auth/signup").send({
			firstname: "test",
			lastname: "test",
			email: "test@test.com",
			password: "martin123321",
			ability: 1,
		});
		await supertest(app).post("/api/auth/signup").send({
			firstname: "test2",
			lastname: "test2",
			email: "test2@test.com",
			password: "martin123321",
			ability: 0,
		});
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	});

	describe("ADMIN Functions", () => {
		beforeAll(async () => {
			const loginResponse = await supertest(app).post("/api/auth/login").send({
				email: "test@test.com",
				password: "martin123321",
			});
			expect(loginResponse.status).toBe(200);
			cookies = loginResponse.headers["set-cookie"];

			const notAdminResponse = await supertest(app)
				.post("/api/auth/login")
				.send({
					email: "test2@test.com",
					password: "martin123321",
				});
			expect(notAdminResponse.status).toBe(200);
			notAdminCookies = notAdminResponse.headers["set-cookie"];
		});

		describe("POST /api/category", () => {
			it("should return 201 Created Request", async () => {
				const response = await supertest(app)
					.post("/api/category")
					.send({
						label: "test",
					})
					.set("Cookie", cookies);
				expect(response.status).toBe(201);
				expect(response.body.message).toBe("Category created successfully");

				expect(response.body.category).toMatchObject({
					_id: expect.any(String),
					label: "test",
					__v: expect.any(Number),
				});
				categoryId = response.body.category._id;

				// To get a category after the first delete
				const response2 = await supertest(app)
					.post("/api/category")
					.send({
						label: "test",
					})
					.set("Cookie", cookies);
				expect(response2.status).toBe(201);
				expect(response2.body.message).toBe("Category created successfully");
			});
			it("should return 400 Bad Request", async () => {
				const response = await supertest(app)
					.post("/api/category")
					.send({
						label: "",
					})
					.set("Cookie", cookies);
				expect(response.status).toBe(400);
				expect(response.body.message).toBe("Bad Request - Label Required");
			});
			it("should return 401 Unauthorized - User Not Logged In", async () => {
				const response = await supertest(app).post("/api/category").send({
					label: "test",
				});
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - User not logged in");
			});
			it("should return 401 Unauthorized - Not Admin", async () => {
				const response = await supertest(app)
					.post("/api/category")
					.send({
						label: "test",
					})
					.set("Cookie", notAdminCookies);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - Not Admin");
			});
		});

		describe("GET /api/category/:id", () => {
			it("should return 200 Successful Request", async () => {
				const response = await supertest(app)
					.get(`/api/category/${categoryId}`)
					.set("Cookie", cookies);
				expect(response.status).toBe(200);
				expect(response.body.message).toBe("Category sent successfully");
				expect(response.body.category).toMatchObject({
					_id: categoryId,
					label: "test",
					__v: expect.any(Number),
				});
			});
			it("should return 404 Not Found", async () => {
				const response = await supertest(app)
					.get(`/api/category/655965aea768317e884707a3`)
					.set("Cookie", cookies);
				expect(response.status).toBe(404);
				expect(response.body.message).toBe("Not Found - Category ID");
			});
			it("should return 401 Unauthorized - User Not Logged In", async () => {
				const response = await supertest(app).get(
					`/api/category/${categoryId}`
				);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized");
			});
		});

		describe("DELETE /api/category/:id", () => {
			it("should return 401 Unauthorized - Not Logged In", async () => {
				const response = await supertest(app).delete(
					`/api/category/${categoryId}`
				);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - User not logged in");
			});

			it("should return 401 Unauthorized - Not Admin", async () => {
				const response = await supertest(app)
					.delete(`/api/category/${categoryId}`)
					.set("Cookie", notAdminCookies);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - Not Admin");
			});

			it("should return 200 Successful Request", async () => {
				const response = await supertest(app)
					.delete(`/api/category/${categoryId}`)
					.set("Cookie", cookies);
				expect(response.status).toBe(200);
				expect(response.body.message).toBe("Category deleted successfully");
				expect(response.body.category).toMatchObject({
					_id: categoryId,
					label: "test",
					__v: expect.any(Number),
				});
			});
			it("should return 404 ", async () => {
				const response = await supertest(app)
					.delete(`/api/category/${categoryId}`)
					.set("Cookie", cookies);
				expect(response.status).toBe(404);
				expect(response.body.message).toBe("Not Found - Category ID");
			});
		});
	});

	describe("GET /api/category", () => {
		it("should return 200 Successful Request", async () => {
			const response = await supertest(app).get("/api/category");
			expect(response.status).toBe(200);
			expect(response.body.categories).toBeInstanceOf(Array);
			expect(response.body.categories[0]).toMatchObject({
				_id: expect.any(String),
				label: "test",
				__v: expect.any(Number),
			});
		});
	});
});
