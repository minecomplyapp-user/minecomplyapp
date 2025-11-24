const buildGeneralInfo = () => ({
  companyName: "Test Mining Company",
  projectName: "Laoag River Aggregates Project",
  location: "Sitio Sta. Rosa, Brgy. San Miguel",
  region: "Region I (Ilocos)",
  province: "Ilocos Norte",
  municipality: "San Miguel",
  quarter: "1st",
  year: "2025",
  dateOfCompliance: "2025-03-31",
  monitoringPeriod: "2025-01-01 to 2025-03-31",
  dateOfCMRSubmission: "2025-04-15",
});

const buildPermitSections = () => ({
  eccInfo: {
    isNA: false,
    permitHolder: "First ECC Permit Holder",
    eccNumber: "ECC-2025-001",
    dateOfIssuance: "2025-01-15",
  },
  eccAdditionalForms: [
    {
      permitHolder: "Second ECC Permit Holder",
      eccNumber: "ECC-2025-002",
      dateOfIssuance: "2025-01-20",
    },
    {
      permitHolder: "Third ECC Permit Holder",
      eccNumber: "ECC-2025-003",
      dateOfIssuance: "2025-01-25",
    },
  ],
  isagInfo: {
    isNA: false,
    permitHolder: "First ISAG Holder",
    isagNumber: "ISAG-2025-001",
    dateOfIssuance: "2025-01-20",
    currentName: "Current Test Project",
    nameInECC: "Test Project in ECC",
    projectStatus: "Active",
    gpsX: "120.5678",
    gpsY: "18.1234",
    proponentName: "Test Proponent",
    proponentContact: "John Doe, CEO",
    proponentAddress: "456 Business Ave, San Miguel",
    proponentPhone: "+63-912-345-6789",
    proponentEmail: "test@mining.com",
  },
  isagAdditionalForms: [
    {
      permitHolder: "Second ISAG Holder",
      isagNumber: "ISAG-2025-002",
      dateOfIssuance: "2025-01-25",
    },
    {
      permitHolder: "Third ISAG Holder",
      isagNumber: "ISAG-2025-003",
      dateOfIssuance: "2025-01-30",
    },
  ],
  epepInfo: {
    isNA: false,
    permitHolder: "First EPEP Holder",
    epepNumber: "EPEP-2025-001",
    dateOfApproval: "2025-02-01",
  },
  epepAdditionalForms: [
    {
      permitHolder: "Second EPEP Holder",
      epepNumber: "EPEP-2025-002",
      dateOfApproval: "2025-02-05",
    },
    {
      permitHolder: "Third EPEP Holder",
      epepNumber: "EPEP-2025-003",
      dateOfApproval: "2025-02-10",
    },
  ],
  rcfInfo: {
    isNA: false,
    permitHolder: "First RCF Holder",
    savingsAccount: "RCF-1234-5678-90",
    amountDeposited: "500,000.00",
    dateUpdated: "2025-03-01",
  },
  rcfAdditionalForms: [
    {
      permitHolder: "Second RCF Holder",
      savingsAccount: "RCF-2345-6789-01",
      amountDeposited: "750,000.00",
      dateUpdated: "2025-03-05",
    },
    {
      permitHolder: "Third RCF Holder",
      savingsAccount: "RCF-3456-7890-12",
      amountDeposited: "1,000,000.00",
      dateUpdated: "2025-03-10",
    },
  ],
  mtfInfo: {
    isNA: false,
    permitHolder: "First MTF Holder",
    savingsAccount: "MTF-1234-5678-90",
    amountDeposited: "2,500,000.00",
    dateUpdated: "2025-03-01",
  },
  mtfAdditionalForms: [
    {
      permitHolder: "Second MTF Holder",
      savingsAccount: "MTF-2345-6789-01",
      amountDeposited: "3,000,000.00",
      dateUpdated: "2025-03-05",
    },
    {
      permitHolder: "Third MTF Holder",
      savingsAccount: "MTF-3456-7890-12",
      amountDeposited: "3,500,000.00",
      dateUpdated: "2025-03-10",
    },
  ],
  fmrdfInfo: {
    isNA: false,
    permitHolder: "First FMRDF Holder",
    savingsAccount: "FMRDF-1234-5678-90",
    amountDeposited: "1,500,000.00",
    dateUpdated: "2025-03-01",
  },
  fmrdfAdditionalForms: [
    {
      permitHolder: "Second FMRDF Holder",
      savingsAccount: "FMRDF-2345-6789-01",
      amountDeposited: "2,000,000.00",
      dateUpdated: "2025-03-05",
    },
    {
      permitHolder: "Third FMRDF Holder",
      savingsAccount: "FMRDF-3456-7890-12",
      amountDeposited: "2,500,000.00",
      dateUpdated: "2025-03-10",
    },
  ],
  mmtInfo: {
    isNA: false,
    contactPerson: "Jane Smith, MMT Head",
    mailingAddress: "789 Government St, Laoag City",
    phoneNumber: "+63-912-987-6543",
    emailAddress: "mmt@denr.gov",
  },
});

const buildExecutiveSummary = () => ({
  epepCompliance: {
    safety: true,
    social: true,
    rehabilitation: false,
  },
  epepRemarks:
    "Safety and social commitments are being followed. Rehabilitation needs improvement.",
  sdmpCompliance: "Complied",
  sdmpRemarks: "SDMP requirements are being met according to schedule.",
  complaintsManagement: {
    complaintReceiving: true,
    caseInvestigation: true,
    implementationControl: true,
    communicationComplainant: true,
    complaintDocumentation: true,
    naForAll: false,
  },
  complaintsRemarks:
    "Comprehensive complaints management system is in place and functioning well.",
  accountability: "Complied",
  accountabilityRemarks: "Mining engineer is properly registered and active.",
  othersSpecify: "",
  othersNA: true,
});

const buildProcessDocumentation = () => {
  const eccMmtAdditional = [
    "David Wilson - Regional Director",
    "Sarah Thompson - Compliance Officer",
    "Michael Brown - Technical Advisor",
  ];
  const epepMmtAdditional = [
    "Patricia Martinez - Safety Inspector",
    "James Anderson - Social Development Officer",
    "Jennifer Lee - Rehabilitation Specialist",
  ];
  const ocularMmtAdditional = [
    "Thomas White - Mining Engineer",
    "Elizabeth Harris - Geologist",
    "Christopher Martin - Environmental Scientist",
  ];

  return {
    processDocumentation: {
      dateConducted: "2025-03-15",
      sameDateForAll: true,
      eccMmtMembers: "John Smith - MMT Lead, Jane Doe - EMB Representative",
      epepMmtMembers:
        "Robert Johnson - EPEP Specialist, Maria Garcia - Community Rep",
      ocularMmtMembers:
        "Carlos Rodriguez - Site Inspector, Lisa Chen - Environmental Officer",
      ocularNA: false,
      methodologyRemarks:
        "Comprehensive site inspection covering operations, waste facilities, and rehabilitation areas.",
      siteValidationApplicable: "Yes",
      samplingDateConducted: "2025-03-16",
      samplingMmtMembers:
        "Dr. Thomas Anderson - Laboratory Lead, Lisa Martinez - Sample Coordinator",
      samplingMethodologyRemarks:
        "Water, soil, and air samples collected at designated monitoring points following DENR protocols.",
      eccMmtAdditional,
      epepMmtAdditional,
      ocularMmtAdditional,
    },
    eccMmtAdditional,
    epepMmtAdditional,
    ocularMmtAdditional,
  };
};

const buildComplianceProjectLocation = () => ({
  formData: {
    projectLocation: {
      label: "Project Location",
      specification: "Sitio Sta. Rosa, Brgy. San Miguel",
      remarks: "Within permitted boundaries",
      withinSpecs: true,
    },
    projectArea: {
      label: "Project Area (ha)",
      specification: "125.4",
      remarks: "As per approved ECC",
      withinSpecs: true,
    },
    capitalCost: {
      label: "Capital Cost (Php)",
      specification: "150000000",
      remarks: "Updated estimate",
      withinSpecs: true,
    },
    typeOfMinerals: {
      label: "Type of Minerals",
      specification: "Nickel",
      remarks: "Primary commodity",
      withinSpecs: null,
    },
    miningMethod: {
      label: "Mining Method",
      specification: "Open pit with staged rehabilitation",
      remarks: "Conforms to EPEP",
      withinSpecs: true,
    },
    production: {
      label: "Production",
      specification: "120000 tons/month",
      remarks: "Stable production",
      withinSpecs: null,
    },
    mineLife: {
      label: "Mine Life",
      specification: "15 years",
      remarks: "Estimated remaining life",
      withinSpecs: null,
    },
    mineralReserves: {
      label: "Mineral Reserves/ Resources",
      specification: "Measured: 2.5M tons",
      remarks: "Geological update 2024",
      withinSpecs: null,
    },
    accessTransportation: {
      label: "Access/ Transportation",
      specification: "Existing access road maintained",
      remarks: "No encroachment",
      withinSpecs: true,
    },
    powerSupply: {
      label: "Power Supply",
      specification: "On-grid with backup genset",
      remarks: "Verified via plant inspection",
      withinSpecs: true,
      subFields: [
        { label: "Plant:", specification: "2x 1MW genset" },
        { label: "Port:", specification: "Shared power line" },
      ],
    },
    miningEquipment: {
      label: "Mining Equipment",
      specification: "2x excavator, 3x haul trucks",
      remarks: "Maintained per SOP",
      withinSpecs: true,
      subFields: [
        { label: "Quarry/Plant:", specification: "1 crusher" },
        { label: "Port:", specification: "Conveyor system" },
      ],
    },
    workForce: {
      label: "Work Force",
      specification: "450 employees",
      remarks: "Includes contractors",
      withinSpecs: null,
      subFields: [{ label: "Employees:", specification: "450" }],
    },
    developmentSchedule: {
      label: "Development/ Utilization Schedule",
      specification: "Phase 2 development Q3 2025",
      remarks: "On schedule",
      withinSpecs: null,
    },
  },
  otherComponents: [
    {
      specification: "Waste Management Facility - Cell A",
      remarks: "Operational",
      withinSpecs: true,
    },
    {
      specification: "Sediment Pond - SP1",
      remarks: "Maintenance required",
      withinSpecs: false,
    },
    {
      specification: "Rehabilitation Plot - R1",
      remarks: "Planted with native species",
      withinSpecs: true,
    },
  ],
  uploadedImages: {},
  imagePreviews: {},
});

const buildImpactManagement = () => ({
  preConstruction: "yes",
  construction: "yes",
  quarryOperation: {
    title: "Quarry Operation",
    isNA: false,
    measures: [
      {
        id: "1",
        planned: "Dust suppression through water spraying",
        actualObservation:
          "Water spraying system operational, regular application observed",
        isEffective: "yes",
        recommendations:
          "Maintain current practices, consider additional coverage during dry season",
      },
      {
        id: "2",
        planned: "Progressive rehabilitation of mined-out areas",
        actualObservation:
          "Rehabilitation ongoing in Phase 1 area, native species planted",
        isEffective: "yes",
        recommendations:
          "Continue monitoring survival rates, expand to Phase 2",
      },
      {
        id: "3",
        planned: "Noise control through equipment maintenance",
        actualObservation:
          "Regular maintenance schedule followed, noise levels within limits",
        isEffective: "yes",
        recommendations: "No changes required, continue monitoring",
      },
    ],
  },
  plantOperation: {
    title: "Plant Operation",
    isNA: false,
    measures: [
      {
        id: "1",
        planned: "Air quality monitoring and emission controls",
        actualObservation:
          "Baghouse filters operational, emissions below standards",
        isEffective: "yes",
        recommendations:
          "Replace filters as scheduled, continue quarterly monitoring",
      },
      {
        id: "2",
        planned: "Wastewater treatment before discharge",
        actualObservation:
          "Treatment facility functioning, effluent meets DENR standards",
        isEffective: "yes",
        recommendations: "Maintain current treatment processes",
      },
      {
        id: "3",
        planned: "Solid waste segregation and disposal",
        actualObservation:
          "Segregation protocols followed, disposal records complete",
        isEffective: "yes",
        recommendations: "Continue waste audit program",
      },
    ],
  },
  portOperation: {
    title: "Port Operation",
    isNA: false,
    measures: [
      {
        id: "1",
        planned: "Marine water quality monitoring",
        actualObservation:
          "Monthly monitoring conducted, parameters within limits",
        isEffective: "yes",
        recommendations: "Expand monitoring points near coral reef areas",
      },
      {
        id: "2",
        planned: "Spill prevention and response procedures",
        actualObservation:
          "Spill kits positioned strategically, staff trained on response",
        isEffective: "yes",
        recommendations: "Conduct quarterly drills, update emergency contacts",
      },
      {
        id: "3",
        planned: "Dust control during loading operations",
        actualObservation:
          "Conveyor enclosures installed, minimal dust generation observed",
        isEffective: "yes",
        recommendations: "Inspect enclosures monthly for wear and tear",
      },
    ],
  },
  overallCompliance:
    "The mining operation demonstrates strong compliance with EIA commitments and EPEP requirements. All environmental impact control strategies are being effectively implemented across quarry, plant, and port operations.",
});

const buildAirQualityAssessment = () => ({
  quarry:
    "Water Sprinkling and imposition of speed limits minimize fugitive dust emissions at the quarry.",
  plant:
    "Regular water spraying and speed limits control dust at the plant site.",
  port: "Covered conveyors and misting reduce dust at the port.",
  quarryPlant:
    "Combined quarry and plant operations with comprehensive dust control measures.",
  table: {
    parameters: [
      {
        id: "1",
        parameter: "TSP",
        currentSMR: "3.54 µg/Ncm",
        previousSMR: "10.51 µg/Ncm",
        currentMMT: "-",
        previousMMT: "-",
        thirdPartyTesting: "",
        eqplRedFlag: "-",
        action: "-",
        limitPM25: "35 µg/Ncm",
        remarks: "ONRI - Sarrat Plant",
      },
      {
        id: "2",
        parameter: "PM10",
        currentSMR: "28.3 µg/Ncm",
        previousSMR: "32.1 µg/Ncm",
        currentMMT: "27.8 µg/Ncm",
        previousMMT: "31.9 µg/Ncm",
        thirdPartyTesting: "",
        eqplRedFlag: "None",
        action: "Continue monitoring",
        limitPM25: "60 µg/Ncm",
        remarks: "Port area - Good air quality",
      },
    ],
    dateTime: "November 18-21, 2024",
    weatherWind: "Sunny, prevailing wind from North-Northwest (N-NW)",
    explanation:
      "Confirmatory sampling conducted for validation across all monitored locations",
    overallCompliance: "All parameters within DENR standards",
  },
  uploadedEccFile: null,
  uploadedImage: null,
});

const buildWaterQualityAssessment = () => {
  const waterQuality = {
    locationInput: "",
    parameter: "TSS",
    resultType: "Month",
    tssCurrent: "18",
    tssPrevious: "6.2",
    mmtCurrent: "-",
    mmtPrevious: "-",
    isMMTNA: true,
    eqplRedFlag: "-",
    action: "-",
    limit: "150",
    remarks: "All monitoring stations within acceptable limits",
    dateTime: "June 27, 2025",
    weatherWind: "Sunny, light breeze from Northeast",
    explanation:
      "Confirmatory sampling conducted for validation of internal monitoring results",
    isExplanationNA: false,
    overallCompliance:
      "All water quality parameters are within DENR Class C standards",
    parameters: [
      {
        id: "wq-1",
        parameter: "pH",
        resultType: "Month",
        tssCurrent: "7.2",
        tssPrevious: "7.1",
        mmtCurrent: "7.25",
        mmtPrevious: "7.15",
        isMMTNA: false,
        eqplRedFlag: "-",
        action: "-",
        limit: "6.5-8.5",
        remarks: "pH levels stable and within range",
      },
    ],
  };

  const port = {
    locationInput: "",
    parameter: "Turbidity",
    resultType: "Month",
    tssCurrent: "12",
    tssPrevious: "14",
    mmtCurrent: "13",
    mmtPrevious: "15",
    isMMTNA: false,
    eqplRedFlag: "No",
    action: "Maintain dust suppression during loading",
    limit: "20",
    remarks: "Below threshold",
    dateTime: "June 29, 2025",
    weatherWind: "Clear, Light breeze",
    explanation: "Minor turbidity from loading activities",
    isExplanationNA: false,
    overallCompliance:
      "All port water quality parameters are within DENR standards",
    parameters: [],
  };

  return {
    quarry: "Station WQ-01 (Quarry settling pond effluent)",
    plant: "Station WQ-02 (Plant wastewater treatment outlet)",
    quarryPlant: "Mobile crusher operations with temporary water management",
    quarryEnabled: true,
    plantEnabled: true,
    quarryPlantEnabled: true,
    waterQuality,
    port,
    data: {
      quarryInput: "Station WQ-01 (Quarry settling pond effluent)",
      plantInput: "Station WQ-02 (Plant wastewater treatment outlet)",
      quarryPlantInput:
        "Mobile crusher operations with temporary water management",
      parameter: waterQuality.parameter,
      resultType: waterQuality.resultType,
      tssCurrent: waterQuality.tssCurrent,
      tssPrevious: waterQuality.tssPrevious,
      mmtCurrent: waterQuality.mmtCurrent,
      mmtPrevious: waterQuality.mmtPrevious,
      isMMTNA: waterQuality.isMMTNA,
      eqplRedFlag: waterQuality.eqplRedFlag,
      action: waterQuality.action,
      limit: waterQuality.limit,
      remarks: waterQuality.remarks,
      dateTime: waterQuality.dateTime,
      weatherWind: waterQuality.weatherWind,
      explanation: waterQuality.explanation,
      isExplanationNA: waterQuality.isExplanationNA,
      overallCompliance: waterQuality.overallCompliance,
    },
    parameters: waterQuality.parameters,
    ports: [],
  };
};

const buildNoiseQualityAssessment = () => ({
  hasInternalNoise: true,
  uploadedFiles: [],
  parameters: [
    {
      id: "1",
      parameter: "Quarry Blasting Operations",
      isParameterNA: false,
      currentInSMR: "78 dB(A)",
      previousInSMR: "80 dB(A)",
      mmtCurrent: "77 dB(A)",
      mmtPrevious: "79 dB(A)",
      redFlag: "No",
      isRedFlagChecked: false,
      action: "Continue noise monitoring near residential areas",
      isActionChecked: false,
      limit: "85 dB(A)",
      isLimitChecked: false,
    },
    {
      id: "2",
      parameter: "Crushing Plant Operations",
      isParameterNA: false,
      currentInSMR: "72 dB(A)",
      previousInSMR: "74 dB(A)",
      mmtCurrent: "71 dB(A)",
      mmtPrevious: "73 dB(A)",
      redFlag: "No",
      isRedFlagChecked: false,
      action: "Maintain acoustic barriers",
      isActionChecked: false,
      limit: "85 dB(A)",
      isLimitChecked: false,
    },
    {
      id: "3",
      parameter: "Haul Truck Traffic",
      isParameterNA: false,
      currentInSMR: "65 dB(A)",
      previousInSMR: "67 dB(A)",
      mmtCurrent: "64 dB(A)",
      mmtPrevious: "66 dB(A)",
      redFlag: "No",
      isRedFlagChecked: false,
      action: "Continue speed limits on haul roads",
      isActionChecked: false,
      limit: "75 dB(A)",
      isLimitChecked: false,
    },
  ],
  remarks: "All noise levels within DENR permissible limits",
  dateTime: "March 15, 2025, 11:00 AM - 3:00 PM",
  weatherWind: "Sunny, Wind speed 3-5 m/s from East",
  explanation:
    "Noise monitoring conducted at boundary and sensitive receptor locations",
  explanationNA: false,
  quarters: {
    first: "Average: 68 dB(A)",
    isFirstChecked: true,
    second: "Average: 70 dB(A)",
    isSecondChecked: true,
    third: "Average: 69 dB(A)",
    isThirdChecked: false,
    fourth: "",
    isFourthChecked: false,
  },
});

const buildWasteManagement = () => ({
  selectedQuarter: "Q2",
  quarryData: {
    noSignificantImpact: false,
    generateTable: true,
    N_A: false,
  },
  quarryPlantData: {
    typeOfWaste: "Overburden, Topsoil, Mine Tailings",
    eccEpepCommitments: [
      {
        id: "1",
        typeOfWaste: "Overburden, Topsoil, Mine Tailings",
        handling: "Segregated handling by type",
        storage: "Designated stockpile areas with erosion control",
        disposal: "Progressive backfilling and rehabilitation",
      },
      {
        id: "2",
        typeOfWaste: "Overburden, Topsoil, Mine Tailings",
        handling: "Use of covered trucks for transport",
        storage: "Temporary storage in lined containment",
        disposal: "Treatment before disposal",
      },
      {
        id: "3",
        typeOfWaste: "Overburden, Topsoil, Mine Tailings",
        handling: "Immediate containment of spills",
        storage: "Bunded storage areas",
        disposal: "Licensed disposal facility",
      },
    ],
    isAdequate: "YES",
    previousRecord: "2,450 tons",
    currentQuarterWaste: "2,680 tons",
  },
  plantSimpleData: {
    noSignificantImpact: false,
    generateTable: true,
    N_A: false,
  },
  plantData: {
    typeOfWaste: "Used oil, Filters, Scrap metal, Office waste",
    eccEpepCommitments: [
      {
        id: "1",
        typeOfWaste: "Used oil, Filters, Scrap metal, Office waste",
        handling: "Segregation at source",
        storage: "Designated waste storage shed",
        disposal: "Accredited TSD facility",
      },
      {
        id: "2",
        typeOfWaste: "Used oil, Filters, Scrap metal, Office waste",
        handling: "Containerized collection",
        storage: "Roofed and secured area",
        disposal: "Recycling facility",
      },
      {
        id: "3",
        typeOfWaste: "Used oil, Filters, Scrap metal, Office waste",
        handling: "Regular collection schedule",
        storage: "Separate biodegradable and non-biodegradable bins",
        disposal: "Municipal waste collection",
      },
    ],
    isAdequate: "YES",
    previousRecord: "850 liters (used oil), 12 tons (scrap)",
    currentQuarterWaste: "920 liters (used oil), 14 tons (scrap)",
  },
  portData: {
    noSignificantImpact: false,
    generateTable: true,
    N_A: false,
  },
  portPlantData: {
    typeOfWaste: "Bilge water, Oily rags, Packaging materials",
    eccEpepCommitments: [
      {
        id: "1",
        typeOfWaste: "Bilge water, Oily rags, Packaging materials",
        handling: "Spill containment protocols",
        storage: "Sealed drums in designated area",
        disposal: "Authorized waste hauler",
      },
      {
        id: "2",
        typeOfWaste: "Bilge water, Oily rags, Packaging materials",
        handling: "Immediate bagging and labeling",
        storage: "Secured hazmat storage",
        disposal: "TSD facility",
      },
      {
        id: "3",
        typeOfWaste: "Bilge water, Oily rags, Packaging materials",
        handling: "Segregation and compaction",
        storage: "Covered waste bins",
        disposal: "Recycling or proper disposal",
      },
    ],
    isAdequate: "YES",
    previousRecord: "180 liters (bilge), 0.5 tons (packaging)",
    currentQuarterWaste: "165 liters (bilge), 0.6 tons (packaging)",
  },
});

const buildChemicalSafety = () => ({
  chemicalSafety: {
    isNA: false,
    riskManagement: "YES",
    training: "YES",
    handling: "YES",
    emergencyPreparedness: "YES",
    remarks:
      "All chemical safety protocols are in place and being followed. Regular training conducted quarterly.",
    chemicalCategory: null,
    othersSpecify: "",
  },
  healthSafetyChecked: true,
  socialDevChecked: true,
});

const buildComplaints = () => [
  {
    id: "1",
    isNA: false,
    dateFiled: "January 15, 2025",
    filedLocation: "DENR",
    othersSpecify: "",
    nature: "Noise complaint from nearby residents during blasting operations",
    resolutions:
      "Adjusted blasting schedule to avoid early morning hours and provided advance notice to community.",
  },
  {
    id: "2",
    isNA: false,
    dateFiled: "February 20, 2025",
    filedLocation: "Others",
    othersSpecify: "LGU",
    nature: "Dust accumulation on crops near haul road reported by farmer",
    resolutions:
      "Increased water spraying frequency, installed additional dust suppressors, and compensated affected farmer.",
  },
  {
    id: "3",
    isNA: false,
    dateFiled: "March 5, 2025",
    filedLocation: "Others",
    othersSpecify: "Barangay",
    nature: "Request for road maintenance on access road used by mining trucks",
    resolutions:
      "Co-funded road repair with LGU and established a regular maintenance plan.",
  },
];

const buildRecommendations = () => ({
  prevQuarter: "4th",
  prevYear: "2024",
  currentRecommendations: {
    plant: {
      isNA: false,
      items: [
        {
          recommendation:
            "Upgrade baghouse filters to improve emission control efficiency",
          commitment: "Install new filters by end of Q3 2025",
          status: "",
        },
        {
          recommendation: "Implement real-time air quality monitoring system",
          commitment: "Deploy monitoring equipment by Q2 2025",
          status: "",
        },
        {
          recommendation:
            "Conduct quarterly training on waste segregation protocols",
          commitment: "Training sessions scheduled for all quarters",
          status: "",
        },
      ],
    },
    quarry: {
      isNA: false,
      items: [
        {
          recommendation: "Expand progressive rehabilitation to Phase 2 area",
          commitment: "Begin planting native species by June 2025",
          status: "",
        },
        {
          recommendation:
            "Install additional dust suppression misters at loading zones",
          commitment: "Complete installation by May 2025",
          status: "",
        },
        {
          recommendation: "Improve drainage system to prevent siltation",
          commitment: "Construct additional drainage channels by August 2025",
          status: "",
        },
      ],
    },
    port: {
      isNA: false,
      items: [
        {
          recommendation: "Upgrade marine water quality monitoring frequency",
          commitment: "Increase from monthly to bi-weekly sampling",
          status: "",
        },
        {
          recommendation: "Install covered conveyor system to reduce dust",
          commitment: "Project completion by Q4 2025",
          status: "",
        },
        {
          recommendation: "Conduct spill response drill with coast guard",
          commitment: "Quarterly drills starting Q2 2025",
          status: "",
        },
      ],
    },
  },
  previousRecommendations: {
    plant: {
      isNA: false,
      items: [
        {
          recommendation: "Repair cracks in wastewater treatment pond liner",
          commitment: "Complete repairs by Q1 2025",
          status: "Completed - Repairs finished January 2025",
        },
        {
          recommendation: "Update MSDS for all chemicals in use",
          commitment: "Review and update by Q4 2024",
          status: "Completed - MSDS updated December 2024",
        },
        {
          recommendation: "Install flow meters on effluent discharge lines",
          commitment: "Install by Q1 2025",
          status: "In Progress - Installation ongoing",
        },
      ],
    },
    quarry: {
      isNA: false,
      items: [
        {
          recommendation: "Stabilize haul road slopes to prevent erosion",
          commitment: "Stabilization works by Q4 2024",
          status: "Completed - Slopes reinforced November 2024",
        },
        {
          recommendation: "Replace aging water spraying system",
          commitment: "New system operational by Q1 2025",
          status: "Completed - System replaced February 2025",
        },
        {
          recommendation:
            "Conduct biodiversity monitoring in rehabilitation areas",
          commitment: "Quarterly monitoring starting Q1 2025",
          status: "Ongoing - First survey completed March 2025",
        },
      ],
    },
    port: {
      isNA: false,
      items: [
        {
          recommendation: "Repair damaged sections of pier decking",
          commitment: "Repairs by Q4 2024",
          status: "Completed - Repairs finished December 2024",
        },
        {
          recommendation: "Upgrade oil spill containment boom",
          commitment: "Purchase and deploy new boom by Q1 2025",
          status: "Completed - New boom deployed January 2025",
        },
        {
          recommendation: "Install CCTV cameras for security monitoring",
          commitment: "Install by Q1 2025",
          status: "In Progress - 50% installation complete",
        },
      ],
    },
  },
});

export const buildCmvrTestData = () => {
  const generalInfo = buildGeneralInfo();
  const permits = buildPermitSections();
  const executiveSummary = buildExecutiveSummary();
  const {
    processDocumentation,
    eccMmtAdditional,
    epepMmtAdditional,
    ocularMmtAdditional,
  } = buildProcessDocumentation();
  const complianceProjectLocation = buildComplianceProjectLocation();
  const impactManagement = buildImpactManagement();
  const airQuality = buildAirQualityAssessment();
  const waterQuality = buildWaterQualityAssessment();
  const noiseQuality = buildNoiseQualityAssessment();
  const wasteManagement = buildWasteManagement();
  const chemicalSafety = buildChemicalSafety();
  const complaints = buildComplaints();
  const recommendations = buildRecommendations();

  const report = {
    generalInfo,
    ...permits,
    executiveSummaryOfCompliance: executiveSummary,
    processDocumentationOfActivitiesUndertaken: processDocumentation,
    eccMmtAdditional,
    epepMmtAdditional,
    ocularMmtAdditional,
    complianceToProjectLocationAndCoverageLimits: complianceProjectLocation,
    complianceToImpactManagementCommitments: impactManagement,
    airQualityImpactAssessment: airQuality,
    waterQualityImpactAssessment: waterQuality,
    noiseQualityImpactAssessment: noiseQuality,
    complianceWithGoodPracticeInSolidAndHazardousWasteManagement:
      wasteManagement,
    complianceWithGoodPracticeInChemicalSafetyManagement: chemicalSafety,
    complaintsVerificationAndManagement: complaints,
    recommendationsData: recommendations,
    attendanceId: "sample-attendance-record-id",
  };

  const metadata = {
    fileName: "CMVR Test Report - Q1 2025",
    projectName: generalInfo.projectName,
  };

  return { metadata, report };
};
