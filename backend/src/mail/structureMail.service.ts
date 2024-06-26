import { ContactFrom } from "../types/contact.types"

export const structureMessageMeTEXT: (data: ContactFrom) => string = (data: ContactFrom): string => {
    return `
  ${data.message}
  
  ----------------------------------
  
  Information sur l'email :
  
  Nom de famille : ${data.lastname}
  Prénom : ${data.firstname}
  Email : ${data.email}
    `;
};
  
export const structureMessageMeHTML: (data: ContactFrom) => string = (data: ContactFrom): string => {
    return `
  <p>${data.message}</p>
  <hr>
  <p><strong>Information sur l'email :</strong></p>
  <p>Nom de famille : ${data.lastname}</p>
  <p>Prénom : ${data.firstname}</p>
  <p>Email : ${data.email}</p>
    `;
};