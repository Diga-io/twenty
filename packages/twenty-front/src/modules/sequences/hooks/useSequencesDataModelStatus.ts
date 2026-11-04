import { isDefined } from 'twenty-shared/utils';

import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceEnrollmentObjectNameSingular';
import { SEQUENCE_OBJECT_NAME_SINGULAR } from '@/sequences/constants/SequenceObjectNameSingular';
import { TASK_SEQUENCE_ENROLLMENT_FIELD_NAME } from '@/sequences/constants/TaskSequenceEnrollmentFieldName';
import { TASK_TYPE_FIELD_NAME } from '@/sequences/constants/TaskTypeFieldName';
import { CoreObjectNameSingular } from 'twenty-shared/types';

export const useSequencesDataModelStatus = () => {
  const { objectMetadataItems } = useObjectMetadataItems();

  const findObject = (nameSingular: string) =>
    objectMetadataItems.find(
      (objectMetadataItem) =>
        objectMetadataItem.nameSingular === nameSingular &&
        objectMetadataItem.isActive,
    );

  const sequenceObject = findObject(SEQUENCE_OBJECT_NAME_SINGULAR);
  const sequenceEnrollmentObject = findObject(
    SEQUENCE_ENROLLMENT_OBJECT_NAME_SINGULAR,
  );
  const taskObject = findObject(CoreObjectNameSingular.Task);
  const personObject = findObject(CoreObjectNameSingular.Person);

  const hasTaskField = (fieldName: string) =>
    isDefined(
      taskObject?.fields.find(
        (field) => field.name === fieldName && field.isActive === true,
      ),
    );

  const isDataModelReady =
    isDefined(sequenceObject) &&
    isDefined(sequenceEnrollmentObject) &&
    hasTaskField(TASK_TYPE_FIELD_NAME) &&
    hasTaskField(TASK_SEQUENCE_ENROLLMENT_FIELD_NAME);

  return {
    isDataModelReady,
    sequenceObject,
    sequenceEnrollmentObject,
    taskObject,
    personObject,
    hasTaskField,
  };
};
