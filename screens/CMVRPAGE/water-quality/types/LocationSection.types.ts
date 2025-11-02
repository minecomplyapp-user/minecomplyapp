export type LocationState = {
  quarry: boolean;
  plant: boolean;
  quarryPlant: boolean;
};
export type LocationSectionProps = {
  selectedLocations: LocationState;
  quarryInput: string;
  plantInput: string;
  quarryPlantInput: string;
  onLocationToggle: (location: keyof LocationState) => void;
  onInputChange: (field: string, value: string) => void;
};