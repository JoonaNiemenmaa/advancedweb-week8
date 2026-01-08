import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./models/User";

const BCRYPT_ITERS = 10;
const SECRET: string | undefined = process.env.SECRET;

console.log(`SECRET: ${SECRET}`);

if (!SECRET) {
	console.error("No SECRET environment variable provided!");
	process.exit(1);
}

const router = Router();

router.use(express.json());

router.post(
	"/api/user/register/",
	async (request: Request, response: Response) => {
		const user = new User({
			username: request.body.username,
			email: request.body.email,
			password: request.body.password,
			isAdmin: request.body.isAdmin,
		});

		if (await User.findOne({ email: request.body.email })) {
			response.status(403).json({ email: "Email already in use" });
		}

		const salt = bcrypt.genSaltSync(BCRYPT_ITERS);
		const hash = bcrypt.hashSync(user.password, salt);

		user.password = hash;

		const saved = await user.save().catch((error) => console.log(error));

		return user === saved
			? response.status(200).json(saved)
			: response.status(400).json({ success: false });
	},
);

router.post("/api/user/login", async (request: Request, response: Response) => {
	console.log("------------------------------------------");
	console.log("--------------REQUEST---------------------");
	console.log("------------------------------------------");
	console.log(request.body);

	const user = await User.findOne({ email: request.body.email });

	if (!user) {
		return response.status(404).json({ error: "user not found" });
	}

	if (!bcrypt.compareSync(request.body.password, user.password)) {
		return response.status(403).json({ error: "incorrect password" });
	}

	const payload = {
		username: user.username,
		isAdmin: user.isAdmin,
	};

	const token = jwt.sign(payload, SECRET);

	return response.status(200).json({ token: token });
});

export default router;
