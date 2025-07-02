
import React, { useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, RefreshCcw, X } from 'lucide-react'

interface CameraComponentProps {
  onPictureTaken: (imageDataUrl: string) => void
  onCancel: () => void
}

export default function CameraComponent({ onPictureTaken, onCancel }: CameraComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Käytä takakameraa
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Kameran avaaminen epäonnistui:', error)
      alert('Kameran avaaminen epäonnistui. Varmista, että olet antanut luvan kameran käyttöön.')
      onCancel()
    } finally {
      setIsLoading(false)
    }
  }, [onCancel])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
        const dataUrl = canvas.toDataURL('image/png')
        onPictureTaken(dataUrl)
        stopCamera()
      }
    }
  }

  // Käynnistä kamera, kun komponentti ladataan
  React.useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Avataan kameraa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Ohje käyttäjälle */}
        <div className="absolute top-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-center">
          <p className="text-sm">Kohdista kamera ruokapakkauksen ravintotietoihin ja ota kuva</p>
        </div>
      </div>
      
      {/* Kontrollit */}
      <div className="bg-black bg-opacity-75 p-4 flex justify-around items-center">
        <Button onClick={onCancel} variant="outline" size="lg">
          <X className="h-6 w-6 mr-2" />
          Peruuta
        </Button>
        
        <Button 
          onClick={takePicture} 
          size="lg" 
          className="rounded-full w-20 h-20 bg-white text-black hover:bg-gray-200"
          disabled={!stream}
        >
          <Camera className="h-8 w-8" />
        </Button>
        
        <Button 
          onClick={startCamera} 
          variant="outline" 
          size="lg"
          disabled={!!stream}
        >
          <RefreshCcw className="h-6 w-6 mr-2" />
          Uudelleen
        </Button>
      </div>
    </div>
  )
}
