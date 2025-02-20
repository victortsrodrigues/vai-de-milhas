import { faker } from "@faker-js/faker";
import {
  AffiliateStatus,
  Location,
  ServiceClass,
  Trip,
} from "../../src/protocols";

export function tripFactory() {
  const trip: Trip = {
    code: faker.string.alphanumeric(6).toUpperCase(),
    origin: generateRandomLocation(),
    destination: generateRandomLocation(),
    miles: faker.datatype.boolean(),
    plane: faker.airline.airplane().name,
    service: faker.helpers.enumValue(ServiceClass),
    affiliate: faker.helpers.enumValue(AffiliateStatus),
    date: faker.date.future().toISOString().split("T")[0], // Formats as YYYY-MM-DD
  };
  const miles = trip.miles ? 0 : faker.number.int({ min: 0, max: 500000 });
  return {
    trip,
    miles,
  };
}

function generateRandomLocation(): Location {
  return {
    lat: faker.location.latitude(),
    long: faker.location.longitude(),
  };
}

export function tripCalculateFactory() {
  const trip: Trip = {
    code: faker.string.alphanumeric(6).toUpperCase(),
    origin: generateRandomLocation(),
    destination: generateRandomLocation(),
    miles: false,
    plane: faker.airline.airplane().name,
    service: ServiceClass.ECONOMIC,
    affiliate: AffiliateStatus.BRONZE,
    date: "2025-07-15"
  };
  return trip;
}