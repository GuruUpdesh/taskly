import { auth } from "@clerk/nextjs";
import { createInvite } from "~/actions/invite-actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

type Params = {
	params: {
		projectId: string;
	};
};

export default async function ProjectSettingsInvite({
	params: { projectId },
}: Params) {
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const inviteLink = await createInvite(userId, projectId);
	if (inviteLink === false) return null;

	console.log(inviteLink);

	// const handleCopyToClipboard = async () => {
	//     try {
	//         await navigator.clipboard.writeText(randomLink);
	//         alert('Copied to clipboard!');
	//     } catch (error) {
	//         console.error('Error copying to clipboard:', error);
	//     }
	// };

	return (
		<div className="container flex flex-col pt-4">
			<h1>Invite with Link</h1>
			<p>Invite a user using the link below!</p>
			<div className="flex items-start">
				<Textarea value={inviteLink} />
				{/* <Button onClick={handleCopyToClipboard}>
                    Copy to Clipboard
                </Button> */}
			</div>
			<br />
			<h1>Invite with User</h1>
			<p>Invite a user using their email!</p>
			<div className="flex items-start">
				<Input placeholder="user@example.com" />
				<Button>Send Invite</Button>
			</div>
		</div>
	);
}
