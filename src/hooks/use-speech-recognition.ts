// src/hooks/use-speech-recognition.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onEnd?: (finalTranscript: string) => void;
  language?: string;
  medicalContext?: boolean;
}

/**
 * Enhanced Speech Recognition & Transcription Hook for Medical Use
 */
export const useSpeechRecognition = ({
  onResult,
  onEnd,
  language = 'en-US',
  medicalContext = true
}: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confirmation storage for confirmed browser segments
  const finalSegmentsRef = useRef('');
  const liveTranscriptRef = useRef('');

  // Real-time Web Speech Recognition (for live preview)
  const recognitionRef = useRef<any>(null);

  // Audio Capture for specialized STT APIs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const timerRef = useRef<any>(null);
  const animationRef = useRef<number>();

  // Sync refs manually inside control functions to avoid race conditions with effects
  const isListeningRef = useRef(false);
  const isPausedRef = useRef(false);

  const onResultRef = useRef(onResult);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onResultRef.current = onResult;
    onEndRef.current = onEnd;
  }, [onResult, onEnd]);

  useEffect(() => {
    // Setup Live Preview Recognition (Standard Browser API)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let newFinals = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newFinals += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (newFinals) {
          finalSegmentsRef.current += newFinals;
        }

        const fullTranscript = (finalSegmentsRef.current + interimTranscript).trim();
        const cleanedText = medicalContext ? cleanMedicalTerms(fullTranscript) : fullTranscript;

        liveTranscriptRef.current = cleanedText;
        setTranscript(cleanedText);
        onResultRef.current?.(cleanedText);
      };

      recognition.onerror = (event: any) => {
        console.error('Recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        if (event.error === 'no-speech') return;
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          // Restart recognition if still listening (browser often stops automatically)
          try {
            recognition.start();
          } catch (e) {
            // Ignore if already starting
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      // Only clean up on actual unmount, not on state changes
    };
  }, [language, medicalContext]); // removed isListening from deps

  const cleanMedicalTerms = (text: string) => {
    const medicalTerms: Record<string, string> = {
      'm r i': 'MRI',
      'c t': 'CT',
      'c t scan': 'CT scan',
      'x ray': 'X-ray',
      'm r': 'MR',
      'millimeter': 'mm',
      'centimeter': 'cm',
      'millilitre': 'mL',
      'kilogram': 'kg',
      'e s r': 'ESR',
      'c r p': 'CRP',
      'w b c': 'WBC',
      'r b c': 'RBC',
      'h g b': 'Hb',
      'p l t': 'platelet',
      'u s g': 'ultrasound',
      'e c g': 'ECG',
      'e e g': 'EEG',
      'b p': 'blood pressure',
      'h r': 'heart rate',
      'r r': 'respiratory rate',
      's p o two': 'SpO₂',
      's a o two': 'SaO₂',
      'p a o two': 'PaO₂',
      'p a c o two': 'PaCO₂',
      'p h': 'pH',
      'n a': 'sodium',
      'k': 'potassium',
      'c a': 'calcium',
      'm g': 'magnesium',
      'c l': 'chloride',
      'h c o three': 'HCO₃',
      'b u n': 'BUN',
      'c r': 'creatinine',
      'a l t': 'ALT',
      'a s t': 'AST',
      'a l p': 'ALP',
      'g g t': 'GGT',
      't b i l': 'total bilirubin',
      'd b i l': 'direct bilirubin',
      't p': 'total protein',
      'a l b': 'albumin',
      'p t': 'prothrombin time',
      'i n r': 'INR',
      'a p t t': 'aPTT',
      'f b g': 'fasting blood glucose',
      'h b a one c': 'HbA1c',
      't s h': 'TSH',
      'f t four': 'FT4',
      'f t three': 'FT3',
      'p s a': 'PSA',
      'c e a': 'CEA',
      'c a one two five': 'CA-125',
      'c a one nine nine': 'CA 19-9',
      'a f p': 'AFP',
      'h c g': 'hCG',
      'u r i': 'URI',
      'u t i': 'UTI',
      'c o p d': 'COPD',
      'c h f': 'CHF',
      'm i': 'MI',
      'c v a': 'CVA',
      't i a': 'TIA',
      'd m': 'DM',
      'h t n': 'HTN',
      'c k d': 'CKD',
      'c l d': 'CLD',
      'a r d s': 'ARDS',
      'd i c': 'DIC',
      'd v t': 'DVT',
      'p e': 'PE',
      'a f': 'AF',
      'v t': 'VT',
      'v f': 'VF',
      'a c l s': 'ACLS',
      'b l s': 'BLS',
      'c p r': 'CPR',
      'e t t': 'ETT',
      'i v': 'IV',
      'i m': 'IM',
      's c': 'SC',
      'p o': 'PO',
      'p r': 'PR',
      's l': 'SL',
      't d s': 'TDS',
      'b d': 'BD',
      'q d': 'QD',
      'q i d': 'QID',
      'q o d': 'QOD',
      'p r n': 'PRN',
      's o s': 'SOS',
      's t a t': 'STAT',
      'n p o': 'NPO',
      'a d lib': 'ad lib',

      //Diction-specific terms
      'full stop': '. ',
      'comma': ', ',
      'semi colon': '; ',
      'colon': ': ',
      'new paragraph': '\n\n',
      'new line': '\n',
      'right lower': 'right lower',
      'right upper': 'right upper',
      'left lower': 'left lower',
      'left upper': 'left upper',
      'well aerated': 'well aerated',
      'bilaterally': 'bilaterally',
      'focal area': 'focal area',
      'consolidation': 'consolidation',
      'approximately': 'approximately',
      'cavitation': 'cavitation',
      'pleural effusion': 'pleural effusion',
      'pneumothorax': 'pneumothorax',
      'mediastinal': 'mediastinal',
      'hilar': 'hilar',
      'lymphadenopathy': 'lymphadenopathy',
      'unremarkable': 'unremarkable',
      'significant': 'significant',
    };

    let cleaned = text.toLowerCase();

    cleaned = cleaned.replace(/full stop/gi, '. ');
    cleaned = cleaned.replace(/comma/gi, ', ');
    cleaned = cleaned.replace(/semi colon/gi, '; ');
    cleaned = cleaned.replace(/colon/gi, ': ');
    cleaned = cleaned.replace(/new paragraph/gi, '\n\n');
    cleaned = cleaned.replace(/new line/gi, '\n');
    cleaned = cleaned.replace(/paragraph break/gi, '\n\n');

    // Handle medical measurements
    cleaned = cleaned.replace(/(\d+)\s*(millimeters?|mm)/gi, '$1 mm');
    cleaned = cleaned.replace(/(\d+)\s*(centimeters?|cm)/gi, '$1 cm');
    cleaned = cleaned.replace(/(\d+)\s*(kilograms?|kg)/gi, '$1 kg');
    cleaned = cleaned.replace(/(\d+)\s*(grams?|g)/gi, '$1 g');
    cleaned = cleaned.replace(/(\d+)\s*(milligrams?|mg)/gi, '$1 mg');
    cleaned = cleaned.replace(/(\d+)\s*(micrograms?|mcg|µg)/gi, '$1 µg');
    cleaned = cleaned.replace(/(\d+)\s*(liters?|l)/gi, '$1 L');
    cleaned = cleaned.replace(/(\d+)\s*(milliliters?|ml)/gi, '$1 mL');

    // Fix common medical dictation issues
    cleaned = cleaned.replace(/i will erited/gi, 'are well aerated');
    cleaned = cleaned.replace(/by literally/gi, 'bilaterally');
    cleaned = cleaned.replace(/on pneumothoraxes/gi, 'or pneumothorax');
    cleaned = cleaned.replace(/there had sizes/gi, 'The heart size');
    cleaned = cleaned.replace(/various tunnel/gi, 'mediastinal');
    cleaned = cleaned.replace(/allow structures/gi, 'hilar structures');
    cleaned = cleaned.replace(/are remarkable/gi, 'are unremarkable');
    cleaned = cleaned.replace(/significantly/gi, 'significant lymphadenopathy');

    // Convert spoken fractions
    cleaned = cleaned.replace(/(one|two|three|four|five|six|seven|eight|nine|ten)\s*(half|halves|third|thirds|quarter|quarters)/gi, (match, num, fraction) => {
      const numbers: Record<string, string> = {
        'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
        'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
      };
      const fractions: Record<string, string> = {
        'half': '½', 'halves': '½', 'third': '⅓', 'thirds': '⅓',
        'quarter': '¼', 'quarters': '¼'
      };
      return `${numbers[num.toLowerCase()]} ${fractions[fraction.toLowerCase()]}`;
    });

    // Handle common mis-transcriptions in medical dictation
    const misTranslations: Record<string, string> = {
      'i will': 'are well',
      'by literally': 'bilaterally',
      'on pneumothoraxes': 'or pneumothorax',
      'there had': 'The heart',
      'various tunnel': 'mediastinal',
      'allow': 'hilar',
      'remarkable': 'unremarkable',
      'significantly': 'significant lymphadenopathy',
      'lobe consolidation comma': 'lobe consolidation,',
      'likely in effective': 'likely infectious',
      'in etiology': 'in etiology',
    };

    Object.entries(misTranslations).forEach(([incorrect, correct]) => {
      const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
      cleaned = cleaned.replace(regex, correct);
    });

    // Apply medical term replacements
    Object.entries(medicalTerms).forEach(([spoken, written]) => {
      const regex = new RegExp(`\\b${spoken}\\b`, 'gi');
      cleaned = cleaned.replace(regex, written);
    });

    // Capitalize sentences and proper medical terms
    cleaned = cleaned.replace(/(^|\.\s+)([a-z])/g, (match, boundary, letter) => {
      return boundary + letter.toUpperCase();
    });

    // Fix common medical phrasing
    cleaned = cleaned.replace(/no significant|no acute|no evidence of/gi, (match) => match);
    cleaned = cleaned.replace(/normal limits|within normal/gi, 'within normal limits');
    cleaned = cleaned.replace(/patient presents with/gi, 'Patient presents with');

    return cleaned;
  };

  const startRecording = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setError("Your browser does not support audio recording. Please use Chrome or Edge.");
      return;
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' :
        MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000 // Higher quality for medical speech
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          await handleMedicalTranscription(audioBlob);
        } catch (transcriptionError) {
          console.error('Transcription failed:', transcriptionError);
          setError('Transcription service failed. Please try again.');
        } finally {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      // Setup audio visualization
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setAudioLevel(Math.min(100, (average / 128) * 100)); // Normalize to 0-100
          animationRef.current = requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;

      // Start speech recognition for live preview
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (recognitionErr) {
          console.log('Speech recognition already active');
        }
      }

      setIsListening(true);
      isListeningRef.current = true;
      setIsPaused(false);
      isPausedRef.current = false;
      setIsTranscribing(false);
      setTranscript('');
      finalSegmentsRef.current = '';
      liveTranscriptRef.current = '';

      toast.success("Recording started", {
        description: "Speak clearly for medical transcription",
      });

    } catch (err: any) {
      console.error('Microphone Access Error:', err);
      let errorMessage = 'Could not access microphone';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = "Microphone access denied. Please check browser permissions.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = "No microphone found on your device.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = "Microphone is already in use by another application.";
      }

      setError(errorMessage);
      setIsListening(false);
    }
  }, []);

  const handleMedicalTranscription = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const DEEPGRAM_API_KEY = import.meta.env.VITE_APP_DEEPGRAM_API_KEY;

      // Using Deepgram's medical model with enhanced medical features
      const DEEPGRAM_URL = `https://api.deepgram.com/v1/listen?model=nova-3-medical&smart_format=true&medical=true&punctuate=true&paragraphs=true&diarize=false&numerals=true&language=${language}&utterances=true`;

      const response = await fetch(DEEPGRAM_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': audioBlob.type,
          'Accept': 'application/json',
        },
        body: audioBlob
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Deepgram API failed: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      // Extract the best transcription
      let finalTranscript = '';
      if (data.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
        finalTranscript = data.results.channels[0].alternatives[0].transcript;

        // Apply medical cleaning to the final transcript
        finalTranscript = medicalContext ? cleanMedicalTerms(finalTranscript) : finalTranscript;

        // Add confidence score if available
        const confidence = data.results.channels[0].alternatives[0].confidence;
        console.log(`Transcription confidence: ${confidence}`);

        if (confidence < 0.7) {
          toast.warning("Low transcription confidence", {
            description: "Some words may be inaccurate. Please review carefully.",
          });
        }
      } else {
        throw new Error('No transcription returned from API');
      }

      setIsTranscribing(false);

      // Call the onEnd callback with the final transcript
      if (finalTranscript.trim()) {
        onEndRef.current?.(finalTranscript);
        toast.success("Medical transcription complete", {
          description: "AI has processed your dictation with medical context.",
        });
      } else {
        const fallback = liveTranscriptRef.current || transcript;
        onEndRef.current?.(fallback); // Fallback to live transcript
        toast.info("No speech detected", {
          description: "Using live preview text instead.",
        });
      }

    } catch (err: any) {
      console.error('Deepgram Medical Processing Error:', err);
      setIsTranscribing(false);
      setError(`Transcription failed: ${err.message}`);

      // Fallback: Use the live transcript if API fails
      const fallbackTranscript = liveTranscriptRef.current || transcript.trim() || '';
      if (fallbackTranscript) {
        onEndRef.current?.(fallbackTranscript);
        toast.warning("Using live preview", {
          description: "Full transcription service unavailable.",
        });
      } else {
        onEndRef.current?.('');
        toast.error("Transcription failed", {
          description: "Please try recording again.",
        });
      }
    }
  };

  const stopRecording = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Stop recognition error:', e);
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setError(null);
  }, []);

  const stopAll = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;

    if (isListening && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isListening,
    isPaused,
    isTranscribing,
    transcript,
    recordingTime: formatTime(recordingTime),
    audioLevel,
    error,
    startRecording,
    stopRecording,
    pauseRecording: () => {
      if (isListeningRef.current) {
        const nextPaused = !isPaused;
        isPausedRef.current = nextPaused;
        setIsPaused(nextPaused);

        if (recognitionRef.current) {
          try {
            if (nextPaused) {
              recognitionRef.current.stop();
            } else {
              recognitionRef.current.start();
            }
          } catch (e) {
            console.log('Pause/Resume error:', e);
          }
        }
      }
    },
    clearTranscript: () => {
      setTranscript('');
      finalSegmentsRef.current = '';
      liveTranscriptRef.current = '';
      setError(null);
      onResultRef.current?.('');
    },
    clearError: () => setError(null),
  };
};