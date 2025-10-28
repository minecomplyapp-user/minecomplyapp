// ECC specific default conditions extracted from ECCMonitoringScreen
import { Condition } from '../types/eccTypes';

// ECC specific default conditions extracted from ECCMonitoringScreen
export const DEFAULT_CONDITIONS: Condition[] = [
  {
    id: 1,
    title: 'Secure all necessary Permits from concerned agencies',
    options: [
      { value: 'complied', label: 'Complied', remark: 'All necessary permits are secured.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Some permits are secured while others are still being processed.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Still in the process of securing the necessary permits from concerned agencies.', color: '#ef4444' }
    ]
  },
  {
    id: 2,
    title: 'Condition 2',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Requirement met for condition 2.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 2 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 2 not started.', color: '#ef4444' }
    ]
  },
  {
    id: 3,
    title: 'Condition 3',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Requirement met for condition 3.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 3 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 3 not started.', color: '#ef4444' }
    ]
  },
  {
    id: 4,
    title: 'Condition 4',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Requirement met for condition 4.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 4 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 4 not started.', color: '#ef4444' }
    ]
  },
  {
    id: 5,
    title: 'Condition 5',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Requirement met for condition 5.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 5 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 5 not started.', color: '#ef4444' }
    ]
  },
  {
    id: 6,
    title: 'Condition 6',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Requirement met for condition 6.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 6 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 6 not started.', color: '#ef4444' }
    ]
  }
];

export const COMPLIANCE_CONDITIONS: Condition[] = [
  {
    id: '7a',
    title: 'Secure a PTO and Discharge Permit',
    options: [
      { value: 'complied', label: 'Complied', remark: 'PTO-OL-R01-2021-02801-R valid until 05/06/2026 and DP-R01-20-02099 valid until 09/01/2025. WWDP requirements for domestic wastewater are in process.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'PTO and Discharge Permit are secured, but renewal/application for WWDP requirements is ongoing', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Still in the process of securing PTO, Discharge Permit, and WWDP requirements', color: '#ef4444' }
    ]
  },
  {
    id: '7b',
    title: 'Condition 7b',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 7b fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 7b in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 7b not started.', color: '#ef4444' }
    ]
  },
  {
    id: '7c',
    title: 'Condition 7c',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 7c fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 7c in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 7c not started.', color: '#ef4444' }
    ]
  },
  {
    id: '7d',
    title: 'Condition 7d',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 7d fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 7d in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 7d not started.', color: '#ef4444' }
    ]
  },
  {
    id: '7e',
    title: 'Condition 7e',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 7e fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 7e in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 7e not started.', color: '#ef4444' }
    ]
  },
  {
    id: '7f',
    title: 'Condition 7f',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 7f fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 7f in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 7f not started.', color: '#ef4444' }
    ]
  },
  {
    id: '8',
    title: 'Condition 8',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 8 fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 8 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 8 not started.', color: '#ef4444' }
    ]
  },
  {
    id: '9',
    title: 'Condition 9',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 9 fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 9 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 9 not started.', color: '#ef4444' }
    ]
  },
  {
    id: '10',
    title: 'Condition 10',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 10 fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 10 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 10 not started.', color: '#ef4444' }
    ]
  },
  {
    id: '11',
    title: 'Condition 11',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 11 fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 11 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 11 not started.', color: '#ef4444' }
    ]
  },
  {
    id: '12',
    title: 'Condition 12',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 12 fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 12 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 12 not started.', color: '#ef4444' }
    ]
  },
  {
    id: '13',
    title: 'Condition 13',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 13 fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 13 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 13 not started.', color: '#ef4444' }
    ]
  },
  {
    id: '14',
    title: 'Condition 14',
    options: [
      { value: 'complied', label: 'Complied', remark: 'Condition 14 fully complied.', color: '#10b981' },
      { value: 'partial', label: 'Partially Complied', remark: 'Condition 14 in progress.', color: '#f59e0b' },
      { value: 'not', label: 'Not Complied', remark: 'Condition 14 not started.', color: '#ef4444' }
    ]
  }
];

export default {
  DEFAULT_CONDITIONS,
  COMPLIANCE_CONDITIONS,
};
