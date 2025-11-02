import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  additionalContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#BFDBFE',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 0,
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#DC2626',
    zIndex: 10,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  parameterHeader: {
    marginBottom: 8,
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#02217C',
  },
  parameterInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 16,
    borderRadius: 6,
    color: '#1E293B',
  },
  mmtSubSection: {
    marginTop: 16,
    marginBottom: 16,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#02217C',
  },
  mmtTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#02217C',
    marginBottom: 8,
  },
});