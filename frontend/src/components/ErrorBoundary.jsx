// frontend/src/components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center">
          <div className="text-5xl mb-4">X</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Ups, ada yang error!
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {this.state.error?.message ||
              "Terjadi kesalahan yang tidak terduga"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
