/**
 * Multi-Track Curated Bank of Interview Questions for PM, SWE, and Scrum Master
 * Segmented by Seniority Levels: Junior (0-2 YOE), Mid-Level (3-5 YOE), Senior (6-9 YOE), Staff/Principal (10+ YOE), Director (15+ YOE)
 */

export const CURATED_INTERVIEW_QUESTIONS = [
  // =========================================================================
  // 1. PRODUCT MANAGER (PM) QUESTIONS (Junior to 15+ YOE Director)
  // =========================================================================
  
  // --- PM Junior / APM (0-2 YOE) ---
  {
    id: 'pm-pd-jr-1',
    track: 'pm',
    experienceLevel: 'Junior',
    category: 'product_design',
    title: 'Design a Frictionless Bill Split Feature for a Mobile Banking App',
    companyMatch: ['fintech', 'revolut', 'stripe', 'general'],
    question: 'Design an intuitive bill-splitting and group expense tracking feature inside a consumer mobile banking app. How would you design the user flow for inviting friends, settling debts via UPI/Debit, and sending gentle reminder nudges?',
    hints: [
      'Focus on the user journey: bill capture (OCR receipt scan vs manual), splitting evenly vs itemized, and settlement.',
      'Use the CIRCLES framework: Goals -> User Personas -> Pain Points -> 3 Solutions -> Trade-offs -> Metrics.'
    ],
    clarifications: [
      'Interviewer: Focus on young working professionals (ages 21-28) who eat out or travel in groups frequently.'
    ]
  },
  {
    id: 'pm-met-jr-1',
    track: 'pm',
    experienceLevel: 'Junior',
    category: 'metrics',
    title: 'Analyze a 12% Drop in User Signup-to-Activation Conversion',
    companyMatch: ['saas', 'notion', 'b2b', 'consumer'],
    question: 'Over the last 2 weeks, the signup-to-activation conversion rate on our web application dropped from 45% to 33%. How would you break down the funnel, isolate root causes across browser/device cohorts, and propose tests to recover the metric?',
    hints: [
      'Segment by traffic source (Organic vs Paid Ads), device type (Desktop vs Mobile Web), and country.',
      'Check recent frontend changes, auth flow modifications, or third-party SSO loading latencies.'
    ],
    clarifications: [
      'Interviewer: Activation is defined as a new user creating their first project within 24 hours of registration.'
    ]
  },

  // --- PM Mid-Level (3-5 YOE) ---
  {
    id: 'pm-pd-mid-1',
    track: 'pm',
    experienceLevel: 'Mid-Level',
    category: 'product_design',
    title: 'Design an AI Financial Wellness Assistant for Gig Workers',
    companyMatch: ['fintech', 'stripe', 'revolut', 'uber', 'general'],
    question: 'Design an AI-powered financial wellness and automated tax-saving assistant tailored specifically for gig economy workers (rideshare drivers, couriers, freelance creators). How would you differentiate it and measure sustained engagement?',
    hints: [
      'Think about income volatility, lack of employer tax withholding, and cash-flow predictability.',
      'Use the CIRCLES framework: Goals -> Personas -> Pain Points -> 3 Solutions -> Trade-offs -> Metrics.'
    ],
    clarifications: [
      'Interviewer: Assume you are building this for gig workers earning between $20k and $80k annually.'
    ]
  },
  {
    id: 'pm-met-mid-1',
    track: 'pm',
    experienceLevel: 'Mid-Level',
    category: 'metrics',
    title: 'Diagnose a 7% Drop in Global Checkout Completion Rate',
    companyMatch: ['stripe', 'fintech', 'shopify', 'amazon', 'ecommerce'],
    question: 'You are the Product Manager for core Checkout. Yesterday morning, your dashboard alerted you that Checkout Completion Rate dropped by 7% globally. Walk me through how you isolate, diagnose, and resolve this issue.',
    hints: [
      'Check data pipeline integrity first.',
      'Segment by payment rail (cards, Apple Pay), platform (iOS, Android, Web), country, and recent deployments.'
    ],
    clarifications: [
      'Interviewer: The drop started on Tuesday at 03:00 UTC and affects mobile web traffic predominantly.'
    ]
  },

  // --- PM Senior (6-9 YOE) ---
  {
    id: 'pm-prio-sr-1',
    track: 'pm',
    experienceLevel: 'Senior',
    category: 'prioritization',
    title: 'Prioritize Enterprise SAML/SSO vs Self-Serve Checkout vs Dispute Automation',
    companyMatch: ['fintech', 'saas', 'stripe', 'plaid', 'b2b'],
    question: 'You have a team of 6 engineers for Q3. Sales demands Enterprise SAML/SSO to close a $500k ARR deal, Customer Support demands automated dispute tooling to reduce 400 manual tickets/day, and Marketing wants a self-serve checkout revamp to drive viral acquisition. How do you evaluate and prioritize these competing initiatives?',
    hints: [
      'Use RICE (Reach, Impact, Confidence, Effort) or an Impact/Effort matrix.',
      'Explicitly discuss opportunity costs, phased MVP milestones, and alignment with company OKRs.'
    ],
    clarifications: [
      'Interviewer: The company OKR is reaching cash-flow positivity while retaining top enterprise accounts.'
    ]
  },
  {
    id: 'pm-est-sr-1',
    track: 'pm',
    experienceLevel: 'Senior',
    category: 'estimation',
    title: 'Estimate Annual Revenue of Stripe Payment Processing in the US',
    companyMatch: ['stripe', 'fintech', 'square', 'adyen'],
    question: 'Estimate the total annual gross revenue generated by Stripe for processing online e-commerce transactions for US merchants.',
    hints: [
      'Formula: US E-commerce GMV * Stripe Market Share * Stripe Take Rate.',
      'State all baseline assumptions clearly and finish with a sanity check against public fintech benchmarks.'
    ],
    clarifications: [
      'Interviewer: Focus on online card processing in the US for the current calendar year.'
    ]
  },

  // --- PM Group / Principal (10+ YOE) ---
  {
    id: 'pm-strat-10-1',
    track: 'pm',
    experienceLevel: 'Lead_Principal_10+',
    category: 'prioritization',
    title: 'Cannibalize an Existing $150M Cash-Cow SaaS to Launch a GenAI Native Platform',
    companyMatch: ['google', 'meta', 'stripe', 'notion', 'microsoft'],
    question: 'Your core legacy product generates $150M ARR with 85% gross margins, but is threatened by nimble GenAI-native startups. You need to launch a new GenAI-first product that will directly cannibalize 35% of your existing subscription base. How do you architect the multi-year migration roadmap, pricing transition, and stakeholder alignment without tanking public market valuation?',
    hints: [
      'Address the Innovator\'s Dilemma: pricing model transition (per-seat vs usage-based tokens), customer migration carrots vs sticks, and gross margin compression due to GPU inference costs.',
      'Define clear transition gates, beta opt-in cohorts, and board communication strategies.'
    ],
    clarifications: [
      'Interviewer: Enterprise customers have multi-year contracts that must be honored or upgraded seamlessly.'
    ]
  },
  {
    id: 'pm-beh-10-1',
    track: 'pm',
    experienceLevel: 'Lead_Principal_10+',
    category: 'behavioral',
    title: 'Aligning 5 Autonomous Engineering Orgs on a Unified API Platform Architecture',
    companyMatch: ['all', 'uber', 'meta', 'google', 'amazon'],
    question: 'Tell me about a time you led a cross-organizational initiative across 5 different VP product domains with conflicting roadmaps and intense political inertia to mandate a unified platform API standard. How did you build consensus without formal authority?',
    hints: [
      'Use the STAR method with focus on executive influence, creating shared incentives, RFC review processes, and clear governance councils.',
      'Highlight how you quantified the organizational cost of fragmentation (developer velocity, duplicate infrastructure).'
    ],
    clarifications: [
      'Interviewer: Focus on organizational psychology, negotiation, and measurable outcome.'
    ]
  },

  // --- PM Director / VP of Product (15+ YOE) ---
  {
    id: 'pm-exec-15-1',
    track: 'pm',
    experienceLevel: 'Director_VP_15+',
    category: 'prioritization',
    title: 'Post-M&A Product Integration and Portfolio Rationalization Across Global Markets',
    companyMatch: ['all', 'google', 'meta', 'stripe', 'amazon'],
    question: 'Following a $1.2 Billion cross-border acquisition of a competing European platform, you are tasked with rationalizing two redundant product suites with 800+ employees and overlapping enterprise clients across the US and EMEA. How do you structure the 3-year unified product vision, sunset timeline, brand consolidation, and talent retention strategy?',
    hints: [
      'Address customer churn risks, GDPR/compliance divergence, unified billing/auth migration, and cultural integration of engineering teams.',
      'Formulate a 30-60-90 day discovery plan followed by phased strangler integration.'
    ],
    clarifications: [
      'Interviewer: You are presenting this strategy to the Board of Directors and Executive Leadership Team.'
    ]
  },

  // =========================================================================
  // 2. SOFTWARE ENGINEER (SWE) QUESTIONS (Junior L3 to 15+ YOE Fellow)
  // =========================================================================
  
  // --- SWE Junior / Entry (0-2 YOE - L3) ---
  {
    id: 'swe-algo-jr-1',
    track: 'swe',
    experienceLevel: 'Junior',
    category: 'algorithms_ds',
    title: 'Implement an LRU Cache with O(1) Get and Put Operations',
    companyMatch: ['google', 'amazon', 'meta', 'apple', 'general'],
    question: 'Design and implement a Least Recently Used (LRU) Cache that supports `get(key)` and `put(key, value)` operations in strictly O(1) average time complexity. Explain your choice of data structures, how you handle capacity evictions, and potential edge cases with null/duplicate keys.',
    hints: [
      'Combine a Hash Map (for O(1) key lookup) with a Doubly Linked List (for O(1) node removal and head insertion).',
      'Explain why a simple Array or Queue is insufficient for O(1) updates.'
    ],
    clarifications: [
      'Interviewer: Single-threaded environment with positive integer capacity and non-negative values.'
    ]
  },
  {
    id: 'swe-api-jr-1',
    track: 'swe',
    experienceLevel: 'Junior',
    category: 'api_db_design',
    title: 'Design a RESTful User Profile & Notification Preferences API with SQLite/Postgres',
    companyMatch: ['general', 'stripe', 'shopify', 'netflix'],
    question: 'Design a clean RESTful API and relational database schema for a User Profile and Notification Preference service. Explain HTTP method conventions (POST vs PUT vs PATCH), request body validation, pagination for activity history, and foreign key constraints.',
    hints: [
      'Define standard routes: GET /api/v1/users/:id, PATCH /api/v1/users/:id/preferences.',
      'Explain HTTP 400 validation errors and compound indexes on (user_id, created_at).'
    ],
    clarifications: [
      'Interviewer: Focus on clean API contracts, HTTP status code accuracy, and schema normalization.'
    ]
  },

  // --- SWE Mid-Level (3-5 YOE - L4) ---
  {
    id: 'swe-dbg-mid-1',
    track: 'swe',
    experienceLevel: 'Mid-Level',
    category: 'code_quality',
    title: 'Diagnose N+1 Query Bottleneck and Concurrency Race Condition in Order Checkout',
    companyMatch: ['shopify', 'stripe', 'uber', 'amazon', 'general'],
    question: 'During flash sales, customers report intermittent over-selling of limited inventory items, and database CPU spikes to 100%. Code review reveals an N+1 query pattern in the cart loader and non-atomic check-then-act stock reduction. How do you refactor the code and SQL queries using database locks (Pessimistic vs Optimistic) or Redis atomic decrements?',
    hints: [
      'Explain `SELECT ... FOR UPDATE` vs Optimistic concurrency control with version column.',
      'Discuss `IN` clause batching or GraphQL dataloaders to eliminate N+1 queries.',
      'Address distributed caching with Redis DECR and rollback on failure.'
    ],
    clarifications: [
      'Interviewer: The service handles up to 5,000 checkout requests per second on popular items.'
    ]
  },
  {
    id: 'swe-algo-mid-1',
    track: 'swe',
    experienceLevel: 'Mid-Level',
    category: 'algorithms_ds',
    title: 'Design an In-Memory Rate Limiter with Sliding Window Counter',
    companyMatch: ['google', 'amazon', 'uber', 'meta', 'stripe'],
    question: 'Implement an in-memory Rate Limiter supporting multiple tiers (e.g. 100 requests per minute per IP address). Explain your data structure choice (Token Bucket vs Leaking Bucket vs Sliding Window Counter), and how you handle concurrent threads without excessive mutex lock contention.',
    hints: [
      'Analyze time and space complexity of Sliding Window Log vs Sliding Window Counter.',
      'Discuss Atomic integers, Redis ZSET / Lua scripts, and memory footprints per active client.'
    ],
    clarifications: [
      'Interviewer: The rate limiter runs in a multi-threaded web server environment handling 100k requests/sec.'
    ]
  },

  // --- SWE Senior (6-9 YOE - L5) ---
  {
    id: 'swe-sd-sr-1',
    track: 'swe',
    experienceLevel: 'Senior',
    category: 'system_design',
    title: 'Design a Distributed Real-Time Financial Ledger with Exactly-Once Semantics',
    companyMatch: ['stripe', 'fintech', 'google', 'uber', 'general'],
    question: 'Design a highly available, fault-tolerant distributed ledger and payment processing system that processes 50,000 write transactions per second with strict double-entry bookkeeping, ACID guarantees, and zero double-charging under network partitions.',
    hints: [
      'Discuss idempotency keys, distributed locks vs saga patterns, and database choice (PostgreSQL with sharding vs Spanner).',
      'Address two-phase commits vs Event Sourcing with Kafka.',
      'Walk through failure modes: what happens if the database crashes midway through debit/credit?'
    ],
    clarifications: [
      'Interviewer: Assume peak 50,000 write TPS, 99.999% availability, and maximum 100ms p99 latency.'
    ]
  },
  {
    id: 'swe-api-sr-1',
    track: 'swe',
    experienceLevel: 'Senior',
    category: 'api_db_design',
    title: 'Design an Enterprise Webhook Engine with Exponential Backoff and Dead Letter Queues',
    companyMatch: ['stripe', 'github', 'shopify', 'fintech', 'saas'],
    question: 'Design an API and database schema for an enterprise Webhook delivery platform delivering 50 million events daily. How do you guarantee at-least-once delivery, handle slow customer endpoints (up to 30s timeouts) without thread pool starvation, and prevent replay attacks?',
    hints: [
      'Detail tables for webhooks, subscriptions, and delivery attempts.',
      'Explain asynchronous worker queues (Kafka / SQS / Celery) with Dead Letter Queues (DLQ) and HMAC-SHA256 signature verification.'
    ],
    clarifications: [
      'Interviewer: Customer endpoints can be flaky, slow, or malicious.'
    ]
  },

  // --- SWE Staff / Tech Lead (10+ YOE - L6) ---
  {
    id: 'swe-sd-staff-1',
    track: 'swe',
    experienceLevel: 'Staff_10+',
    category: 'system_design',
    title: 'Architect a Multi-Region Active-Active Distributed Database with Conflict Resolution',
    companyMatch: ['netflix', 'google', 'meta', 'amazon', 'stripe'],
    question: 'Architect a global multi-region active-active deployment across US-East, EU-Central, and AP-East for a low-latency social feed and messaging application. How do you handle cross-region replication lag, write-conflict resolution (LWW vs CRDTs vs Vector Clocks), split-brain scenarios, and regulatory data residency (GDPR)?',
    hints: [
      'Evaluate CockroachDB / Google Cloud Spanner / DynamoDB Global Tables.',
      'Detail how to handle local reads < 10ms with async cross-region consensus, and how to route traffic via Anycast DNS during complete regional outage.'
    ],
    clarifications: [
      'Interviewer: Target SLA is 99.999% availability with automated sub-30s region failover.'
    ]
  },
  {
    id: 'swe-beh-staff-1',
    track: 'swe',
    experienceLevel: 'Staff_10+',
    category: 'swe_behavioral',
    title: 'Leading a Zero-Downtime Monolith to Event-Driven Microservices Migration',
    companyMatch: ['all', 'uber', 'meta', 'google', 'netflix'],
    question: 'Tell me about a multi-quarter engineering initiative where you led the decomposition of a brittle, mission-critical monolith into an event-driven microservice ecosystem serving millions of QPS with ZERO user-facing downtime. How did you ensure data consistency and manage team resistance?',
    hints: [
      'Detail the Strangler Fig pattern, Change Data Capture (CDC via Debezium/Kafka), shadow traffic validation, and rollback strategies.',
      'Explain how you aligned 40+ engineers across squads on RFC standards and domain-driven design boundaries.'
    ],
    clarifications: [
      'Interviewer: Focus on architectural depth, risk mitigation, and technical leadership.'
    ]
  },

  // --- SWE Principal / Fellow (15+ YOE - L7+) ---
  {
    id: 'swe-sd-princ-1',
    track: 'swe',
    experienceLevel: 'Principal_15+',
    category: 'system_design',
    title: 'Enterprise Multi-Cloud Disaster Recovery & Planetary Scale Infrastructure Governance',
    companyMatch: ['google', 'amazon', 'microsoft', 'apple', 'meta'],
    question: 'You are the Principal Systems Architect for a Fortune 50 cloud infrastructure supporting billions of daily transactions. Design a multi-cloud hybrid architecture (AWS + GCP + On-Prem) capable of surviving a catastrophic global outage of a primary cloud provider with RPO=0 (Zero data loss) and RTO < 5 minutes. Walk through state replication, BGP routing, and cryptographic key management.',
    hints: [
      'Discuss consensus across cloud providers (Raft/Paxos over dedicated WAN links), multi-cloud Kubernetes federation, distributed secret management (HashiCorp Vault across HSMs), and egress cost optimization.',
      'Analyze failure domains, cascading outages, and automated chaos engineering drills.'
    ],
    clarifications: [
      'Interviewer: Assume stateful transactional workloads with strict regulatory compliance.'
    ]
  },

  // =========================================================================
  // 3. SCRUM MASTER & AGILE COACH QUESTIONS (Junior to 12+ YOE Enterprise Lead)
  // =========================================================================
  
  // --- Scrum Master Junior (1-3 YOE) ---
  {
    id: 'sm-cer-jr-1',
    track: 'scrum_master',
    experienceLevel: 'Junior',
    category: 'ceremonies_facilitation',
    title: 'Facilitating an Engaging Daily Standup That Avoids Status Reporting',
    companyMatch: ['general', 'spotify', 'target', 'atlassian'],
    question: 'In your team, daily standups have turned into individual 2-minute status reports to the manager, where developers stop listening to each other. How do you re-energize the standup, refocus the team on the Sprint Goal, and identify blockers effectively in under 15 minutes?',
    hints: [
      'Shift focus from "What did I do yesterday?" to "Walk the board right-to-left" and "What can we swarm on to get ticket X to Done today?".',
      'Explain how to defer deep technical debugging into "Parking Lot / 16th minute" topics.'
    ],
    clarifications: [
      'Interviewer: The team has 6 developers and 1 QA engineer.'
    ]
  },

  // --- Scrum Master Mid-Level (5+ YOE) ---
  {
    id: 'sm-imp-mid-1',
    track: 'scrum_master',
    experienceLevel: 'Mid-Level_5+',
    category: 'conflict_impediment',
    title: 'Resolving Chronic Mid-Sprint Scope Creep and Missing Acceptance Criteria',
    companyMatch: ['all', 'fintech', 'enterprise', 'capitalone'],
    question: 'Halfway through a two-week sprint, your Product Owner regularly injects urgent stakeholder feature requests, while QA rejects 40% of completed tickets due to unstated acceptance criteria. How do you intervene as a Servant Leader to establish a strict Definition of Ready (DoR) and restore sprint predictability without alienating product leadership?',
    hints: [
      'Apply the 5 Whys and trade-off negotiations (swapping scope out vs creating emergency spikes).',
      'Facilitate a BDD (Given-When-Then) workshop between PO, Dev, and QA.'
    ],
    clarifications: [
      'Interviewer: Focus on collaborative coaching and protecting team focus.'
    ]
  },
  {
    id: 'sm-met-mid-1',
    track: 'scrum_master',
    experienceLevel: 'Mid-Level_5+',
    category: 'metrics_continuous_improvement',
    title: 'Diagnosing Bottlenecks Using Cumulative Flow Diagrams (CFD) and WIP Limits',
    companyMatch: ['jpmorgan', 'salesforce', 'atlassian', 'general'],
    question: 'Your team\'s velocity has fluctuated wildly over the last 6 sprints (ranging from 15 to 45 story points), and tickets spend an average of 8 days in the "Code Review / QA" column. How do you use Cumulative Flow Diagrams (CFD) and Lead Time histograms to demonstrate bottlenecks and introduce WIP (Work In Progress) limits?',
    hints: [
      'Explain how widening bands on a CFD indicate inventory buildup and context-switching waste.',
      'Propose pairing on code reviews, limiting WIP to max 2 items per developer, and holding swarming sessions.'
    ],
    clarifications: [
      'Interviewer: The engineering manager is skeptical of limiting work in progress.'
    ]
  },

  // --- Scrum Master Senior / Agile Coach (8+ YOE) ---
  {
    id: 'sm-team-sr-1',
    track: 'scrum_master',
    experienceLevel: 'Senior_8+',
    category: 'team_coaching',
    title: 'Coaching a Dominant Tech Lead and Transforming a Low-Trust Blame Culture',
    companyMatch: ['all', 'spotify', 'salesforce', 'atlassian'],
    question: 'You take over an engineering team where psychological safety is near zero: a dominant Tech Lead publicly criticizes junior mistakes in retrospectives, developers conceal bugs until release day, and morale is at an all-time low. Walk me through your 90-day coaching intervention using the GROW model to restore psychological safety, establish blameless post-mortems, and transition the Tech Lead into an empowering mentor.',
    hints: [
      'Use the GROW coaching model (Goal, Reality, Options, Will) in 1-on-1 sessions with the Tech Lead.',
      'Establish blameless retrospective prime directives, anonymous safety checks, and pairing rituals.'
    ],
    clarifications: [
      'Interviewer: The Tech Lead is a top individual contributor who fears losing control over code quality.'
    ]
  },
  {
    id: 'sm-scaled-sr-1',
    track: 'scrum_master',
    experienceLevel: 'Senior_8+',
    category: 'scaled_agile_leadership',
    title: 'De-Risking Cross-Team Dependencies for a High-Stakes Regulatory Deadline',
    companyMatch: ['enterprise', 'fintech', 'amazon', 'jpmorgan', 'spotify'],
    question: 'Your squad is one of four teams delivering a mandatory regulatory compliance update with a fixed legal launch date. Two upstream dependency squads are consistently 3 sprints behind schedule and blocking your testing. How do you facilitate cross-team alignment (Scrum of Scrums / Program Board) and negotiate architecture stubs to decouple delivery risk?',
    hints: [
      'Detail dependency mapping (Program Board), API contract stubs / mocking, and escalating systemic bottlenecks to Release Train / Leadership.',
      'Discuss de-scoping non-critical paths to guarantee compliance core by the fixed date.'
    ],
    clarifications: [
      'Interviewer: Assume standard scaled agile setup with cross-team dependencies.'
    ]
  },

  // --- Enterprise Agile Transformation Lead (12+ YOE) ---
  {
    id: 'sm-exec-12-1',
    track: 'scrum_master',
    experienceLevel: 'Enterprise_12+',
    category: 'scaled_agile_leadership',
    title: 'Transitioning a 1,500-Person Traditional Waterfall Organization to Value Stream Agility',
    companyMatch: ['all', 'jpmorgan', 'target', 'cisco', 'enterprise'],
    question: 'You are hired as the Head of Agile Transformation to lead a multi-year agile reorganization of a 1,500-person engineering organization stuck in rigid 12-month waterfall release cycles with heavy Project Management Office (PMO) governance. How do you design the Value Stream transformation, coach executive directors who resist letting go of Gantt charts, and measure true business agility without creating SAFe cargo-cult bureaucracy?',
    hints: [
      'Map Value Streams from customer request to production deployment to eliminate handoff delays.',
      'Coach leadership on outcome-based roadmaps (OKRs) instead of fixed output deadlines.',
      'Implement dual-track agile, automated CI/CD pipelines, and establish Communities of Practice (CoPs).'
    ],
    clarifications: [
      'Interviewer: Executive stakeholders demand governance and predictable quarterly budgets.'
    ]
  }
];

/**
 * Helper to get a curated question for a track, category, experienceLevel, role, and company
 */
export function getCuratedQuestionForTrack(track, category, role = '', company = '', experienceLevel = '') {
  let matching = CURATED_INTERVIEW_QUESTIONS.filter((q) => q.track === track);

  // Filter by category if available
  if (category) {
    const catFiltered = matching.filter((q) => q.category === category);
    if (catFiltered.length > 0) {
      matching = catFiltered;
    }
  }

  // Filter by experience level if available
  if (experienceLevel) {
    const levelFiltered = matching.filter((q) => q.experienceLevel === experienceLevel);
    if (levelFiltered.length > 0) {
      matching = levelFiltered;
    }
  }

  if (matching.length > 0) {
    const compLower = (company || '').toLowerCase();
    const roleLower = (role || '').toLowerCase();
    const tailored = matching.find((q) =>
      q.companyMatch.some((tag) => compLower.includes(tag) || roleLower.includes(tag))
    );
    return tailored || matching[Math.floor(Math.random() * matching.length)];
  }

  // Fallback to any question in track or first question
  const fallback = CURATED_INTERVIEW_QUESTIONS.find((q) => q.track === track);
  return fallback || CURATED_INTERVIEW_QUESTIONS[0];
}
