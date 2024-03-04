import React from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import safeAsync from '~/lib/safe-action'
import { handleProjectInfo } from '~/actions/settings/settings-actions'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createComment } from '~/actions/application/comment-actions'
import { Button } from '../ui/button'
import { ChevronRight, Loader2Icon } from 'lucide-react'
import { Textarea } from '../ui/textarea'

type Props = {
    taskId: number;
}

const formSchema = z.object({
    comment: z.string().min(1).max(3000),
});

const CommentForm = ({ taskId }: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await createComment(values.comment, taskId);
        form.reset();
    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full items-center gap-1.5"
            >
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea          
                                    placeholder="Add a comment..."                    
                                    className="bg-accent/25"
                                    rows={2}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    size="sm"
                    disabled={
                        !form.formState.isDirty ||
                        form.formState.isSubmitting
                    }
                >
                    {form.formState.isSubmitting
                        ? "Saving Changes"
                        : "Save Changes"}
                    {form.formState.isSubmitting ? (
                        <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ChevronRight className="ml-2 h-4 w-4" />
                    )}
                </Button>
            </form>
        </Form>

    )
}

export default CommentForm
