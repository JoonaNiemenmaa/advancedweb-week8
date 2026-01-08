import express from "express";
import mongoose from "mongoose";
import router from "./router";

const port = 3000;

const db_url = "mongodb://localhost:27017/testdb";
mongoose
	.connect("mongodb://localhost:27017/testdb")
	.catch((err) => console.error(err));

const app = express();

app.use(router);

app.use(express.static("public"));

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
