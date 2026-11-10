import { useUploadAttachmentFile } from '@/activities/files/hooks/useUploadAttachmentFile';
import { type Note } from '@/activities/types/Note';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useCreateManyRecords } from '@/object-record/hooks/useCreateManyRecords';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useObjectMorphJunctionConfigOrThrow } from '@/object-record/record-field/ui/hooks/useObjectMorphJunctionConfigOrThrow';
import { findTargetFieldInfo } from '@/object-record/record-field/ui/utils/junction/findTargetFieldInfo';
import { PHONE_CALL_RESULT_OPTIONS } from '@/phone-call/constants/PhoneCallResultOptions';
import { phoneCallRecorder } from '@/phone-call/services/phoneCallRecorder';
import { phoneCallState } from '@/phone-call/states/phoneCallState';
import { type PhoneCall } from '@/phone-call/types/PhoneCall';
import { buildPhoneCallNoteContent } from '@/phone-call/utils/buildPhoneCallNoteContent';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { CoreObjectNameSingular } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { useToast } from 'twenty-ui/components/feedback';

export const useRegisterPhoneCall = () => {
  const { t, i18n } = useLingui();
  const { enqueueToast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const setPhoneCall = useSetAtomState(phoneCallState);

  const { createOneRecord: createOneNote } = useCreateOneRecord<
    Note & { position: 'first' | 'last' }
  >({
    objectNameSingular: CoreObjectNameSingular.Note,
  });

  const { objectMetadataItems } = useObjectMetadataItems();
  const { junctionObjectMetadata, sourceJoinColumnName } =
    useObjectMorphJunctionConfigOrThrow({
      objectNameSingular: CoreObjectNameSingular.Note,
    });

  const { createManyRecords: createNoteTargets } = useCreateManyRecords({
    objectNameSingular: junctionObjectMetadata.nameSingular,
    shouldMatchRootQueryFilter: true,
  });

  const { uploadAttachmentFile } = useUploadAttachmentFile();
  const { updateOneRecord } = useUpdateOneRecord();

  const registerPhoneCall = async (phoneCall: PhoneCall) => {
    const resultOption = PHONE_CALL_RESULT_OPTIONS.find(
      (option) => option.value === phoneCall.result,
    );

    if (!isDefined(resultOption)) {
      enqueueToast({
        status: 'warning',
        children: t`Choose the call result before logging it`,
      });
      return false;
    }

    setIsRegistering(true);

    try {
      const recording = await phoneCallRecorder.stop();

      const { title, markdown } = buildPhoneCallNoteContent({
        labels: {
          call: t({ message: 'Call', context: 'phone call noun' }),
          result: t`Result`,
          duration: t`Duration`,
          phoneNumber: t`Phone`,
          notes: t`Notes`,
          recordingAttached: t`Recording attached to the person's files`,
        },
        resultLabel: i18n._(resultOption.label),
        durationInSeconds: phoneCall.durationInSeconds,
        phoneNumber: phoneCall.phoneNumber,
        notes: phoneCall.notes,
        hasRecording: isDefined(recording),
      });

      const note = await createOneNote({
        title,
        bodyV2: { markdown, blocknote: null, tiptap: null },
        position: 'first',
      });

      const personObjectMetadataId = objectMetadataItems.find(
        (item) => item.nameSingular === CoreObjectNameSingular.Person,
      )?.id;

      const personJoinColumnName = findTargetFieldInfo(
        junctionObjectMetadata.fields,
        personObjectMetadataId ?? '',
        objectMetadataItems,
      )?.joinColumnName;

      if (isDefined(personJoinColumnName)) {
        await createNoteTargets({
          recordsToCreate: [
            {
              [sourceJoinColumnName]: note.id,
              [personJoinColumnName]: phoneCall.personId,
            },
          ],
          upsert: true,
        });
      }

      if (isDefined(recording)) {
        const recordingDate = new Date()
          .toISOString()
          .slice(0, 16)
          .replace(/[:T]/g, '-');
        const recordingFileName = `${t({ message: 'Call', context: 'phone call noun' })}-${recordingDate}.webm`;

        await uploadAttachmentFile(
          new File([recording], recordingFileName, { type: recording.type }),
          {
            id: phoneCall.personId,
            targetObjectNameSingular: CoreObjectNameSingular.Person,
          },
        );
      }

      if (isDefined(phoneCall.taskId)) {
        await updateOneRecord({
          objectNameSingular: CoreObjectNameSingular.Task,
          idToUpdate: phoneCall.taskId,
          updateOneRecordInput: { status: 'DONE' },
        });
      }

      phoneCallRecorder.discard();
      setPhoneCall(null);

      enqueueToast({
        status: 'success',
        children: isDefined(phoneCall.taskId)
          ? t`Call logged and task completed`
          : t`Call logged`,
      });

      return true;
    } catch {
      enqueueToast({
        status: 'error',
        children: t`Couldn't log the call. Try again.`,
      });

      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  return { registerPhoneCall, isRegistering };
};
