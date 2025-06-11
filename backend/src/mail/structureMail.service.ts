import { ContactFrom } from "../types/contact.types"

export const structureMessageMeTEXT: (data: ContactFrom) => string = (data: ContactFrom): string => {
    return `
    ${data.message}
    
    ----------------------------------
    
    Information sur l'email :
    Email : ${data.email}
  `;
};
  
export const structureMessageMeHTML: (data: ContactFrom) => string = (data: ContactFrom): string => {
    return `
    <p>${data.message}</p>
    <hr>
    <p><strong>Information sur l'email :</strong></p>
    <p>Email : ${data.email}</p>
    `;
};

export const structureMessageCreatedAccountTEXT: (firstname: string, plainPassword : string) => string = (firstname: string, plainPassword : string): string => {
    return  `
    Bonjour ${firstname},

    Votre compte a été créé avec succès.

    Voici votre mot de passe temporaire : ${plainPassword}

    Merci de le changer dès votre première connexion.
  `;
};

export const structureMessageCreatedAccountHTML: (firstname: string, plainPassword : string) => string = (firstname: string, plainPassword : string): string => {
  return `
  <p>Bonjour ${firstname},</p>
  <p>Votre compte a été créé avec succès.</p>
  <p><strong>Mot de passe temporaire :</strong> ${plainPassword}</p>
  <p>Merci de le changer dès votre première connexion.</p>
  `;
};