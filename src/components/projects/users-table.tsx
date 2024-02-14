"use client";

import React from "react";

import {
	Table,
	TableBody,
	TableHeader,
	TableHead,
	TableRow,
	TableCell,
} from "~/components/ui/table";

import { throwClientError } from "~/utils/errors";

import { type User } from "~/server/db/schema";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { deleteUserFromProject } from "~/actions/user-actions";



function UsersTable({ users, projectId }: { users: User[], projectId: number}) {

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Username</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map(
						(user) =>
							user !== null && (
								<TableRow key={user.userId}>
									<TableCell>{user.username}</TableCell>
									<TableCell>
										{user.username == "Cameron Hollis"
											? "Owner"
											: "Member"}
									</TableCell>
									<TableCell>
										<div className="flex">
											<button
												className="flex h-min items-center justify-between space-x-2 whitespace-nowrap rounded-sm border-0 p-2 px-3 text-sm text-blue-500 ring-offset-background placeholder:text-muted-foreground focus:text-blue-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												onClick={() => {
													throwClientError(
														"Not implemented (manage user)",
													);
												}}
											>
												<Pencil2Icon />
											</button>
											<button
												className="ml-2 flex h-min items-center justify-between space-x-2 whitespace-nowrap rounded-sm border-0 p-2 px-3 text-sm text-red-500 ring-offset-background placeholder:text-muted-foreground focus:text-red-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
												onClick={() => deleteUserFromProject(user.userId, projectId)}
											>
												<TrashIcon />
											</button>
										</div>
									</TableCell>
								</TableRow>
							),
					)}
				</TableBody>
			</Table>
		</>
	);
}

export default UsersTable;
