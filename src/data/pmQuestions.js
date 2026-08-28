/**
 * Curated Bank of High-Quality PM Interview Questions
 * Organized across the 5 mandatory categories:
 * 1. Product Design
 * 2. Metrics
 * 3. Estimation
 * 4. Prioritization
 * 5. Behavioral
 */

export const CURATED_PM_QUESTIONS = [
  // --- 1. PRODUCT DESIGN ---
  {
    id: 'pd-1',
    category: 'product_design',
    title: 'Design an AI-Powered Financial Wellness Assistant for Gig Workers',
    companyMatch: ['fintech', 'stripe', 'revolut', 'uber', 'general'],
    question: 'Design an AI-powered financial wellness and tax-saving assistant specifically tailored for gig economy workers (Uber drivers, freelancers, food couriers). How would you differentiate it and measure engagement?',
    hints: [
      'Think about income volatility, lack of automated tax withholding, and immediate cash flow needs.',
      'Consider user trust when dealing with sensitive bank credentials and financial advice.',
      'Structure using the CIRCLES framework: Goal -> Segments -> Pain Points -> 3 Solutions -> Trade-offs -> Metrics.'
    ],
    clarifications: [
      'Interviewer: Assume you are building this as a standalone mobile app or an embedded feature in a major fintech ecosystem.',
      'Target market: US & European gig economy workers earning $20k-$75k annually.'
    ]
  },
  {
    id: 'pd-2',
    category: 'product_design',
    title: 'Design a Collaborative Team Workspace for Remote PMs',
    companyMatch: ['notion', 'slack', 'google', 'microsoft', 'saas'],
    question: 'How would you design a next-generation real-time decision-making product for hybrid and remote product teams struggling with alignment and endless meetings?',
    hints: [
      'Focus on asynchronous decision logs, PRD commenting, and context switching.',
      'Identify distinct personas: Junior PM vs Eng Lead vs Product VP.',
      'Pick 1 high-leverage solution and detail the core user flow.'
    ],
    clarifications: [
      'Interviewer: You are building for cross-functional tech teams (PM, Design, Eng) of 10 to 500 people.'
    ]
  },
  {
    id: 'pd-3',
    category: 'product_design',
    title: 'Design a Ride-Sharing Experience for Elderly Passengers',
    companyMatch: ['uber', 'lyft', 'waymo', 'consumer'],
    question: 'Design a dedicated ride-hailing experience optimized for senior citizens (aged 70+) who may have visual impairments, mobility challenges, or limited tech familiarity.',
    hints: [
      'Consider both the senior rider and their adult children / caregivers as co-personas.',
      'Think about phone/voice booking, pickup spot safety, and driver dispatch training.',
      'Address safety guardrails and caregiver notification features.'
    ],
    clarifications: [
      'Interviewer: Focus on the mobile app and physical vehicle onboarding touchpoints.'
    ]
  },

  // --- 2. METRICS & EXECUTION ---
  {
    id: 'met-1',
    category: 'metrics',
    title: 'Investigate a 7% Drop in Checkout Completion Rate',
    companyMatch: ['stripe', 'fintech', 'shopify', 'amazon', 'ecommerce'],
    question: 'You are the Product Manager for the core Checkout product. Yesterday morning, your analytics dashboard alerted you that Checkout Completion Rate dropped by 7% globally. Walk me through step-by-step how you diagnose, isolate, and address this issue.',
    hints: [
      'Check data integrity / tracking pipeline first.',
      'Segment by dimensions: payment method (cards vs Apple Pay vs local rails), geography, device (iOS vs Android), and recent code releases.',
      'Identify external factors (bank gateway outages, 3D Secure regulatory changes) vs internal bugs.'
    ],
    clarifications: [
      'Interviewer: The drop started on Tuesday at 03:00 UTC and persisted for 12 hours before triggering the P1 alert.'
    ]
  },
  {
    id: 'met-2',
    category: 'metrics',
    title: 'Define the North Star Metric for Spotify Discover Weekly',
    companyMatch: ['spotify', 'netflix', 'youtube', 'consumer', 'media'],
    question: 'What is the North Star metric for Spotify Discover Weekly? Define your primary metric, 2-3 supporting input metrics, and 2 critical counter/guardrail metrics to avoid perverse incentives.',
    hints: [
      'Distinguish between short-term engagement (track skips, streams) and long-term retention / library saving.',
      'Guardrail against algorithmic echo chambers or volume gaming by repetitive bots.'
    ],
    clarifications: [
      'Interviewer: Focus specifically on the personalized algorithmic discovery playlist feature.'
    ]
  },
  {
    id: 'met-3',
    category: 'metrics',
    title: 'Diagnose a 15% Decrease in Creator Video Uploads',
    companyMatch: ['youtube', 'tiktok', 'instagram', 'meta', 'social'],
    question: 'Over the last 30 days, video uploads by verified creators on your platform have decreased by 15%, while viewer watch time remains flat. How do you investigate the root cause and formulate an action plan?',
    hints: [
      'Isolate creator cohorts: top 1% vs mid-tier vs new creators.',
      'Examine creator monetization earnings, algorithmic reach satisfaction, and editing tool crashes.',
      'Propose quick triage experiments and long-term creator incentive adjustments.'
    ],
    clarifications: [
      'Interviewer: The drop is concentrated among creators with 10k-100k subscribers.'
    ]
  },

  // --- 3. ESTIMATION & MARKET SIZING ---
  {
    id: 'est-1',
    category: 'estimation',
    title: 'Estimate the Annual Revenue of Stripe Payment Processing in the US',
    companyMatch: ['stripe', 'fintech', 'square', 'adyen', 'general'],
    question: 'Estimate the total annual gross revenue generated by Stripe for processing online e-commerce transactions for US businesses.',
    hints: [
      'Break down: Total US e-commerce GMV -> Stripe market share percentage -> Stripe take rate (e.g. 2.9% + $0.30) -> Calculate gross take.',
      'State all baseline assumptions clearly (e.g. US Retail e-commerce = ~$1.1 Trillion).',
      'End with a sanity check comparing to public benchmarks.'
    ],
    clarifications: [
      'Interviewer: Focus on online card processing in the US for the current calendar year.'
    ]
  },
  {
    id: 'est-2',
    category: 'estimation',
    title: 'Estimate the Number of EV Charging Stations Needed in California by 2030',
    companyMatch: ['tesla', 'uber', 'waymo', 'hardware', 'general'],
    question: 'Estimate how many public Electric Vehicle (EV) fast-charging plugs will be required across the state of California by 2030 to prevent driver queuing.',
    hints: [
      'Estimate California population -> Car ownership -> Expected % EV adoption by 2030.',
      'Estimate daily miles driven per EV -> kWh consumed -> Fast charger throughput per hour -> Capacity utilization factor.'
    ],
    clarifications: [
      'Interviewer: Consider public DC fast chargers (Level 3) rather than overnight home chargers.'
    ]
  },
  {
    id: 'est-3',
    category: 'estimation',
    title: 'Estimate Daily Storage Required for WhatsApp Voice Notes',
    companyMatch: ['meta', 'whatsapp', 'telegram', 'google', 'cloud'],
    question: 'Estimate the total daily cloud storage (in Terabytes or Petabytes) required to store all voice notes sent on WhatsApp worldwide.',
    hints: [
      'Active user base (~2 Billion DAU) -> % sending voice notes daily -> Average notes per user -> Average duration in seconds -> Audio bitrate (e.g. Opus codec at ~16 kbps) -> Total gigabytes/terabytes.'
    ],
    clarifications: [
      'Interviewer: Assume voice notes are stored uncompressed or standard compressed on WhatsApp backup servers.'
    ]
  },

  // --- 4. PRIORITIZATION & STRATEGY ---
  {
    id: 'prio-1',
    category: 'prioritization',
    title: 'Prioritize Roadmap for a Fintech Scaling to Enterprise Clients',
    companyMatch: ['fintech', 'stripe', 'plaid', 'b2b', 'saas'],
    question: 'You have a team of 6 engineers for Q3. Your sales team demands Enterprise Single Sign-On (SAML/SSO) to close a $500k deal, Customer Support demands automated refund dispute tooling to cut backlog by 40%, and Product Marketing wants a self-serve checkout revamp. How do you evaluate and prioritize these competing initiatives?',
    hints: [
      'Use a structured scoring matrix (RICE or Strategic Alignment vs Effort).',
      'Discuss trade-offs: Short-term ARR vs Operational cost vs Long-term self-serve funnel.',
      'Propose a compromise or phased scope (e.g., lightweight SSO integration via Okta + MVP dispute tool).'
    ],
    clarifications: [
      'Interviewer: The company\'s top annual OKR is reaching cash-flow positivity while retaining top 100 enterprise accounts.'
    ]
  },
  {
    id: 'prio-2',
    category: 'prioritization',
    title: 'Should Uber Launch a Long-Distance Intercity Bus Service?',
    companyMatch: ['uber', 'lyft', 'airbnb', 'strategy', 'marketplace'],
    question: 'Uber is evaluating whether to launch an intercity bus booking feature (connecting cities 50-200 miles apart) vs expanding its local grocery delivery vertical. How would you framework this strategic decision and make a recommendation to the CEO?',
    hints: [
      'Analyze Market Size, Synergy with Existing Network/Flywheel, Regulatory Barriers, Unit Economics, and Defensibility.',
      'Assess supply constraints: partner with existing bus operators vs dedicated fleet.',
      'Conclude with a high-conviction decision backed by clear rationale.'
    ],
    clarifications: [
      'Interviewer: Focus on the US and Latin America markets.'
    ]
  },

  // --- 5. BEHAVIORAL & LEADERSHIP ---
  {
    id: 'beh-1',
    category: 'behavioral',
    title: 'Disagree and Commit on Technical Debt vs Feature Launch',
    companyMatch: ['all', 'google', 'meta', 'amazon', 'fintech', 'general'],
    question: 'Tell me about a time you had a fundamental disagreement with your Engineering Lead on prioritizing refactoring/technical debt versus launching a high-visibility feature for a deadline. How did you resolve the conflict and what was the outcome?',
    hints: [
      'Use the STAR structure (Situation, Task, Action, Result).',
      'Show deep empathy for engineering constraints without abdicating product accountability.',
      'Highlight data-driven compromise (e.g., 80/20 sprint allocation, performance SLA benchmarking, post-launch refactor sprint).'
    ],
    clarifications: [
      'Interviewer: Focus on your personal actions, the nuance of the conversation, and the long-term team relationship.'
    ]
  },
  {
    id: 'beh-2',
    category: 'behavioral',
    title: 'A Product Launch that Failed to Meet Expectations',
    companyMatch: ['all', 'general', 'senior', 'startup'],
    question: 'Describe a feature or product you spearheaded that failed to achieve its target adoption or business metrics. What were the root causes, how did you communicate the outcome to leadership, and what did you learn?',
    hints: [
      'Demonstrate vulnerability, high agency, and rigorous post-mortem analysis.',
      'Explain what assumptions proved invalid (user research gap, distribution friction, value proposition).',
      'Explain how that learning altered your product discovery playbook in subsequent projects.'
    ],
    clarifications: [
      'Interviewer: Authenticity and depth of self-reflection are heavily weighted here.'
    ]
  }
];

/**
 * Helper to get a curated fallback question tailored to category, role, and company
 */
export function getCuratedQuestionForCategory(category, role = '', company = '') {
  const matchingCategory = CURATED_PM_QUESTIONS.filter(q => q.category === category);
  if (!matchingCategory.length) {
    return CURATED_PM_QUESTIONS[0];
  }
  
  const compLower = (company || '').toLowerCase();
  const roleLower = (role || '').toLowerCase();
  
  const tailoredMatch = matchingCategory.find(q => 
    q.companyMatch.some(tag => compLower.includes(tag) || roleLower.includes(tag))
  );
  
  return tailoredMatch || matchingCategory[Math.floor(Math.random() * matchingCategory.length)];
}
