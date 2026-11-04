export type SequencePerson = {
  id: string;
  name: { firstName: string; lastName: string } | null;
  jobTitle: string | null;
  avatarUrl: string | null;
  emails: { primaryEmail: string | null } | null;
  phones: {
    primaryPhoneNumber: string | null;
    primaryPhoneCallingCode: string | null;
  } | null;
  linkedinLink?: { primaryLinkUrl: string | null } | null;
  company: { id: string; name: string } | null;
};
