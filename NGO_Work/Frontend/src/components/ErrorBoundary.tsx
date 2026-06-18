import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
          <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg border border-red-100">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6 text-sm">
              We're sorry, but an unexpected error occurred. Our team has been notified.
            </p>
            <div className="bg-gray-100 p-4 rounded text-left mb-6 overflow-auto text-xs text-red-800 font-mono max-h-32">
              {this.state.error?.message || "Unknown error"}
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
