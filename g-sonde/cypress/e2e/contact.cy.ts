///<reference types="cypress" />
describe("E2E Tests Contact Page", () => {
	beforeEach(() => {
		// Root of the website
		cy.visit("/");
		cy.get("#navbar-contact").click();
	});

	describe("Insert Form", () => {
		it("should submit the form and have a name error", () => {
			cy.wait(1000);
			let name = "123456";
			let email = "test@test.com";
			let message = "Hello from Cypress";

			cy.get("#form-contact")
				.should("be.visible")
				.within(() => {
					cy.get("#input-contact-name").type(name);
					cy.get("#input-contact-email").type(email);
					cy.get("#input-contact-message").type(message);
					cy.get("#input-contact-submit-button").click();
				});

			cy.get("#toast-contact-error")
				.invoke("attr", "message")
				.should("eq", "Name must only contain letters.");

			cy.location("pathname").should("eq", "/contact");
		});
	});

	describe("Insert Form", () => {
		it("should submit the form without errors", () => {
			cy.wait(1000);
			let name = "test";
			let email = "test@test.com";
			let message = "Hello from Cypress";

			cy.get("#form-contact").within(() => {
				cy.get("#input-contact-name").type(name);
				cy.get("#input-contact-email").type(email);
				cy.get("#input-contact-message").type(message);
				cy.get("#input-contact-submit-button").click();
			});
			cy.get("#popup-close-button").click();
			cy.location("pathname").should("eq", "/", { timeout: 10000 });
			cy.get("#home-desktop-content").should("exist", { timeout: 10000 });
		});
	});

	describe("Insert Form", () => {
		it("should submit the form with empty field and be refused", () => {
			cy.get("#form-contact").within(() => {
				cy.get("#input-contact-submit-button").click();
			});

			cy.location("pathname").should("eq", "/contact", { timeout: 10000 });
			cy.get("#form-contact").should("exist", { timeout: 10000 });
		});
	});
});
