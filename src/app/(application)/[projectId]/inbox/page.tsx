import React from "react";
import { Button } from "~/components/ui/button";
import {
    ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import NotificationItem from "./notification-item";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

type Params = {
    params: {
        projectId: string;
    };
};

export default function InboxPage({
    params: { projectId },
}: Params) {
    return (
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
                id="inbox-sidebar"
                minSize={12}
                maxSize={25}
                defaultSize={15}
            >
                <div className="px-4 min-h-screen">
                    <header className="flex items-center justify-between gap-2 pt-4 pb-4 border-b">
                        <h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
                            Inbox
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                Filter
                            </Button>
                            <Button variant="outline" size="sm">
                                Clear All
                            </Button>
                        </div>
                    </header>
                    <section className="flex flex-col gap-2 py-2">
                        <NotificationItem />
                    </section>
                </div>
            </ResizablePanel>
            <ResizableHandle className="" />
            <ResizablePanel defaultSize={75}>
                <main className="pt-4 flex items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center">
                        <EnvelopeClosedIcon className="w-24 h-24"/>
                        <h1 className="text-xl tracking-tight">
                            You have no notifications
                        </h1>
                    </div>
                </main>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}