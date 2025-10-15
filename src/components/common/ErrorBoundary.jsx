import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center", color: "red" }}>
          <h2>⚠ Something went wrong.</h2>
          <p>Try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
