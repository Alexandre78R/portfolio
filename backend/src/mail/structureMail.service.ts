import { ContactFrom } from "../types/contact.types";

export const structureMessageMeTEXT = (data: ContactFrom): string => `
${data.message}

----------------------------------

Information sur l'email :
Email : ${data.email}
`;

export const structureMessageMeHTML = (data: ContactFrom): string => `
<p>${data.message}</p>
<hr>
<p><strong>Information sur l'email :</strong></p>
<p>Email : ${data.email}</p>
`;

export const structureMessageCreatedAccountTEXT = (firstname: string, plainPassword: string): string => `
Bonjour ${firstname},

Votre compte a été créé avec succès.

Voici votre mot de passe temporaire : ${plainPassword}

Merci de le changer dès votre première connexion.
`;

export const structureMessageCreatedAccountHTML = (firstname: string, plainPassword: string): string => `
<p>Bonjour ${firstname},</p>
<p>Votre compte a été créé avec succès.</p>
<p><strong>Mot de passe temporaire :</strong> ${plainPassword}</p>
<p>Merci de le changer dès votre première connexion.</p>
`;