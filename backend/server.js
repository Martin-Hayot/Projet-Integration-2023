const { json } = require("express");
express = require("express");

const port = process.env.PORT || 8080;
const app = express();

app.use(json());

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
