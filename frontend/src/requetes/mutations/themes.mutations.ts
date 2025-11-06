import { gql } from "@apollo/client";

export const CREATED_THEME  = gql`
mutation CreateTheme($data: CreateThemeInput!) {
  createTheme(data: $data) {
    theme {
      admin
      body
      error
      footer
      grey
      id
      info
      name
      nameEN
      nameFR
      placeholder
      primary
      scrollHandle
      scrollHandleHover
      secondary
      success
      text100
      text200
      text300
      textButton
      textDefault
      visible
      warn
    }
    code
    message
  }
}
`;
