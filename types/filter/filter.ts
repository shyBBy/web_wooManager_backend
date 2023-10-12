export type FilterKey = keyof Filters;
export type FilterRecord = Record<FilterKey, string | number>;
export type FilterRecords = FilterRecord[];

export class Filters {
    name: string;
    model: string;
    yearOfProduction: string;
    isCurrentVehicleInspection: boolean;
    vehicleType: string;
}
