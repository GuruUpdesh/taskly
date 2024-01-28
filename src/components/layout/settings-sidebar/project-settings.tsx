"use client";

import React from "react";
import { useProjectStore } from "~/store/project";
import SidebarButton from "../sidebar/sidebar-button";
import { TrashIcon } from "@radix-ui/react-icons";

const ProjectSettings = () => {
    const project = useProjectStore((state) => state.project);
    if (!project) return null;

    return (
        <>
            <div className="flex items-center gap-2 text-sm font-medium leading-none text-muted-foreground">
                <p>Project Settings</p>
                <p className="rounded-sm bg-accent p-1 px-2">{project.name}</p>
            </div>
            <div>
                <SidebarButton
                    label="General"
                    url={`/settings/project/${project.id}/general`}
                />
                <SidebarButton
                    label="Other"
                    url={`/settings/project/${project.id}/other`}
                />
                <SidebarButton
                    label="Invite"
                    url={`/settings/project/${project.id}/invite`}
                />
				
                <SidebarButton
                    label="Delete"
                    url={`/settings/project/${project.id}/delete`}
					icon={<TrashIcon />}
                />
            </div>
        </>
    );
};

export default ProjectSettings;

