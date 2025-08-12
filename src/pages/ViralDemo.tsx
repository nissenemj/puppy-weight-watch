import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import Index from '@/pages/Index';
import { Toaster } from "@/components/ui/sonner";

export default function ViralDemo() {
  return (
    <TooltipProvider>
      <MobileOptimizedLayout>
        
        <Index />
        <PWAInstallPrompt />
        <Toaster />
      </MobileOptimizedLayout>
    </TooltipProvider>
  );
}
