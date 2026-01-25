// src/hooks/use-speech-recognition.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onEnd?: (finalTranscript: string) => void;
}

/**
 * Enhanced Speech Recognition & Transcription Hook
 */
export const useSpeechRecognition = ({ onResult, onEnd }: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Confirmation storage for confirmed browser segments (prevents tripling/duplication)
  const finalSegmentsRef = useRef('');

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

  // Use refs for callbacks to prevent unnecessary re-renders of the effect
  const onResultRef = useRef(onResult);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onResultRef.current = onResult;
    onEndRef.current = onEnd;
  }, [onResult, onEnd]);

  useEffect(() => {
    // 1. Setup Live Preview Recognition (Standard Browser API)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

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
        const cleanedText = cleanMedicalTerms(fullTranscript);
        setTranscript(cleanedText);
        onResultRef.current?.(cleanedText);
      };

      recognition.onerror = (event: any) => {
        console.error('Recognition error:', event.error);
        if (event.error === 'no-speech') return;
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopAll();
    };
  }, []);

  const cleanMedicalTerms = (text: string) => {
    const medicalTerms: Record<string, string> = {
      'm r i': 'MRI',
      'c t scan': 'CT Scan',
      'x ray': 'X-ray',
      'millimeter': 'mm',
      'centimeter': 'cm',
    };

    let cleaned = text;
    Object.entries(medicalTerms).forEach(([spoken, written]) => {
      const regex = new RegExp(`\\b${spoken}\\b`, 'gi');
      cleaned = cleaned.replace(regex, written);
    });
    return cleaned;
  };

  const startRecording = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      alert("Your browser does not support audio recording. Please use a modern browser like Chrome or Edge.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await handleProperTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((prev, curr) => prev + curr, 0);
          const average = sum / bufferLength;
          setAudioLevel(Math.min(100, average * 1.5));
          animationRef.current = requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (recognitionErr) {
          console.error('Speech Recognition already started:', recognitionErr);
        }
      }

      setIsListening(true);
      setIsPaused(false);
      setIsTranscribing(false);
      setRecordingTime(0);
      setTranscript('');
      finalSegmentsRef.current = '';

    } catch (err: any) {
      console.error('Microphone Access Error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert("Microphone access was denied. Please check your browser settings and allow microphone access for this site.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        alert("No microphone was found on your device.");
      } else {
        alert(`Could not access microphone: ${err.message || 'Unknown error'}`);
      }
      setIsListening(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) recognitionRef.current.stop();

      setIsListening(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    }
  }, [isListening]);

  const handleProperTranscription = async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      const DEEPGRAM_API_KEY = '1c6d8244d045fa75b9208f813acd07113cc3005d';
      const DEEPGRAM_URL = 'https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&punctuate=true&dictation=true';

      const response = await fetch(DEEPGRAM_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': audioBlob.type || 'audio/webm',
        },
        body: audioBlob
      });

      if (!response.ok) throw new Error('Deepgram API failed');

      const data = await response.json();
      const finalTranscript = data.results?.channels[0]?.alternatives[0]?.transcript || '';

      setIsTranscribing(false);

      if (finalTranscript) {
        onEndRef.current?.(finalTranscript);
      } else {
        onEndRef.current?.(transcript);
      }

    } catch (err) {
      console.error('Deepgram Processing Error:', err);
      setIsTranscribing(false);
      onEndRef.current?.(transcript);
    }
  };

  const stopAll = useCallback(() => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (recognitionRef.current) recognitionRef.current.stop();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }, []);

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
    startRecording,
    stopRecording,
    pauseRecording: () => setIsPaused(!isPaused),
    clearTranscript: () => {
      setTranscript('');
      finalSegmentsRef.current = '';
    },
  };
};