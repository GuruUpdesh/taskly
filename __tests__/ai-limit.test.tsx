import { timeTillNextReset } from '../src/config/aiLimit';
import { advanceTo, clear } from 'jest-date-mock';

describe("ai limit > timeTillNextReset", () => {
    afterEach(() => {
        clear();
    });

    test('calculates time correctly just before midnight', () => {
        // Set the time to 23:59 UTC
        advanceTo(new Date(Date.UTC(2024, 0, 1, 23, 59, 0)));
        expect(timeTillNextReset()).toBe(1);
    });

    test('calculates time correctly just after midnight', () => {
        // Set the time to 00:01 UTC
        advanceTo(new Date(Date.UTC(2024, 0, 2, 0, 1, 0)));
        expect(timeTillNextReset()).toBe(24);
    });

    test('calculates time correctly at noon', () => {
        // Set time to 12:00 UTC
        advanceTo(new Date(Date.UTC(2024, 0, 1, 12, 0, 0)));
        expect(timeTillNextReset()).toBe(12);
    });

    test('returns 0 hours at exactly midnight', () => {
        // Set time to exactly midnight
        advanceTo(new Date(Date.UTC(2024, 0, 2, 0, 0, 0)));
        expect(timeTillNextReset()).toBe(0);
    });
});
