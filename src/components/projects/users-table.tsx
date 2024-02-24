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

import { userRoles } from "~/server/db/schema";
import { TrashIcon } from "@radix-ui/react-icons";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import {
	editUserRole,
	removeUserFromProject,
} from "~/actions/settings/settings-actions";
import { type UserWithRole } from "~/actions/application/project-actions";
import { Icon } from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

function UsersTable({
	users,
	projectId,
	userId,
}: {
	users: UserWithRole[];
	projectId: number;
	userId: string;
}) {
	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Username</TableHead>
						<TableHead>Role</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map(
						(user) =>
							user !== null && (
								<TableRow
									key={user.userId}
									className={cn({
										"pointer-events-none opacity-50":
											user.userRole === "owner" ||
											user.userId === userId,
									})}
								>
									<TableCell>{user.username}</TableCell>
									<TableCell>
										<Select
											value={user.userRole}
											onValueChange={(val) =>
												editUserRole(
													user.userId,
													projectId,
													val,
												)
											}
										>
											<SelectTrigger className="w-[180px] capitalize">
												<SelectValue className="capitalize" />
												<Icon asChild>
													<ChevronDown className="h-4 w-4 opacity-50" />
												</Icon>
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{userRoles.map((role) => {
														return (
															<SelectItem
																key={role}
																value={role}
																className="flex capitalize"
															>
																{role}
																<div className="flex-grow" />
															</SelectItem>
														);
													})}
												</SelectGroup>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell>
										<div className="flex">
											<div>
												<Dialog>
													<DialogTrigger asChild>
														<Button
															variant="outline"
															size="icon"
															className="hover:bg-red-500"
														>
															<TrashIcon />
														</Button>
													</DialogTrigger>
													<DialogContent className="sm:max-w-[425px]">
														<DialogHeader>
															<DialogTitle>
																Are you sure you
																want to remove
																this user?
															</DialogTitle>
															<DialogDescription>
																{user.username}{" "}
																will no longer
																have access to
																this project and
																all their tasks
																will be
																unassigned. This
																cannot be
																undone.
															</DialogDescription>
														</DialogHeader>
														<div className="flex items-center space-x-2">
															<div className="grid flex-1 gap-2"></div>
														</div>

														<DialogFooter>
															<DialogClose
																asChild
															>
																<Button
																	type="button"
																	variant="secondary"
																>
																	Cancel
																</Button>
															</DialogClose>
															<DialogClose
																asChild
															>
																<Button
																	type="submit"
																	variant="destructive"
																	onClick={() =>
																		removeUserFromProject(
																			projectId,
																			user.userId,
																		)
																	}
																>
																	Delete{" "}
																	{
																		user.username
																	}
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
