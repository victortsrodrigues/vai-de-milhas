import { generateMilesForTrip, getMilesFromCode } from "../../src/services/miles-service";
import * as milesRepository from "../../src/repositories/miles-repository";
import * as milesCalculatorService from "../../src/services/miles-calculator-service";
import { faker } from "@faker-js/faker";
import { tripFactory } from "../factories/miles-unit-factory";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /miles miles-service Unit Testing", () => {
  it("should return miles for a trip", async () => {
    const {trip, miles: milesSpy} = tripFactory();
    jest.spyOn(milesRepository, "findMiles").mockResolvedValueOnce(null);
    jest
      .spyOn(milesCalculatorService, "calculateMiles")
      .mockReturnValueOnce(milesSpy);
    jest.spyOn(milesRepository, "saveMiles").mockResolvedValueOnce({
      id: 1,
      code: trip.code,
      miles: milesSpy,
    });

    const miles = await generateMilesForTrip(trip);
    expect(miles).toBe(milesSpy);
    expect(milesRepository.findMiles).toHaveBeenCalled();
    expect(milesRepository.saveMiles).toHaveBeenCalled();
    expect(milesCalculatorService.calculateMiles).toHaveBeenCalled();
    expect(milesCalculatorService.calculateMiles).toHaveBeenCalledWith(trip);
  });

  it("should throw conflict error when miles already registered", async () => {
    const {trip, miles: milesSpy} = tripFactory();
    jest.spyOn(milesRepository, "findMiles").mockResolvedValueOnce({
      id: 1,
      code: trip.code,
      miles: milesSpy,
    });
    const milesPromise = generateMilesForTrip(trip);
    expect(milesPromise).rejects.toEqual({
      type: "conflict",
      message: `Miles already registered for code ${trip.code}`,
    });
  });
});

describe("GET /miles/:code miles-service Unit Testing", () => {
  it("should return miles for a trip", async () => {
    const {trip, miles: milesSpy} = tripFactory();
    jest.spyOn(milesRepository, "findMiles").mockResolvedValueOnce({
      id: 1,
      code: trip.code,
      miles: milesSpy,
    });
    const miles = await getMilesFromCode(trip.code);
    expect(miles).toEqual({
      id: 1,
      code: trip.code,
      miles: milesSpy,
    });
    expect(milesRepository.findMiles).toHaveBeenCalled();
  });

  it("should throw not found error when miles not found", async () => {
    const code = faker.string.alphanumeric(6).toUpperCase();
    jest.spyOn(milesRepository, "findMiles").mockResolvedValueOnce(null);
    const milesPromise = getMilesFromCode(code);
    expect(milesPromise).rejects.toEqual({
      type: "not_found",
      message: `Miles not found for code ${code}`,
    });
  });
});
