import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

export type Sequence = ObjectRecord & {
  name: string;
  description: string | null;
  steps: unknown;
};
