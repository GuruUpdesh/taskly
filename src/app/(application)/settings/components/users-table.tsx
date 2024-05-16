"use client";

import React from "react";

import { Icon } from "@radix-ui/react-select";
import { ChevronDown, Delete } from "lucide-react";

import { type UserWithRole } from "~/actions/application/project-actions";
import {
	editUserRole,
	removeUserFromProject,
} from "~/actions/settings/settings-actions";
import UserProfilePicture from "~/app/components/UserProfilePicture";
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Table,
	TableBody,
	TableHeader,
	TableHead,
	TableRow,
	TableCell,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { userRoles } from "~/server/db/schema";

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
		<div className="overflow-hidden rounded-lg border bg-background-dialog/50 py-2">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="font-bold text-primary">
							Member
						</TableHead>
						<TableHead className="font-bold text-primary">
							Role
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map(
						(user) =>
							user !== null && (
								<TableRow key={user.userId}>
									<TableCell className="px-4 py-1">
										<div className="flex items-center gap-4">
											<UserProfilePicture
												src={user.profilePicture}
												size={25}
											/>
											<span className="font-bold">
												{user.username}
											</span>
										</div>
									</TableCell>
									<TableCell
										className={cn("px-4 py-1", {
											"pointer-events-none opacity-50":
												user.userRole === "owner" ||
												user.userId === userId,
										})}
									>
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
											<SelectTrigger className="w-[180px] border-none bg-transparent p-0 capitalize">
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
									<TableCell
										className={cn("px-4 py-1", {
											"pointer-events-none opacity-50":
												user.userRole === "owner" ||
												user.userId === userId,
										})}
									>
										<div className="flex justify-end">
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant="secondary"
														size="sm"
														className="hover:bg-red-500"
													>
														<Delete className="mr-2 h-4 w-4" />
														Remove
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>
															Are you sure you
															want to remove this
															user?
														</DialogTitle>
														<DialogDescription>
															{user.username} will
															no longer have
															access to this
															project and all
															their tasks will be
															unassigned. This
															cannot be undone.
														</DialogDescription>
													</DialogHeader>
													<div className="flex items-center space-x-2">
														<div className="grid flex-1 gap-2"></div>
													</div>

													<DialogFooter>
														<DialogClose asChild>
															<Button
																type="button"
																variant="secondary"
															>
																Cancel
															</Button>
														</DialogClose>
														<DialogClose asChild>
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
																{user.username}
															</Button>
														</DialogClose>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										</div>
									</TableCell>
								</TableRow>
							),
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default UsersTable;
