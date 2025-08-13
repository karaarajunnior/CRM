import { createAgent, gemini } from "@inngest/agent-kit";

export const createTicket = async (ticket) => {
	const analyze = await createAgent({
		model: gemini({
			model: "gemini-1.5-flash-8b",
			apiKey: process.env.GEMINI_KEY,
		}),
		name: "AI agent",
		system: `you are an expert AI agent that proceses technical support tickets.
        your job is to:
        1.summarise the issue
        2.estimate its priority
        3.provide helpful notes and resource links for moderators
        4.list relevant technical skills required

IMPORTANT:
respond with only valid raw json
donot include any code fences, mark down, comments or extra formatting
the format must be a raw json object

repeat:donot wrap your your output in mark down or code in fences
        `,
	});

	const supportagent = analyze.run(
		`you are my first agent for ticketting, only provide strict json object with strictly no extra headers or text or mark down 
        
        analyze the following support ticket and provide json object with:
        -summary: a short 1-2 sentence summary of the issue
        -priority:one of "low", "medium" or "high"
        -helpfulNotes:a detailed technical explanation that moderator can use to solve this issue. include useful external links or resources if possible
        -relatedskills: an array of relevant skills required to solve issue e.g ["react", "node","firebase"]

        respond only in this json format and donot include any code fences, mark down or additional text in the answer

        {
        "summary":"short summary of issue",
        "priority""high",
        "helpfulNotes":"here are helpful tips ...",
        "relatedskills":["react", "node", "ngnix"]
        }

        ---
        ticket information
-title:${ticket.title}
-description:${ticket.description}
        `,
	);
	const raw = (await supportagent).output[0]; //get context information 0789270876
};
