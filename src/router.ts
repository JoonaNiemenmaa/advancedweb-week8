import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./models/User";
import { validate_register } from "./validators/validator";
import { body, validationResult } from "express-validator";

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
	body("username").trim().escape().notEmpty().isLength({ min: 3, max: 25 }),
	body("email").trim().escape().notEmpty().isEmail(),
	body("password").escape().notEmpty().isStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	}),
	body("isAdmin").notEmpty(),
	async (request: Request, response: Response) => {
		const result = validationResult(request);

		if (!result.isEmpty()) {
			return response.status(400).json({ error: result.array() });
		}

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
	const user = await User.findOne({ email: request.body.email.trim() });

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
