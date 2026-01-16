'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCopilotReadable } from '@copilotkit/react-core';
import { motion } from 'framer-motion';
import { PageContextProvider, CompactVoiceButton } from '@/components/voice';
import { HeroBanner } from '@/components/layout';
import { CostChart } from '@/components/mdx/CostChart';
import { QualityOfLifeRadar } from '@/components/mdx/QualityOfLifeRadar';

// Types
interface QuickFact {
  icon: string;
  label: string;
  value: string;
}

interface Highlight {
  icon?: string;
  text?: string;
}

interface Visa {
  name: string;
  type?: string;
  description?: string;
  duration?: string;
  requirements?: string[];
  processingTime?: string;
  cost?: string;
}

interface CostCity {
  cityName: string;
  rent1BRCenter?: number;
  rent1BROutside?: number;
  rent3BRCenter?: number;
  utilities?: number;
  groceries?: number;
  transportation?: number;
  dining?: number;
  costIndex?: number;
  currency?: string;
}

interface JobMarket {
  topIndustries?: string[];
  growingSectors?: string[];
  avgSalaryTech?: number;
  in_demand_sectors?: string[];
  avg_salaries?: Record<string, string>;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Destination {
  id: string;
  slug: string;
  country_name: string;
  flag: string;
  region: string;
  hero_title: string;
  hero_subtitle: string;
  hero_gradient: string;
  hero_image_url: string;
  language: string;
  quick_facts: QuickFact[];
  highlights: Highlight[];
  visas: Visa[];
  cost_of_living: CostCity[] | { currency: string; items: Array<{ category: string; item: string; cost: number; frequency: string }> };
  job_market: JobMarket;
  faqs: FAQ[];
}

interface DestinationClientProps {
  slug: string;
  destination: Destination;
}

// City Card Component
function CityCard({ city, flag }: { city: CostCity; flag: string }) {
  const monthlyTotal = (city.rent1BRCenter || 0) + (city.utilities || 0) + (city.groceries || 0) + (city.transportation || 0) + (city.dining || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl">{flag}</span>
          <h3 className="font-semibold text-white">{city.cityName}</h3>
          {city.costIndex && (
            <span className="ml-auto text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
              Cost Index: {city.costIndex}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-xs">1BR City Center</div>
            <div className="text-white font-semibold">€{city.rent1BRCenter?.toLocaleString()}/mo</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-xs">Utilities</div>
            <div className="text-white font-semibold">€{city.utilities}/mo</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-xs">Groceries</div>
            <div className="text-white font-semibold">€{city.groceries}/mo</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-xs">Dining Out</div>
            <div className="text-white font-semibold">€{city.dining}/mo</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg p-3 text-center">
          <div className="text-white/60 text-xs">Estimated Monthly Total</div>
          <div className="text-emerald-400 font-bold text-xl">€{monthlyTotal.toLocaleString()}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Visa Card Component
function VisaCard({ visa }: { visa: Visa }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 rounded-xl border border-white/10 p-4"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white">{visa.name}</h4>
        {visa.processingTime && (
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
            {visa.processingTime}
          </span>
        )}
      </div>
      {visa.description && (
        <p className="text-white/60 text-sm mb-3">{visa.description}</p>
      )}
      {visa.requirements && visa.requirements.length > 0 && (
        <ul className="space-y-1">
          {visa.requirements.slice(0, 3).map((req, i) => (
            <li key={i} className="text-xs text-white/70 flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              {req}
            </li>
          ))}
        </ul>
      )}
      {visa.cost && (
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-white/60 text-xs">Cost</span>
          <span className="text-amber-400 font-semibold">{visa.cost}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function DestinationClient({ slug, destination }: DestinationClientProps) {
  const [heroImage, setHeroImage] = useState(destination.hero_image_url);
  const [activeSection, setActiveSection] = useState<'overview' | 'cities' | 'visas' | 'jobs'>('overview');

  // Fetch Unsplash image if no hero image
  useEffect(() => {
    if (!destination.hero_image_url) {
      fetch(`/api/unsplash?query=${encodeURIComponent(destination.country_name + ' landscape')}&count=1`)
        .then(res => res.json())
        .then(data => {
          if (data.images?.[0]?.url) {
            setHeroImage(data.images[0].url);
          }
        })
        .catch(() => {});
    }
  }, [destination.country_name, destination.hero_image_url]);

  // Make destination data readable to CopilotKit
  useCopilotReadable({
    description: `Full destination data for ${destination.country_name}`,
    value: {
      country: destination.country_name,
      region: destination.region,
      highlights: destination.highlights,
      visas: destination.visas,
      costOfLiving: destination.cost_of_living,
      jobMarket: destination.job_market,
      faqs: destination.faqs,
    },
  });

  // Parse cost data for visualizations
  const costCities = Array.isArray(destination.cost_of_living)
    ? destination.cost_of_living as CostCity[]
    : [];

  const costChartItems = costCities[0] ? [
    { label: 'Rent (1BR Center)', amount: costCities[0].rent1BRCenter || 0 },
    { label: 'Groceries', amount: costCities[0].groceries || 0 },
    { label: 'Dining', amount: costCities[0].dining || 0 },
    { label: 'Utilities', amount: costCities[0].utilities || 0 },
    { label: 'Transport', amount: costCities[0].transportation || 0 },
  ] : [];

  const qualityMetrics = [
    { label: 'Climate', value: 92, icon: '☀️' },
    { label: 'Safety', value: 85, icon: '🛡️' },
    { label: 'Healthcare', value: 78, icon: '🏥' },
    { label: 'Internet', value: 88, icon: '📶' },
    { label: 'English', value: 90, icon: '🗣️' },
    { label: 'Cost', value: 75, icon: '💰' },
  ];

  return (
    <PageContextProvider pageSlug={`/destinations/${slug}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section with Voice Widget */}
        <div
          className="relative h-[40vh] min-h-[300px] bg-cover bg-center"
          style={{ backgroundImage: heroImage ? `url(${heroImage})` : undefined }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-slate-900" />

          {/* Breadcrumbs */}
          <div className="absolute top-4 left-4 z-10">
            <nav className="flex items-center gap-2 text-sm text-white/70">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/destinations" className="hover:text-white">Destinations</Link>
              <span>/</span>
              <span className="text-white">{destination.country_name}</span>
            </nav>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl">{destination.flag}</span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {destination.hero_title || destination.country_name}
                  </h1>
                  <p className="text-lg text-white/80 mt-1">
                    {destination.hero_subtitle}
                  </p>
                </div>
              </div>

              {/* Quick Facts Pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {destination.quick_facts?.slice(0, 4).map((fact, i) => (
                  <span key={i} className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white flex items-center gap-1">
                    <span>{fact.icon}</span>
                    <span>{fact.value}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Voice Widget */}
            <div className="hidden md:block">
              <CompactVoiceButton />
            </div>
          </div>
        </div>

        {/* Main Content: Split Panel */}
        <div className="flex flex-col lg:flex-row min-h-[60vh]">
          {/* Left Panel: CopilotKit Chat */}
          <div className="lg:w-1/2 xl:w-2/5 border-r border-white/10">
            <div className="sticky top-0 h-[60vh] lg:h-screen">
              <div className="h-full flex flex-col">
                <div className="bg-slate-800/50 border-b border-white/10 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>💬</span> Ask ATLAS about {destination.country_name}
                  </h2>
                  <p className="text-sm text-white/60">Get personalized advice on visas, costs, and more</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CopilotSidebar
                    labels={{
                      title: `ATLAS - ${destination.country_name}`,
                      initial: `Hi! I'm your ${destination.country_name} relocation expert. I can help you with:\n\n• Visa options and requirements\n• Cost of living breakdown\n• Best cities to live in\n• Job market insights\n• Tax benefits\n\nWhat would you like to know?`,
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Visualizations */}
          <div className="lg:w-1/2 xl:w-3/5 overflow-y-auto">
            {/* Section Tabs */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-white/10">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: '🌟' },
                  { id: 'cities', label: 'Cities', icon: '🏙️' },
                  { id: 'visas', label: 'Visas', icon: '📋' },
                  { id: 'jobs', label: 'Jobs', icon: '💼' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as typeof activeSection)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                      activeSection === tab.id
                        ? 'text-white border-b-2 border-amber-500'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Sections */}
            <div className="p-6 space-y-6">
              {activeSection === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Quality of Life */}
                  <QualityOfLifeRadar
                    title="Quality of Life"
                    country={destination.country_name}
                    flag={destination.flag}
                    metrics={qualityMetrics}
                    overallScore={85}
                  />

                  {/* Highlights */}
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Why {destination.country_name}?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {destination.highlights?.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-white/80">
                          <span className="text-emerald-400">{h.icon || '✓'}</span>
                          <span className="text-sm">{h.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  {costChartItems.length > 0 && (
                    <CostChart
                      title={`Monthly Costs in ${costCities[0]?.cityName || destination.country_name}`}
                      items={costChartItems}
                      currency="€"
                    />
                  )}
                </motion.div>
              )}

              {activeSection === 'cities' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white">
                    Popular Cities in {destination.country_name}
                  </h3>
                  <div className="grid gap-4">
                    {costCities.map((city, i) => (
                      <CityCard key={i} city={city} flag={destination.flag} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === 'visas' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-white">
                    Visa Options for {destination.country_name}
                  </h3>
                  <div className="grid gap-4">
                    {destination.visas?.map((visa, i) => (
                      <VisaCard key={i} visa={visa} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === 'jobs' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {destination.job_market?.topIndustries && (
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>🏢</span> Top Industries
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {destination.job_market.topIndustries.map((industry, i) => (
                          <span key={i} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {destination.job_market?.growingSectors && (
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>📈</span> Growing Sectors
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {destination.job_market.growingSectors.map((sector, i) => (
                          <span key={i} className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm">
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {destination.job_market?.avgSalaryTech && (
                    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-white/10 p-6 text-center">
                      <div className="text-white/60 text-sm">Average Tech Salary</div>
                      <div className="text-3xl font-bold text-amber-400">
                        €{destination.job_market.avgSalaryTech.toLocaleString()}/year
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* FAQs */}
              {destination.faqs && destination.faqs.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    {destination.faqs.map((faq, i) => (
                      <details key={i} className="bg-white/5 rounded-xl border border-white/10 group">
                        <summary className="p-4 cursor-pointer text-white font-medium flex items-center justify-between">
                          {faq.question}
                          <span className="text-white/40 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="px-4 pb-4 text-white/70 text-sm">{faq.answer}</div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContextProvider>
  );
}
