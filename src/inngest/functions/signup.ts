import { NonRetriableError } from "inngest";
import { inngest } from "../client";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../../utils/resend";

const prisma = new PrismaClient();
const onSignup = inngest.createFunction(
	{ id: "onsignup" },
	{ event: "sign up" },
	async ({ event, step }) => {
		const { email } = event.data;

		await step.run("userExists", async () => {
			const user = prisma.use.findUnique({ where: { email } });

			if (!user) {
				throw new NonRetriableError("user doesnt exist");
			}
			return user;
		});

		await step.run("end-email", async () => {
			const subject = "welcome email";
			const text = "you have registered with us";

			await sendEmail({
				from: "Acme <crm@resend.dev>",
				to: ["karaarajunior1@gmail.com", "karaarajunior057@gmail.com"],
				subject,
				text,
			});
		});
	},
);
