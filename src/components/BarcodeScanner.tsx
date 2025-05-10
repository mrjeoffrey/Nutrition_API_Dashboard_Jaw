
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface BarcodeScannerProps {
  onDetected?: (code: string, food: any) => void;
}

const BarcodeScanner = ({ onDetected }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const { apiKey } = useAuth();

  const startScanning = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        
        // In a real app, we would initialize a barcode detection library here
        // For example: QuaggaJS, ZXing, etc.
        
        // For this demo, we'll simulate barcode detection after 3 seconds
        setTimeout(() => {
          const mockBarcode = '049000042566'; // Example barcode (Coca-Cola)
          
          if (apiKey) {
            // Attempt to look up the food item
            axios.get(`/v1_1/barcode?code=${mockBarcode}`, {
              headers: {
                Authorization: `Bearer ${apiKey}`
              }
            })
            .then(response => {
              if (onDetected) {
                onDetected(mockBarcode, response.data);
              }
              toast.success(`Found: ${response.data.name}`);
            })
            .catch(error => {
              if (onDetected) {
                onDetected(mockBarcode, null);
              }
              toast.info(`Barcode detected: ${mockBarcode}, but no matching food found`);
            })
            .finally(() => {
              stopScanning();
            });
          } else {
            if (onDetected) {
              onDetected(mockBarcode, null);
            }
            toast.success(`Barcode detected: ${mockBarcode}`);
            stopScanning();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please ensure you have granted camera permissions.');
      setHasCamera(false);
    }
  };

  const stopScanning = () => {
    if (!videoRef.current) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scanning) {
        stopScanning();
      }
    };
  }, [scanning]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barcode Scanner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="relative w-full max-w-sm aspect-video rounded-md overflow-hidden bg-black"
          >
            {scanning ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                <canvas 
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full invisible"
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <div className="w-4/5 h-1/4 border-2 border-green-500 rounded-lg"></div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                Camera preview will appear here
              </div>
            )}
          </div>
          
          <div className="w-full flex justify-center">
            {scanning ? (
              <Button onClick={stopScanning} variant="destructive">
                Stop Scanning
              </Button>
            ) : (
              <Button onClick={startScanning} disabled={!hasCamera || !apiKey}>
                {!hasCamera ? 'Camera Not Available' : !apiKey ? 'API Key Required' : 'Start Scanning'}
              </Button>
            )}
          </div>
          
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Position the barcode within the green box. Hold your device steady for best results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
