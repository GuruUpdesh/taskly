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

function UsersTable({ users }: { users: User[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Username</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.userId}>
						<TableCell>{user.username}</TableCell>
						<TableCell></TableCell>
						<TableCell>
							<button
								onClick={() => {
									throwClientError("Not implemented");
								}}
							>
								Delete
							</button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default UsersTable;
