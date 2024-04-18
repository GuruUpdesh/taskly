import { getTimeOfDay } from "~/utils/time";
import { getHours } from "date-fns";

test("getTimeOfDay returns the correct time of the day", () => {
    const currentHour = getHours(new Date());
    if (currentHour < 12) {
        expect(getTimeOfDay()).toBe("morning");
    } else if (currentHour < 18) {
        expect(getTimeOfDay()).toBe("afternoon");
    } else {
        expect(getTimeOfDay()).toBe("night");
    }
});

