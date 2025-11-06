import { gql } from "@apollo/client";

export const GET_THEMES_LIST = gql`
  query GetThemesList {
    themeList {
        themes {
            body
            admin
            error
            footer
            grey
            id
            info
            name
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