# Pepa — Agentic Back-Office System for Real Estate

> Built solo during a competitive AI build challenge. Finished **Top 7**.

Pepa is a fully autonomous back-office agent for a real estate firm. 
It handles email triage, scheduling, market monitoring, lead matching, 
and weekly reporting — without human intervention.

## What it does

**Email & Scheduling**
- Reads incoming client emails, understands intent
- Drafts replies with 3 available slots pulled from Google Calendar
- After client confirms → creates calendar event + sends confirmation automatically

**Daily Market Intelligence**
- Every morning scrapes Sreality.cz for new listings
- Matches new properties against active buyer profiles in CRM
- Sends personalized briefing to each broker

**Weekly Executive Report**
- Every Monday pulls performance data from Supabase
- Generates charts via Python (Matplotlib)
- Creates a 3-slide Google Slides presentation via API
- Sends to management automatically

**Lead Matching**
- When a new property is listed → finds top 3 matching leads from database
- Suggests outreach with pre-drafted message

## Architecture
Client Email → Gmail Trigger → n8n Agent → Intent Classification
↓
Google Calendar API (free slots)
↓
GPT-4o (draft reply) → Human approval → Send

Sreality Scraper (Firecrawl) → n8n → Lead Matcher → Broker Briefing

Supabase (CRM data) → Python Charts → Google Slides API → Weekly Report

## Tech Stack

| Layer | Technology |
|---|---|
| Orchestration | n8n (4 autonomous workflows) |
| AI Model | GPT-4o-mini |
| Database | Supabase (PostgreSQL) |
| Frontend | Next.js 15, TypeScript, Tailwind |
| Scraping | Firecrawl API |
| Integrations | Gmail, Google Calendar, Google Slides API |
| Charts | Python (Matplotlib/Seaborn) |

## Live Demo

[pepa.coredesk.cz](https://pepa.coredesk.cz)

## Key decisions

**Why n8n over LangChain?** Visual workflow builder allows rapid iteration 
and easy handoff. Each workflow is independently testable and observable.

**Why GPT-4o-mini?** Cost-performance balance for high-frequency tasks 
(daily scraping, email triage). GPT-4o reserved for complex reasoning tasks.

**Human-in-the-loop by design** — agent drafts, human approves before sending. 
Critical for client-facing communications.
