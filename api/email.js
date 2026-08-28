import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'InterviewPrep AI <onboarding@resend.dev>';

/**
 * Send 6-Digit Email OTP for Passwordless Sign-In via Resend
 */
export async function sendOtpEmail({ email, code }) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, OTP simulated:', code);
    return { simulated: true, code };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `🔑 Your InterviewPrep AI Sign-In Code: ${code}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #0f172a; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 24px;">InterviewPrep AI</h1>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">PM &bull; SWE &bull; Scrum Master Studio</p>
          </div>
          
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <h2 style="font-size: 18px; margin-top: 0; color: #1e293b;">Sign In Verification Code</h2>
            <p style="font-size: 14px; color: #475569; margin-bottom: 20px;">
              Enter this 6-digit verification code in InterviewPrep AI to sign in:
            </p>
            
            <div style="background-color: #f1f5f9; letter-spacing: 6px; font-size: 32px; font-weight: 800; color: #2563eb; padding: 14px 20px; border-radius: 8px; font-family: monospace; display: inline-block; margin-bottom: 20px;">
              ${code}
            </div>
            
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              This code expires in 10 minutes. If you did not request this code, you can safely ignore this email.
            </p>
          </div>
        </div>
      `
    });
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send OTP via Resend:', err);
    return { error: err.message };
  }
}

/**
 * Send Welcome Email to newly registered candidate
 */
export async function sendWelcomeEmail({ email, name }) {
  if (!resend) {
    return { skipped: true };
  }

  try {
    const candidateName = name || email.split('@')[0];
    const data = await resend.emails.send({
      from: FROM_EMAIL,
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

/**
 * Send Admin Notification when User submits Feedback
 */
export async function sendFeedbackNotification({ rating, category, feedbackText, userEmail }) {
  if (!resend) return { skipped: true };

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'akashkaintura.ak@gmail.com';
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [adminEmail],
      subject: `⭐ New InterviewPrep AI Feedback [${rating}/5 Stars] - ${category}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0f172a;">
          <h2>New User Feedback Received!</h2>
          <p><strong>Rating:</strong> ${'⭐'.repeat(rating || 5)} (${rating}/5)</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>User Email:</strong> ${userEmail || 'Anonymous Candidate'}</p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-style: italic;">"${feedbackText}"</p>
          </div>
        </div>
      `
    });
  } catch (e) {
    console.error('Failed to send admin feedback notification:', e);
  }
}
