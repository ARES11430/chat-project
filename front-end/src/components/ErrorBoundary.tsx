import { Component, ReactNode, ErrorInfo } from 'react';
import ErrorPage from '../pages/ErrorPage';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('ErrorBoundary caught an error', error, errorInfo);
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return <ErrorPage error={this.state.error} />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
