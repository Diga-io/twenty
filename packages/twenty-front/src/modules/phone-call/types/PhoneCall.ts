import { type PhoneCallRecordingMode } from '@/phone-call/types/PhoneCallRecordingMode';
import { type PhoneCallResult } from '@/phone-call/types/PhoneCallResult';

export type PhoneCallStatus = 'ready' | 'in-progress' | 'ended';

export type PhoneCall = {
  personId: string;
  personName: string;
  phoneNumber: string;
  isPhoneNumberEditable: boolean;
  status: PhoneCallStatus;
  startedAt: number | null;
  durationInSeconds: number;
  result: PhoneCallResult | null;
  notes: string;
  taskId: string | null;
  isMinimized: boolean;
  recordingMode: PhoneCallRecordingMode;
};
