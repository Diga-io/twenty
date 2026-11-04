import { buildTaskActivityLog } from '@/sequences/utils/buildTaskActivityLog';

describe('buildTaskActivityLog', () => {
  it('should skip logging when there is no outcome and no notes', () => {
    expect(
      buildTaskActivityLog({
        activityLabel: 'Email',
        taskTitle: 'Follow-up',
        outcomeLabel: null,
        outcomeHeading: 'Outcome',
        notes: '   ',
      }),
    ).toBeNull();
  });

  it('should log a call outcome with notes', () => {
    expect(
      buildTaskActivityLog({
        activityLabel: 'Call',
        taskTitle: 'Intro call',
        outcomeLabel: 'No answer',
        outcomeHeading: 'Outcome',
        notes: ' Try again Friday ',
      }),
    ).toEqual({
      title: 'Call · No answer',
      markdown: '**Outcome:** No answer\n\nTry again Friday',
    });
  });

  it('should use the task title when only notes are provided', () => {
    expect(
      buildTaskActivityLog({
        activityLabel: 'LinkedIn',
        taskTitle: 'Connect',
        outcomeLabel: null,
        outcomeHeading: 'Outcome',
        notes: 'Sent invite',
      }),
    ).toEqual({ title: 'LinkedIn · Connect', markdown: 'Sent invite' });
  });
});
