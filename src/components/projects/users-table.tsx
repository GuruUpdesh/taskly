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

import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
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

import { type User } from "~/server/db/schema";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { deleteUserFromProject, editUserRoles } from "~/actions/user-actions";
import { db } from "~/server/db";




function UsersTable({ users, projectId, userRoles }: { users: User[], projectId: number, userRoles: { projectId: number, userId: string, userRole: string }[] }) {

	console.log(userRoles);
	const capitalizeFirstLetter = (str: string) => {
		return str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
	};


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
										{userRoles.find((role) => role.userId === user.userId)?.userRole
											? capitalizeFirstLetter(userRoles.find((role) => role.userId === user.userId)?.userRole || 'undefined')
											: "Member"}
									</TableCell>
									<TableCell>
										<div className="flex">
											<div>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															className="flex h-min items-center justify-between space-x-2 whitespace-nowrap rounded-sm border-0 p-2 px-3 text-sm text-blue-500 ring-offset-background placeholder:text-muted-foreground focus:text-blue-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
															onClick={() => {
																throwClientError("Not implemented (manage user)");
															}}
															style={{ background: "none", border: "none" }}
														>
															<Pencil2Icon className="w-4 h-4" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-80">
														<div className="space-y-2">
															<h4 className="font-medium leading-none">Edit {user.username}'s Role</h4>
															<div className="space-y-2">
																<Button variant="outline" onClick={() => {
																	throwClientError("Cannot change your own role");
																}}>
																	Owner
																</Button>
																<div className="space-y-2">
																	<Button variant="outline"
																		onClick={() => { editUserRoles(user.userId) }}
																	>
																		Member
																	</Button>
																</div>
															</div>
														</div>
													</PopoverContent>
												</Popover>
											</div>
											<div>
												<Dialog>
													<DialogTrigger asChild>
														<Button
															className="flex h-min items-center justify-between space-x-2 whitespace-nowrap rounded-sm border-0 p-2 px-3 text-sm text-red-500 ring-offset-background placeholder:text-muted-foreground focus:text-blue-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
															// onClick={() => deleteUserFromProject(user.userId, projectId)}
															style={{ background: "none", border: "none" }}
														>
															<TrashIcon />
														</Button>
													</DialogTrigger>
													<DialogContent className="sm:max-w-[425px]">
														<DialogHeader>
															<DialogTitle>Are you sure you want to remove {user.username} from the Project?</DialogTitle>
															<DialogDescription>
																Warning, once this action is completed, it cannot be
																undone. Are you sure you want to remove {user.username} from the Project?
															</DialogDescription>
														</DialogHeader>
														<div className="flex items-center space-x-2">
															<div className="grid flex-1 gap-2"></div>
														</div>

														<DialogFooter>
															<DialogClose asChild>
																<Button type="button" variant="secondary">
																	No
																</Button>
															</DialogClose>
															<DialogClose asChild>
																<Button
																	type="submit"
																	variant="default"
																	onClick={() => deleteUserFromProject(user.userId, projectId)}
																>
																	Yes
																</Button>
															</DialogClose>
														</DialogFooter>
													</DialogContent>
												</Dialog>
											</div>
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
