import { Document, model, Schema } from "mongoose";

interface ITopic extends Document {
	username: string;
	title: string;
	content: string;
	createdAt: Date;
}

const topic_schema = new Schema<ITopic>({
	username: String,
	title: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, required: true },
});

const Topic = model<ITopic>("Topic", topic_schema);

export { Topic };
