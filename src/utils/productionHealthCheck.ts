// Production Health Check and Environment Validation
export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  environment: {
    supabaseUrl: boolean;
    supabaseKey: boolean;
  };
  build: {
    timestamp: string;
    version: string;
  };
  errors: string[];
}

export function performHealthCheck(): HealthCheckResult {
  const errors: string[] = [];
  
  // Check Supabase configuration
  const supabaseUrl = "https://ckwwxuyteyaaxfcvozvb.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrd3d4dXl0ZXlhYXhmY3ZvenZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzOTMwOTAsImV4cCI6MjA2Njk2OTA5MH0.eCRD_KRFgA9ILpm7yKCgf6yOJzVZGcH21EWlUMzlEpo";
  
  const hasValidSupabaseUrl = supabaseUrl && supabaseUrl.includes('supabase.co');
  const hasValidSupabaseKey = supabaseKey && supabaseKey.length > 100;
  
  if (!hasValidSupabaseUrl) {
    errors.push('Invalid or missing Supabase URL');
  }
  
  if (!hasValidSupabaseKey) {
    errors.push('Invalid or missing Supabase anon key');
  }
  
  // Check if running in production
  const isProduction = import.meta.env.PROD;
  
  // Log environment status
  console.log('🏥 Health Check Results:', {
    environment: {
      production: isProduction,
      supabaseUrl: hasValidSupabaseUrl,
      supabaseKey: hasValidSupabaseKey,
    },
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
  
  if (errors.length > 0) {
    console.error('❌ Health check failed:', errors);
  } else {
    console.log('✅ Health check passed');
  }
  
  const status = errors.length === 0 ? 'healthy' : 
                errors.length <= 1 ? 'warning' : 'error';
  
  return {
    status,
    environment: {
      supabaseUrl: hasValidSupabaseUrl,
      supabaseKey: hasValidSupabaseKey,
    },
    build: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    },
    errors
  };
}

// Initialize health check on app start
export function initializeHealthCheck() {
  try {
    const result = performHealthCheck();
    
    // Store health check result for debugging
    (window as any).__HEALTH_CHECK__ = result;
    
    return result;
  } catch (error) {
    console.error('💀 Critical error during health check:', error);
    return {
      status: 'error' as const,
      environment: {
        supabaseUrl: false,
        supabaseKey: false,
      },
      build: {
        timestamp: new Date().toISOString(),
        version: 'unknown'
      },
      errors: [`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}