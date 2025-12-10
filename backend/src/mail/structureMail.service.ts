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

export const structureMessageForgotPasswordTEXT = (firstname: string, newPassword: string): string => `
Bonjour ${firstname},

Vous avez demandé à réinitialiser votre mot de passe.

Voici votre nouveau mot de passe temporaire : ${newPassword}

Merci de le changer dès votre prochaine connexion pour des raisons de sécurité.

Si vous n'avez pas demandé cette réinitialisation, veuillez contacter l'administrateur immédiatement.
`;

export const structureMessageForgotPasswordHTML = (firstname: string, newPassword: string): string => `
<p>Bonjour ${firstname},</p>
<p>Vous avez demandé à réinitialiser votre mot de passe.</p>
<p><strong>Nouveau mot de passe temporaire :</strong> ${newPassword}</p>
<p>Merci de le changer dès votre prochaine connexion pour des raisons de sécurité.</p>
<p style="color: #d32f2f;">Si vous n'avez pas demandé cette réinitialisation, veuillez contacter l'administrateur immédiatement.</p>
`;