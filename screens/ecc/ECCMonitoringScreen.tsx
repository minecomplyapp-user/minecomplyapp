import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import useECCForm from './hooks/useECCForm';
import PermitHolderSection from './components/PermitHolderSection';
import MonitoringData from './components/MonitoringData';
import ComplianceSection from './components/ComplianceSection';
import RemarksSection from './components/RemarksSection';
import RecommendationsSection from './components/RecommendationsSection';
import ActionButtons from './components/ActionButtons';

export default function ECCMonitoringScreen() {
  const ecc = useECCForm();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Environmental Compliance Certificate (ECC) Monitoring Report</Text>

      <PermitHolderSection ecc={ecc} />
      <MonitoringData ecc={ecc} />
      <ComplianceSection ecc={ecc} />
      <RemarksSection ecc={ecc} />
      <RecommendationsSection ecc={ecc} />
      <ActionButtons ecc={ecc} />

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16 },
  header: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
    color: '#111827',
  },
});
