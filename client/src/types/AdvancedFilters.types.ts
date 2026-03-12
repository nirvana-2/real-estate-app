
export interface AdvancedFilters {
    minBedrooms: string;
    maxBedrooms: string;
    minBathrooms: string;
    maxBathrooms: string;
    minArea: string;
    maxArea: string;
    minYearBuilt: string;
    maxYearBuilt: string;
    minFloors: string;
    maxFloors: string;
}

export const defaultAdvancedFilters: AdvancedFilters = {
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    maxBathrooms: '',
    minArea: '',
    maxArea: '',
    minYearBuilt: '',
    maxYearBuilt: '',
    minFloors: '',
    maxFloors: '',
};