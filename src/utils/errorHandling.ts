/**
 * Standardized Error Handling System for Pentulaskuri
 * Consistent error messages, user-friendly feedback, and accessible notifications
 */

export type ErrorType = 
  | 'network'
  | 'validation' 
  | 'authentication'
  | 'authorization'
  | 'server'
  | 'database'
  | 'form'
  | 'file_upload'
  | 'timeout'
  | 'generic';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface StandardError {
  type: ErrorType;
  severity: ErrorSeverity;
  code: string;
  userMessage: string;
  technicalMessage: string;
  suggestions?: string[];
  retryable: boolean;
  reportable: boolean;
}

// Finnish error messages for better UX
export const ERROR_MESSAGES: Record<string, StandardError> = {
  // Network errors
  'NETWORK_ERROR': {
    type: 'network',
    severity: 'medium',
    code: 'NETWORK_ERROR',
    userMessage: 'Verkkoyhteydessä on ongelma. Tarkista internetyhteys.',
    technicalMessage: 'Network request failed',
    suggestions: ['Tarkista internetyhteys', 'Yritä hetken kuluttua uudelleen'],
    retryable: true,
    reportable: false
  },
  
  'NETWORK_TIMEOUT': {
    type: 'timeout',
    severity: 'medium', 
    code: 'NETWORK_TIMEOUT',
    userMessage: 'Pyyntö kesti liian kauan. Yritä uudelleen.',
    technicalMessage: 'Request timeout',
    suggestions: ['Yritä uudelleen', 'Tarkista internetyhteys'],
    retryable: true,
    reportable: false
  },

  // Authentication errors
  'AUTH_REQUIRED': {
    type: 'authentication',
    severity: 'medium',
    code: 'AUTH_REQUIRED', 
    userMessage: 'Kirjaudu sisään käyttääksesi tätä ominaisuutta.',
    technicalMessage: 'Authentication required',
    suggestions: ['Kirjaudu sisään', 'Rekisteröidy uutena käyttäjänä'],
    retryable: false,
    reportable: false
  },

  'AUTH_INVALID_CREDENTIALS': {
    type: 'authentication',
    severity: 'low',
    code: 'AUTH_INVALID_CREDENTIALS',
    userMessage: 'Sähköposti tai salasana on virheellinen.',
    technicalMessage: 'Invalid email or password',
    suggestions: ['Tarkista sähköposti ja salasana', 'Käytä salasanan palautusta'],
    retryable: true,
    reportable: false
  },

  'AUTH_EMAIL_NOT_CONFIRMED': {
    type: 'authentication',
    severity: 'medium',
    code: 'AUTH_EMAIL_NOT_CONFIRMED',
    userMessage: 'Vahvista sähköpostiosoitteesi ensin.',
    technicalMessage: 'Email not confirmed',
    suggestions: ['Tarkista sähköposti ja klikkaa vahvistuslinkkiä', 'Pyydä uusi vahvistusviesti'],
    retryable: false,
    reportable: false
  },

  // Validation errors
  'VALIDATION_REQUIRED_FIELD': {
    type: 'validation',
    severity: 'low',
    code: 'VALIDATION_REQUIRED_FIELD',
    userMessage: 'Tämä kenttä on pakollinen.',
    technicalMessage: 'Required field missing',
    suggestions: ['Täytä kaikki pakolliset kentät'],
    retryable: true,
    reportable: false
  },

  'VALIDATION_INVALID_EMAIL': {
    type: 'validation',
    severity: 'low',
    code: 'VALIDATION_INVALID_EMAIL',
    userMessage: 'Sähköpostiosoite on virheellinen.',
    technicalMessage: 'Invalid email format',
    suggestions: ['Tarkista sähköpostiosoitteen muoto'],
    retryable: true,
    reportable: false
  },

  'VALIDATION_INVALID_WEIGHT': {
    type: 'validation', 
    severity: 'low',
    code: 'VALIDATION_INVALID_WEIGHT',
    userMessage: 'Paino tulee olla positiivinen luku.',
    technicalMessage: 'Invalid weight value',
    suggestions: ['Syötä paino desimaalilukuna (esim. 2.5)'],
    retryable: true,
    reportable: false
  },

  'VALIDATION_FUTURE_DATE': {
    type: 'validation',
    severity: 'low', 
    code: 'VALIDATION_FUTURE_DATE',
    userMessage: 'Päivämäärä ei voi olla tulevaisuudessa.',
    technicalMessage: 'Date cannot be in the future',
    suggestions: ['Valitse päivämäärä menneisyydestä tai tänään'],
    retryable: true,
    reportable: false
  },

  // Database errors
  'DATABASE_CONNECTION_ERROR': {
    type: 'database',
    severity: 'high',
    code: 'DATABASE_CONNECTION_ERROR',
    userMessage: 'Palvelimeen ei saada yhteyttä. Yritä hetken kuluttua uudelleen.',
    technicalMessage: 'Database connection failed',
    suggestions: ['Yritä hetken kuluttua uudelleen', 'Ota yhteyttä tukeen, jos ongelma jatkuu'],
    retryable: true,
    reportable: true
  },

  'DATABASE_CONSTRAINT_ERROR': {
    type: 'database',
    severity: 'medium',
    code: 'DATABASE_CONSTRAINT_ERROR', 
    userMessage: 'Tiedot ovat ristiriidassa. Tarkista syötteet.',
    technicalMessage: 'Database constraint violation',
    suggestions: ['Tarkista syötteet ja yritä uudelleen'],
    retryable: true,
    reportable: false
  },

  // Server errors
  'SERVER_ERROR': {
    type: 'server',
    severity: 'high',
    code: 'SERVER_ERROR',
    userMessage: 'Palvelimessa tapahtui virhe. Yritä hetken kuluttua uudelleen.',
    technicalMessage: 'Internal server error',
    suggestions: ['Yritä hetken kuluttua uudelleen', 'Ota yhteyttä tukeen, jos ongelma jatkuu'],
    retryable: true,
    reportable: true
  },

  'SERVICE_UNAVAILABLE': {
    type: 'server',
    severity: 'high',
    code: 'SERVICE_UNAVAILABLE',
    userMessage: 'Palvelu on väliaikaisesti poissa käytöstä. Yritä myöhemmin uudelleen.',
    technicalMessage: 'Service temporarily unavailable',
    suggestions: ['Yritä myöhemmin uudelleen'],
    retryable: true,
    reportable: true
  },

  // File upload errors
  'FILE_TOO_LARGE': {
    type: 'file_upload',
    severity: 'low',
    code: 'FILE_TOO_LARGE',
    userMessage: 'Tiedosto on liian suuri. Maksimikoko on 5MB.',
    technicalMessage: 'File size exceeds limit',
    suggestions: ['Pienennä tiedostokoko', 'Käytä toista tiedostoa'],
    retryable: true,
    reportable: false
  },

  'FILE_TYPE_NOT_SUPPORTED': {
    type: 'file_upload',
    severity: 'low',
    code: 'FILE_TYPE_NOT_SUPPORTED',
    userMessage: 'Tiedostotyyppi ei ole tuettu. Käytä JPG, PNG tai GIF tiedostoa.',
    technicalMessage: 'Unsupported file type',
    suggestions: ['Käytä JPG, PNG tai GIF tiedostoa'],
    retryable: true,
    reportable: false
  },

  // Generic fallback
  'GENERIC_ERROR': {
    type: 'generic',
    severity: 'medium',
    code: 'GENERIC_ERROR',
    userMessage: 'Tapahtui odottamaton virhe. Yritä uudelleen.',
    technicalMessage: 'Unknown error occurred',
    suggestions: ['Yritä uudelleen', 'Päivitä sivu'],
    retryable: true,
    reportable: true
  }
};

// Map common error codes to our standard errors
export function mapErrorToStandard(error: any): StandardError {
  // Handle network errors
  if (!navigator.onLine) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Handle Supabase auth errors
  if (error?.message?.includes('Invalid login credentials')) {
    return ERROR_MESSAGES.AUTH_INVALID_CREDENTIALS;
  }
  
  if (error?.message?.includes('Email not confirmed')) {
    return ERROR_MESSAGES.AUTH_EMAIL_NOT_CONFIRMED;
  }

  if (error?.message?.includes('not authenticated') || error?.status === 401) {
    return ERROR_MESSAGES.AUTH_REQUIRED;
  }

  // Handle validation errors
  if (error?.message?.includes('violates check constraint')) {
    return ERROR_MESSAGES.VALIDATION_INVALID_WEIGHT;
  }

  // Handle database connection errors
  if (error?.message?.includes('connection') || error?.message?.includes('timeout')) {
    return ERROR_MESSAGES.DATABASE_CONNECTION_ERROR;
  }

  // Handle server errors
  if (error?.status >= 500) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  if (error?.status === 503) {
    return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
  }

  // Handle file upload errors
  if (error?.message?.includes('file too large')) {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }

  if (error?.message?.includes('invalid file type')) {
    return ERROR_MESSAGES.FILE_TYPE_NOT_SUPPORTED;
  }

  // Fallback to generic error
  return ERROR_MESSAGES.GENERIC_ERROR;
}

// Create user-friendly error message with context
export function createErrorMessage(error: any, context?: string): {
  standardError: StandardError;
  displayMessage: string;
  suggestions: string[];
  canRetry: boolean;
} {
  const standardError = mapErrorToStandard(error);
  
  let displayMessage = standardError.userMessage;
  if (context) {
    displayMessage = `${context}: ${displayMessage}`;
  }

  return {
    standardError,
    displayMessage,
    suggestions: standardError.suggestions || [],
    canRetry: standardError.retryable
  };
}

// Error reporting for analytics
export function shouldReportError(standardError: StandardError): boolean {
  return standardError.reportable && standardError.severity !== 'low';
}

// Create accessible error notification
export interface ErrorNotification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
    primary?: boolean;
  }>;
  ariaLive: 'polite' | 'assertive';
}

export function createErrorNotification(
  standardError: StandardError, 
  context?: string,
  retryAction?: () => void
): ErrorNotification {
  const id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const actions: ErrorNotification['actions'] = [];
  
  if (standardError.retryable && retryAction) {
    actions.push({
      label: 'Yritä uudelleen',
      onClick: retryAction,
      primary: true
    });
  }

  // Add help action for critical errors
  if (standardError.severity === 'critical' || standardError.severity === 'high') {
    actions.push({
      label: 'Ota yhteyttä tukeen',
      onClick: () => window.open('mailto:tuki@pentulaskuri.com?subject=Virhe sovelluksessa'),
      primary: false
    });
  }

  return {
    id,
    message: context ? `${context}: ${standardError.userMessage}` : standardError.userMessage,
    type: standardError.severity === 'low' ? 'warning' : 'error',
    duration: standardError.severity === 'critical' ? undefined : 5000, // Critical errors stay until dismissed
    actions,
    ariaLive: standardError.severity === 'critical' ? 'assertive' : 'polite'
  };
}

// Retry mechanism
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      const standardError = mapErrorToStandard(error);
      
      // Don't retry non-retryable errors
      if (!standardError.retryable || attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  
  throw lastError;
}