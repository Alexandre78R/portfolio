import { gql } from "@apollo/client";

export const GET_THEMES_LIST = gql`
  query GetThemesList {
    listThemes {
        themes {
            body
            admin
            error
            footer
            grey
            id
            info
            name
            nameFR
            nameEN
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
        message
        code
    }
  }
`;

export const GET_THEME_BY_ID = gql`
  query GetThemeById($id: Int!) {
    getThemeById(id: $id) {
      theme {
        id
        name
        nameEN
        nameFR
        visible
        body
        scrollHandle
        scrollHandleHover
        primary
        secondary
        success
        error
        warn
        info
        grey
        placeholder
        footer
        admin
        textDefault
        text100
        text200
        text300
        textButton
      }
      message
      code
    }
  }
`;