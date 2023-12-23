const supertest = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

describe("Contact API", () => {
	let adminCookies = {};
	let notAdminCookies = {};
	let firstCreatedTicketId = 0;
	let ticketIdToBeArchived = 0;
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
		// Login to get cookies
		const adminResponse = await supertest(app).post("/api/auth/login").send({
			email: "test@test.com",
			password: "martin123321",
		});
		expect(adminResponse.status).toBe(200);
		adminCookies = adminResponse.headers["set-cookie"];

		const notAdminResponse = await supertest(app).post("/api/auth/login").send({
			email: "test2@test.com",
			password: "martin123321",
		});
		expect(notAdminResponse.status).toBe(200);
		notAdminCookies = notAdminResponse.headers["set-cookie"];

		// Create category
		const res = await supertest(app)
			.post("/api/category")
			.send({
				label: "test",
			})
			.set("Cookie", adminCookies);
		expect(res.status).toBe(201);
		categoryId = res.body.category._id;
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	});

	describe("POST /api/ticket", () => {
		it("should return 201 Created Request by admin", async () => {
			const response = await supertest(app)
				.post("/api/ticket")
				.send({
					message: "test",
					categoryId: categoryId,
				})
				.set("Cookie", adminCookies);
			expect(response.status).toBe(201);
			expect(response.body.message).toBe("Ticket created successfully");

			expect(response.body.ticket).toMatchObject({
				_id: expect.any(String),
				message: "test",
				userId: expect.any(String),
				archived: false,
				categoryId: categoryId,
				__v: expect.any(Number),
			});
			firstCreatedTicketId = response.body.ticket._id;
		});

		it("should return 201 Created Request by user", async () => {
			// Second ticket to test if it is archived
			const archiveResponse = await supertest(app)
				.post("/api/ticket")
				.send({
					message: "test",
				})
				.set("Cookie", notAdminCookies);
			expect(archiveResponse.status).toBe(201);
			expect(archiveResponse.body.message).toBe("Ticket created successfully");
			expect(archiveResponse.body.ticket).toMatchObject({
				_id: expect.any(String),
				message: "test",
				userId: expect.any(String),
				archived: false,
				__v: expect.any(Number),
			});
			ticketIdToBeArchived = archiveResponse.body.ticket._id;
		});

		it("should return 400 Bad Request", async () => {
			const response = await supertest(app)
				.post("/api/ticket")
				.send({
					message: "",
				})
				.set("Cookie", adminCookies);
			expect(response.status).toBe(400);
			expect(response.body.message).toBe("Bad Request - Message is required");
		});

		it("should return 401 Unauthorized", async () => {
			const response = await supertest(app).post("/api/ticket").send({
				message: "Bonjour c'est le message",
			});
			expect(response.status).toBe(401);
			expect(response.body.message).toBe("Unauthorized");
		});
	});

	describe("ADMIN Functions", () => {
		describe("POST /api/ticket/archive/:id", () => {
			it("should return 200 Success Request", async () => {
				const response = await supertest(app)
					.post(`/api/ticket/archive/${ticketIdToBeArchived}`)
					.set("Cookie", adminCookies);

				expect(response.status).toBe(200);
				expect(response.body.message).toBe("Ticket updated successfully");

				expect(response.body.ticket).toMatchObject({
					_id: expect.any(String),
					message: "test",
					userId: expect.any(String),
					archived: true,
					__v: expect.any(Number),
				});
			});
			it("should return 401 Unauthorized - User Not Logged In", async () => {
				const response = await supertest(app).post(
					`/api/ticket/archive/${ticketIdToBeArchived}`
				);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - User not logged in");
			});

			it("should return 404 Ticket Not Found", async () => {
				const response = await supertest(app)
					.post(`/api/ticket/archive/655965aea768317e884707a3`)
					.set("Cookie", adminCookies);
				expect(response.status).toBe(404);
				expect(response.body.message).toBe("Not Found - Ticket ID");
			});
		});

		describe("GET /api/ticket", () => {
			it("should return 200 Successful Request", async () => {
				const response = await supertest(app)
					.get("/api/ticket")
					.set("Cookie", adminCookies);
				expect(response.status).toBe(200);
				expect(response.body.tickets).toBeInstanceOf(Array);
				expect(response.body.tickets[0]).toMatchObject({
					_id: expect.any(String),
					userId: expect.any(String),
					message: "test",
					archived: false,
					categoryId: categoryId,
					__v: expect.any(Number),
				});
			});
			it("should return 401 Unauthorized - Not Logged In", async () => {
				const response = await supertest(app).get("/api/ticket");
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - User not logged in");
			});
			it("should return 401 Unauthorized - Not Admin", async () => {
				const response = await supertest(app)
					.get("/api/ticket")
					.set("Cookie", notAdminCookies);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - Not Admin");
			});
		});

		describe("GET /api/ticket/archived", () => {
			it("should return 200 Successful Request", async () => {
				const response = await supertest(app)
					.get("/api/ticket/archived")
					.set("Cookie", adminCookies);
				expect(response.status).toBe(200);
				expect(response.body.tickets).toBeInstanceOf(Array);
				expect(response.body.tickets[0]).toMatchObject({
					_id: expect.any(String),
					message: "test",
					userId: expect.any(String),
					archived: true,
					__v: expect.any(Number),
				});
			});
			it("should return 401 Unauthorized - Not Logged In", async () => {
				const response = await supertest(app).get("/api/ticket/archived");
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - User not logged in");
			});
			it("should return 401 Unauthorized - Not Admin", async () => {
				const response = await supertest(app)
					.get("/api/ticket/archived")
					.set("Cookie", notAdminCookies);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - Not Admin");
			});
		});

		describe("GET /api/ticket/:id", () => {
			it("should return 200 Successful Request", async () => {
				const response = await supertest(app)
					.get(`/api/ticket/${firstCreatedTicketId}`)
					.set("Cookie", adminCookies);
				expect(response.status).toBe(200);
				expect(response.body.message).toBe("Ticket sent successfully");
				expect(response.body.ticket).toMatchObject({
					_id: firstCreatedTicketId,
					message: "test",
					userId: expect.any(String),
					archived: false,
					categoryId: categoryId,
					__v: expect.any(Number),
				});
			});
			it("should return 401 Unauthorized - Not Admin", async () => {
				const response = await supertest(app)
					.get(`/api/ticket/${firstCreatedTicketId}`)
					.set("Cookie", notAdminCookies);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - Not Admin");
			});
			it("should return 401 Unauthorized - User Not Logged In", async () => {
				const response = await supertest(app).get(
					`/api/ticket/${firstCreatedTicketId}`
				);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - User not logged in");
			});
		});

		describe("DELETE /api/ticket/:id", () => {
			it("should return 401 Unauthorized - Not Logged In", async () => {
				const response = await supertest(app).delete(
					`/api/ticket/${firstCreatedTicketId}`
				);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - User not logged in");
			});

			it("should return 401 Unauthorized - Not Admin", async () => {
				const response = await supertest(app)
					.delete(`/api/ticket/${firstCreatedTicketId}`)
					.set("Cookie", notAdminCookies);
				expect(response.status).toBe(401);
				expect(response.body.message).toBe("Unauthorized - Not Admin");
			});

			it("should return 200 Successful Request", async () => {
				const response = await supertest(app)
					.delete(`/api/ticket/${firstCreatedTicketId}`)
					.set("Cookie", adminCookies);
				expect(response.status).toBe(200);
				expect(response.body.message).toBe("Ticket deleted successfully");
			});
			it("should return 404 Ticket Not Found", async () => {
				const response = await supertest(app)
					.delete(`/api/ticket/${firstCreatedTicketId}`)
					.set("Cookie", adminCookies);
				expect(response.status).toBe(404);
				expect(response.body.message).toBe("Not Found - Ticket ID");
			});
		});
	});
});
