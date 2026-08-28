/**
 * Gemini API Integration Service for Multi-Track Tech Interview Simulator
 * Supports Product Management (PM), Software Engineering (SWE), and Scrum Master / Agile tracks
 * Features FAANG Bar-Raiser Rigorous Scoring Engine
 */

import { getCuratedQuestionForTrack } from '../data/interviewQuestions';
import { ROLE_TRACKS } from '../data/roleTracks';

// Safe default key read from environment or user input
export const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Candidate models in order of preference
const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-flash-latest',
  'gemini-3.7-flash',
  'gemini-2.5-flash-lite'
];

/**
 * Generic caller for Gemini generateContent endpoint with model fallback
 */
async function callGeminiApi({ apiKey, prompt, systemInstruction, jsonMode = true }) {
  const cleanKey = (apiKey || DEFAULT_GEMINI_KEY).trim();
  if (!cleanKey) {
    throw new Error('Please enter a valid Gemini API Key.');
  }

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      
      const payload = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.65,
          topP: 0.95
        }
      };

      if (jsonMode) {
        payload.generationConfig.responseMimeType = 'application/json';
      }

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        console.warn(`Model ${model} failed: ${errorMessage}`);
        lastError = new Error(errorMessage);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!rawText) {
        throw new Error('Gemini API returned an empty response.');
      }

      return {
        rawText,
        modelUsed: model
      };
    } catch (err) {
      lastError = err;
      console.warn(`Attempt with ${model} failed:`, err.message);
    }
  }

  throw lastError || new Error('All Gemini API model attempts failed.');
}

/**
 * Clean JSON parser that extracts JSON even from markdown code fences if present
 */
function parseJsonSafely(text) {
  if (!text) return null;
  
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Failed to parse structured response from Gemini.');
  }
}

/**
 * Test API key and measure latency
 */
export async function testApiKey(apiKey) {
  const startTime = performance.now();
  try {
    const res = await callGeminiApi({
      apiKey,
      prompt: 'Respond with valid JSON: {"status": "ok", "message": "API Key is valid and active"}',
      jsonMode: true
    });
    const parsed = parseJsonSafely(res.rawText);
    const latency = Math.round(performance.now() - startTime);
    return {
      success: true,
      latency,
      model: res.modelUsed,
      message: parsed?.message || 'Connected successfully'
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Generate a Tailored Interview Question across PM, SWE, or Scrum Master tracks
 */
export async function generateTailoredQuestion({
  apiKey,
  track = 'pm',
  role,
  company,
  jobDescription = '',
  category,
  questionIndex = 1,
  totalQuestions = 5,
  difficulty = 'Senior',
  previousQuestions = []
}) {
  const trackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;
  const currentCategoryObj = trackConfig.categories.find((c) => c.id === category) || trackConfig.categories[0];
  const categoryName = currentCategoryObj.label;

  const prompt = `You are an elite, uncompromising ${trackConfig.barRaiserTitle} at ${company || 'a tier-1 tech company like Stripe/Google/Netflix/Meta'}.
You are conducting a high-stakes technical interview for the target role of: "${role || trackConfig.defaultRole}" at the "${difficulty}" level.

TARGET CANDIDATE DETAILS:
- Track: ${trackConfig.label}
- Target Role: ${role || trackConfig.defaultRole}
- Target Company: ${company || 'Tier-1 Tech Company'}
- Difficulty / Level: ${difficulty}
- Category for this round: ${categoryName} (Key: "${category}")
- Question Index: ${questionIndex} of ${totalQuestions}
${jobDescription ? `- Job Description Nuance: "${jobDescription.slice(0, 1000)}"` : ''}
${previousQuestions.length > 0 ? `- Previously asked questions in this loop (DO NOT REPEAT): ${JSON.stringify(previousQuestions)}` : ''}

INSTRUCTIONS FOR HARD, REALISTIC QUESTION GENERATION:
1. Generate ONE authentic, deeply challenging, and nuanced interview question that top tech companies (Google, Meta, Stripe, Netflix, Uber, Amazon) ask to separate Senior/Staff talent from junior candidates.
2. DO NOT make it a generic trivia question. Include realistic architectural constraints, scale numbers (e.g. 50k RPS, millions of DAUs, multi-region sync), or conflicting stakeholder dilemmas.
3. If track is 'pm': Focus on complex product trade-offs (CIRCLES), difficult root-cause metrics drops, TAM sizing with cannibalization, or ruthless feature prioritization (RICE).
4. If track is 'swe': Focus on distributed system design (CAP theorem, data sharding, cache invalidation storms, idempotent APIs), algorithms with tight memory/time limits, or real-time production incident triage.
5. If track is 'scrum_master': Focus on resolving toxic team dysfunctions, deep-rooted organizational impediments (5 Whys), cross-team dependency deadlocks in SAFe/Spotify models, or fixing volatile velocity with CFD metrics.

Respond in STRICT JSON format:
{
  "title": "Concise high-impact title (e.g. 'Design a Real-Time Idempotent Payment Settlement Engine')",
  "question": "Full verbatim question posed by the interviewer with concrete scale/context",
  "context": "Why this specific challenge is a critical differentiator for ${difficulty} ${role} candidates",
  "hints": [
    "Structural framework recommendation (e.g. CIRCLES, 5-Step System Architecture, GROW Coaching)",
    "Key architectural/user constraint or failure mode to consider",
    "Critical trade-off or boundary condition that must be addressed"
  ],
  "clarifications": [
    "Interviewer clarification if candidate asks about scope, traffic SLA, or latency budgets",
    "Interviewer clarification regarding multi-region failure domain or target user persona"
  ],
  "evaluationCriteria": [
    "What separates a Strong Hire answer from a mediocre one (Criteria 1)",
    "Concrete technical/strategic depth expected (Criteria 2)",
    "Handling of non-functional requirements and edge cases (Criteria 3)"
  ]
}`;

  const systemInstruction = `You are a world-class ${trackConfig.barRaiserTitle}. Output pure valid JSON with zero conversational fluff.`;

  try {
    const result = await callGeminiApi({
      apiKey,
      prompt,
      systemInstruction,
      jsonMode: true
    });

    const parsed = parseJsonSafely(result.rawText);
    if (!parsed || !parsed.question) {
      throw new Error('Invalid question format from AI');
    }

    return {
      id: `ai-q-${Date.now()}-${questionIndex}`,
      track,
      category,
      title: parsed.title || `${categoryName} Interview Question`,
      question: parsed.question,
      context: parsed.context || `Tailored for ${role} at ${company}`,
      hints: parsed.hints || [],
      clarifications: parsed.clarifications || [],
      evaluationCriteria: parsed.evaluationCriteria || [],
      isAiGenerated: true,
      modelUsed: result.modelUsed
    };
  } catch (err) {
    console.warn('Gemini question generation error, falling back to curated library:', err);
    const fallback = getCuratedQuestionForTrack(track, category, role, company);
    return {
      ...fallback,
      id: `curated-${fallback.id}-${Date.now()}`,
      isAiGenerated: false,
      fallbackNotice: 'Loaded from curated interview bank.'
    };
  }
}

/**
 * Evaluate Candidate's Answer with Ultra-Strict FAANG Bar-Raiser Calibrated Scoring Engine
 */
export async function evaluateCandidateAnswer({
  apiKey,
  track = 'pm',
  question,
  answer,
  role,
  company,
  jobDescription = '',
  category,
  difficulty = 'Senior'
}) {
  const trackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;

  if (!answer || answer.trim().length < 25) {
    return {
      score: 1.5,
      verdict: 'No Hire',
      summary: 'Candidate response was severely incomplete and insufficient for technical evaluation.',
      whatWasStrong: ['Acknowledged the question.'],
      whatWasMissing: [
        'Complete absence of structured technical/domain framework.',
        'Zero quantitative justifications, scale analysis, or architectural blueprints.',
        'No edge cases, trade-offs, or failure recovery mechanics.'
      ],
      oneSpecificSuggestion: 'Speak in structured, comprehensive paragraphs using standard industry frameworks with explicit numbers and trade-offs.',
      modelAnswer: 'A complete, multi-paragraph response is required to unlock full benchmark analysis.',
      rubricBreakdown: {
        structureAndClarity: { score: 1, feedback: 'Insufficient length to determine logical structure.' },
        userFocusAndEmpathy: { score: 1, feedback: 'Did not address target user persona or system requirements.' },
        analyticalAndMetricsRigor: { score: 1, feedback: 'Zero calculations, metrics, or architectural constraints provided.' },
        strategicVisionAndTradeoffs: { score: 1, feedback: 'No trade-offs or alternatives evaluated.' },
        deliveryAndConciseness: { score: 2, feedback: 'Incomplete answer.' }
      }
    };
  }

  const prompt = `You are an elite, demanding ${trackConfig.barRaiserTitle} at ${company || 'Google/Meta/Stripe/Netflix'}.
You are conducting a strict hiring committee calibration for a candidate interviewing for: "${role || trackConfig.defaultRole}" at the "${difficulty}" level.

QUESTION POSED (${track.toUpperCase()} Track - ${category}):
"${question.question}"

CANDIDATE'S ACTUAL SUBMITTED TRANSCRIPT / ANSWER:
"""
${answer}
"""

CANDIDATE TARGET PROFILE:
- Target Track: ${trackConfig.label}
- Target Role & Level: ${difficulty} ${role || trackConfig.defaultRole}
- Target Company Bar: ${company || 'Tier-1 FAANG/Unicorn'}
- Evaluation Category: ${category}
${jobDescription ? `- Role Nuances from JD: "${jobDescription.slice(0, 600)}"` : ''}

STRICT BAR-RAISER SCORING CALIBRATION GUIDELINES:
DO NOT INFLATE SCORES. Be tough, objective, and realistic. Most candidates score between 5.0 and 7.5.
- **Strong Hire (8.8 - 10.0)**: Reserved ONLY for top 5% candidates. Flawless structure, deep technical/domain mastery, explicit quantitative justification, zero single points of failure, exhaustive trade-off evaluation.
- **Hire (7.5 - 8.7)**: Solid senior performance. Clear framework, strong rationale, covers primary edge cases, realistic scale considerations. Minor omissions in secondary trade-offs.
- **Lean Hire (6.0 - 7.4)**: Understands core concepts, but stays at a high level. Lacks specific numerical estimates, misses 1-2 critical edge cases or failure modes, or uses generic buzzwords without mechanics.
- **Lean No Hire (4.5 - 5.9)**: Superficial answer. Hand-wavy explanations ("I'll just use Redis/AI"), lack of structured progression, fails to handle scale or edge cases, poor trade-off analysis.
- **No Hire (< 4.5)**: Factually incorrect concepts, rambling without direction, completely missing core question requirements, or dangerously naive assumptions.

TRACK-SPECIFIC PENALTIES:
- If PM: Deduct heavily if no clear User Persona, missing North Star Metric & Counter-Metric (guardrail), or missing RICE/Go-To-Market risks.
- If SWE: Deduct heavily if claiming "I will use Kafka/Redis/NoSQL" without explaining partition keys, cache invalidation/thundering herd, CAP theorem consistency model, or database indexing strategies.
- If Scrum Master: Deduct heavily if demonstrating command-and-control behavior instead of servant-leadership, or ignoring flow metrics (Cycle time, CFD, WIP limits) and psychological safety.

Respond STRICTLY in valid JSON adhering to this schema:
{
  "score": 7.4,
  "verdict": "Lean Hire",
  "summary": "1-2 sentence executive verdict detailing why this answer passed or fell short of the ${difficulty} bar at ${company || 'top tech companies'}.",
  "whatWasStrong": [
    "Specific strength 1 with direct reference to candidate's points",
    "Specific strength 2 highlighting structured logic, technical depth, or user empathy",
    "Specific strength 3 (if applicable)"
  ],
  "whatWasMissing": [
    "Critical omission 1 (e.g. neglected partition key skew, missing counter-metrics, unstated failure domains)",
    "Critical omission 2 (e.g. lack of quantitative throughput estimates or rollback strategies)",
    "Critical omission 3 (e.g. hand-wavy trade-off justification)"
  ],
  "oneSpecificSuggestion": "1 actionable, high-leverage coaching tip that will instantly elevate the candidate's score on this exact topic in their next interview.",
  "modelAnswer": "### 1. Requirements & Scope Clarification\\n...\\n### 2. High-Level Architecture & Core Strategy\\n...\\n### 3. Deep Dive & Resiliency / Edge Cases\\n...\\n### 4. Explicit Trade-offs & Counter-Metrics\\n...",
  "rubricBreakdown": {
    "structureAndClarity": {
      "score": 7,
      "feedback": "Specific, calibrated feedback on framework adherence and logical sequence."
    },
    "userFocusAndEmpathy": {
      "score": 7,
      "feedback": "Specific feedback on domain depth, persona understanding, or system functional requirements."
    },
    "analyticalAndMetricsRigor": {
      "score": 6,
      "feedback": "Specific feedback on quantitative calculations, scale parameters, latency budgets, or data metrics."
    },
    "strategicVisionAndTradeoffs": {
      "score": 7,
      "feedback": "Specific feedback on explicit evaluation of alternatives, CAP trade-offs, or organizational second-order effects."
    },
    "deliveryAndConciseness": {
      "score": 8,
      "feedback": "Specific feedback on communication precision, lack of fluff, and clarity."
    }
  }
}`;

  const systemInstruction = `You are a legendary ${trackConfig.barRaiserTitle} known for rigorous, calibrated, zero-fluff candidate evaluations. You output pure valid JSON only.`;

  const result = await callGeminiApi({
    apiKey,
    prompt,
    systemInstruction,
    jsonMode: true
  });

  const parsed = parseJsonSafely(result.rawText);
  if (!parsed || typeof parsed.score !== 'number') {
    throw new Error('Could not parse structured evaluation from Gemini response.');
  }

  const rawScore = Number(parsed.score.toFixed(1));
  const finalScore = Math.min(10.0, Math.max(1.0, rawScore));

  const derivedVerdict = parsed.verdict || (
    finalScore >= 8.8 ? 'Strong Hire' :
    finalScore >= 7.5 ? 'Hire' :
    finalScore >= 6.0 ? 'Lean Hire' :
    finalScore >= 4.5 ? 'Lean No Hire' : 'No Hire'
  );

  return {
    score: finalScore,
    verdict: derivedVerdict,
    summary: parsed.summary || 'Answer calibrated against top-tier tech hiring standards.',
    whatWasStrong: Array.isArray(parsed.whatWasStrong) ? parsed.whatWasStrong : [parsed.whatWasStrong || 'Good structure.'],
    whatWasMissing: Array.isArray(parsed.whatWasMissing) ? parsed.whatWasMissing : [parsed.whatWasMissing || 'Missing depth in trade-offs and edge cases.'],
    oneSpecificSuggestion: parsed.oneSpecificSuggestion || 'Practice structuring your answers with explicit trade-offs and quantitative constraints.',
    modelAnswer: parsed.modelAnswer || 'Exemplary benchmark answer not generated.',
    rubricBreakdown: parsed.rubricBreakdown || {
      structureAndClarity: { score: 6, feedback: 'Standard progression.' },
      userFocusAndEmpathy: { score: 6, feedback: 'Adequate domain understanding.' },
      analyticalAndMetricsRigor: { score: 5, feedback: 'Needs more concrete numerical estimates.' },
      strategicVisionAndTradeoffs: { score: 5, feedback: 'Explore explicit architectural trade-offs.' },
      deliveryAndConciseness: { score: 7, feedback: 'Clear delivery.' }
    },
    modelUsed: result.modelUsed
  };
}

/**
 * Ask a clarifying question to the interviewer during prep
 */
export async function askClarifyingQuestion({
  apiKey,
  track = 'pm',
  question,
  candidateClarification,
  role,
  company
}) {
  const trackConfig = ROLE_TRACKS[track] || ROLE_TRACKS.pm;

  const prompt = `You are a ${trackConfig.barRaiserTitle} at ${company || 'a top tech company'} interviewing a candidate for ${role || trackConfig.defaultRole}.
You asked the candidate this question:
"${question.question}"

The candidate has just asked you this clarifying question before beginning their full answer:
"${candidateClarification}"

Provide a realistic, professional, yet concise response (2-3 sentences max) from the interviewer's perspective to clarify scope, constraints, traffic scale, or assumptions without giving away the entire solution.`;

  const result = await callGeminiApi({
    apiKey,
    prompt,
    systemInstruction: `You are an experienced ${trackConfig.barRaiserTitle}. Respond naturally and concisely in 2-3 sentences.`,
    jsonMode: false
  });

  return result.rawText.trim();
}
