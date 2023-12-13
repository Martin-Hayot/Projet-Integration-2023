const app = require("./app");
const port = 3001;
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "G-SONDE API",
            description: "G-SONDE API Information",
            servers: ["http://localhost:3001"],
        },
    },
    apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

function swaggerDocs(app, port) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
}

swaggerDocs(app, port);
