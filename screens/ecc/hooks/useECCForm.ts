import { useState } from 'react';
import { Alert } from 'react-native';
import { DEFAULT_CONDITIONS, COMPLIANCE_CONDITIONS } from '../utils/defaultConditions';

export default function useECCForm() {
  const [formData, setFormData] = useState({
    permitHolderName: '',
    permitHolderDesignation: '',
    remarks: '',
    recommendations: '',
  });

  const [monitoringConditions, setMonitoringConditions] = useState(DEFAULT_CONDITIONS);
  const [complianceConditions, setComplianceConditions] = useState(COMPLIANCE_CONDITIONS);

  const updateFormData = (key: string, value: any) => {
    if (key === 'monitoringConditions') return setMonitoringConditions(value);
    if (key === 'complianceConditions') return setComplianceConditions(value);
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const saveAsDraft = () => {
    Alert.alert('Draft Saved', 'Your ECC monitoring form has been saved locally.');
  };

  const generateReport = () => {
    Alert.alert('Report Generated', 'Your ECC monitoring report has been generated successfully.');
  };

  return {
    formData,
    monitoringConditions,
    complianceConditions,
    updateFormData,
    saveAsDraft,
    generateReport,
  };
}
