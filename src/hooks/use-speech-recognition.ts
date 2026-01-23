// src/hooks/useSpeechRecognition.ts
import { useState, useEffect, useRef } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
}

export const useSpeechRecognition = ({ onResult, onEnd }: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // For demo medical terms, we can try to improve recognition
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: any) => {
      let currentTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        // Filter out some common medical abbreviations and terms
        const medicalTerms: Record<string, string> = {
          'm r i': 'MRI',
          'c t': 'CT',
          'x ray': 'X-ray',
          'a m': 'AM',
          'p m': 'PM',
          'millimeter': 'mm',
          'centimeter': 'cm',
          'kilogram': 'kg',
        };

        let processedTranscript = transcript;
        Object.entries(medicalTerms).forEach(([spoken, written]) => {
          const regex = new RegExp(`\\b${spoken}\\b`, 'gi');
          processedTranscript = processedTranscript.replace(regex, written);
        });

        if (event.results[i].isFinal) {
          currentTranscript += processedTranscript + ' ';
        } else {
          currentTranscript += processedTranscript;
        }
      }

      // Simulate audio level for visualization
      if (currentTranscript.trim().length > 0) {
        const level = Math.min(100, Math.random() * 80 + 20); // Random between 20-100
        setAudioLevel(level);
      }

      setTranscript(prev => {
        const newTranscript = prev + currentTranscript;
        onResult?.(newTranscript);
        return newTranscript;
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current!);
      onEnd?.();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current!);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current!);
    };
  }, [onResult, onEnd]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setIsPaused(false);
      setRecordingTime(0);
      setTranscript('');

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Simulate audio level animation
      const animateAudioLevel = () => {
        if (isListening && !isPaused) {
          // Generate random level when not speaking
          const baseLevel = transcript.trim().length > 0 ? 30 : 10;
          const randomLevel = baseLevel + Math.random() * 20;
          setAudioLevel(randomLevel);
        }
        animationRef.current = requestAnimationFrame(animateAudioLevel);
      };
      animateAudioLevel();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current!);
    }
  };

  const pauseRecording = () => {
    if (recognitionRef.current && isListening) {
      if (!isPaused) {
        recognitionRef.current.stop();
        setIsPaused(true);
      } else {
        recognitionRef.current.start();
        setIsPaused(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isListening,
    isPaused,
    transcript,
    recordingTime: formatTime(recordingTime),
    audioLevel,
    startRecording,
    stopRecording,
    pauseRecording,
    clearTranscript: () => setTranscript(''),
  };
};