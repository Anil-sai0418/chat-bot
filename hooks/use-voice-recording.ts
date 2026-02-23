import * as React from "react"
import { toast } from "sonner"

interface UseVoiceRecordingReturn {
  isRecording: boolean
  recordingTime: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  audioBlob: Blob | null
}

export function useVoiceRecording(onTranscribe?: (blob: Blob) => Promise<void>): UseVoiceRecordingReturn {
  const [isRecording, setIsRecording] = React.useState(false)
  const [recordingTime, setRecordingTime] = React.useState(0)
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null)

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const audioChunksRef = React.useRef<Blob[]>([])
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.onstart = () => {
        setIsRecording(true)
        setRecordingTime(0)

        timerIntervalRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      }

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        setIsRecording(false)
        
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current)
        }

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(blob)

        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }

        if (onTranscribe) {
          await onTranscribe(blob)
        }
      }

      mediaRecorder.start()
    } catch (error) {
      toast.error("Unable to access microphone. Please check permissions.")
      console.error("Recording error:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    audioBlob,
  }
}
