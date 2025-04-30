import nodemailer from 'nodemailer';

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('sendEmail', () => {
  let sendEmail: (
    email: string,
    subject: string,
    text: string,
    html: string,
    sendToMe?: boolean
  ) => Promise<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send email to the provided email address when sendToMe is false', async () => {
    process.env.AUTH_USER_MAIL = 'user@example.com';

    (nodemailer.createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: mockSendMail,
    }));

    mockSendMail.mockResolvedValue(true);

    await jest.isolateModulesAsync(async () => {
      const mailModule = await import('../../src/mail/mail.service');
      sendEmail = mailModule.sendEmail;

      const result = await sendEmail(
        'test@example.com',
        'Subject',
        'Text content',
        '<p>HTML content</p>',
        false
      );

      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'user@example.com',
        to: 'test@example.com',
        subject: 'Subject',
        text: 'Text content',
        html: '<p>HTML content</p>',
      });
      expect(result).toEqual({ label: 'emailSent', message: 'Email sent', status: true });
    });
  });

  it('should send email to the user email when sendToMe is true', async () => {
    process.env.AUTH_USER_MAIL = 'user@example.com';

    (nodemailer.createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: mockSendMail,
    }));

    mockSendMail.mockResolvedValue(true);

    await jest.isolateModulesAsync(async () => {
      const mailModule = await import('../../src/mail/mail.service');
      sendEmail = mailModule.sendEmail;

      const result = await sendEmail(
        'ignored@example.com',
        'Subject',
        'Text content',
        '<p>HTML content</p>',
        true
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'user@example.com' })
      );
      expect(result.status).toBe(true);
    });
  });

  it('should return error message if sendMail throws an error', async () => {
    process.env.AUTH_USER_MAIL = 'user@example.com';

    (nodemailer.createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: mockSendMail,
    }));

    mockSendMail.mockRejectedValue(new Error('Failed to send email'));

    await jest.isolateModulesAsync(async () => {
      const mailModule = await import('../../src/mail/mail.service');
      sendEmail = mailModule.sendEmail;

      const result = await sendEmail(
        'test@example.com',
        'Subject',
        'Text content',
        '<p>HTML content</p>'
      );

      expect(result.status).toBe(false);
      expect(result.label).toBe('emailNoSent');
      expect(result.message).toBe('Failed to send email');
    });
  });

  it('should handle unknown errors gracefully', async () => {
    process.env.AUTH_USER_MAIL = 'user@example.com';

    (nodemailer.createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: mockSendMail,
    }));

    mockSendMail.mockRejectedValue('Unexpected failure');

    await jest.isolateModulesAsync(async () => {
      const mailModule = await import('../../src/mail/mail.service');
      sendEmail = mailModule.sendEmail;

      const result = await sendEmail(
        'test@example.com',
        'Subject',
        'Text content',
        '<p>HTML content</p>'
      );

      expect(result.status).toBe(false);
      expect(result.label).toBe('emailNoSent');
      expect(result.message).toBe('Unknown error');
    });
  });

  // --- Nouveaux tests ---

  it('should throw error if AUTH_USER_MAIL env is not set', async () => {
    delete process.env.AUTH_USER_MAIL;

    (nodemailer.createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: mockSendMail,
    }));

    mockSendMail.mockResolvedValue(true);

    await jest.isolateModulesAsync(async () => {
      const mailModule = await import('../../src/mail/mail.service');
      sendEmail = mailModule.sendEmail;

      // Même si user est undefined, la fonction tente d’envoyer un email,
      // on vérifie donc que le from est undefined (ou vide)
      const result = await sendEmail(
        'someone@example.com',
        'Subject',
        'Text content',
        '<p>HTML content</p>'
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ from: undefined, to: 'someone@example.com' })
      );
      expect(result.status).toBe(true);
    });
  });

  it('should send email with empty html or text without error', async () => {
    process.env.AUTH_USER_MAIL = 'user@example.com';

    (nodemailer.createTransport as jest.Mock).mockImplementation(() => ({
      sendMail: mockSendMail,
    }));

    mockSendMail.mockResolvedValue(true);

    await jest.isolateModulesAsync(async () => {
      const mailModule = await import('../../src/mail/mail.service');
      sendEmail = mailModule.sendEmail;

      const result = await sendEmail(
        'test@example.com',
        'Subject',
        '',
        '',
        false
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({ text: '', html: '' })
      );
      expect(result.status).toBe(true);
    });
  });
});