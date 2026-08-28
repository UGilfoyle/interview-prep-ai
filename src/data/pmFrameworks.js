/**
 * Standard PM Frameworks and Scratchpad Templates
 */

export const PM_FRAMEWORKS = [
  {
    id: 'circles',
    name: 'CIRCLES Method',
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
    name: 'STAR Method',
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
    name: 'Root Cause & Metrics Tree',
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
    name: 'Top-Down / Bottom-Up Estimation',
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
    name: 'RICE & Strategic Prioritization',
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
  }
];

export const PM_CATEGORIES = [
  {
    id: 'product_design',
    label: 'Product Design',
    color: 'var(--cat-design)',
    bgColor: 'var(--cat-design-bg)',
    badgeClass: 'badge-design',
    icon: 'Layout',
    frameworkTip: 'Use CIRCLES Method. Start with user empathy & segmentation before jumping to features.',
    timeTargetMinutes: 5
  },
  {
    id: 'metrics',
    label: 'Metrics & Execution',
    color: 'var(--cat-metrics)',
    bgColor: 'var(--cat-metrics-bg)',
    badgeClass: 'badge-metrics',
    icon: 'TrendingUp',
    frameworkTip: 'Define North Star + Leading/Lagging + Guardrail metrics. For drops, segment by cohorts.',
    timeTargetMinutes: 4
  },
  {
    id: 'estimation',
    label: 'Estimation & Sizing',
    color: 'var(--cat-estimation)',
    bgColor: 'var(--cat-estimation-bg)',
    badgeClass: 'badge-estimation',
    icon: 'Calculator',
    frameworkTip: 'State assumptions clearly. Keep calculations round and finish with a sanity check.',
    timeTargetMinutes: 4
  },
  {
    id: 'prioritization',
    label: 'Prioritization & Strategy',
    color: 'var(--cat-prioritization)',
    bgColor: 'var(--cat-prioritization-bg)',
    badgeClass: 'badge-prioritization',
    icon: 'GitFork',
    frameworkTip: 'Anchor to business goals. Use RICE or 2x2 Impact/Effort and explicitly discuss trade-offs.',
    timeTargetMinutes: 4
  },
  {
    id: 'behavioral',
    label: 'Behavioral & Leadership',
    color: 'var(--cat-behavioral)',
    bgColor: 'var(--cat-behavioral-bg)',
    badgeClass: 'badge-behavioral',
    icon: 'Users',
    frameworkTip: 'Use the STAR format. Focus 60% of your time on YOUR specific actions and learnings.',
    timeTargetMinutes: 4
  }
];
