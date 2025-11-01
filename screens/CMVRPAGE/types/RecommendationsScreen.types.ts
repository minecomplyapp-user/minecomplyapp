// RecommendationsScreen.types.ts
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import * as DocumentPicker from 'expo-document-picker';

export type RecommendationItem = {
  recommendation: string;
  commitment: string;
  status: string;
};

export type SectionData = {
  isNA: boolean;
  items: RecommendationItem[];
};

export type SectionKey = 'plant' | 'quarry' | 'port';

export type PickerItem = {
  label: string;
  value: string;
};

export type RootStackParamList = {
  AttendanceDetail: {
    record: {
      id: number;
      title: string;
      date: string;
    };
  };
  Recommendations: any;
};

export type RecommendationsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Recommendations'
>;

export type RecommendationsScreenRouteProp = RouteProp<
  RootStackParamList,
  'Recommendations'
>;
