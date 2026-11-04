import { sortTasksForQueue } from '@/sequences/utils/sortTasksForQueue';

describe('sortTasksForQueue', () => {
  it('should sort by due date, then creation date, with undated tasks last', () => {
    const tasks = [
      { id: 'undated', dueAt: null, createdAt: '2026-11-01T00:00:00.000Z' },
      {
        id: 'later',
        dueAt: '2026-11-05T09:00:00.000Z',
        createdAt: '2026-11-01T00:00:00.000Z',
      },
      {
        id: 'sooner-newer',
        dueAt: '2026-11-04T09:00:00.000Z',
        createdAt: '2026-11-02T00:00:00.000Z',
      },
      {
        id: 'sooner-older',
        dueAt: '2026-11-04T09:00:00.000Z',
        createdAt: '2026-11-01T00:00:00.000Z',
      },
    ];

    expect(sortTasksForQueue(tasks).map((task) => task.id)).toEqual([
      'sooner-older',
      'sooner-newer',
      'later',
      'undated',
    ]);
  });

  it('should not mutate the input', () => {
    const tasks = [
      { dueAt: '2026-11-05T09:00:00.000Z', createdAt: 'b' },
      { dueAt: '2026-11-04T09:00:00.000Z', createdAt: 'a' },
    ];

    sortTasksForQueue(tasks);

    expect(tasks[0].createdAt).toBe('b');
  });
});
