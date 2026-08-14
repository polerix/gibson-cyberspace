import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '20px',
                    backgroundColor: '#000',
                    color: '#f00',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <h1 style={{ textShadow: '0 0 10px #f00' }}>[ SYSTEM CRITICAL ERROR ]</h1>
                    <p style={{ maxWidth: '600px', wordBreak: 'break-all' }}>
                        {this.state.error && this.state.error.toString()}
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#f00',
                            border: '1px solid #f00',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            marginTop: '20px',
                            fontFamily: 'inherit'
                        }}
                    >
                        REBOOT SYSTEM
                    </button>
                    <p style={{ marginTop: '20px', color: '#666', fontSize: '12px' }}>
                        GIBSON CYBERSPACE // RUNTIME_FAIL_0x0A
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
