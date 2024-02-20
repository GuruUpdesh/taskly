"use client";

import React from "react";
import {
    KBarProvider,
    KBarPortal,
    KBarPositioner,
    KBarAnimator,
    KBarSearch,
    useMatches,
    KBarResults,
} from "kbar";
import { Project } from "~/server/db/schema";
import { type Task } from "~/server/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
    projectId: number;
};

const searchStyle = {
    padding: "12px 16px",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box" as React.CSSProperties["boxSizing"],
    outline: "none",
    border: "none",
    background: "var(--background)",
    color: "var(--foreground)",
  };

  const animatorStyle = {
    maxWidth: "600px",
    width: "100%",
    background: "var(--background)",
    color: "var(--foreground)",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "var(--shadow)",
  };
  
  const groupNameStyle = {
    padding: "8px 16px",
    fontSize: "10px",
    textTransform: "uppercase" as const,
    opacity: 0.5,
  };

function GlobalSearch({projectId}: Props) {
    
    const queryClient = useQueryClient();
    const tasks = queryClient.getQueryData<Task[]>([
        "tasks",
    ]) || [];

    const router = useRouter();

    const actions = tasks.map((task) => ({
        id: String(task.id),
        name: task.title,
        perform: () => router.push(`/project/${projectId}/task/${task.id}`)
      }));
      
    return (
        <KBarProvider actions={actions}>
            <KBarPortal>
                <KBarPositioner>
                    <KBarAnimator style={animatorStyle}>
                        <KBarSearch style={searchStyle}/>
                            <RenderResults/>
                    </KBarAnimator>
                </KBarPositioner>
            </KBarPortal>
        </KBarProvider>
    );
}

function RenderResults() {
    const { results } = useMatches();
  
    return (
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === "string" ? (
            <div>{item}</div>
          ) : (
            <div
              style={{
                background: "transparent",
              }}
            >
              {item.name}
            </div>
          )
        }
      />
    );
  }

export default GlobalSearch;
