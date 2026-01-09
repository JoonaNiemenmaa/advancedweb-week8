import { Document, model, Schema } from "mongoose";

const MIN_LENGTH = 3;
const MAX_LENGTH = 25;

interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	isAdmin: boolean;
}

const user_schema = new Schema<IUser>({
	username: {
		type: String,
		required: true,
		minLength: MIN_LENGTH,
		maxLength: MAX_LENGTH,
	},
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, required: true },
});

const User = model<IUser>("User", user_schema);

export { User, IUser };
