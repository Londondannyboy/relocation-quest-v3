// Create the destinations table for relocation.quest
// Run with: node scripts/create-destinations-table.mjs

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function createDestinationsTable() {
  console.log('Creating destinations table...');

  try {
    // Create the base destinations table
    await sql`
      CREATE TABLE IF NOT EXISTS destinations (
        slug TEXT PRIMARY KEY,
        country_name TEXT NOT NULL,
        flag TEXT NOT NULL DEFAULT '',
        region TEXT NOT NULL DEFAULT '',
        language TEXT DEFAULT '',
        hero_title TEXT DEFAULT '',
        hero_subtitle TEXT DEFAULT '',
        hero_image_url TEXT DEFAULT '',
        quick_facts JSONB DEFAULT '{}',
        highlights JSONB DEFAULT '[]',
        visas JSONB DEFAULT '[]',
        cost_of_living JSONB DEFAULT '{}',
        job_market JSONB DEFAULT '{}',
        faqs JSONB DEFAULT '[]',
        enabled BOOLEAN DEFAULT true,
        priority INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✓ Base destinations table created');

    // Add extended fields from migration 001
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS education_stats JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS company_incorporation JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS property_info JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS expatriate_scheme JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS residency_requirements JSONB DEFAULT '{}'
    `;
    console.log('✓ Extended fields (education, company, property, expatriate, residency) added');

    // Add comprehensive fields from migration 002
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS climate_data JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS crime_safety JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS healthcare JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS lifestyle JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS infrastructure JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS dining_nightlife JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS capital_overview JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS quality_of_life JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS currency_info JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS digital_nomad_info JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS comparison_highlights JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '{}'
    `;
    console.log('✓ Comprehensive fields (climate, crime, healthcare, lifestyle, etc.) added');

    // Add property market and education data fields
    await sql`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS property_market JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS education_data JSONB DEFAULT '{}'
    `;
    console.log('✓ Property market and education data fields added');

    // Create indexes for JSONB fields
    await sql`CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_destinations_enabled ON destinations(enabled)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_destinations_priority ON destinations(priority DESC)`;
    console.log('✓ Indexes created');

    // Verify table exists
    const result = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'destinations'
      ORDER BY ordinal_position
    `;
    console.log('\n✓ Table structure:');
    result.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    console.log('\n✓ Destinations table created successfully!');
    console.log('\nNext: Run migration scripts or seed data to populate the table.');

  } catch (error) {
    console.error('Error creating destinations table:', error);
    process.exit(1);
  }
}

createDestinationsTable();
