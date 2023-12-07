import EmailForm from "./EmailForm";

export default function EmailPage() {
	return (
		<div className="container flex flex-col gap-4 px-4 py-16 ">
			<h3 className="scroll-m-20 text-2xl font-normal tracking-tight">
				Email Tester
			</h3>
			<EmailForm />
		</div>
	);
}
