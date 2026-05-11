"use client";

import { useState, useRef, useEffect } from "react";

export interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onRecordingCancel?: () => void;
  maxDuration?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onRecordingCancel,
  maxDuration = 300,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cancelledRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      cancelledRef.current = false;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (!cancelledRef.current && chunksRef.current.length > 0) {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          onRecordingComplete(audioBlob);
        }
        resetRecorder();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const next = prev + 1;
          if (next >= maxDuration) {
            stopRecording();
            return prev;
          }
          return next;
        });
      }, 1000);
    } catch {
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current!.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    cancelledRef.current = true;
    stopRecording();
    chunksRef.current = [];
    onRecordingCancel?.();
  };

  const resetRecorder = () => {
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
    chunksRef.current = [];
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          Start Recording
        </button>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-lg font-mono">{formatTime(recordingTime)}</span>
          </div>

          <button
            onClick={togglePause}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Stop
          </button>

          <button
            onClick={cancelRecording}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ color: "var(--color-error)" }}
          >
            Cancel
          </button>
        </>
      )}

      {isRecording && recordingTime > maxDuration * 0.9 && (
        <p className="text-sm text-yellow-600">
          Approaching limit ({formatTime(maxDuration)})
        </p>
      )}
    </div>
  );
};
