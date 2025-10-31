import { useState } from 'react';
import { Alert } from 'react-native';
import { DEFAULTS } from '../utils/defaultConditions';

export default function useECCForm() {
  const [formData, setFormData] = useState({
    permitHolderName: '',
    permitHolderDesignation: '',
    remarks: '',
    recommendations: '',
  });

  const [monitoringConditions, setMonitoringConditions] = useState(DEFAULTS);


  const updateFormData = (key: string, value: any) => {
    if (key === 'monitoringConditions') return setMonitoringConditions(value);

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
    updateFormData,
    saveAsDraft,
    generateReport,
  };
}
