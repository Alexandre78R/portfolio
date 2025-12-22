import {
  structureMessageMeTEXT,
  structureMessageMeHTML,
  structureMessageCreatedAccountTEXT,
  structureMessageCreatedAccountHTML,
} from '../../src/mail/structureMail.service';

import type { ContactFrom } from '../../src/types/contact.types';

describe('structureMail.service', () => {
  const contactData: ContactFrom = {
    email: 'test@example.com',
    message: 'Bonjour, ceci est un message test.',
    object: 'Coucou',
  };

  describe('structureMessageMeTEXT', () => {
    it('should return a plain text message including email and message', () => {
      const result: string = structureMessageMeTEXT(contactData);
      expect(result).toContain(contactData.message);
      expect(result).toContain(contactData.email);
      expect(result).toMatch(/Information sur l'email/);
    });

    it('should handle empty message and email in structureMessageMeTEXT', () => {
      const emptyData: ContactFrom = { email: '', message: '', object: '' };
      const result: string = structureMessageMeTEXT(emptyData);
      expect(result).toContain('Email : ');
      expect(result).toContain('\n');
    });
  });

  describe('structureMessageMeHTML', () => {
    it('should return an HTML message including email and message', () => {
      const result: string = structureMessageMeHTML(contactData);
      expect(result).toContain(`<p>${contactData.message}</p>`);
      expect(result).toContain(`<p>Email : ${contactData.email}</p>`);
      expect(result).toContain('<hr>');
    });

    it('should handle empty message and email in structureMessageMeHTML', () => {
      const emptyData: ContactFrom = { email: '', message: '', object: '' };
      const result: string = structureMessageMeHTML(emptyData);
      expect(result).toContain('<p></p>');
      expect(result).toContain('<p>Email : </p>');
    });

    it('should render special characters properly in HTML message', () => {
      const specialCharData: ContactFrom = {
        email: 'test@example.com',
        message: 'Bonjour <script>alert("xss")</script>',
        object: 'Test',
      };
      const result: string = structureMessageMeHTML(specialCharData);
      // On vérifie que les caractères spéciaux sont inclus (éventuellement échappés)
      expect(result).toContain(`<p>${specialCharData.message}</p>`);
    });
  });

  describe('structureMessageCreatedAccountTEXT', () => {
    it('should return a plain text account creation message in French (default)', () => {
      const firstname: string = 'Alexandre';
      const password: string = 'abc123';

      const result: string = structureMessageCreatedAccountTEXT(firstname, password);
      expect(result).toContain(`Bonjour ${firstname}`);
      expect(result).toContain(password);
      expect(result).toContain('compte a été créé');
      expect(result).toContain('changer dès votre première connexion');
    });

    it('should return a plain text account creation message in French when lang is "fr"', () => {
      const firstname: string = 'Alexandre';
      const password: string = 'abc123';

      const result: string = structureMessageCreatedAccountTEXT(firstname, password, 'fr');
      expect(result).toContain(`Bonjour ${firstname}`);
      expect(result).toContain(password);
      expect(result).toContain('Votre compte a été créé avec succès');
    });

    it('should return a plain text account creation message in English when lang is "en"', () => {
      const firstname: string = 'Alexandre';
      const password: string = 'abc123';

      const result: string = structureMessageCreatedAccountTEXT(firstname, password, 'en');
      expect(result).toContain(`Hello ${firstname}`);
      expect(result).toContain(password);
      expect(result).toContain('Your account has been successfully created');
      expect(result).toContain('Please change it on your first login');
    });

    it('should handle empty firstname and password in structureMessageCreatedAccountTEXT', () => {
      const result: string = structureMessageCreatedAccountTEXT('', '');
      expect(result).toContain('Bonjour');
      expect(result).toContain('Votre compte a été créé avec succès');
      expect(result).toContain('Voici votre mot de passe temporaire : ');
    });
  });

  describe('structureMessageCreatedAccountHTML', () => {
    it('should return an HTML account creation message in French (default)', () => {
      const firstname: string = 'Alexandre';
      const password: string = 'abc123';

      const result: string = structureMessageCreatedAccountHTML(firstname, password);
      expect(result).toContain(`<p>Bonjour ${firstname},</p>`);
      expect(result).toContain(`<strong>Mot de passe temporaire :</strong> ${password}`);
      expect(result).toContain('changer dès votre première connexion');
    });

    it('should return an HTML account creation message in French when lang is "fr"', () => {
      const firstname: string = 'Alexandre';
      const password: string = 'abc123';

      const result: string = structureMessageCreatedAccountHTML(firstname, password, 'fr');
      expect(result).toContain(`<p>Bonjour ${firstname},</p>`);
      expect(result).toContain(`<strong>Mot de passe temporaire :</strong> ${password}`);
      expect(result).toContain('Votre compte a été créé avec succès');
    });

    it('should return an HTML account creation message in English when lang is "en"', () => {
      const firstname: string = 'Alexandre';
      const password: string = 'abc123';

      const result: string = structureMessageCreatedAccountHTML(firstname, password, 'en');
      expect(result).toContain(`<p>Hello ${firstname},</p>`);
      expect(result).toContain(`<strong>Temporary password:</strong> ${password}`);
      expect(result).toContain('Your account has been successfully created');
      expect(result).toContain('Please change it on your first login');
    });

    it('should handle empty firstname and password in structureMessageCreatedAccountHTML', () => {
      const result: string = structureMessageCreatedAccountHTML('', '');
      expect(result).toContain('<p>Bonjour ,</p>');
      expect(result).toContain('<strong>Mot de passe temporaire :</strong> ');
      expect(result).toContain('Merci de le changer dès votre première connexion');
    });
  });
});