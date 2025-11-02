import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    shadowColor: "#02217C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  portHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  portLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    marginRight: 5,
  },
  portLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#02217C',
  },
  portInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#F8FAFC',
    fontSize: 13,
  },
  deletePortButton: {
    marginLeft: 10,
  },
  internalMonitoringContainer: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  internalMonitoringTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#02217C',
    marginBottom: 12,
  },
  parameterFormWrapper: {
    // Wrapper to contain ParameterForm content
  },
  mmtSubSection: {
    marginTop: 16,
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
  addParameterButton: {
    backgroundColor: "#EFF6FF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  addParameterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#02217C",
  },
});