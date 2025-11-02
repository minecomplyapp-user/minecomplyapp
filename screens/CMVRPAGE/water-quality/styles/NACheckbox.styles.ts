import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#02217C',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#EFF6FF',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
});