import { NextFunction, Request, Response } from "express";
import { SECRET } from "../server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IPayload extends JwtPayload {
	username?: string;
	isAdmin?: boolean;
}

interface IOptions {
	isAdmin: boolean;
}

const BEARER_LENGTH = 7;

export const validate = function (options: IOptions = { isAdmin: false }) {
	return (request: Request, response: Response, next: NextFunction) => {
		if (!request.headers.authorization) {
			return response.status(401).json({ message: "Token not found" });
		}

		let payload: IPayload | undefined;

		try {
			const token = (request.headers.authorization as string).substring(
				BEARER_LENGTH,
			);

			payload = jwt.verify(token, SECRET) as IPayload;
		} catch (error) {
			return response.status(403).json({ message: "Access denied." });
		}

		if (options.isAdmin && !payload.isAdmin) {
			return response.status(403).json({ message: "Access denied." });
		}

		if (!request.body) {
			request.body = {};
		}

		request.body.payload = payload;

		next();
	};
};
