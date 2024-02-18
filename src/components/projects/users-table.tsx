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

import { type UserRole, type User } from "~/server/db/schema";
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
interface UserWithRole extends User {
	userRole: UserRole;
}

const userRoles: UserRole[] = ["owner", "admin", "member"];

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
						<TableHead>Actions</TableHead>
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
															className="flex h-min items-center justify-between space-x-2 whitespace-nowrap rounded-sm border-0 p-2 px-3 text-sm text-red-500 ring-offset-background placeholder:text-muted-foreground focus:text-blue-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
															style={{
																background:
																	"none",
																border: "none",
															}}
														>
															<TrashIcon />
														</Button>
													</DialogTrigger>
													<DialogContent className="sm:max-w-[425px]">
														<DialogHeader>
															<DialogTitle>
																Are you sure you
																want to remove{" "}
																{user.username}{" "}
																from the
																Project?
															</DialogTitle>
															<DialogDescription>
																Warning, once
																this action is
																completed, it
																cannot be
																undone. Are you
																sure you want to
																remove{" "}
																{user.username}{" "}
																from the
																Project?
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
																	No
																</Button>
															</DialogClose>
															<DialogClose
																asChild
															>
																<Button
																	type="submit"
																	variant="default"
																	onClick={() =>
																		removeUserFromProject(
																			projectId,
																			user.userId,
																		)
																	}
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
