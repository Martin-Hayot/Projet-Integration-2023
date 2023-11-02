const supertest = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");

describe("Rate limiter", () => {
	beforeAll(async () => {
		await mongoose.disconnect();
		const mongoServer = await MongoMemoryServer.create();

		await mongoose.connect(mongoServer.getUri());
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoose.connection.close();
	});

	describe("POST /api/auth/signup", () => {
		it("When spaming requests more than 100 request over 15min, should return 429 Too Many Requests", async () => {
			for (let i = 0; i < 120; i++) {
				var res = await supertest(app).post("/api/auth/signup").send({
					firstname: "test",
					lastname: "test",
					email: "test@test.com",
					password: "martin123321",
				});
			}
			console.log(res.status);
			expect(res.status).toBe(429);
		});
	});
});
