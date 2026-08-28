import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Send Welcome Email to newly registered candidate
 */
export async function sendWelcomeEmail({ email, name }) {
  if (!resend) {
    console.log('RESEND_API_KEY not configured, skipping welcome email.');
    return { skipped: true };
  }

  try {
    const candidateName = name || email.split('@')[0];
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'InterviewPrep AI <onboarding@resend.dev>',
      to: [email],
      subject: `🎯 Welcome to InterviewPrep AI, ${candidateName}!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 26px;">InterviewPrep AI</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">PM &bull; SWE &bull; Scrum Master Interview Studio</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <h2 style="font-size: 18px; margin-top: 0; color: #1e293b;">Hi ${candidateName}, welcome aboard! 👋</h2>
            <p style="font-size: 15px; color: #334155;">
              Your account is active and connected to <strong>Neon Serverless Postgres</strong>. You can now practice realistic interview questions with real-time speech transcription and Gemini bar-raiser rubric scoring.
            </p>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 16px; margin: 20px 0; border-radius: 6px;">
              <h3 style="margin: 0 0 6px 0; font-size: 14px; color: #1e40af;">🚀 3 Steps to Ace Your Next Interview:</h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1e3a8a;">
                <li>Pick your track: <strong>Product Manager</strong>, <strong>Software Engineer</strong>, or <strong>Scrum Master</strong>.</li>
                <li>Practice answering out loud using the <strong>Voice Speech-to-Text</strong> button.</li>
                <li>Review the <strong>5-Pillar Rubric Breakdown</strong> and copy your custom scorecards.</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 28px 0 12px;">
              <a href="https://pm-interview-prep-beryl.vercel.app" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
                Start Practice Session &rarr;
              </a>
            </div>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 24px;">
            InterviewPrep AI &bull; Powered by Google Gemini & Neon Postgres
          </p>
        </div>
      `
    });

    return { success: true, data };
  } catch (err) {
    console.error('Failed to send welcome email via Resend:', err);
    return { error: err.message };
  }
}
