# Relocation Quest V3 - Product Requirements Document

> This is the **north star document**. All development decisions reference this PRD.

## Vision

An AI-powered relocation advisor (ATLAS) that helps people explore international destinations through conversational chat and voice, providing real data on visas, costs, taxes, and lifestyle factors.

## Problem Statement

People considering international relocation face information overload. Visa requirements, cost of living, tax implications, and lifestyle factors are scattered across government sites, expat forums, and outdated blog posts. There's no single source that:
- Provides structured, comparable data across destinations
- Answers follow-up questions conversationally
- Remembers user preferences and context
- Works via both text and voice

## Target Users

| User Type | Description | Primary Need |
|-----------|-------------|--------------|
| Digital Nomads | Remote workers seeking tax-friendly, visa-friendly destinations | Visa options, internet quality, cost of living |
| Expats/Retirees | People planning permanent international moves | Residency paths, healthcare, tax implications |
| Tax-Conscious Professionals | High earners exploring legal tax optimization | Corporate tax rates, NHR/Beckham Law programs |

## Core Features

### 1. Destination Explorer

**User Story**: As a potential relocator, I want to ask about any destination and see structured data so that I can quickly assess if it fits my needs.

**Acceptance Criteria**:
- [x] User can ask "Tell me about Portugal" and see destination card
- [x] Card shows: cost of living, visa options, highlights, quick facts
- [x] Data comes from Neon database (17 destinations)
- [x] Visual presentation with hero images and animations

### 2. Country Comparisons

**User Story**: As a potential relocator, I want to compare two destinations side-by-side so that I can make an informed choice.

**Acceptance Criteria**:
- [x] User can ask "Compare Portugal vs Spain"
- [x] Shows ComparisonTable with flags, costs, visa info
- [x] Highlights differences in key metrics
- [x] Supports focus areas: cost, visa, lifestyle

### 3. Cost of Living Breakdown

**User Story**: As a potential relocator, I want to see detailed monthly expenses so that I can budget accurately.

**Acceptance Criteria**:
- [x] User can ask "Show me cost breakdown for Lisbon"
- [x] Shows CostChart with rent, groceries, dining, transport, utilities
- [x] Visual bar chart format with animations
- [x] Currency displayed correctly per destination

### 4. Pros & Cons Analysis

**User Story**: As a potential relocator, I want to understand the trade-offs of each destination so that I can set realistic expectations.

**Acceptance Criteria**:
- [x] User can ask "Pros and cons of moving to Thailand"
- [x] Shows two-column ProsCons component
- [x] Pros pulled from destination highlights
- [x] Cons include common relocation challenges

### 5. Voice Interaction

**User Story**: As a user, I want to speak with ATLAS hands-free so that I can research while multitasking.

**Acceptance Criteria**:
- [ ] Hume EVI widget available on page
- [ ] Voice queries routed to same agent as chat (Single Brain)
- [ ] Responses streamed back as speech
- [ ] Low latency conversational experience

### 6. User Preferences

**User Story**: As a returning user, I want ATLAS to remember my preferences so that recommendations are personalized.

**Acceptance Criteria**:
- [x] User can mention budget, climate, purpose
- [x] Preferences saved and displayed as chips
- [ ] Preferences persist across sessions (requires Zep)
- [ ] Agent tailors recommendations based on preferences

### 7. Authentication

**User Story**: As a user, I want to create an account so that my preferences and history are saved.

**Acceptance Criteria**:
- [x] Sign up / sign in via Neon Auth
- [x] User avatar/menu component
- [x] Protected account settings page
- [ ] User ID passed to agent for personalization

## Non-Goals (Explicit Exclusions)

- **Booking/Reservations**: We don't book flights, accommodation, or visa appointments
- **Immigration Lawyer Matching**: We provide info, not legal advice or referrals
- **Property Listings**: No real estate search or rental integration
- **Job Board**: No job listings (that's fractional.quest)
- **Visa Applications**: We explain requirements, don't process applications

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TARGET ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐         ┌──────────────┐         ┌────────────┐ │
│   │   VERCEL     │         │   VERCEL     │         │  RAILWAY   │ │
│   │  (Next.js)   │         │  (Python)    │         │  (Python)  │ │
│   │              │         │  [Phase 2]   │         │  [Phase 2] │ │
│   │ Frontend     │ ──────► │  CLM for     │ ──────► │  Pydantic  │ │
│   │ + CopilotKit │         │  Hume Voice  │         │  AI Agent  │ │
│   │              │         │              │         │            │ │
│   └──────────────┘         └──────────────┘         └────────────┘ │
│          │                        ▲                       ▲        │
│          │                        │                       │        │
│          └────────────────────────┼───────────────────────┘        │
│                                   │                                 │
│                            ┌──────────────┐                        │
│                            │   HUME AI    │                        │
│                            │   (Voice)    │                        │
│                            │  [Phase 2]   │                        │
│                            └──────────────┘                        │
│                                                                      │
│   External Services:                                                │
│   ├── Neon PostgreSQL (Database) ✓                                 │
│   ├── Zep (Memory/Facts) [Phase 2]                                 │
│   └── Google AI / Gemini (LLM) ✓                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend | Next.js 15, React 19, TypeScript | SSR, App Router, modern React |
| UI Framework | Tailwind CSS, Framer Motion | Rapid styling, smooth animations |
| AI Chat | CopilotKit + Gemini adapter | Structured tool calls, generative UI |
| Agent | Pydantic AI (Phase 2) | Type-safe tools, AG-UI protocol |
| Database | Neon PostgreSQL | Serverless, branching, auth built-in |
| Voice | Hume EVI (Phase 2) | Low-latency emotional voice AI |
| Memory | Zep Cloud (Phase 2) | Conversation memory, user facts |
| Auth | Neon Auth (@neondatabase/auth) | Integrated with database |

### Key Integration Points

1. **Frontend ↔ Agent**: Currently CopilotKit Next.js runtime; target is AG-UI protocol to Railway
2. **Agent ↔ Database**: Direct PostgreSQL queries via asyncpg
3. **Voice ↔ Agent**: CLM endpoint (OpenAI-compatible SSE streaming)
4. **Memory ↔ Agent**: Zep Cloud for conversation history and user facts

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Destinations covered | 20+ | Count in database |
| Query response time | <3s | Measure API latency |
| Voice response latency | <1s | Hume dashboard metrics |
| User return rate | 30%+ | Auth + analytics |

## Milestones

### Phase 1: MVP (COMPLETE)
- [x] Next.js 15 project setup
- [x] CopilotKit integration with Gemini
- [x] Neon database with 17 destinations
- [x] MDX component library (ComparisonTable, CostChart, ProsCons, InfoCard)
- [x] show_destination, save_preferences, generate_custom_view actions
- [x] Neon Auth integration
- [x] Deploy to Vercel

### Phase 2: Voice & Agent (IN PROGRESS)
- [ ] Deploy Pydantic AI agent to Railway
- [ ] Connect frontend to Railway agent (replace built-in runtime)
- [ ] Implement CLM endpoint for Hume voice
- [ ] Enable Hume voice widget
- [ ] Migrate tools from frontend to agent
- [ ] Add Zep memory integration

### Phase 3: Scale & Polish
- [ ] Add more destinations (target: 50)
- [ ] Implement user fact extraction and storage
- [ ] Add visa timeline visualizations
- [ ] Performance optimization
- [ ] Mobile-responsive voice UX

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Railway cold starts | Medium | Medium | Keep-alive pings, optimize startup |
| Hume SSE format issues | Medium | High | Thorough CLM testing, fallback to chat |
| Destination data staleness | High | Medium | Regular data updates, source citations |
| Voice misunderstanding queries | Medium | Medium | Robust entity extraction, confirmation UI |

## Open Questions

- [x] Use CopilotKit built-in runtime or separate agent? → Target: separate agent
- [ ] How to handle destinations not in database? → Fallback to web search?
- [ ] Should voice and chat share exact same prompt? → Yes (Single Brain principle)
- [ ] How to cite sources for visa/tax information? → TBD

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-01-13 | Initial project setup, Phase 1 complete | Dan |
| 2026-01-15 | PRD filled out from codebase analysis | Claude |
