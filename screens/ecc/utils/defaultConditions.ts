export const DEFAULTS = [
  {
    id: "1",
    title: "Condition 1: Secure all necessary Permits from concerned agencies",
    descriptions: {
      complied: "All necessary permits are secured.",
      partial:
        "Some permits are secured while others are still being processed.",
      not: "Still in the process of securing the necessary permits from concerned agencies.",
    },
    isDefault: true,
  },
  {
    id: "1.1",
    title:
      "Condition 1.1: That this Certificate shall cover the extraction and processing of 70,000 cu. m. sand, gravel and boulders annually and the installation of 2 units of sand and gravel classifiers with a production capacity of 80 cu. m./ hr; confined within an applied area of 19.9999 ha.",
    descriptions: {
      complied:
        "The project complies with the approved extraction and processing limit of 70,000 cu. m. annually and ensures that only 2 units of sand and gravel classifiers with a maximum production capacity of 80 cu. m./hr are installed and operated within the applied area of 19.9999 hectares.",
      partial:
        "The proponent adheres to the set annual extraction and processing volume of 70,000 cu. m. and limits the installation of sand and gravel classifiers to 2 units with a production capacity of 80 cu. m./hr within the 19.9999-hectare applied area.",
      not: "Still in the process of securing the necessary requirements for ECC EIS category application for MPSA Contract.",
    },
    isDefault: true,
    parentId: "1",
  },
  {
    id: "1.2",
    title:
      "Condition 1.2: Submission of semi-annual Compliance Monitoring Report (CMR)",
    descriptions: {
      complied: "CMRs are regularly submitted.",
      partial: "CMRs are submitted with occasional delay or minor deficiency.",
      not: "Still in the process of completing and preparing the necessary reports for submission.",
    },
    isDefault: true,
    parentId: "1",
  },
  {
    id: "2",
    title:
      "Condition 2: Provision of adequate drainage system and soil erosion control measures",
    descriptions: {
      complied: "Adequate drainage system is constructed.",
      partial:
        "Partial drainage system and soil erosion control measures are in place, with improvements ongoing.",
      not: "Still in the process of establishing adequate drainage system and soil erosion control measures",
    },
    isDefault: true,
  },
  {
    id: "3",
    title:
      "Condition 3: Implementation of regular sanitary housekeeping practices, proper collection of solid and hazardous waste",
    descriptions: {
      complied:
        "Permit to transport application is in process. The permittee attended the Technical Conference on May 19, 2025 regarding NOV issued for non-compliance with the provisions of RA 6969 and commitments will be undertaken until June 15, 2025.",
      partial:
        "Regular sanitary housekeeping practices are in place, with proper collection of solid waste observed; hazardous waste management is partially complied with pending permit issuance.",
      not: "Still in the process of fully implementing regular sanitary housekeeping practices, proper collection, and hazardous waste management measures",
    },
    isDefault: true,
  },
  {
    id: "4",
    title:
      "Condition 4: Conduct of Tree Planting and submission of annual report (if applicable)",
    descriptions: {
      complied:
        "Tree planting is regularly conducted and annual report is submitted",
      partial:
        "Tree planting activities are conducted but annual report submission is delayed or incomplete",
      not: "Still in the process of conducting tree planting activities and preparing the annual report",
    },
    isDefault: true,
  },
  {
    id: "5",
    title: "Condition 5: Secure Tree Cutting Permit",
    descriptions: {
      complied: "Tree Cutting Permit is secured",
      partial: "Application for Tree Cutting Permit is in process",
      not: "No cutting of trees involved",
    },
    isDefault: true,
  },
  {
    id: "6",
    title:
      "Condition 6: Conduct of Information, Education & Communication (IEC) Campaign and submission of annual report of compliance (if applicable)",
    descriptions: {
      complied:
        "IEC is regularly conducted with report submitted to this Office",
      partial:
        "IEC is conducted but annual report submission is delayed or incomplete",
      not: "Still in the process of conducting IEC and preparing the annual report for submission",
    },
    isDefault: true,
  },

  // Condition 7 (parent) with subconditions 7a..7f (each subcondition is also a BaseCondition with parentId "7")
  {
    id: "7",
    title:
      "Compliance with the provisions of RA 8749, RA 9275, RA 9003 and RA 6969",
    descriptions: { complied: "", partial: "", not: "" },
    isDefault: true,
  },
  {
    id: "7a",
    title: "Condition 7a: Secure a PTO and Discharge Permit",
    descriptions: {
      complied:
        "PTO-OL-R01-2021-02801-R valid until 05/06/2026 and DP-R01-20-02099 valid until 09/01/2025. WWDP requirements for domestic wastewater are in process. The permittee attended the Technical Conference on May 19, 2025 regarding NOV issued for non-compliance with the provisions of RA 9275 and commitments will be undertaken until June 15, 2025",
      partial:
        "PTO and Discharge Permit are secured, but renewal/application for WWDP requirements is ongoing",
      not: "Still in the process of securing PTO, Discharge Permit, and WWDP requirements",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7b",
    title: "Condition 7b: Designate a PCO",
    descriptions: {
      complied: "With designated PCO. PCO accreditation renewal is in process",
      partial:
        "PCO is designated but accreditation has not yet been renewed/updated",
      not: "Still in the process of designating a PCO and securing accreditation",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7c",
    title: "Condition 7c: Registration as a HW Generator",
    descriptions: {
      complied: "OL-GR-R1-28-012653 issued on 12-14-2024",
      partial:
        "Registration as HW Generator is secured but renewal/validation is in process",
      not: "Still in the process of securing registration as HW Generator",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7d",
    title: "Condition 7d: Submission of SMR (if applicable)",
    descriptions: {
      complied: "SMRs are regularly and timely submitted",
      partial:
        "SMRs are submitted but with occasional delays or incomplete documentation",
      not: "Still in the process of preparing and submitting SMRs",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7e",
    title: "Condition 7e: Submission of ROLA (if applicable)",
    descriptions: {
      complied:
        "ROLA is regularly submitted and passed the DENR Effluent Standards",
      partial:
        "ROLA is submitted but with delay or has minor deficiencies in meeting the DENR Effluent Standards",
      not: "Still in the process of preparing and submitting ROLA",
    },
    isDefault: true,
    parentId: "7",
  },
  {
    id: "7f",
    title:
      "Condition 7f: Secure Permit to Transport (PTT) and submission of HW-Manifest and Certificate of Treatment (COT) (if applicable)",
    descriptions: {
      complied:
        "PTT requirements are still in process. The permittee attended the Technical Conference on May 19, 2025 regarding NOV issued for non-compliance with the provisions of RA 9275 and commitments will be undertaken until June 15, 2025",
      partial:
        "PTT and HW-Manifest are secured, but Certificate of Treatment (COT) is pending/partially complied with",
      not: "Still in the process of securing PTT, HW-Manifest, and COT",
    },
    isDefault: true,
    parentId: "7",
  },

  {
    id: "8",
    title:
      "Condition 8: Submission of report on the implemented mitigating measures and the corresponding cost of such activities",
    descriptions: {
      complied: "Included in the submitted CMRs",
      partial:
        "Report on mitigating measures is prepared but submission is delayed or incomplete",
      not: "Still in the process of preparing and submitting report on mitigating measures and corresponding costs",
    },
    isDefault: true,
  },
  {
    id: "9",
    title:
      "Condition 9: Conduct of Information, Education & Communication (IEC) Campaign and submission of annual report of compliance (if applicable)",
    descriptions: {
      complied:
        "IEC is regularly conducted with report submitted to this Office",
      partial:
        "IEC is conducted but annual report submission is delayed or incomplete",
      not: "Still in the process of conducting IEC and preparing the annual report for submission",
    },
    isDefault: true,
  },
  {
    id: "10",
    title:
      "Condition 10: Creation of Environmental Unit and designation of PCO",
    descriptions: {
      complied: "With designated PCO. PCO accreditation renewal is in process",
      partial:
        "Environmental Unit is organized but PCO accreditation is still pending/for renewal",
      not: "Still in the process of creating an Environmental Unit and designating a PCO",
    },
    isDefault: true,
  },
  {
    id: "11",
    title:
      "Condition 11: Submit abandonment plan in case of abandonment, 3 months prior abandonment",
    descriptions: {
      complied:
        "Abandonment plan is prepared and submitted 3 months prior to project abandonment",
      partial: "Abandonment plan is being prepared but not yet submitted",
      not: "The management has no plans of abandoning the project",
    },
    isDefault: true,
  },
  {
    id: "12",
    title:
      "Condition 12: Project expansion and/or construction of additional structures, change in location shall be subject to a new EIA",
    descriptions: {
      complied:
        "Still in the process of securing the necessary requirements for ECC EIS category application for MPSA Contract",
      partial:
        "Application for new EIA requirements is prepared but pending submission/approval",
      not: "No project expansion, additional structures, or change in location undertaken that requires a new EIA",
    },
    isDefault: true,
  },
  {
    id: "13",
    title: "Condition 13: Land clearing within the project description",
    descriptions: {
      complied: "Land area developed is within the project description",
      partial:
        "Land clearing activities are ongoing but still within the approved project description",
      not: "Still in the process of securing confirmation that land clearing activities are within the approved project description",
    },
    isDefault: true,
  },
  {
    id: "14",
    title:
      "Condition 14: Notify EMB in case of transfer of ownership within 15 days from the date of transfer",
    descriptions: {
      complied: "No transfer of ownership",
      partial:
        "Transfer of ownership occurred, EMB was notified within 15 days",
      not: "Transfer of ownership occurred, but EMB notification is still in process / delayed",
    },
    isDefault: true,
  },
];

export const COMPLIANCE_CONDITIONS = [
  { id: 1, condition: 'Solid Waste Management', compliant: false },
  { id: 2, condition: 'Wastewater Disposal', compliant: false },
  { id: 3, condition: 'Hazardous Waste Handling', compliant: false },
];