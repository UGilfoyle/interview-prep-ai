/**
 * Web Speech API Integration Service
 * Provides SpeechRecognition (Voice-to-Text) and SpeechSynthesis (Text-to-Speech)
 */

export class SpeechRecognitionManager {
  constructor({ onTranscript, onError, onStatusChange }) {
    this.onTranscript = onTranscript || (() => {});
    this.onError = onError || (() => {});
    this.onStatusChange = onStatusChange || (() => {});
    
    this.recognition = null;
    this.isRecording = false;
    this.finalTranscript = '';
    this.isSupported = false;

    this.init();
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.onStatusChange(true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let newFinalPart = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            newFinalPart += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        if (newFinalPart) {
          this.finalTranscript += newFinalPart;
        }

        this.onTranscript({
          final: this.finalTranscript,
          interim: interimTranscript,
          combined: (this.finalTranscript + interimTranscript).trim()
        });
      };

      this.recognition.onerror = (event) => {
        console.warn('SpeechRecognition Error:', event.error);
        if (event.error === 'not-allowed') {
          this.onError('Microphone access was denied. Please allow microphone permissions in your browser settings.');
        } else if (event.error !== 'no-speech') {
          this.onError(`Voice recognition notice: ${event.error}`);
        }
        this.isRecording = false;
        this.onStatusChange(false);
      };

      this.recognition.onend = () => {
        // If meant to keep recording, restart
        if (this.isRecording) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isRecording = false;
            this.onStatusChange(false);
          }
        } else {
          this.onStatusChange(false);
        }
      };
    } catch (err) {
      console.error('Failed to initialize SpeechRecognition:', err);
      this.isSupported = false;
    }
  }

  setInitialText(text) {
    this.finalTranscript = text ? (text.endsWith(' ') ? text : text + ' ') : '';
  }

  start(existingText = '') {
    if (!this.isSupported || !this.recognition) {
      this.onError('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    if (this.isRecording) return true;

    this.finalTranscript = existingText ? (existingText.endsWith(' ') ? existingText : existingText + ' ') : '';
    this.isRecording = true;

    try {
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('Recognition start exception:', err);
      this.isRecording = false;
      this.onStatusChange(false);
      return false;
    }
  }

  stop() {
    this.isRecording = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Recognition stop exception:', err);
      }
    }
    this.onStatusChange(false);
  }

  toggle(existingText = '') {
    if (this.isRecording) {
      this.stop();
      return false;
    } else {
      return this.start(existingText);
    }
  }
}

/**
 * Text-to-Speech Synthesizer for Interviewer Voice Feedback
 */
export class TextToSpeechManager {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  get isSupported() {
    return !!this.synth;
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  speak(text, { onEnd, onStart, rate = 1.0, pitch = 1.0 } = {}) {
    if (!this.isSupported) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return;
    }

    // Clean markdown headings, bullets, asterisks for natural speech
    const cleanText = text
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'en-US';

    // Pick a natural sounding English voice if available
    const voices = this.synth.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('TTS Error:', e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }
}
