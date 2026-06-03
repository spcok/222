export type TabType = 'infrastructure' | 'router' | 'query' | 'zod';

export interface LogEntry {
  id: string;
  timestamp: string;
  operation: string;
  routePath: string;
  latency: string;
  status: 'Success' | 'Warning' | 'Error';
  details: string;
}

export interface DrizzleField {
  name: string;
  type: 'serial' | 'text' | 'integer' | 'boolean' | 'timestamp';
  isKey: boolean;
  isNullable: boolean;
}

export interface MockStoreItem {
  key: string;
  value: any;
  size: string;
  updatedAt: string;
}
