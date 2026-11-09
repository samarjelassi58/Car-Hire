const test = require("node:test");
const assert = require("node:assert/strict");
const { parseRentalDate, datesChevauchent } = require("../utils/dateUtils");

test("parseRentalDate accepts only real calendar dates in YYYY-MM-DD format", () => {
  assert.equal(parseRentalDate("2026-12-01").toISOString(), "2026-12-01T00:00:00.000Z");
  assert.equal(parseRentalDate("2026-02-30"), null);
  assert.equal(parseRentalDate("01-12-2026"), null);
});

test("datesChevauchent detects overlapping and adjacent inclusive date periods", () => {
  assert.equal(datesChevauchent(new Date("2026-12-01"), new Date("2026-12-05"), new Date("2026-12-05"), new Date("2026-12-08")), true);
  assert.equal(datesChevauchent(new Date("2026-12-01"), new Date("2026-12-03"), new Date("2026-12-04"), new Date("2026-12-08")), false);
});
