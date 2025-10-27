// components/data-state.tsx
import React from "react";

interface StateConfig {
  text?: string;
  className?: string;
}

interface DataStateProps<T> {
  query: {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  isEmpty?: (data: T) => boolean;
  loading?: StateConfig | React.ReactNode;
  error?: StateConfig | React.ReactNode;
  empty?: StateConfig | React.ReactNode;
  children: (data: T) => React.ReactNode;
}

// Default components
const defaultStates = {
  loading: () => <div className="h-10 w-full animate-pulse bg-muted rounded" />,
  error: (text = "Error loading data") => (
    <div className="text-sm text-destructive text-center">{text}</div>
  ),
  empty: (text = "No data available") => (
    <div className="text-sm text-muted-foreground text-center">{text}</div>
  ),
};

function createStateComponent(
  config: StateConfig | React.ReactNode | undefined,
  defaultComponent: (text?: string) => React.ReactNode
): React.ReactNode {
  if (React.isValidElement(config)) return config;
  if (!config) return defaultComponent();

  const { text, className } = config as StateConfig;

  if (className && text) {
    return <div className={className}>{text}</div>;
  }

  if (text) {
    return defaultComponent(text);
  }

  return defaultComponent();
}

export function DataState<T>({
  query,
  isEmpty = (d) => !d || (Array.isArray(d) && d.length === 0),
  loading,
  error,
  empty,
  children,
}: DataStateProps<T>) {
  const { isLoading, isError, data } = query;
  if (isLoading) {
    return <>{createStateComponent(loading, defaultStates.loading)}</>;
  }

  if (isError) {
    return <>{createStateComponent(error, defaultStates.error)}</>;
  }

  if (!data || isEmpty(data)) {
    return <>{createStateComponent(empty, defaultStates.empty)}</>;
  }

  return <>{children(data)}</>;
}
