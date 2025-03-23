import { FinancialRecord, EmergencyFundingAct } from '@/types/data';
import { v4 as uuidv4 } from 'uuid';

// List of emergency funding acts
const emergencyFundingActs: EmergencyFundingAct[] = [
  'CARES Act',
  'American Rescue Plan',
  'COVID-19 Supplemental',
  'Paycheck Protection Program',
  'Families First Coronavirus Response Act',
  'Other',
  'None'
];

// List of US states with their two-letter codes
const states = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];

// List of sample recipients
const recipients = [
  'Moderna, Inc.',
  'Pfizer, Inc.',
  'Johnson & Johnson',
  'AstraZeneca',
  'State of California Health Department',
  'New York State Department of Health',
  'Texas Health and Human Services Commission',
  'Florida Department of Health',
  'Mayo Clinic',
  'Johns Hopkins University',
  'University of California San Francisco',
  'Harvard Medical School',
  'Cleveland Clinic',
  'Quest Diagnostics',
  'LabCorp',
  'Abbott Laboratories',
  'Gilead Sciences',
  'Regeneron Pharmaceuticals',
  'Eli Lilly and Company',
  'Merck & Co.',
  'Novavax, Inc.',
  'CVS Health',
  'Walgreens Boots Alliance',
  'UnitedHealth Group',
  'McKesson Corporation',
  'AmerisourceBergen',
  'Cardinal Health',
  'Medtronic',
  'Siemens Healthineers',
  'Roche Diagnostics'
];

// List of sample HHS programs
const programs = [
  'COVID-19 Vaccine Development',
  'Emergency Medical Response',
  'Hospital Preparedness Program',
  'COVID-19 Testing Initiative',
  'COVID-19 Treatment Acceleration Program',
  'Public Health Emergency Preparedness',
  'Strategic National Stockpile',
  'Health Workforce Training',
  'Telehealth Network Grant Program',
  'Mental Health Services Block Grant',
  'Substance Abuse Prevention and Treatment',
  'Health Center Program',
  'Ryan White HIV/AIDS Program',
  'Maternal and Child Health Services',
  'Medical Reserve Corps',
  'Rural Health Outreach Program',
  'Biomedical Advanced Research and Development',
  'Hospital Infection Control',
  'Healthcare Systems Preparedness',
  'Provider Relief Fund'
];

// List of sample object classes
const objectClasses = [
  'Medical Supplies and Equipment',
  'Pharmaceuticals',
  'Personal Protective Equipment',
  'Laboratory Services',
  'Research and Development',
  'Testing Supplies',
  'Vaccination Distribution',
  'Personnel Services',
  'IT Systems and Services',
  'Healthcare Facility Support',
  'Emergency Response Equipment',
  'Administrative Support',
  'Training Services',
  'Transportation and Logistics',
  'Community Outreach'
];

/**
 * Generate a random number between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random date within a range
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Get a random item from an array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generates sample financial records for the dashboard
 */
export async function generateSampleData(): Promise<FinancialRecord[]> {
  // For simplicity, we'll simulate a delay to mimic an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const records: FinancialRecord[] = [];
  
  // Define date range (2020-2023 for COVID funding)
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2023-12-31');
  
  // Generate contract records
  for (let i = 0; i < 1899; i++) {
    const date = randomDate(startDate, endDate);
    const isAllocation = Math.random() > 0.2; // 80% are allocations, 20% are deallocations
    
    // Generate random amounts
    const obligationAmount = isAllocation 
      ? randomInt(100000, 10000000) 
      : -randomInt(50000, 2000000);
    
    // In most rows, only one financial column has a value
    const hasOutlay = Math.random() > 0.8; // Only 20% have both values
    const outlay = hasOutlay ? randomInt(50000, obligationAmount > 0 ? obligationAmount : 1000000) : 0;
    
    records.push({
      id: uuidv4(),
      source: 'contracts',
      recipient: randomItem(recipients),
      recipientState: randomItem(states).code,
      program: randomItem(programs),
      objectClass: randomItem(objectClasses),
      emergencyFunding: randomItem(emergencyFundingActs),
      obligationAmount,
      outlay,
      date: date.toISOString(),
      fiscalYear: date.getFullYear(),
      fiscalPeriod: Math.floor(date.getMonth() / 3) + 1
    });
  }
  
  // Generate financial assistance records
  for (let i = 0; i < 7610; i++) {
    const date = randomDate(startDate, endDate);
    const isAllocation = Math.random() > 0.15; // 85% are allocations, 15% are deallocations
    
    // Generate random amounts
    const obligationAmount = isAllocation 
      ? randomInt(500000, 50000000) 
      : -randomInt(100000, 5000000);
    
    // In most rows, only one financial column has a value
    const hasOutlay = Math.random() > 0.75; // Only 25% have both values
    const outlay = hasOutlay ? randomInt(100000, obligationAmount > 0 ? obligationAmount : 3000000) : 0;
    
    records.push({
      id: uuidv4(),
      source: 'assistance',
      recipient: randomItem(recipients),
      recipientState: randomItem(states).code,
      program: randomItem(programs),
      emergencyFunding: randomItem(emergencyFundingActs),
      obligationAmount,
      outlay,
      date: date.toISOString(),
      fiscalYear: date.getFullYear(),
      fiscalPeriod: Math.floor(date.getMonth() / 3) + 1
    });
  }
  
  return records;
} 