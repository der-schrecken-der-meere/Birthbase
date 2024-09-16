import React, { ReactElement } from 'react'

type Props = {
    children: ReactElement | ReactElement[] | null,
    fallback: ReactElement
}

type State = {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo);
    }

    render(): React.ReactNode {
        return (<>
            {this.state.hasError ? this.props.fallback : this.props.children}
        </>)
    }
}

export default ErrorBoundary