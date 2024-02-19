"use client";

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
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

export async function CreateTicket() {


    const createGitHubIssue = async (title: string, body: string) => {
        console.log(title, body)

        const accessToken = '';
        const owner = 'GuruUpdesh';
        const repo = 'taskly';

        const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

        if (!title && !body || !title || !body) {
            console.log('Invalid ticket');
            return false;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `token ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, body })
        });

        if (response.ok) {
            console.log('Issue created successfully');
            return true;
        } else {
            const errorMessage = await response.text();
            console.error('Failed to create issue:', errorMessage);
            return false;
        }
    };

    return (

        <Dialog>
            <DialogTrigger asChild>
                <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                    <Button variant="outline" className="rounded-full h-10 w-10 flex items-center justify-center">
                        T
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Issue</DialogTitle>
                    <DialogDescription>
                        Create a ticket for our Taskly. Click submit to send it to our team!
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input id="title" placeholder="Title" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input id="description" placeholder="Description" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                    <Button type="submit" onClick={() => {
                        const titleInput = document.getElementById('title') as HTMLInputElement;
                        const descriptionInput = document.getElementById('description') as HTMLInputElement;
                        const title = titleInput.value;
                        const description = descriptionInput.value;
                        createGitHubIssue(title, description)
                    }}>Submit</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateTicket;