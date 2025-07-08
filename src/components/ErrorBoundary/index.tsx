'use client';

import React, { Component, ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

type State = {
    hasError: boolean;
    error: Error | null;
};

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Optionally log error to an error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center text-red-600 bg-red-50 rounded">
                    <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
                    <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
