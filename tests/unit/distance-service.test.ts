import { calculateDistance } from "../../src/services/distances-calculator-service";
import { Location } from "../../src/protocols";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("calculateDistance Unit Testing", () => {
  const coords1: Location = { lat: 40.7128, long: -74.006 };
  const coords2: Location = { lat: 34.0522, long: -118.2437 };

  it("should return distance in miles", () => {
    const distance = calculateDistance(coords1, coords2, true);
    expect(distance).toBe(2446);
  });

  it("should return distance in km", () => {
    const distance = calculateDistance(coords1, coords2, false);
    expect(distance).toBe(3936);
  })
});