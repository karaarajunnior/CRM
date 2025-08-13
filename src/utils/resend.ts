import {
	Resend,
	CreateEmailOptions,
	CreateEmailResponseSuccess,
	ErrorResponse,
} from "resend";
import { SendEmailInput } from "../users/types";
const resend = new Resend(process.env.CRM_RESEND_KEY);

export async function sendEmail(
	options: SendEmailInput | CreateEmailOptions,
): Promise<
	| CreateEmailResponseSuccess
	| ErrorResponse
	| {
			data: null;
			error: unknown;
	  }
	| null
> {
	try {
		const { data, error } = await resend.emails.send(options);

		if (error) {
			console.error("Resend email sending error:", error);
			return error;
		}

		console.log("Email sent successfully:", data);
		return data;
	} catch (err) {
		console.error("Unexpected error during email sending:", err);
		throw err;
	}
}
