import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { Types } from "mongoose";

import { SECRET } from "./server";

import { User } from "./models/User";
import { Topic } from "./models/Topic";

import { validate } from "./middleware/validate";

const BCRYPT_ITERS = 10;

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

router.get("/api/topics", async (request: Request, response: Response) => {
	return response.status(200).json(await Topic.find());
});

router.post(
	"/api/topic",
	validate(),
	async (request: Request, response: Response) => {
		const post = new Topic({
			title: request.body.title,
			content: request.body.content,
			username: request.body.payload.username,
			createdAt: Date.now(),
		});

		await post.save().catch((error) => {
			console.log(error);
			return response.status(400).json({ message: "failure" });
		});

		return response.status(200).json(post);
	},
);

router.delete(
	"/api/topic/:id",
	validate({ isAdmin: true }),
	async (request: Request, response: Response) => {
		const id = request.params.id;

		console.log(id);

		try {
			await Topic.deleteOne({ _id: new Types.ObjectId(id) });
			return response
				.status(200)
				.json({ message: "Topic deleted successfully." });
		} catch (error) {
			console.error(error);
			return response.status(400).json({ message: "failure" });
		}
	},
);

export default router;
