import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class ModuleLoadingErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;
  
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is a module loading error
    const isModuleError = error.message.includes('Cannot access') || 
                          error.message.includes('before initialization') ||
                          error.message.includes('is not defined');
    
    return {
      hasError: isModuleError,
      error: isModuleError ? error : undefined,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message.includes('Cannot access') || error.message.includes('before initialization')) {
      console.error('Module loading error detected:', error, errorInfo);
      
      // Attempt automatic retry for module loading errors
      if (this.state.retryCount < 3) {
        this.retryTimeout = setTimeout(() => {
          this.setState(prevState => ({
            hasError: false,
            error: undefined,
            retryCount: prevState.retryCount + 1
          }));
        }, 1000 * (this.state.retryCount + 1)); // Exponential backoff
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleManualRetry = () => {
    // Force a hard reload for persistent module issues
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert className="max-w-md">
            <AlertTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Module Loading Error
            </AlertTitle>
            <AlertDescription className="space-y-4">
              <p>
                There was an issue loading application modules. This usually resolves itself automatically.
              </p>
              {this.state.retryCount >= 3 && (
                <Button onClick={this.handleManualRetry} className="w-full">
                  Reload Application
                </Button>
              )}
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}