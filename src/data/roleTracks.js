/**
 * Comprehensive Track Definitions for PM, SWE, and Scrum Master
 * Integrated with Ant Design Icons
 */

export const ROLE_TRACKS = {
  pm: {
    id: 'pm',
    label: 'Product Manager (PM)',
    shortLabel: 'PM Track',
    badgeClass: 'badge-track-pm',
    iconType: 'AppstoreOutlined',
    description: 'Master Product Design, Metrics, TAM Sizing, Prioritization, and Behavioral interview loops.',
    barRaiserTitle: 'Principal Director of Product Management & Bar Raiser',
    defaultRole: 'PM at a fintech company',
    defaultCompany: 'Stripe',
    rolePresets: [
      'PM at a fintech company',
      'Senior PM - Core Payments',
      'Growth PM - B2B SaaS',
      'AI / GenAI Product Manager',
      'Consumer Product Manager',
      'Platform & Infrastructure PM'
    ],
    companyPresets: [
      'Stripe',
      'Google',
      'Uber',
      'Airbnb',
      'Meta',
      'Revolut',
      'Notion',
      'Amazon'
    ],
    categories: [
      {
        id: 'product_design',
        label: 'Product Design & UX',
        color: 'var(--cat-design)',
        bgColor: 'var(--cat-design-bg)',
        badgeClass: 'badge-design',
        iconType: 'AppstoreOutlined',
        frameworkTip: 'Use CIRCLES Method. Define goal, user segments, pain points, solutions, and trade-offs.',
        timeTargetMinutes: 5,
        defaultTemplateId: 'circles'
      },
      {
        id: 'metrics',
        label: 'Metrics & Analytics',
        color: 'var(--cat-metrics)',
        bgColor: 'var(--cat-metrics-bg)',
        badgeClass: 'badge-metrics',
        iconType: 'RiseOutlined',
        frameworkTip: 'Define North Star + input metrics + guardrails. For drops, segment by cohorts.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'metrics_root_cause'
      },
      {
        id: 'estimation',
        label: 'Estimation & Sizing',
        color: 'var(--cat-estimation)',
        bgColor: 'var(--cat-estimation-bg)',
        badgeClass: 'badge-estimation',
        iconType: 'CalculatorOutlined',
        frameworkTip: 'State clear assumptions. Use top-down or bottom-up arithmetic and sanity check.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'market_sizing'
      },
      {
        id: 'prioritization',
        label: 'Prioritization & Strategy',
        color: 'var(--cat-prioritization)',
        bgColor: 'var(--cat-prioritization-bg)',
        badgeClass: 'badge-prioritization',
        iconType: 'BranchesOutlined',
        frameworkTip: 'Anchor to business OKRs. Use RICE or Impact/Effort matrix and discuss trade-offs.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'rice_prioritization'
      },
      {
        id: 'behavioral',
        label: 'Behavioral & Leadership',
        color: 'var(--cat-behavioral)',
        bgColor: 'var(--cat-behavioral-bg)',
        badgeClass: 'badge-behavioral',
        iconType: 'TeamOutlined',
        frameworkTip: 'Use STAR method. Spend 60% of your time on YOUR specific actions and learnings.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'star'
      }
    ],
    experienceLevels: [
      { id: 'Junior', label: 'Associate / Junior PM (0-2 YOE - APM)' },
      { id: 'Mid-Level', label: 'Mid-Level PM (3-5 YOE)' },
      { id: 'Senior', label: 'Senior PM (6-9 YOE - L5/L6)' },
      { id: 'Lead_Principal_10+', label: 'Group / Principal PM (10+ YOE)' },
      { id: 'Director_VP_15+', label: 'Director / VP of Product (15+ YOE)' }
    ],
    rubricPillars: {
      structureAndClarity: 'Structure & Clarity',
      userFocusAndEmpathy: 'User Focus & Empathy',
      analyticalAndMetricsRigor: 'Analytical & Metrics Rigor',
      strategicVisionAndTradeoffs: 'Strategic Vision & Trade-offs',
      deliveryAndConciseness: 'Delivery & Communication'
    }
  },

  swe: {
    id: 'swe',
    label: 'Software Engineer (SWE)',
    shortLabel: 'SWE Track',
    badgeClass: 'badge-track-swe',
    iconType: 'CodeOutlined',
    description: 'Master System Design, Architecture, Algorithms, API Design, Debugging, and Engineering Leadership.',
    barRaiserTitle: 'Principal Staff Software Engineer & Systems Architect Bar Raiser',
    defaultRole: 'Senior Backend Engineer (Distributed Systems)',
    defaultCompany: 'Google',
    rolePresets: [
      'Senior Backend Engineer (Distributed Systems)',
      'Full Stack Engineer - React & Node.js',
      'Staff Software Engineer - Cloud Architecture',
      'Frontend Architect - Performance & Web Vitals',
      'AI / Machine Learning Infrastructure Engineer',
      'DevOps / SRE / Platform Engineer'
    ],
    companyPresets: [
      'Google',
      'Netflix',
      'Uber',
      'Amazon AWS',
      'Meta',
      'Stripe',
      'Apple',
      'Microsoft'
    ],
    experienceLevels: [
      { id: 'Junior', label: 'Junior / Entry SWE (0-2 YOE - L3)' },
      { id: 'Mid-Level', label: 'Mid-Level Engineer (3-5 YOE - L4)' },
      { id: 'Senior', label: 'Senior Engineer (6-9 YOE - L5)' },
      { id: 'Staff_10+', label: 'Staff / Tech Lead (10+ YOE - L6)' },
      { id: 'Principal_15+', label: 'Principal Architect / Fellow (15+ YOE - L7+)' }
    ],
    categories: [
      {
        id: 'system_design',
        label: 'System Design & Scalability',
        color: '#2563eb',
        bgColor: '#eff6ff',
        badgeClass: 'badge-design',
        iconType: 'ClusterOutlined',
        frameworkTip: 'Scope requirements, estimate QPS/storage, define API/schema, design high-level, and deep-dive bottlenecks.',
        timeTargetMinutes: 5,
        defaultTemplateId: 'system_design_framework'
      },
      {
        id: 'algorithms_ds',
        label: 'Algorithms & Problem Solving',
        color: '#7c3aed',
        bgColor: '#f5f3ff',
        badgeClass: 'badge-prioritization',
        iconType: 'ThunderboltOutlined',
        frameworkTip: 'Clarify constraints, start with brute force complexity, optimize data structures, and state edge cases.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'algorithm_approach'
      },
      {
        id: 'code_quality',
        label: 'Code Quality & Debugging',
        color: '#d97706',
        bgColor: '#fffbeb',
        badgeClass: 'badge-estimation',
        iconType: 'BugOutlined',
        frameworkTip: 'Isolate root cause, formulate hypotheses, test race conditions/leaks, and propose robust refactoring.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'debug_framework'
      },
      {
        id: 'api_db_design',
        label: 'API & Database Architecture',
        color: '#059669',
        bgColor: '#ecfdf5',
        badgeClass: 'badge-metrics',
        iconType: 'DatabaseOutlined',
        frameworkTip: 'Design REST/gRPC endpoints, define SQL/NoSQL schema with indexing, idempotency, and concurrency controls.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'api_design_framework'
      },
      {
        id: 'swe_behavioral',
        label: 'Engineering Leadership & Culture',
        color: '#db2777',
        bgColor: '#fdf2f8',
        badgeClass: 'badge-behavioral',
        iconType: 'TeamOutlined',
        frameworkTip: 'Use STAR format. Focus on technical trade-offs, code review conflicts, post-mortems, and mentorship.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'star_swe'
      }
    ],
    rubricPillars: {
      structureAndClarity: 'System Architecture & Soundness',
      userFocusAndEmpathy: 'Technical Depth & Trade-offs',
      analyticalAndMetricsRigor: 'Scalability & Performance Rigor',
      strategicVisionAndTradeoffs: 'Edge Cases, Resiliency & Fault Tolerance',
      deliveryAndConciseness: 'Code/API Quality & Communication'
    }
  },

  scrum_master: {
    id: 'scrum_master',
    label: 'Scrum Master / Agile Coach',
    shortLabel: 'Scrum Master Track',
    badgeClass: 'badge-track-agile',
    iconType: 'TeamOutlined',
    description: 'Master Agile Ceremony Facilitation, Impediment Removal, Sprint Metrics, Coaching, and Scaled Agile.',
    barRaiserTitle: 'Enterprise Agile Transformation Lead & Agile Coaching Bar Raiser',
    defaultRole: 'Senior Scrum Master - Engineering Teams',
    defaultCompany: 'Spotify',
    rolePresets: [
      'Senior Scrum Master - Engineering Teams',
      'Agile Coach - Enterprise Transformation',
      'Technical Scrum Master - Platform Engineering',
      'Scrum Master - FinTech / Regulated Environment',
      'Delivery Lead / Agile Release Train Engineer'
    ],
    companyPresets: [
      'Spotify',
      'JPMorgan Chase',
      'Salesforce',
      'Target',
      'Cisco',
      'Capital One',
      'Atlassian'
    ],
    experienceLevels: [
      { id: 'Junior', label: 'Junior Scrum Master (1-3 YOE)' },
      { id: 'Mid-Level_5+', label: 'Mid-Level Scrum Master (5+ YOE)' },
      { id: 'Senior_8+', label: 'Senior Scrum Master / Agile Coach (8+ YOE)' },
      { id: 'Enterprise_12+', label: 'Enterprise Agile Transformation Lead (12+ YOE)' }
    ],
    categories: [
      {
        id: 'ceremonies_facilitation',
        label: 'Ceremonies & Facilitation',
        color: '#2563eb',
        bgColor: '#eff6ff',
        badgeClass: 'badge-design',
        iconType: 'ScheduleOutlined',
        frameworkTip: 'Focus on outcome-driven retrospectives, sprint planning sizing, backlog refinement, and engaging standups.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'retro_framework'
      },
      {
        id: 'conflict_impediment',
        label: 'Impediment & Conflict Resolution',
        color: '#dc2626',
        bgColor: '#fef2f2',
        badgeClass: 'badge-behavioral',
        iconType: 'SafetyCertificateOutlined',
        frameworkTip: 'Address root causes of team friction, PO/Dev disagreements, overcommitment, and blocked dependencies.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'impediment_5whys'
      },
      {
        id: 'metrics_continuous_improvement',
        label: 'Agile Metrics & Flow',
        color: '#059669',
        bgColor: '#ecfdf5',
        badgeClass: 'badge-metrics',
        iconType: 'RiseOutlined',
        frameworkTip: 'Analyze cycle time, lead time, cumulative flow diagrams, escaped defects, and protect velocity from weaponization.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'agile_metrics_framework'
      },
      {
        id: 'team_coaching',
        label: 'Team Coaching & Psychological Safety',
        color: '#7c3aed',
        bgColor: '#f5f3ff',
        badgeClass: 'badge-prioritization',
        iconType: 'HeartOutlined',
        frameworkTip: 'Use the GROW coaching model to empower self-organizing teams, mentor junior devs, and build psychological safety.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'grow_coaching'
      },
      {
        id: 'scaled_agile_leadership',
        label: 'Scaled Agile & Stakeholder Management',
        color: '#d97706',
        bgColor: '#fffbeb',
        badgeClass: 'badge-estimation',
        iconType: 'ApartmentOutlined',
        frameworkTip: 'Manage cross-team dependencies, align POs with executive leadership, and manage fixed-date roadmap expectations.',
        timeTargetMinutes: 4,
        defaultTemplateId: 'star_scrum'
      }
    ],
    rubricPillars: {
      structureAndClarity: 'Servant Leadership & Coaching Mindset',
      userFocusAndEmpathy: 'Agile Principles & Ceremony Rigor',
      analyticalAndMetricsRigor: 'Impediment Removal & Conflict Resolution',
      strategicVisionAndTradeoffs: 'Flow Metrics & Continuous Improvement',
      deliveryAndConciseness: 'Stakeholder Alignment & Communication'
    }
  }
};

/**
 * All frameworks across PM, SWE, and Scrum Master tracks
 */
export const ALL_FRAMEWORKS = [
  // --- PM FRAMEWORKS ---
  {
    id: 'circles',
    track: 'pm',
    name: 'CIRCLES Method (PM)',
    category: 'product_design',
    description: 'The industry-standard framework for Product Design and Feature ideation questions.',
    structure: [
      'C - Comprehend Situation (Goal, Constraints, Context)',
      'I - Identify Customer Segments & Personas',
      'R - Report Customer Needs & Pain Points',
      'C - Cut & Prioritize 1-2 Critical Needs',
      'L - List 3+ Creative Solutions',
      'E - Evaluate Solutions & Trade-offs',
      'S - Summarize Recommendation & Metrics'
    ],
    templateSnippet: `### 1. Goal & Context Clarification
- Objective: [Define user value vs business goal]
- Scope & Constraints: [Platform, geography, timeline]

### 2. Target User Segments
- Segment A: [Primary Persona & Behaviors]
- Segment B: [Secondary Persona]
- Selected Segment: [Why this persona is highest priority]

### 3. Pain Points & User Needs
- [Pain Point 1 - High impact]
- [Pain Point 2 - Frequent friction]

### 4. Solutions Ideation
- Solution 1: [Low friction / Baseline]
- Solution 2: [High impact / Innovative]
- Solution 3: [Moonshot / AI-powered]

### 5. Prioritization & Trade-offs (Impact vs Effort)
- Selected: [Solution X] because [...]

### 6. Success Metrics & Risks
- North Star: [Core Metric]
- Guardrail: [Safety / Latency / Cannibalization]`
  },
  {
    id: 'star',
    track: 'pm',
    name: 'STAR Method (PM)',
    category: 'behavioral',
    description: 'Gold standard for Behavioral, Leadership, and Cross-functional conflict stories.',
    structure: [
      'S - Situation: High-stakes context & challenge',
      'T - Task: Your specific responsibility as PM',
      'A - Action: Concrete steps YOU took (data, alignment, execution)',
      'R - Result: Measurable outcome, lessons learned, retrospection'
    ],
    templateSnippet: `### Situation & Context
- Company/Product: [Context & initial state]
- The Stakes: [Why this was critical to solve]

### Task & PM Role
- Objective: [My specific ownership]
- Core Conflict/Obstacle: [Timeline / Resource / Disagreement]

### Actions Taken (As PM)
1. [Gathered quantitative data & customer feedback]
2. [Facilitated cross-functional alignment workshop]
3. [Made hard trade-off / phased milestone rollout]

### Results & Learnings
- Quantitative Impact: [+X% metric / Delivered on time]
- Qualitative Impact: [Team trust / standard adopted]
- What I would do differently: [Key takeaway]`
  },
  {
    id: 'metrics_root_cause',
    track: 'pm',
    name: 'Root Cause Diagnostic (PM)',
    category: 'metrics',
    description: 'Systematic approach for "Metric X dropped by Y%" or Defining a North Star.',
    structure: [
      '1. Clarify the Drop (Magnitude, timeline, seasonality, sudden vs gradual)',
      '2. External Factors (Holidays, competitor launch, outages, OS updates)',
      '3. Internal Factors (Bugs, new release, tracking/logging glitch, algorithm shift)',
      '4. Funnel Segmentation (Platform, geography, user cohort, app version)',
      '5. Hypothesis & Action Plan (Prioritize likely causes, immediate hotfix, long-term monitor)'
    ],
    templateSnippet: `### 1. Clarifying Questions & Scope
- Drop characteristics: [Sudden vs gradual, absolute vs percentage]
- Data integrity check: [Is tracking/analytics pipeline healthy?]

### 2. External Diagnostic Hypotheses
- Macro factors: [Holidays, network outage, competitor move]

### 3. Internal Diagnostic Hypotheses
- Deployments: [Recent app update, A/B experiment leak, server latency]

### 4. Cohort & Funnel Segmentation
- By Platform: [iOS vs Android vs Web]
- By Geography & User Type: [New users vs Power users]
- Funnel step drop-off: [Acquisition -> Activation -> Retention]

### 5. Action Plan & Next Steps
- Immediate triage: [Rollback / Hotfix]
- Long-term prevention: [Alerting & monitoring]`
  },
  {
    id: 'market_sizing',
    track: 'pm',
    name: 'Top-Down / Bottom-Up Estimation (PM)',
    category: 'estimation',
    description: 'Step-by-step arithmetic for sizing TAM, storage, or volume.',
    structure: [
      '1. Scope Definition & Formula Breakdown',
      '2. Top-down (Population -> Demographics -> Penetration -> Frequency)',
      '3. Bottom-up (Supply capacity -> Utilization -> Unit Economics)',
      '4. Calculations with rounded numbers',
      '5. Sanity Check & Sensitivity Analysis'
    ],
    templateSnippet: `### 1. Problem Clarification & Formula
- Target Metric: [e.g. Total annual revenue or Units/day]
- Formula: [Target Population * % Target Audience * Annual Frequency * Price per Unit]

### 2. Key Assumptions & Population Breakdown
- Total base population: [e.g. 330M US / 8B Global]
- Target demographic: [e.g. 100M households]
- Penetration rate: [e.g. 20% = 20M active users]

### 3. Step-by-Step Calculations
- Units per user per year: [e.g. 5x / year]
- Total Volume: [20M * 5 = 100M transactions]
- Total Value: [100M * $25 = $2.5 Billion]

### 4. Sanity Check & Edge Cases
- Does $2.5B align with known adjacent markets?
- Key risk factors in this estimate:`
  },
  {
    id: 'rice_prioritization',
    track: 'pm',
    name: 'RICE Prioritization Matrix (PM)',
    category: 'prioritization',
    description: 'Objective framework to prioritize features, backlog items, or strategic bets.',
    structure: [
      'R - Reach: How many customers will this impact per quarter?',
      'I - Impact: How much will it increase the core metric? (0.25 to 3)',
      'C - Confidence: How certain are we about reach/impact? (50% to 100%)',
      'E - Effort: Person-months or sprint points required',
      'Score = (R * I * C) / E'
    ],
    templateSnippet: `### Strategic Goal Alignment
- Company OKR / Quarter Goal: [e.g. Increase D30 Retention or Enterprise ARR]

### Candidate Options Evaluated
- Option A: [Description]
- Option B: [Description]
- Option C: [Description]

### RICE Evaluation Matrix
- Option A: Reach [X] | Impact [Y] | Confidence [Z%] | Effort [E months] => Score: [Score]
- Option B: Reach [X] | Impact [Y] | Confidence [Z%] | Effort [E months] => Score: [Score]

### Final Recommendation & Phased Rollout
- Primary choice: [Option X]
- Key Trade-offs accepted: [Deprioritizing Option Y due to engineering load]
- Rollout strategy: [Alpha testing with 5% users]`
  },

  // --- SWE FRAMEWORKS ---
  {
    id: 'system_design_framework',
    track: 'swe',
    name: 'System Design 5-Step Architecture (SWE)',
    category: 'system_design',
    description: 'Industry-standard systematic framework for large-scale distributed system design interviews.',
    structure: [
      '1. Clarify Functional & Non-Functional Requirements (Latency, Availability, Consistency, Scale)',
      '2. Back-of-the-Envelope Capacity Estimations (QPS, Storage, Bandwidth, Memory)',
      '3. High-Level Architecture (API Gateway, Microservices, DB, Cache, Message Queues)',
      '4. Component Deep Dive & Data Modeling (Schema, Indexes, Partitioning/Sharding)',
      '5. Bottlenecks, Fault Tolerance, CAP Trade-offs & Monitoring (Replication, SPOFs, Rate Limiting)'
    ],
    templateSnippet: `### 1. Requirements & Scope
- Functional Requirements:
  - User can [Core Action 1]
  - User can [Core Action 2]
- Non-Functional Requirements:
  - Latency: < 50ms p99 read, < 200ms write
  - Scale: 10M DAU, High Availability (99.99%), Eventual Consistency (AP system)

### 2. Back-of-the-Envelope Estimation
- Read QPS: [10M * 20 reads / 86400s = ~2,300 QPS (Peak: 5,000 QPS)]
- Write QPS: [10M * 2 writes / 86400s = ~230 QPS]
- Storage (5 yrs): [230 writes/s * 1KB/record * 86400s * 365 * 5 = ~36 TB]
- Cache Memory: [20% daily read volume in Redis cache = ~40 GB RAM]

### 3. High-Level Architecture
- Client -> Cloudflare CDN / Global Load Balancer -> API Gateway
- Stateless App Servers (Auto-scaling cluster)
- Cache Layer: Redis Cluster (LRU eviction policy)
- Message Queue: Apache Kafka / RabbitMQ for asynchronous write processing
- Primary Storage: PostgreSQL with Read Replicas / DynamoDB for metadata
- Blob Storage: AWS S3 / GCS for media assets

### 4. Data Model & API Design
- Endpoints: POST /api/v1/resource, GET /api/v1/resource/:id
- DB Schema: [Tables, Primary Keys, Foreign Keys, Compound Indexes]
- Partition Key Strategy: Sharded by [user_id / tenant_id] using consistent hashing

### 5. Bottlenecks, Resiliency & Trade-offs
- Single Point of Failure mitigation: Multi-region active-passive failover
- Rate limiting: Token bucket algorithm in Envoy proxy
- Circuit Breaker: Resilience4j to isolate downstream microservice failures`
  },
  {
    id: 'algorithm_approach',
    track: 'swe',
    name: 'Algorithm & Problem Solving Method (SWE)',
    category: 'algorithms_ds',
    description: 'Structured methodology for LeetCode style and algorithmic architectural problems.',
    structure: [
      '1. Clarify Inputs, Outputs, Constraints & Edge Cases (Empty, Null, Large scale, Overflow)',
      '2. Propose Initial Brute Force Solution & State Time/Space Complexity',
      '3. Identify Bottlenecks & Optimize with Optimal Data Structures (HashMaps, Two Pointers, Trees, DP, Monotonic Stacks)',
      '4. Structured Code Outline with clean variables and helper functions',
      '5. Dry Run with test cases and verify edge cases'
    ],
    templateSnippet: `### 1. Problem Understanding & Constraints
- Input Format: [Data types, range, ordering]
- Output Format: [Return type or in-place modification]
- Constraints: [e.g. N <= 10^5 -> Need O(N) or O(N log N) solution]
- Edge Cases: [Empty input, single element, duplicates, negative numbers, overflow]

### 2. Brute Force Baseline
- Approach: [Nested loops / full permutations]
- Complexity: Time: O(N^2), Space: O(1)

### 3. Optimized Approach & Data Structures
- Core Insight: [e.g., Use Hash Map for O(1) lookup or Two Pointers after sorting]
- Algorithm steps: [Step 1, Step 2, Step 3]
- Target Complexity: Time: O(N log N) or O(N), Space: O(N)

### 4. Pseudocode / Implementation Structure
- Initialization: [...]
- Traversal & Logic: [...]
- Return statement: [...]

### 5. Complexity & Verification
- Final Time Complexity: O(...)
- Final Space Complexity: O(...)
- Test case dry run: [Input -> Output trace]`
  },
  {
    id: 'debug_framework',
    track: 'swe',
    name: 'Production Debugging & Refactoring (SWE)',
    category: 'code_quality',
    description: 'Systematic approach for diagnosing memory leaks, race conditions, and high-severity outages.',
    structure: [
      '1. Triage & Impact Assessment (Severity, Error Rates, Affected Users, Rollback Need)',
      '2. Formulate 3 Testable Hypotheses (Code regression, Database lock contention, Memory leak, Network partition)',
      '3. Diagnostic Tools & Telemetry (APM traces, pprof CPU/Heap profiler, Logs, Metrics)',
      '4. Root Cause Identification & Immediate Mitigation (Hotfix / Feature flag toggle)',
      '5. Permanent Refactoring & Regression Prevention (Unit/Load tests, Alerting, SLA)'
    ],
    templateSnippet: `### 1. Incident Triage & Immediate Response
- Scope: [Affected endpoints, error status 504 vs 500, % of user traffic]
- First mitigation step: [Traffic rerouting / Rollback recent deployment]

### 2. Diagnostic Hypotheses
- Hypothesis A: [Memory leak in connection pooling / unclosed Goroutines]
- Hypothesis B: [Database lock contention during bulk write]
- Hypothesis C: [Third-party dependency timeout exhausting thread pool]

### 3. Observability & Proof
- Telemetry inspected: [Datadog p99 traces, heap flame graphs, slow query logs]
- Verification: [Trace shows blocking I/O on unindexed query]

### 4. Root Cause & Solution
- Code Fix: [Refactor synchronous blocking call to async event queue with bounded worker pool]
- Defensive coding: [Add timeout context, connection pooling limits]

### 5. Long-Term Hardening
- Automated regression test: [Load test at 3x peak QPS]
- Circuit breaker & SLO monitoring threshold: [...]`
  },
  {
    id: 'api_design_framework',
    track: 'swe',
    name: 'REST / gRPC API & Schema Design (SWE)',
    category: 'api_db_design',
    description: 'Framework for designing robust, idempotent, backward-compatible APIs and schemas.',
    structure: [
      '1. Resource Modeling & URI Conventions (Nouns, Hierarchy, Query params)',
      '2. Request/Response Payloads & Type Safety (JSON schemas, Protobufs, Validation)',
      '3. Error Handling & HTTP Status Codes (400 vs 404 vs 409 vs 422, RFC 7807 Problem Details)',
      '4. Non-Functional Concerns (Idempotency Keys, Pagination, Auth, Rate Limiting, Versioning)',
      '5. Database Schema & Index Optimization'
    ],
    templateSnippet: `### 1. API Resources & Endpoints
- POST /api/v1/payments (Create payment - Idempotent via Idempotency-Key header)
- GET /api/v1/payments/:id (Retrieve payment)
- GET /api/v1/payments?cursor=xyz&limit=50 (Cursor-based pagination)
- POST /api/v1/payments/:id/refunds (Sub-resource refund action)

### 2. Request & Response Specification
- Headers: Authorization: Bearer <token>, Idempotency-Key: <uuid>
- Request Body: JSON with strict validation schema
- Response Body: Normalized data model with timestamp ISO-8601

### 3. Error Handling Contract (RFC 7807)
- 400 Bad Request / 409 Conflict (Duplicate idempotency key)
- Standardized error schema: { type, title, status, detail, error_code }

### 4. Database Schema & Index Strategy
- Table: payments (id UUID PK, customer_id UUID INDEX, amount BIGINT, status VARCHAR, created_at TIMESTAMPTZ)
- Compound Index: (customer_id, created_at DESC) for fast paginated retrieval`
  },
  {
    id: 'star_swe',
    track: 'swe',
    name: 'STAR for Engineering Leadership (SWE)',
    category: 'swe_behavioral',
    description: 'Framework for answering technical disputes, refactoring vs feature trade-offs, and outages.',
    structure: [
      'S - Situation: High-stakes technical context or system crisis',
      'T - Task: Your architectural responsibility and technical goal',
      'A - Action: Deep dive into YOUR technical choices, benchmarks, data-driven consensus, and execution',
      'R - Result: Measurable latency/cost/reliability impact, team best practice established'
    ],
    templateSnippet: `### Situation & Architecture Context
- System Context: [Legacy monolith vs microservice, scale, SLA requirement]
- The Conflict / Crisis: [Tech debt vs Q3 deadline / Monolith split disagreement]

### My Engineering Ownership (Task)
- Objective: [Deliver scalable solution without compromising system uptime]
- Key Technical Challenge: [Zero-downtime migration, data consistency]

### Engineering Actions Taken
1. [Ran performance benchmarks and flame graphs to present objective data]
2. [Proposed a strangler fig migration pattern to decouple risk incrementally]
3. [Implemented automated shadow traffic testing to validate parity]

### Measured Technical Results & Lessons
- Performance Metric: [p99 latency reduced from 800ms to 45ms, 99.99% uptime achieved]
- Team Impact: [Architecture design review RFC process adopted org-wide]
- What I would improve in hindsight: [...]`
  },

  // --- SCRUM MASTER & AGILE FRAMEWORKS ---
  {
    id: 'retro_framework',
    track: 'scrum_master',
    name: '5-Stage Retrospective Framework (Scrum Master)',
    category: 'ceremonies_facilitation',
    description: 'Gold-standard framework by Esther Derby & Diana Larsen for high-impact sprint retrospectives.',
    structure: [
      '1. Set the Stage (Safety check, Prime Directive, icebreaker)',
      '2. Gather Data (Hard facts, sprint timeline, burn-down, sticky notes: Glad/Sad/Mad/Start/Stop)',
      '3. Generate Insights (5 Whys, Fishbone diagram, clustering patterns)',
      '4. Decide What to Do (Pick 1-2 actionable SMART experiments with clear owners)',
      '5. Close the Retrospective (Appreciations, feedback on retro effectiveness)'
    ],
    templateSnippet: `### 1. Set the Stage & Psychological Safety
- Prime Directive: "Regardless of what we discover, we understand that everyone did the best job they could."
- Check-in Exercise: [Safety check scale 1-5 / One-word sprint pulse]

### 2. Gather Objective & Subjective Data
- Sprint Facts: [Committed vs Completed story points, unplanned work %]
- Retro Format: [Mad/Sad/Glad or Start/Stop/Continue or Sailboat: Anchors vs Wind]

### 3. Generate Insights & Root Cause
- Clustered Theme: [e.g., Unclear Acceptance Criteria causing mid-sprint churn]
- Technique used: [5 Whys to identify why stories were refined late]

### 4. SMART Action Items
- Action Item 1: [PO and Tech Lead will pre-refine stories 2 days before Planning]
  - Owner: [Jane Doe]
  - Target Measure: [Zero stories carry over due to missing specs next sprint]

### 5. Close & Appreciation
- Team shout-outs for cross-functional pairing`
  },
  {
    id: 'impediment_5whys',
    track: 'scrum_master',
    name: '5 Whys Impediment Removal (Scrum Master)',
    category: 'conflict_impediment',
    description: 'Systematic root-cause resolution for chronic sprint blockers and inter-team dependencies.',
    structure: [
      '1. Clearly Define the Blocker (Impact on Sprint Goal, engineers affected)',
      '2. Apply 5 Whys to peel back surface symptoms to institutional root cause',
      '3. Distinguish Team-Level vs Organizational Impediments',
      '4. Implement Immediate Removal & Long-term Systemic Countermeasure',
      '5. Track Resolution and verify non-recurrence'
    ],
    templateSnippet: `### 1. Impediment Definition & Sprint Impact
- Blocker: [Frontend engineers blocked waiting on Backend API schema for 3 days]
- Impact: [Sprint Goal at risk, 40% of sprint capacity idling]

### 2. 5 Whys Root-Cause Diagnosis
- Why 1: Why is Frontend blocked? -> Backend API isn't deployed to staging.
- Why 2: Why isn't it deployed? -> Backend contract wasn't agreed upon before sprint started.
- Why 3: Why was there no contract? -> Backlog refinement focused on UI mockups without API spec.
- Why 4: Why was API spec omitted? -> No Definition of Ready (DoR) requirement for OpenAPI schema.
- Root Cause: Missing OpenAPI contract validation in Definition of Ready.

### 3. Action Plan & Resolution
- Immediate Unblocker: [Facilitated 30-min schema pairing session and set up Mockoon mock API server]
- Systemic Fix: [Updated team Definition of Ready to mandate Swagger/OpenAPI contract sign-off]`
  },
  {
    id: 'agile_metrics_framework',
    track: 'scrum_master',
    name: 'Flow Metrics & Continuous Improvement (Scrum Master)',
    category: 'metrics_continuous_improvement',
    description: 'Framework for utilizing Agile metrics (Lead Time, Cycle Time, CFD, Throughput) constructively without weaponizing velocity.',
    structure: [
      '1. Metric Selection & Intent (Flow Efficiency vs Arbitrary Output)',
      '2. Cycle Time & Lead Time Analysis (Identify where tickets sit idle in QA/Review)',
      '3. Cumulative Flow Diagram (CFD) WIP Limits diagnosis',
      '4. Protecting Velocity from Gaming & Pressure',
      '5. Continuous Delivery improvement experiments'
    ],
    templateSnippet: `### 1. Metric Purpose & Health Check
- Core Metric: [Cycle Time from In-Progress to Production / Flow Efficiency]
- Anti-Pattern Avoidance: [Never compare velocity across different teams or use it for appraisal]

### 2. Diagnostic Analysis of Flow
- Current State: [Average cycle time is 9.5 days; tickets spend 6 days waiting in "Code Review"]
- WIP (Work In Progress) Status: [12 open PRs for 4 developers -> High context switching]

### 3. Proposed Agile Experiment
- Experiment: [Enact WIP limit of max 2 PRs per developer and hold daily 15-min pairing review hour]
- Target Metric: [Reduce average PR review time from 6 days to < 24 hours]

### 4. Review & Retrospect
- Review cadence: [Evaluate CFD and cycle time trend at next sprint retrospective]`
  },
  {
    id: 'grow_coaching',
    track: 'scrum_master',
    name: 'GROW Coaching Model (Scrum Master)',
    category: 'team_coaching',
    description: 'Powerful non-directive coaching model for 1-on-1 coaching with Product Owners, Tech Leads, and disengaged team members.',
    structure: [
      'G - Goal: What does the coachee want to achieve in this situation?',
      'R - Reality: What is happening right now? What are the obstacles?',
      'O - Options: What are all the possible ways forward?',
      'W - Will / Way Forward: Which option will you commit to and by when?'
    ],
    templateSnippet: `### 1. Goal (Clarify Objective)
- Coaching Context: [1-on-1 with Product Owner struggling with mid-sprint scope creep]
- Desired Outcome: [PO wants the team to deliver reliable commitments without burning out]

### 2. Reality (Current State Exploration)
- Open Questions Asked: ["What happens when stakeholders request emergency features mid-sprint?"]
- Coachee Realization: ["I say yes to everyone because I don't have a structured intake process."]

### 3. Options (Brainstorming Solutions)
- Explored Alternatives:
  - Option A: Buffer 20% capacity in sprint for urgent operational bugs.
  - Option B: Introduce a formal Trade-off rule: "To bring X in, we must swap Y out."
  - Option C: Route all stakeholder requests through a weekly refinement queue.

### 4. Way Forward & Commitment
- PO Commitment: [PO chooses Option B and will communicate the swap policy at tomorrow's sprint review]
- Scrum Master Support: [I will facilitate stakeholder alignment and back the PO in trade-off discussions]`
  },
  {
    id: 'star_scrum',
    track: 'scrum_master',
    name: 'STAR for Scrum Masters & Agile Leaders',
    category: 'scaled_agile_leadership',
    description: 'Structured framework for demonstrating servant leadership, stakeholder management, and team empowerment.',
    structure: [
      'S - Situation: Challenging team dynamic, agile antipattern, or multi-team dependency roadblock',
      'T - Task: Your role as Servant Leader (NOT manager or task-assigner)',
      'A - Action: How you coached, facilitated, removed systemic blockers, and built consensus',
      'R - Result: Measurable team agility, predictability, psychological safety, and delivery speed'
    ],
    templateSnippet: `### Situation & Agile Antipattern
- Team State: [Team was missing 50% of sprint commitments, morale was low, standups were 45-min status reports]
- The Challenge: [Engineering management was threatening micro-management]

### My Role as Servant Leader (Task)
- Objective: [Transform the team into a self-organizing, high-trust unit with predictable flow]

### Agile Interventions & Coaching (Action)
1. [Restructured Daily Standup to focus on the Sprint Goal rather than individual status: "What are we swarming on today?"]
2. [Facilitated psychological safety workshop and established a strict Definition of Done (DoD)]
3. [Coached Product Owner on writing testable Acceptance Criteria using BDD/Given-When-Then]

### Measured Results & Team Evolution
- Delivery Predictability: [Say-Do ratio increased from 52% to 88% over 4 sprints]
- Cycle Time: [Lead time decreased by 35%]
- Team Health: [Employee Net Promoter Score (eNPS) rose from +12 to +58]`
  }
];
