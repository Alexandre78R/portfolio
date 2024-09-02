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