import { getPersonContactCardData } from '@/object-record/record-show/utils/getPersonContactCardData';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

const buildRecord = (overrides: Record<string, unknown>): ObjectRecord =>
  ({ id: 'person-id', __typename: 'Person', ...overrides }) as ObjectRecord;

describe('getPersonContactCardData', () => {
  it('should join job title and company name in the subtitle', () => {
    const data = getPersonContactCardData(
      buildRecord({
        jobTitle: 'CTO',
        company: { id: 'company-id', name: 'Google' },
      }),
    );

    expect(data.subtitle).toBe('CTO · Google');
    expect(data.companyId).toBe('company-id');
    expect(data.companyName).toBe('Google');
  });

  it('should omit missing parts of the subtitle', () => {
    expect(
      getPersonContactCardData(buildRecord({ jobTitle: '  ' })).subtitle,
    ).toBe('');
    expect(
      getPersonContactCardData(buildRecord({ company: { name: 'Meta' } }))
        .subtitle,
    ).toBe('Meta');
  });

  it('should build email and dialable phone links', () => {
    const data = getPersonContactCardData(
      buildRecord({
        emails: { primaryEmail: 'mark@google.com' },
        phones: {
          primaryPhoneNumber: '612 34 56 78',
          primaryPhoneCallingCode: '+34',
        },
      }),
    );

    expect(data.email).toBe('mark@google.com');
    expect(data.phoneLabel).toBe('+34 612 34 56 78');
    expect(data.phoneHref).toBe('tel:+34612345678');
  });

  it('should return empty values when the record is not loaded', () => {
    expect(getPersonContactCardData(undefined)).toEqual({
      subtitle: '',
      email: null,
      phoneLabel: null,
      phoneHref: null,
      companyId: null,
      companyName: null,
    });
  });
});
