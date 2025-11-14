import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 4,
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxOuterChecked: {
    backgroundColor: '#02217C',
    borderColor: '#02217C',
  },
  checkboxOuterDisabled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  checkboxOuterCheckedDisabled: {
    backgroundColor: '#CBD5E1',
    borderColor: '#CBD5E1',
  },
  label: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  labelDisabled: {
    color: '#9CA3AF',
  },
});