import { calculateMiles } from "../../src/services/miles-calculator-service";
import { calculateDistance } from "../../src/services/distances-calculator-service";
import { tripCalculateFactory } from "../factories/miles-unit-factory";
import { AffiliateStatus, ServiceClass, Trip } from "../../src/protocols";

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("../../src/services/distances-calculator-service", () => ({
  calculateDistance: jest.fn(),
}));

describe("calculateMiles Unit Testing", () => {
  let trip: Trip;
  beforeEach(() => {
    trip = tripCalculateFactory();
  });

  it("should return 0 miles when miles is true", () => {
    trip.miles = true;
    const miles = calculateMiles(trip);
    expect(miles).toBe(0);
  });

  it("should return miles with default values (ECONOMIC & BRONZE & no birthday)", () => {
    (calculateDistance as jest.Mock).mockReturnValue(100);
    const miles = calculateMiles(trip);
    expect(miles).toBe(100);
  });

  it("should return miles for different service classes and other default values", () => {
    (calculateDistance as jest.Mock).mockReturnValue(100);
    trip.service = ServiceClass.ECONOMIC_PREMIUM;
    const milesEconomicPremium = calculateMiles(trip);
    expect(milesEconomicPremium).toBe(125);

    trip.service = ServiceClass.EXECUTIVE;
    const milesExecutive = calculateMiles(trip);
    expect(milesExecutive).toBe(150);

    trip.service = ServiceClass.FIRST_CLASS;
    const milesFirstClass = calculateMiles(trip);
    expect(milesFirstClass).toBe(200);
  });

  it("should return miles for different affiliates and other default values", () => {
    (calculateDistance as jest.Mock).mockReturnValue(100);
    trip.affiliate = AffiliateStatus.BRONZE;
    const milesBronze = calculateMiles(trip);
    expect(milesBronze).toBe(100);

    trip.affiliate = AffiliateStatus.SILVER;
    const milesSilver = calculateMiles(trip);
    expect(milesSilver).toBe(110);

    trip.affiliate = AffiliateStatus.GOLD;
    const milesGold = calculateMiles(trip);
    expect(milesGold).toBe(125);

    trip.affiliate = AffiliateStatus.PLATINUM;
    const milesPlatinum = calculateMiles(trip);
    expect(milesPlatinum).toBe(150);
  });

  it("should return birthday bonus when date is in May", () => {
    (calculateDistance as jest.Mock).mockReturnValue(100);
    trip.date = "2025-05-15";
    const miles = calculateMiles(trip);
    expect(miles).toBe(110);
  });

  it("should return miles for FIRST_CLASS with GOLD affiliate and birthday bonus", () => {
    (calculateDistance as jest.Mock).mockReturnValue(100);
    trip.service = ServiceClass.FIRST_CLASS;
    trip.affiliate = AffiliateStatus.GOLD;
    trip.date = "2025-05-15";
    const miles = calculateMiles(trip);
    expect(miles).toBe(275);
  });

  it("should round correctly", () => {
    (calculateDistance as jest.Mock).mockReturnValue(123);
    trip.service = ServiceClass.ECONOMIC_PREMIUM;
    trip.affiliate = AffiliateStatus.GOLD;
    trip.date = "2025-05-15";
    const miles = calculateMiles(trip);
    expect(miles).toBe(211);
  });
});
