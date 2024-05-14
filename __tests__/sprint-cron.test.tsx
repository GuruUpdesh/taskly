/**
 * @jest-environment node
 */

import { instance, mock, reset, when } from "ts-mockito";

import { GET } from "../src/app/api/cron/sprint/route";
import { NextRequest } from "next/server";
import { Project, projects, sprints } from "../src/server/db/schema";
import { db } from "../src/server/db";
import { addDays, addWeeks, subMonths, subWeeks } from "date-fns";

jest.mock("../src/env.mjs", () => ({
	env: {
		DATABASE_URL: process.env.TEST_DATABASE_URL,
		CRON_SECRET: "mock-cron-secret",
		TESTING: true,
	},
}));

const mockedRequest: NextRequest = mock(NextRequest);

afterEach(async () => {
	reset(mockedRequest);
	await db.delete(projects);
	await db.delete(sprints);
});

describe("/api/cron/sprint", () => {
	const requestHeaders = new Headers();

	it("should return 401 if no authorization header", async () => {
		jest.setTimeout(5 * 1000);
		requestHeaders.set("authorization", "Bearer wrong-secret");
		when(mockedRequest.headers).thenReturn(requestHeaders);

		const response = await GET(instance(mockedRequest));
		expect(response.status).toBe(401);
	});

	it("should handle no projects", async () => {
		jest.setTimeout(5 * 1000);
		requestHeaders.set("authorization", "Bearer mock-cron-secret");
		when(mockedRequest.headers).thenReturn(requestHeaders);

		const response = await GET(instance(mockedRequest));
		expect(response.status).toBe(200);
		const body = await response.text();
		const results = JSON.parse(body);
		expect(results).toEqual({});
	});

	it("should create 2 sprints if there are 0", async () => {
		jest.setTimeout(5 * 1000);
		requestHeaders.set("authorization", "Bearer mock-cron-secret");
		when(mockedRequest.headers).thenReturn(requestHeaders);

		const startDate = new Date();
		const projectData = mockProject(startDate);
		await db.insert(projects).values(projectData);

		const response = await GET(instance(mockedRequest));
		const body = await response.text();
		const results = JSON.parse(body);

		expect(response.status).toBe(200);
		expect(results).toHaveProperty("1");
		expect(results[1]).toHaveLength(2);

		// verify sprints where correctly created
		const sprintsData = await db.select().from(sprints);
		expect(sprintsData).toHaveLength(2);
	});

	it("should create 1 sprint if current sprint is the last", async () => {
		jest.setTimeout(5 * 1000);
		requestHeaders.set("authorization", "Bearer mock-cron-secret");
		when(mockedRequest.headers).thenReturn(requestHeaders);

		const startDate = new Date();
		const projectData = mockProject(startDate);
		await db.insert(projects).values(projectData);

		const sprintData = {
			projectId: projectData[0].id,
			startDate: startDate,
			endDate: addWeeks(startDate, 2),
		};
		await db.insert(sprints).values(sprintData);

		const response = await GET(instance(mockedRequest));
		const body = await response.text();
		const results = JSON.parse(body);

		expect(response.status).toBe(200);
		expect(results).toHaveProperty("1");
		expect(results[1]).toHaveLength(1);

		// verify sprints where correctly created
		const sprintsData = await db.select().from(sprints);
		expect(sprintsData).toHaveLength(2);
	});

	it("should create 0 sprint if current sprint is second to last", async () => {
		jest.setTimeout(5 * 1000);
		requestHeaders.set("authorization", "Bearer mock-cron-secret");
		when(mockedRequest.headers).thenReturn(requestHeaders);

		const startDate = new Date();
		const projectData = mockProject(startDate);
		await db.insert(projects).values(projectData);

		const sprintData = [
			{
				projectId: projectData[0].id,
				startDate: startDate,
				endDate: addWeeks(startDate, 2),
			},
			{
				projectId: projectData[0].id,
				startDate: addWeeks(startDate, 2),
				endDate: addWeeks(startDate, 4),
			},
		];
		await db.insert(sprints).values(sprintData);

		const response = await GET(instance(mockedRequest));
		const body = await response.text();
		const results = JSON.parse(body);

		expect(response.status).toBe(200);
		expect(results).toHaveProperty("1");
		expect(results[1]).toHaveLength(0);

		// verify sprints still only have 2
		const sprintsData = await db.select().from(sprints);
		expect(sprintsData).toHaveLength(2);
	});

	it("should catch up to current sprint + 1 if there is a gap", async () => {
		jest.setTimeout(5 * 1000);
		requestHeaders.set("authorization", "Bearer mock-cron-secret");
		when(mockedRequest.headers).thenReturn(requestHeaders);

		const startDate = subMonths(new Date(), 3);
		const projectData = mockProject(startDate);
		await db.insert(projects).values(projectData);

		const sprintData = [
			{
				projectId: projectData[0].id,
				startDate: startDate,
				endDate: addWeeks(startDate, 2),
			},
			{
				projectId: projectData[0].id,
				startDate: addWeeks(startDate, 2),
				endDate: addWeeks(startDate, 4),
			},
		];
		await db.insert(sprints).values(sprintData);

		const response = await GET(instance(mockedRequest));
		const body = await response.text();
		const results = JSON.parse(body);
		expect(response.status).toBe(200);
		expect(results).toHaveProperty("1");
		expect(results[1]).toHaveLength(6);

		// verify sprints
		const sprintsData = await db.select().from(sprints);
		expect(sprintsData).toHaveLength(8);
	});

	it("should create 0 sprints if sprint start is in the future", async () => {
		jest.setTimeout(5 * 1000);
		requestHeaders.set("authorization", "Bearer mock-cron-secret");
		when(mockedRequest.headers).thenReturn(requestHeaders);

		const startDate = addDays(new Date(), 3);
		const projectData = mockProject(startDate);
		await db.insert(projects).values(projectData);

		const sprintData = [
			{
				projectId: projectData[0].id,
				startDate: startDate,
				endDate: addWeeks(startDate, 2),
			},
			{
				projectId: projectData[0].id,
				startDate: addWeeks(startDate, 2),
				endDate: addWeeks(startDate, 4),
			},
		];
		await db.insert(sprints).values(sprintData);

		const response = await GET(instance(mockedRequest));
		const body = await response.text();
		const results = JSON.parse(body);
		expect(response.status).toBe(200);
		expect(results).toHaveProperty("1");
		expect(results[1]).toHaveLength(0);

		// verify sprints
		const sprintsData = await db.select().from(sprints);
		expect(sprintsData).toHaveLength(2);
	});
});

function mockProject(date: Date): Project[] {
	return [
		{
			id: 1,
			name: "mock-project",
			sprintDuration: 2,
			sprintStart: date,
			description: null,
			image: null,
			color: "#000000",
			isAiEnabled: false,
			githubIntegrationId: null,
		},
	];
}
