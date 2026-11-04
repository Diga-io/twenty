import { isNonEmptyString } from '@sniptt/guards';

// Labels arrive already translated so this stays a pure, testable function.
export const buildTaskActivityLog = ({
  activityLabel,
  taskTitle,
  outcomeLabel,
  outcomeHeading,
  notes,
}: {
  activityLabel: string;
  taskTitle: string | null;
  outcomeLabel: string | null;
  outcomeHeading: string;
  notes: string;
}): { title: string; markdown: string } | null => {
  const trimmedNotes = notes.trim();

  if (!isNonEmptyString(outcomeLabel) && !isNonEmptyString(trimmedNotes)) {
    return null;
  }

  const title = [
    activityLabel,
    isNonEmptyString(outcomeLabel) ? outcomeLabel : taskTitle,
  ]
    .filter(isNonEmptyString)
    .join(' · ');

  const markdown = [
    isNonEmptyString(outcomeLabel)
      ? `**${outcomeHeading}:** ${outcomeLabel}`
      : null,
    isNonEmptyString(trimmedNotes) ? trimmedNotes : null,
  ]
    .filter(isNonEmptyString)
    .join('\n\n');

  return { title, markdown };
};
