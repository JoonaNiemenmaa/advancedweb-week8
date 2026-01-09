import { NextFunction, Request, Response } from "express";

const validate_register = (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	request.body.email.isEmpty();
	console.log("THIS IS COMING FROM MIDDLEWARE");
	next();
};

export { validate_register };
