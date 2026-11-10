import { buildPhoneCallNoteContent } from '@/phone-call/utils/buildPhoneCallNoteContent';

const labels = {
  call: 'Llamada',
  result: 'Resultado',
  duration: 'Duración',
  phoneNumber: 'Teléfono',
  notes: 'Notas',
  recordingAttached: 'Grabación adjunta',
};

describe('buildPhoneCallNoteContent', () => {
  it('should build the title with result and duration', () => {
    const { title } = buildPhoneCallNoteContent({
      labels,
      resultLabel: 'Conectada',
      durationInSeconds: 205,
      phoneNumber: '+34 600123456',
      notes: '',
      hasRecording: false,
    });

    expect(title).toBe('Llamada · Conectada · 03:25');
  });

  it('should include notes and the recording mention when present', () => {
    const { markdown } = buildPhoneCallNoteContent({
      labels,
      resultLabel: 'Conectada',
      durationInSeconds: 61,
      phoneNumber: '+34 600123456',
      notes: '  Volver a llamar el lunes  ',
      hasRecording: true,
    });

    expect(markdown).toBe(
      [
        '**Resultado:** Conectada',
        '',
        '**Duración:** 01:01',
        '',
        '**Teléfono:** +34 600123456',
        '',
        '**Notas:**',
        '',
        'Volver a llamar el lunes',
        '',
        '_Grabación adjunta_',
      ].join('\n'),
    );
  });

  it('should omit empty notes and the recording mention', () => {
    const { markdown } = buildPhoneCallNoteContent({
      labels,
      resultLabel: 'Sin respuesta',
      durationInSeconds: 0,
      phoneNumber: '600123456',
      notes: '   ',
      hasRecording: false,
    });

    expect(markdown).not.toContain('Notas');
    expect(markdown).not.toContain('Grabación');
  });
});
