/**
 * Update Cyprus Destination with Cost of Living Data
 *
 * Adds properly formatted city cost data for visualizations.
 * Run: node scripts/update-cyprus-costs.js
 */

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
}
loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Cyprus cost of living data for visualizations
const cyprusCostData = [
  {
    cityName: 'Limassol',
    rent1BRCenter: 1200,
    rent1BROutside: 900,
    rent3BRCenter: 2200,
    utilities: 120,
    groceries: 350,
    transportation: 80,
    dining: 250,
    costIndex: 58,
    currency: 'EUR'
  },
  {
    cityName: 'Paphos',
    rent1BRCenter: 900,
    rent1BROutside: 700,
    rent3BRCenter: 1600,
    utilities: 100,
    groceries: 320,
    transportation: 60,
    dining: 200,
    costIndex: 48,
    currency: 'EUR'
  },
  {
    cityName: 'Larnaca',
    rent1BRCenter: 850,
    rent1BROutside: 650,
    rent3BRCenter: 1500,
    utilities: 100,
    groceries: 310,
    transportation: 50,
    dining: 180,
    costIndex: 45,
    currency: 'EUR'
  },
  {
    cityName: 'Nicosia',
    rent1BRCenter: 1000,
    rent1BROutside: 750,
    rent3BRCenter: 1800,
    utilities: 110,
    groceries: 330,
    transportation: 70,
    dining: 200,
    costIndex: 52,
    currency: 'EUR'
  }
];

// Quality of life metrics
const cyprusQualityOfLife = {
  overall_score: 85,
  cost_of_living_index: 52,
  purchasing_power_index: 68,
  safety_index: 82,
  climate_index: 95,
  expat_friendly_index: 88,
  healthcare_index: 75,
  pollution_index: 22
};

// Job market data
const cyprusJobMarket = {
  topIndustries: ['Finance', 'Shipping', 'Tech/IT', 'iGaming', 'Tourism'],
  growingSectors: ['FinTech', 'PropTech', 'Cryptocurrency', 'Remote Work Services'],
  avgSalaryTech: 42000,
  in_demand_sectors: ['Software Development', 'Cybersecurity', 'Fund Administration', 'Digital Marketing'],
  avg_salaries: {
    'Software Developer': '€35,000 - €55,000',
    'Finance Manager': '€45,000 - €75,000',
    'Marketing Manager': '€30,000 - €45,000',
    'Customer Service': '€18,000 - €25,000'
  }
};

// Visas
const cyprusVisas = [
  {
    name: 'Digital Nomad Visa',
    type: 'work',
    description: 'For remote workers employed outside Cyprus',
    duration: '1 year, renewable up to 3 years',
    requirements: [
      'Proof of €3,500/month income',
      'Valid health insurance',
      'Clean criminal record',
      'Employment contract or business proof'
    ],
    processingTime: '4-6 weeks',
    cost: '€70-140'
  },
  {
    name: 'Permanent Residency (Fast-Track)',
    type: 'residency',
    description: 'Category F for property investors',
    duration: 'Permanent',
    requirements: [
      'Property investment of €300,000+',
      'Annual income of €30,000+ from abroad',
      'Clean criminal record',
      'Health insurance'
    ],
    processingTime: '2-3 months',
    cost: '€500'
  },
  {
    name: 'Pink Slip (Employment)',
    type: 'work',
    description: 'Standard work permit for employees',
    duration: '1 year, renewable',
    requirements: [
      'Job offer from Cyprus employer',
      'Employer sponsorship',
      'Relevant qualifications'
    ],
    processingTime: '4-8 weeks',
    cost: '€40'
  },
  {
    name: 'Self-Employment Visa',
    type: 'work',
    description: 'For entrepreneurs and freelancers',
    duration: '1 year, renewable',
    requirements: [
      'Business plan',
      'Proof of funds €30,000+',
      'Cyprus company registration'
    ],
    processingTime: '6-8 weeks',
    cost: '€140'
  }
];

// Quick facts
const cyprusQuickFacts = [
  { icon: '🌡️', label: 'Climate', value: '340 days sunshine' },
  { icon: '🇪🇺', label: 'EU Member', value: 'Since 2004' },
  { icon: '💶', label: 'Currency', value: 'Euro (€)' },
  { icon: '🗣️', label: 'English', value: 'Widely spoken' },
  { icon: '✈️', label: 'To London', value: '4.5 hours' },
  { icon: '👥', label: 'Population', value: '1.2 million' }
];

// Highlights
const cyprusHighlights = [
  { icon: '☀️', text: 'Mediterranean climate with 340+ days of sunshine' },
  { icon: '🏖️', text: 'Beautiful beaches and crystal-clear waters' },
  { icon: '💼', text: 'Favorable tax regime with non-dom status' },
  { icon: '🇪🇺', text: 'EU member state with English widely spoken' },
  { icon: '🏠', text: 'Affordable cost of living compared to Western Europe' },
  { icon: '🌐', text: 'Growing tech and finance hub' },
  { icon: '🛡️', text: 'Safe country with low crime rates' },
  { icon: '✈️', text: 'Strategic location between Europe, Middle East, and Africa' }
];

// FAQs
const cyprusFaqs = [
  {
    question: 'What is the 60-day rule in Cyprus?',
    answer: 'The 60-day rule allows individuals to become tax residents of Cyprus by spending just 60 days in the country, provided they meet certain conditions: not being tax resident elsewhere, having a Cyprus business/job, and owning or renting property.'
  },
  {
    question: 'What is non-dom status in Cyprus?',
    answer: 'Non-domiciled (non-dom) status exempts individuals from tax on dividends, interest, and rental income from abroad for 17 years. This makes Cyprus highly attractive for investors and entrepreneurs.'
  },
  {
    question: 'Is Cyprus good for digital nomads?',
    answer: 'Yes! Cyprus offers a Digital Nomad Visa for remote workers with €3,500/month income. The island has good internet, growing coworking spaces, a friendly expat community, and an excellent quality of life.'
  },
  {
    question: 'What is the cost of living in Cyprus?',
    answer: 'Monthly costs range from €1,500-2,500 in Paphos/Larnaca to €2,000-3,500 in Limassol. This includes rent, utilities, groceries, and entertainment. Cyprus is more affordable than Western Europe but pricier than some Eastern European destinations.'
  },
  {
    question: 'Do I need to speak Greek in Cyprus?',
    answer: 'No, English is widely spoken throughout Cyprus, especially in business, tourism, and expat areas. Most official documents are available in English, and daily life is manageable without Greek.'
  }
];

async function updateCyprus() {
  console.log('Updating Cyprus destination with visualization data...\n');

  try {
    // Check if Cyprus exists
    const existing = await sql`SELECT slug FROM destinations WHERE slug = 'cyprus'`;

    if (existing.length === 0) {
      console.log('Cyprus destination not found. Creating...');
      await sql`
        INSERT INTO destinations (
          slug, country_name, flag, region, language, enabled,
          hero_title, hero_subtitle,
          quick_facts, highlights, visas, cost_of_living,
          job_market, faqs, quality_of_life, priority
        ) VALUES (
          'cyprus', 'Cyprus', '🇨🇾', 'Europe', 'Greek, English', true,
          'Cyprus', 'Mediterranean island life with EU benefits',
          ${JSON.stringify(cyprusQuickFacts)}, ${JSON.stringify(cyprusHighlights)},
          ${JSON.stringify(cyprusVisas)}, ${JSON.stringify(cyprusCostData)},
          ${JSON.stringify(cyprusJobMarket)}, ${JSON.stringify(cyprusFaqs)},
          ${JSON.stringify(cyprusQualityOfLife)}, 8
        )
      `;
      console.log('✓ Created Cyprus destination');
    } else {
      console.log('Updating existing Cyprus destination...');
      await sql`
        UPDATE destinations SET
          country_name = 'Cyprus',
          flag = '🇨🇾',
          region = 'Europe',
          language = 'Greek, English',
          hero_title = 'Cyprus',
          hero_subtitle = 'Mediterranean island life with EU benefits',
          quick_facts = ${JSON.stringify(cyprusQuickFacts)},
          highlights = ${JSON.stringify(cyprusHighlights)},
          visas = ${JSON.stringify(cyprusVisas)},
          cost_of_living = ${JSON.stringify(cyprusCostData)},
          job_market = ${JSON.stringify(cyprusJobMarket)},
          faqs = ${JSON.stringify(cyprusFaqs)},
          quality_of_life = ${JSON.stringify(cyprusQualityOfLife)},
          priority = 8,
          enabled = true,
          updated_at = NOW()
        WHERE slug = 'cyprus'
      `;
      console.log('✓ Updated Cyprus destination');
    }

    // Verify
    const result = await sql`
      SELECT slug, country_name,
        jsonb_array_length(cost_of_living::jsonb) as city_count,
        jsonb_array_length(visas::jsonb) as visa_count
      FROM destinations WHERE slug = 'cyprus'
    `;

    if (result.length > 0) {
      console.log('\nVerification:');
      console.log(`  Country: ${result[0].country_name}`);
      console.log(`  Cities with cost data: ${result[0].city_count}`);
      console.log(`  Visa options: ${result[0].visa_count}`);
    }

    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateCyprus();
