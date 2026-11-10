import { useOpenPhoneCall } from '@/phone-call/hooks/useOpenPhoneCall';
import { getPersonPhoneNumber } from '@/phone-call/utils/getPersonPhoneNumber';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { useLingui } from '@lingui/react/macro';
import { IconPhone } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';

type PersonCallButtonProps = {
  person: ObjectRecord;
};

export const PersonCallButton = ({ person }: PersonCallButtonProps) => {
  const { t } = useLingui();
  const { openPhoneCall } = useOpenPhoneCall();

  const handleClick = () => {
    const personName = [person.name?.firstName, person.name?.lastName]
      .filter(Boolean)
      .join(' ');

    openPhoneCall({
      personId: person.id,
      personName,
      phoneNumber: getPersonPhoneNumber(person.phones),
    });
  };

  return (
    <Button
      variant="solid"
      color="accent"
      size="sm"
      startIcon={<IconPhone size={16} />}
      onClick={handleClick}
    >
      {t({ message: 'Call', context: 'phone call action' })}
    </Button>
  );
};
