import { Ionicons } from "@expo/vector-icons";

export interface ComplianceCheckboxSectionProps {
  sectionNumber: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  checked: boolean;
  onToggle: () => void;
}