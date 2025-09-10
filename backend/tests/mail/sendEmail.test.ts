import nodemailer from 'nodemailer';
import { sendEmail } from '../../src/mail/mail.service';

jest.mock('nodemailer', () => {
  const sendMailMock = jest.fn();
  return {
    createTransport: jest.fn(() => ({
      sendMail: sendMailMock,
    })),
    __sendMailMock: sendMailMock,
  };
});

describe('sendEmail', () => {
  let mockSendMail: jest.Mock;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, AUTH_USER_MAIL: 'contact@alexandre-renard.dev' };
    mockSendMail = (nodemailer as any).__sendMailMock;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should send email to the provided email address when sendToMe is false', async () => {
    mockSendMail.mockResolvedValue(true);

    const result = await sendEmail(
      'test@example.com',
      'Subject',
      'Text content',
      '<p>HTML content</p>',
      false
    );

    expect(mockSendMail).toHaveBeenCalledWith({
      from: 'contact@alexandre-renard.dev',
      to: 'test@example.com',
      subject: 'Subject',
      text: 'Text content',
      html: '<p>HTML content</p>',
    });
    expect(result).toEqual({ label: 'emailSent', message: 'Email sent', status: true });
  });

  it('should send email to the user email when sendToMe is true', async () => {
    mockSendMail.mockResolvedValue(true);

    const result = await sendEmail(
      'ignored@example.com',
      'Subject',
      'Text content',
      '<p>HTML content</p>',
      true
    );

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'contact@alexandre-renard.dev' })
    );
    expect(result.status).toBe(true);
  });

  it('should return error message if sendMail throws an error', async () => {
    mockSendMail.mockRejectedValue(new Error('Failed to send email'));

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

  it('should handle unknown errors gracefully', async () => {
    mockSendMail.mockRejectedValue('Unexpected failure');

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

  it('should send email even if AUTH_USER_MAIL env is missing', async () => {
    // process.env.AUTH_USER_MAIL = '';
    delete process.env.AUTH_USER_MAIL;
    mockSendMail.mockResolvedValue(true);

    const result = await sendEmail(
      'someone@example.com',
      'Subject',
      'Text content',
      '<p>HTML content</p>'
    );

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'someone@example.com',
        text: 'Text content',
        html: '<p>HTML content</p>',
      })
    );
    expect(result.status).toBe(true);
  });

  it('should send email with empty html or text without error', async () => {
    mockSendMail.mockResolvedValue(true);

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