"use client";

import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { createTicket } from "~/actions/application/ticket-action";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { env } from "~/env.mjs";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
    title: z.string().max(100),
    description: z.string().max(1000),
});

export function CreateTicket() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    function resetForm() {
        form.reset({
            title: "",
            description: "",
        });
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("submitting")
        await createTicket(values.title, values.description);
    }

    return (
        <Dialog onOpenChange={(open) => {
            if (!open) {
                resetForm();
            }
        }}>
            <DialogTrigger asChild>
                <div
                    style={{ position: "fixed", bottom: "20px", right: "20px" }}
                >
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                    >
                        <QuestionMarkIcon className="h-4 w-4" />
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form
                        className="grid w-full items-center gap-1.5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <DialogHeader>
                            <DialogTitle>Create Issue</DialogTitle>
                            <DialogDescription>
                                Create a ticket for our Taskly. Click submit to send it
                                to our team!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="title"
                                                placeholder="Title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                id="description"
                                                placeholder="Description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="submit"
                                    disabled={
                                        !form.formState.isDirty ||
                                        form.formState.isSubmitting
                                    }
                                >
                                    Submit
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>


    );
}

export default CreateTicket;
