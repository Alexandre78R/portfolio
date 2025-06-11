import {
  structureMessageMeTEXT,
  structureMessageMeHTML,
  structureMessageCreatedAccountTEXT,
  structureMessageCreatedAccountHTML,
} from '../../src/mail/structureMail.service';

import { ContactFrom } from '../../src/types/contact.types';

describe('structureMail.service', () => {
  const contactData: ContactFrom = {
    email: 'test@example.com',
    message: 'Bonjour, ceci est un message test.',
    object: 'Coucou',
  };

  describe('structureMessageMeTEXT', () => {
    it('should return a plain text message including email and message', () => {
      const result = structureMessageMeTEXT(contactData);
      expect(result).toContain(contactData.message);
      expect(result).toContain(contactData.email);
      expect(result).toMatch(/Information sur l'email/);
    });

    it('should handle empty message and email in structureMessageMeTEXT', () => {
      const emptyData: ContactFrom = { email: '', message: '', object: '' };
      const result = structureMessageMeTEXT(emptyData);
      expect(result).toContain('Email : ');
      expect(result).toContain('\n');
    });
  });

  describe('structureMessageMeHTML', () => {
    it('should return an HTML message including email and message', () => {
      const result = structureMessageMeHTML(contactData);
      expect(result).toContain(`<p>${contactData.message}</p>`);
      expect(result).toContain(`<p>Email : ${contactData.email}</p>`);
      expect(result).toContain('<hr>');
    });

    it('should handle empty message and email in structureMessageMeHTML', () => {
      const emptyData: ContactFrom = { email: '', message: '', object: '' };
      const result = structureMessageMeHTML(emptyData);
      expect(result).toContain('<p></p>');
      expect(result).toContain('<p>Email : </p>');
    });

    it('should render special characters properly in HTML message', () => {
      const specialCharData: ContactFrom = {
        email: 'test@example.com',
        message: 'Bonjour <script>alert("xss")</script>',
        object: 'Test',
      };
      const result = structureMessageMeHTML(specialCharData);
      expect(result).toContain(`<p>${specialCharData.message}</p>`);
    });
  });

  describe('structureMessageCreatedAccountTEXT', () => {
    it('should return a plain text account creation message', () => {
      const result = structureMessageCreatedAccountTEXT('Alexandre', 'abc123');
      expect(result).toContain('Bonjour Alexandre');
      expect(result).toContain('abc123');
      expect(result).toContain('compte a été créé');
      expect(result).toContain('changer dès votre première connexion');
    });

    it('should handle empty firstname and password in structureMessageCreatedAccountTEXT', () => {
      const result = structureMessageCreatedAccountTEXT('', '');
      expect(result).toContain('Bonjour');
      expect(result).toContain('Votre compte a été créé avec succès');
      expect(result).toContain('Voici votre mot de passe temporaire : ');
    });
  });

  describe('structureMessageCreatedAccountHTML', () => {
    it('should return an HTML account creation message', () => {
      const result = structureMessageCreatedAccountHTML('Alexandre', 'abc123');
      expect(result).toContain('<p>Bonjour Alexandre,</p>');
      expect(result).toContain('<strong>Mot de passe temporaire :</strong> abc123');
      expect(result).toContain('changer dès votre première connexion');
    });

    it('should handle empty firstname and password in structureMessageCreatedAccountHTML', () => {
      const result = structureMessageCreatedAccountHTML('', '');
      expect(result).toContain('<p>Bonjour ,</p>');
      expect(result).toContain('<strong>Mot de passe temporaire :</strong> ');
      expect(result).toContain('Merci de le changer dès votre première connexion');
    });
  });
});