import { doNotTranslate } from 'twenty-shared/i18n';
import { RelationType } from 'twenty-shared/types';
import { FieldMetadataType } from '~/generated-metadata/graphql';

import { SEQUENCE_ENROLLMENT_OBJECT_NAME_PLURAL } from '@/sequences/constants/SequenceEnrollmentObjectNamePlural';
import { SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceEnrollmentObjectNameSingular';
import { SEQUENCE_OBJECT_NAME_PLURAL } from '@/sequences/constants/SequenceObjectNamePlural';
import { SEQUENCE_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceObjectNameSingular';

type SelectOptionDefinition = {
  label: string;
  value: string;
  color: string;
};

export type SequencesFieldDefinition = {
  name: string;
  label: string;
  icon: string;
  type: FieldMetadataType;
  options?: SelectOptionDefinition[];
  defaultValue?: unknown;
  relation?: {
    type: RelationType;
    targetObjectNameSingular: string;
    targetFieldLabel: string;
    targetFieldIcon: string;
  };
};

export type SequencesObjectDefinition = {
  nameSingular: string;
  namePlural: string;
  labelSingular: string;
  labelPlural: string;
  icon: string;
  description: string;
  fields: SequencesFieldDefinition[];
};

// Kept as workspace (custom) metadata so the feature ships without a server
// release; `useSetupSequencesDataModel` creates whatever is missing.
export const SEQUENCES_OBJECT_DEFINITIONS: SequencesObjectDefinition[] = [
  {
    nameSingular: SEQUENCE_OBJECT_NAME_SINGULAR,
    namePlural: SEQUENCE_OBJECT_NAME_PLURAL,
    labelSingular: doNotTranslate('Sequence'),
    labelPlural: doNotTranslate('Sequences'),
    icon: 'IconTimelineEvent',
    description: doNotTranslate(
      'Outbound cadence of call, email and to-do steps',
    ),
    fields: [
      {
        name: 'description',
        label: doNotTranslate('Description'),
        icon: 'IconFileDescription',
        type: FieldMetadataType.TEXT,
      },
      {
        name: 'steps',
        label: doNotTranslate('Steps'),
        icon: 'IconListNumbers',
        type: FieldMetadataType.RAW_JSON,
      },
    ],
  },
  {
    nameSingular: SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
    namePlural: SEQUENCE_ENROLLMENT_OBJECT_NAME_PLURAL,
    labelSingular: doNotTranslate('Sequence enrollment'),
    labelPlural: doNotTranslate('Sequence enrollments'),
    icon: 'IconUserPlus',
    description: doNotTranslate('A contact going through a sequence'),
    fields: [
      {
        name: 'status',
        label: doNotTranslate('Status'),
        icon: 'IconProgressCheck',
        type: FieldMetadataType.SELECT,
        defaultValue: "'ACTIVE'",
        options: [
          { label: doNotTranslate('Active'), value: 'ACTIVE', color: 'green' },
          {
            label: doNotTranslate('Finished'),
            value: 'FINISHED',
            color: 'blue',
          },
          {
            label: doNotTranslate('Unenrolled'),
            value: 'UNENROLLED',
            color: 'gray',
          },
        ],
      },
      {
        name: 'currentStepIndex',
        label: doNotTranslate('Current step'),
        icon: 'IconListNumbers',
        type: FieldMetadataType.NUMBER,
        defaultValue: 0,
      },
      {
        name: 'person',
        label: doNotTranslate('Contact'),
        icon: 'IconUser',
        type: FieldMetadataType.RELATION,
        relation: {
          type: RelationType.MANY_TO_ONE,
          targetObjectNameSingular: 'person',
          targetFieldLabel: doNotTranslate('Sequence enrollments'),
          targetFieldIcon: 'IconTimelineEvent',
        },
      },
      {
        name: 'sequence',
        label: doNotTranslate('Sequence'),
        icon: 'IconTimelineEvent',
        type: FieldMetadataType.RELATION,
        relation: {
          type: RelationType.MANY_TO_ONE,
          targetObjectNameSingular: SEQUENCE_OBJECT_NAME_SINGULAR,
          targetFieldLabel: doNotTranslate('Enrollments'),
          targetFieldIcon: 'IconUserPlus',
        },
      },
    ],
  },
];
