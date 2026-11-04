import { doNotTranslate } from 'twenty-shared/i18n';
import { RelationType } from 'twenty-shared/types';
import { FieldMetadataType } from '~/generated-metadata/graphql';

import { SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceEnrollmentObjectNameSingular';
import { type SequencesFieldDefinition } from '@/sequences/constants/SequencesObjectDefinitions';
import { TASK_SEQUENCE_ENROLLMENT_FIELD_NAME } from '@/sequences/constants/TaskSequenceEnrollmentFieldName';
import { TASK_TYPE_FIELD_NAME } from '@/sequences/constants/TaskTypeFieldName';

export const SEQUENCES_TASK_FIELD_DEFINITIONS: SequencesFieldDefinition[] = [
  {
    name: TASK_TYPE_FIELD_NAME,
    label: doNotTranslate('Task type'),
    icon: 'IconCategory',
    type: FieldMetadataType.SELECT,
    defaultValue: "'TODO'",
    options: [
      { label: doNotTranslate('Call'), value: 'CALL', color: 'green' },
      { label: doNotTranslate('Email'), value: 'EMAIL', color: 'blue' },
      { label: doNotTranslate('LinkedIn'), value: 'LINKEDIN', color: 'sky' },
      { label: doNotTranslate('To-do'), value: 'TODO', color: 'orange' },
    ],
  },
  {
    name: TASK_SEQUENCE_ENROLLMENT_FIELD_NAME,
    label: doNotTranslate('Sequence enrollment'),
    icon: 'IconTimelineEvent',
    type: FieldMetadataType.RELATION,
    relation: {
      type: RelationType.MANY_TO_ONE,
      targetObjectNameSingular: SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
      targetFieldLabel: doNotTranslate('Tasks'),
      targetFieldIcon: 'IconCheckbox',
    },
  },
];
