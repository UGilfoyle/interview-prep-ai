/**
 * Gemini API Integration Service for Multi-Track Tech Interview Simulator
 * Supports Product Management (PM), Software Engineering (SWE), and Scrum Master / Agile tracks
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
          temperature: 0.7,
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

  const prompt = `You are a ${trackConfig.barRaiserTitle} at ${company || 'a top-tier tech company'}.
You are conducting a live technical interview for the target role of: "${role || trackConfig.defaultRole}".

TARGET CANDIDATE DETAILS:
- Track: ${trackConfig.label}
- Target Role: ${role || trackConfig.defaultRole}
- Target Company: ${company || 'Top Tech Company'}
- Difficulty / Seniority Level: ${difficulty}
- Interview Category for this round: ${categoryName} (Category Key: "${category}")
- Question Number: ${questionIndex} of ${totalQuestions}
${jobDescription ? `- Job Description Context: "${jobDescription.slice(0, 1000)}"` : ''}
${previousQuestions.length > 0 ? `- Previously asked questions in this session to avoid repeating: ${JSON.stringify(previousQuestions)}` : ''}

INSTRUCTIONS:
1. Generate ONE highly realistic, rigorous, and practical interview question tailored specifically to the company (${company || 'Target Company'}), the specific role (${role}), and the required category (${categoryName}).
2. The question must feel authentic to what actual hiring bar raisers ask at top companies like Google, Stripe, Meta, Netflix, Uber, Amazon, and Spotify.
3. If track is 'pm': Focus on product design (CIRCLES), analytics, TAM sizing, RICE prioritization, or behavioral leadership.
4. If track is 'swe': Focus on distributed system design (scale, CAP, caching, DB), data structures/algorithms, production debugging/refactoring, API/DB modeling, or technical leadership.
5. If track is 'scrum_master': Focus on ceremony facilitation (Retrospectives/Planning), resolving dev-QA-PO conflicts, agile metrics/flow, team coaching (GROW), or scaled agile dependencies.

Respond in STRICT JSON format adhering to this structure:
{
  "title": "Short descriptive title (e.g. 'Design a Distributed Ledger for Stripe Payments')",
  "question": "Full verbatim interview question asked by the interviewer",
  "context": "1-2 sentences on why this question is crucial for this specific role and company",
  "hints": [
    "Specific hint 1 (e.g. Recommended framework like CIRCLES, System Design 5-Step, or Retrospective 5-Stage)",
    "Specific hint 2 (Key technical or architectural constraints / user considerations)",
    "Specific hint 3 (Edge cases, bottlenecks, or trade-offs to evaluate)"
  ],
  "clarifications": [
    "Interviewer clarification 1 if candidate asks about scope/scale/constraints",
    "Interviewer clarification 2 regarding target environment or parameters"
  ],
  "evaluationCriteria": [
    "Key thing interviewer is looking for 1",
    "Key thing interviewer is looking for 2",
    "Key thing interviewer is looking for 3"
  ]
}`;

  const systemInstruction = `You are a world-class ${trackConfig.barRaiserTitle}. You output only valid JSON without markdown conversational filler.`;

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
      fallbackNotice: 'Loaded from curated interview bank (AI generation offline or timed out).'
    };
  }
}

/**
 * Evaluate Candidate's Answer with Track-Specific Rubric
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

  if (!answer || answer.trim().length < 15) {
    return {
      score: 2.0,
      verdict: 'No Hire',
      summary: 'Answer was too brief to evaluate thoroughly.',
      whatWasStrong: ['Attempted the question.'],
      whatWasMissing: ['Detailed structured thinking, technical depth, edge cases, and trade-off analysis were missing.'],
      oneSpecificSuggestion: 'Provide a structured, multi-paragraph response using standard frameworks.',
      modelAnswer: 'Please provide a comprehensive response to receive a full model answer breakdown.',
      rubricBreakdown: {
        structureAndClarity: { score: 2, feedback: 'Insufficient detail to assess structure.' },
        userFocusAndEmpathy: { score: 2, feedback: 'Insufficient technical/domain depth.' },
        analyticalAndMetricsRigor: { score: 2, feedback: 'No metrics or scalability calculations identified.' },
        strategicVisionAndTradeoffs: { score: 2, feedback: 'No trade-offs evaluated.' },
        deliveryAndConciseness: { score: 2, feedback: 'Too brief.' }
      }
    };
  }

  const prompt = `You are a ${trackConfig.barRaiserTitle} at ${company || 'a top tech company'}.
You are evaluating a candidate's answer for the role of: "${role || trackConfig.defaultRole}" (${difficulty} Level).

QUESTION ASKED (${track.toUpperCase()} - ${category}):
"${question.question}"

CANDIDATE'S SUBMITTED ANSWER:
"""
${answer}
"""

ADDITIONAL CONTEXT:
- Track: ${trackConfig.label}
- Target Role: ${role || trackConfig.defaultRole}
- Target Company: ${company || 'Top Tech Company'}
- Category: ${category}
${jobDescription ? `- Job Description Nuance: "${jobDescription.slice(0, 500)}"` : ''}

EVALUATION RUBRIC & INSTRUCTIONS:
Evaluate this answer with extreme rigor, calibrated against hiring standards at Google, Meta, Stripe, Amazon, Netflix, and Spotify.
1. Provide an overall score between 1.0 and 10.0 (one decimal place).
2. Assign an official hiring recommendation: 'Strong Hire' (8.8-10.0), 'Hire' (7.5-8.7), 'Lean Hire' (6.0-7.4), 'Lean No Hire' (4.5-5.9), 'No Hire' (<4.5).
3. "whatWasStrong": Exactly 2 to 4 bullet points highlighting specific strengths (structural clarity, architectural depth, trade-off analysis, servant leadership, or STAR execution).
4. "whatWasMissing": Exactly 2 to 4 bullet points identifying critical omissions, unstated assumptions, neglected edge cases, bottlenecks, lack of guardrails, or missing trade-offs.
5. "oneSpecificSuggestion": Exactly 1 high-impact, actionable coaching sentence that will instantly elevate the candidate's next interview answer.
6. "modelAnswer": A comprehensive, exemplary ${difficulty}-level model answer to this exact question, structured clearly with headings/bullet points.
7. "rubricBreakdown": Score (1 to 10) and 1-sentence specific feedback for each of the 5 rubric pillars:
   - structureAndClarity (${trackConfig.rubricPillars.structureAndClarity})
   - userFocusAndEmpathy (${trackConfig.rubricPillars.userFocusAndEmpathy})
   - analyticalAndMetricsRigor (${trackConfig.rubricPillars.analyticalAndMetricsRigor})
   - strategicVisionAndTradeoffs (${trackConfig.rubricPillars.strategicVisionAndTradeoffs})
   - deliveryAndConciseness (${trackConfig.rubricPillars.deliveryAndConciseness})

Respond ONLY in valid JSON matching this schema:
{
  "score": 7.8,
  "verdict": "Hire",
  "summary": "1-2 sentence executive verdict on candidate performance",
  "whatWasStrong": [
    "Clear structured breakdown following standard best practices.",
    "Strong domain depth and explicit trade-off considerations."
  ],
  "whatWasMissing": [
    "Did not specify edge cases or resilience under failure conditions.",
    "Lacked explicit quantitative justification."
  ],
  "oneSpecificSuggestion": "Always conclude your answer by explicitly evaluating at least 2 trade-offs and stating failure recovery modes.",
  "modelAnswer": "### 1. Requirements & Scope\\n...\\n### 2. Core Architecture / Solutions\\n...\\n### 3. Trade-offs & Resiliency\\n...",
  "rubricBreakdown": {
    "structureAndClarity": { "score": 8, "feedback": "Well-organized progression from problem definition to solution." },
    "userFocusAndEmpathy": { "score": 8, "feedback": "Demonstrated deep domain empathy and realistic constraints." },
    "analyticalAndMetricsRigor": { "score": 7, "feedback": "Good quantitative reasoning; could go deeper on edge-case metrics." },
    "strategicVisionAndTradeoffs": { "score": 7, "feedback": "Clear alignment with business goals; explicit trade-offs discussed." },
    "deliveryAndConciseness": { "score": 8, "feedback": "Crisp communication with minimal fluff." }
  }
}`;

  const systemInstruction = `You are an elite ${trackConfig.barRaiserTitle}. You evaluate candidates with rigorous, calibrated, and actionable feedback. Return pure valid JSON only.`;

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

  return {
    score: Math.min(10, Math.max(1, Number(parsed.score.toFixed(1)))),
    verdict: parsed.verdict || (parsed.score >= 8.5 ? 'Strong Hire' : parsed.score >= 7.0 ? 'Hire' : parsed.score >= 5.5 ? 'Lean Hire' : 'Lean No Hire'),
    summary: parsed.summary || 'Answer evaluated against top-tier hiring benchmarks.',
    whatWasStrong: Array.isArray(parsed.whatWasStrong) ? parsed.whatWasStrong : [parsed.whatWasStrong || 'Good structure.'],
    whatWasMissing: Array.isArray(parsed.whatWasMissing) ? parsed.whatWasMissing : [parsed.whatWasMissing || 'Missing depth in trade-offs.'],
    oneSpecificSuggestion: parsed.oneSpecificSuggestion || 'Practice structuring your answers with clear numbered frameworks.',
    modelAnswer: parsed.modelAnswer || 'Exemplary answer not generated.',
    rubricBreakdown: parsed.rubricBreakdown || {
      structureAndClarity: { score: 7, feedback: 'Solid structure.' },
      userFocusAndEmpathy: { score: 7, feedback: 'Good domain depth.' },
      analyticalAndMetricsRigor: { score: 7, feedback: 'Reasonable metrics/architecture.' },
      strategicVisionAndTradeoffs: { score: 7, feedback: 'Fair trade-offs.' },
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

Provide a realistic, helpful, yet concise response (2-3 sentences max) from the interviewer's perspective to clarify scope, constraints, or assumptions without giving away the entire solution.`;

  const result = await callGeminiApi({
    apiKey,
    prompt,
    systemInstruction: `You are an experienced ${trackConfig.barRaiserTitle}. Respond naturally and concisely in 2-3 sentences.`,
    jsonMode: false
  });

  return result.rawText.trim();
}
