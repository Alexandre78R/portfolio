import { AuthChecker } from "type-graphql";
import { MyContext } from "../index"; // Importe MyContext depuis ton fichier principal du serveur
import { UserRole } from "../entities/user.entity"; // Importe UserRole (ton enum)

/**
 * Fonction customAuthChecker pour Type-GraphQL.
 * Elle est appelée par le décorateur @Authorized() pour vérifier les permissions.
 *
 * @param {object} param0 - Contient l'objet de contexte (context) de la requête.
 * @param {string[]} roles - Tableau des rôles requis pour accéder au resolver (passés à @Authorized()).
 * @returns {boolean} True si l'utilisateur est autorisé, False sinon.
 */

// export const customAuthChecker: AuthChecker<MyContext> = (
//   { context }, 
//   roles 
// ) => {

//   if (!context.user) {
//     // console.log("AuthChecker: User not logged in (context.user is null).");
//     return false;
//   }

//   if (roles.length > 0) {
//     if (!roles.includes(context.user.role)) {
//     //   console.log(
//     //     `AuthChecker: User '${context.user.email}' (Role: '${context.user.role}') is not in required roles: [${roles.join(', ')}].`
//     //   );
//       return false;
//     }
//   }

// //   console.log(`AuthChecker: User '${context.user.email}' (Role: '${context.user.role}') is authorized.`);
//   return true;
// };

export const customAuthChecker = (
  { context }: { context: MyContext },
  roles: string[]
): boolean => {
  if (!context.user) {
    // console.log("AuthChecker: User not logged in (context.user is null).");
    return false;
  }

  if (roles.length > 0) {
    if (!roles.includes(context.user.role)) {
    //   console.log(
    //     `AuthChecker: User '${context.user.email}' (Role: '${context.user.role}') is not in required roles: [${roles.join(', ')}].`
    //   );
      return false;
    }
  }

//   console.log(`AuthChecker: User '${context.user.email}' (Role: '${context.user.role}') is authorized.`);
  return true;
};