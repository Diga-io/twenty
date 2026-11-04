import { doNotTranslate } from 'twenty-shared/i18n';
import { useMutation } from '@apollo/client/react';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { useToast } from 'twenty-ui/components/feedback';
import { v4 } from 'uuid';
import {
  CreateOneFieldMetadataItemDocument,
  CreateOneObjectMetadataItemDocument,
} from '~/generated-metadata/graphql';

import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import {
  SEQUENCES_OBJECT_DEFINITIONS,
  type SequencesFieldDefinition,
} from '@/sequences/constants/SequencesObjectDefinitions';
import { SEQUENCES_TASK_FIELD_DEFINITIONS } from '@/sequences/constants/SequencesTaskFieldDefinitions';

export const useSetupSequencesDataModel = () => {
  const { t } = useLingui();
  const { enqueueToast } = useToast();
  const { objectMetadataItems } = useObjectMetadataItems();
  const [isSettingUp, setIsSettingUp] = useState(false);

  const [createOneObject] = useMutation(CreateOneObjectMetadataItemDocument);
  const [createOneField] = useMutation(CreateOneFieldMetadataItemDocument);

  const setupSequencesDataModel = async () => {
    setIsSettingUp(true);

    // Object ids created during this run are not in the metadata store yet.
    const objectIdsByName = new Map(
      objectMetadataItems.map((item) => [item.nameSingular, item.id]),
    );

    const ensureField = async (
      objectNameSingular: string,
      fieldDefinition: SequencesFieldDefinition,
    ) => {
      const objectMetadataId = objectIdsByName.get(objectNameSingular);

      if (!isDefined(objectMetadataId)) {
        throw new Error(doNotTranslate(`Missing object ${objectNameSingular}`));
      }

      const existingObject = objectMetadataItems.find(
        (item) => item.nameSingular === objectNameSingular,
      );

      const fieldAlreadyExists = isDefined(
        existingObject?.fields.find(
          (field) => field.name === fieldDefinition.name,
        ),
      );

      if (fieldAlreadyExists) {
        return;
      }

      const targetObjectMetadataId = isDefined(fieldDefinition.relation)
        ? objectIdsByName.get(fieldDefinition.relation.targetObjectNameSingular)
        : undefined;

      await createOneField({
        variables: {
          input: {
            field: {
              objectMetadataId,
              name: fieldDefinition.name,
              label: fieldDefinition.label,
              icon: fieldDefinition.icon,
              type: fieldDefinition.type,
              isNullable: true,
              defaultValue: fieldDefinition.defaultValue,
              options: fieldDefinition.options?.map((option, position) => ({
                id: v4(),
                position,
                ...option,
              })),
              relationCreationPayload: isDefined(fieldDefinition.relation)
                ? {
                    type: fieldDefinition.relation.type,
                    targetObjectMetadataId,
                    targetFieldLabel: fieldDefinition.relation.targetFieldLabel,
                    targetFieldIcon: fieldDefinition.relation.targetFieldIcon,
                  }
                : undefined,
            },
          },
        },
      });
    };

    try {
      for (const objectDefinition of SEQUENCES_OBJECT_DEFINITIONS) {
        if (!objectIdsByName.has(objectDefinition.nameSingular)) {
          const { data } = await createOneObject({
            variables: {
              input: {
                object: {
                  nameSingular: objectDefinition.nameSingular,
                  namePlural: objectDefinition.namePlural,
                  labelSingular: objectDefinition.labelSingular,
                  labelPlural: objectDefinition.labelPlural,
                  icon: objectDefinition.icon,
                  description: objectDefinition.description,
                  isLabelSyncedWithName: false,
                },
              },
            },
          });

          if (isDefined(data?.createOneObject)) {
            objectIdsByName.set(
              objectDefinition.nameSingular,
              data.createOneObject.id,
            );
          }
        }
      }

      for (const objectDefinition of SEQUENCES_OBJECT_DEFINITIONS) {
        for (const fieldDefinition of objectDefinition.fields) {
          await ensureField(objectDefinition.nameSingular, fieldDefinition);
        }
      }

      for (const fieldDefinition of SEQUENCES_TASK_FIELD_DEFINITIONS) {
        await ensureField(CoreObjectNameSingular.Task, fieldDefinition);
      }

      // Relations add fields on person/task too; a full reload is the
      // simplest way to get a consistent metadata store and GraphQL schema.
      window.location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      enqueueToast({
        status: 'error',
        children: t`Could not set up sequences: ${errorMessage}`,
      });
      setIsSettingUp(false);
    }
  };

  return { setupSequencesDataModel, isSettingUp };
};
