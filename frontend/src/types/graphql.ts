import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CaptchaImage = {
  __typename?: 'CaptchaImage';
  id: Scalars['String']['output'];
  typeEN: Scalars['String']['output'];
  typeFR: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CaptchaResponse = {
  __typename?: 'CaptchaResponse';
  challengeType: Scalars['String']['output'];
  challengeTypeTranslation: ChallengeTypeTranslation;
  expirationTime: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  images: Array<CaptchaImage>;
};

export type ChallengeTypeTranslation = {
  __typename?: 'ChallengeTypeTranslation';
  typeEN: Scalars['String']['output'];
  typeFR: Scalars['String']['output'];
};

export type ContactFrom = {
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  object: Scalars['String']['input'];
};

export type Education = {
  __typename?: 'Education';
  diplomaLevelEN: Scalars['String']['output'];
  diplomaLevelFR: Scalars['String']['output'];
  endDateEN: Scalars['String']['output'];
  endDateFR: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  month?: Maybe<Scalars['Float']['output']>;
  school: Scalars['String']['output'];
  startDateEN: Scalars['String']['output'];
  startDateFR: Scalars['String']['output'];
  titleEN: Scalars['String']['output'];
  titleFR: Scalars['String']['output'];
  typeEN: Scalars['String']['output'];
  typeFR: Scalars['String']['output'];
  year: Scalars['Float']['output'];
};

export type Experience = {
  __typename?: 'Experience';
  business: Scalars['String']['output'];
  employmentContractEN?: Maybe<Scalars['String']['output']>;
  employmentContractFR?: Maybe<Scalars['String']['output']>;
  endDateEN: Scalars['String']['output'];
  endDateFR: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  jobEN: Scalars['String']['output'];
  jobFR: Scalars['String']['output'];
  month?: Maybe<Scalars['Float']['output']>;
  startDateEN: Scalars['String']['output'];
  startDateFR: Scalars['String']['output'];
  typeEN: Scalars['String']['output'];
  typeFR: Scalars['String']['output'];
};

export type MessageType = {
  __typename?: 'MessageType';
  label: Scalars['String']['output'];
  message: Scalars['String']['output'];
  status: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  clearCaptcha: Scalars['Boolean']['output'];
  sendContact: MessageType;
  validateCaptcha: ValidationResponse;
};


export type MutationClearCaptchaArgs = {
  idCaptcha: Scalars['String']['input'];
};


export type MutationSendContactArgs = {
  data: ContactFrom;
};


export type MutationValidateCaptchaArgs = {
  challengeType: Scalars['String']['input'];
  idCaptcha: Scalars['String']['input'];
  selectedIndices: Array<Scalars['Float']['input']>;
};

export type Project = {
  __typename?: 'Project';
  contentDisplay: Scalars['String']['output'];
  descriptionEN: Scalars['String']['output'];
  descriptionFR: Scalars['String']['output'];
  github?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  skills: Array<SkillSubItem>;
  title: Scalars['String']['output'];
  typeDisplay: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  educationList: Array<Education>;
  experienceList: Array<Experience>;
  generateCaptcha: CaptchaResponse;
  projectList: Array<Project>;
  skillList: Array<Skill>;
};

export type Skill = {
  __typename?: 'Skill';
  categoryEN: Scalars['String']['output'];
  categoryFR: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  skills: Array<SkillSubItem>;
};

export type SkillSubItem = {
  __typename?: 'SkillSubItem';
  categoryId: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ValidationResponse = {
  __typename?: 'ValidationResponse';
  isValid: Scalars['Boolean']['output'];
};

export type ValidateCaptchaMutationVariables = Exact<{
  challengeType: Scalars['String']['input'];
  selectedIndices: Array<Scalars['Float']['input']> | Scalars['Float']['input'];
  idCaptcha: Scalars['String']['input'];
}>;


export type ValidateCaptchaMutation = { __typename?: 'Mutation', validateCaptcha: { __typename?: 'ValidationResponse', isValid: boolean } };

export type ClearCaptchaMutationVariables = Exact<{
  idCaptcha: Scalars['String']['input'];
}>;


export type ClearCaptchaMutation = { __typename?: 'Mutation', clearCaptcha: boolean };

export type SendContactMutationVariables = Exact<{
  data: ContactFrom;
}>;


export type SendContactMutation = { __typename?: 'Mutation', sendContact: { __typename?: 'MessageType', label: string, message: string, status: boolean } };

export type GenerateCaptchaQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateCaptchaQuery = { __typename?: 'Query', generateCaptcha: { __typename?: 'CaptchaResponse', id: string, challengeType: string, images: Array<{ __typename?: 'CaptchaImage', typeEN: string, typeFR: string, url: string, id: string }>, challengeTypeTranslation: { __typename?: 'ChallengeTypeTranslation', typeEN: string, typeFR: string } } };

export type GetEducationsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEducationsListQuery = { __typename?: 'Query', educationList: Array<{ __typename?: 'Education', id: string, titleEN: string, titleFR: string, diplomaLevelEN: string, diplomaLevelFR: string, school: string, location: string, year: number, startDateEN: string, startDateFR: string, endDateEN: string, endDateFR: string, month?: number | null, typeEN: string, typeFR: string }> };

export type GetExperiencesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExperiencesListQuery = { __typename?: 'Query', experienceList: Array<{ __typename?: 'Experience', id: string, jobEN: string, jobFR: string, business: string, employmentContractEN?: string | null, employmentContractFR?: string | null, startDateEN: string, startDateFR: string, endDateEN: string, endDateFR: string, month?: number | null, typeEN: string, typeFR: string }> };

export type GetProjectsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsListQuery = { __typename?: 'Query', projectList: Array<{ __typename?: 'Project', id: string, title: string, github?: string | null, descriptionFR: string, descriptionEN: string, contentDisplay: string, typeDisplay: string, skills: Array<{ __typename?: 'SkillSubItem', id: string, name: string, image: string, categoryId: number }> }> };

export type GetSkillsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSkillsListQuery = { __typename?: 'Query', skillList: Array<{ __typename?: 'Skill', id: string, categoryFR: string, categoryEN: string, skills: Array<{ __typename?: 'SkillSubItem', name: string, image: string }> }> };


export const ValidateCaptchaDocument = gql`
    mutation ValidateCaptcha($challengeType: String!, $selectedIndices: [Float!]!, $idCaptcha: String!) {
  validateCaptcha(
    challengeType: $challengeType
    selectedIndices: $selectedIndices
    idCaptcha: $idCaptcha
  ) {
    isValid
  }
}
    `;
export type ValidateCaptchaMutationFn = Apollo.MutationFunction<ValidateCaptchaMutation, ValidateCaptchaMutationVariables>;

/**
 * __useValidateCaptchaMutation__
 *
 * To run a mutation, you first call `useValidateCaptchaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useValidateCaptchaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [validateCaptchaMutation, { data, loading, error }] = useValidateCaptchaMutation({
 *   variables: {
 *      challengeType: // value for 'challengeType'
 *      selectedIndices: // value for 'selectedIndices'
 *      idCaptcha: // value for 'idCaptcha'
 *   },
 * });
 */
export function useValidateCaptchaMutation(baseOptions?: Apollo.MutationHookOptions<ValidateCaptchaMutation, ValidateCaptchaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ValidateCaptchaMutation, ValidateCaptchaMutationVariables>(ValidateCaptchaDocument, options);
      }
export type ValidateCaptchaMutationHookResult = ReturnType<typeof useValidateCaptchaMutation>;
export type ValidateCaptchaMutationResult = Apollo.MutationResult<ValidateCaptchaMutation>;
export type ValidateCaptchaMutationOptions = Apollo.BaseMutationOptions<ValidateCaptchaMutation, ValidateCaptchaMutationVariables>;
export const ClearCaptchaDocument = gql`
    mutation ClearCaptcha($idCaptcha: String!) {
  clearCaptcha(idCaptcha: $idCaptcha)
}
    `;
export type ClearCaptchaMutationFn = Apollo.MutationFunction<ClearCaptchaMutation, ClearCaptchaMutationVariables>;

/**
 * __useClearCaptchaMutation__
 *
 * To run a mutation, you first call `useClearCaptchaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearCaptchaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearCaptchaMutation, { data, loading, error }] = useClearCaptchaMutation({
 *   variables: {
 *      idCaptcha: // value for 'idCaptcha'
 *   },
 * });
 */
export function useClearCaptchaMutation(baseOptions?: Apollo.MutationHookOptions<ClearCaptchaMutation, ClearCaptchaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearCaptchaMutation, ClearCaptchaMutationVariables>(ClearCaptchaDocument, options);
      }
export type ClearCaptchaMutationHookResult = ReturnType<typeof useClearCaptchaMutation>;
export type ClearCaptchaMutationResult = Apollo.MutationResult<ClearCaptchaMutation>;
export type ClearCaptchaMutationOptions = Apollo.BaseMutationOptions<ClearCaptchaMutation, ClearCaptchaMutationVariables>;
export const SendContactDocument = gql`
    mutation sendContact($data: ContactFrom!) {
  sendContact(data: $data) {
    label
    message
    status
  }
}
    `;
export type SendContactMutationFn = Apollo.MutationFunction<SendContactMutation, SendContactMutationVariables>;

/**
 * __useSendContactMutation__
 *
 * To run a mutation, you first call `useSendContactMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendContactMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendContactMutation, { data, loading, error }] = useSendContactMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSendContactMutation(baseOptions?: Apollo.MutationHookOptions<SendContactMutation, SendContactMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendContactMutation, SendContactMutationVariables>(SendContactDocument, options);
      }
export type SendContactMutationHookResult = ReturnType<typeof useSendContactMutation>;
export type SendContactMutationResult = Apollo.MutationResult<SendContactMutation>;
export type SendContactMutationOptions = Apollo.BaseMutationOptions<SendContactMutation, SendContactMutationVariables>;
export const GenerateCaptchaDocument = gql`
    query generateCaptcha {
  generateCaptcha {
    id
    images {
      typeEN
      typeFR
      url
      id
    }
    challengeType
    challengeTypeTranslation {
      typeEN
      typeFR
    }
  }
}
    `;

/**
 * __useGenerateCaptchaQuery__
 *
 * To run a query within a React component, call `useGenerateCaptchaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateCaptchaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateCaptchaQuery({
 *   variables: {
 *   },
 * });
 */
export function useGenerateCaptchaQuery(baseOptions?: Apollo.QueryHookOptions<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>(GenerateCaptchaDocument, options);
      }
export function useGenerateCaptchaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>(GenerateCaptchaDocument, options);
        }
export function useGenerateCaptchaSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>(GenerateCaptchaDocument, options);
        }
export type GenerateCaptchaQueryHookResult = ReturnType<typeof useGenerateCaptchaQuery>;
export type GenerateCaptchaLazyQueryHookResult = ReturnType<typeof useGenerateCaptchaLazyQuery>;
export type GenerateCaptchaSuspenseQueryHookResult = ReturnType<typeof useGenerateCaptchaSuspenseQuery>;
export type GenerateCaptchaQueryResult = Apollo.QueryResult<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>;
export const GetEducationsListDocument = gql`
    query GetEducationsList {
  educationList {
    id
    titleEN
    titleFR
    diplomaLevelEN
    diplomaLevelFR
    school
    location
    year
    startDateEN
    startDateFR
    endDateEN
    endDateFR
    month
    typeEN
    typeFR
  }
}
    `;

/**
 * __useGetEducationsListQuery__
 *
 * To run a query within a React component, call `useGetEducationsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEducationsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEducationsListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEducationsListQuery(baseOptions?: Apollo.QueryHookOptions<GetEducationsListQuery, GetEducationsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEducationsListQuery, GetEducationsListQueryVariables>(GetEducationsListDocument, options);
      }
export function useGetEducationsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEducationsListQuery, GetEducationsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEducationsListQuery, GetEducationsListQueryVariables>(GetEducationsListDocument, options);
        }
export function useGetEducationsListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEducationsListQuery, GetEducationsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEducationsListQuery, GetEducationsListQueryVariables>(GetEducationsListDocument, options);
        }
export type GetEducationsListQueryHookResult = ReturnType<typeof useGetEducationsListQuery>;
export type GetEducationsListLazyQueryHookResult = ReturnType<typeof useGetEducationsListLazyQuery>;
export type GetEducationsListSuspenseQueryHookResult = ReturnType<typeof useGetEducationsListSuspenseQuery>;
export type GetEducationsListQueryResult = Apollo.QueryResult<GetEducationsListQuery, GetEducationsListQueryVariables>;
export const GetExperiencesListDocument = gql`
    query GetExperiencesList {
  experienceList {
    id
    jobEN
    jobFR
    business
    employmentContractEN
    employmentContractFR
    startDateEN
    startDateFR
    endDateEN
    endDateFR
    month
    typeEN
    typeFR
  }
}
    `;

/**
 * __useGetExperiencesListQuery__
 *
 * To run a query within a React component, call `useGetExperiencesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExperiencesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExperiencesListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExperiencesListQuery(baseOptions?: Apollo.QueryHookOptions<GetExperiencesListQuery, GetExperiencesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExperiencesListQuery, GetExperiencesListQueryVariables>(GetExperiencesListDocument, options);
      }
export function useGetExperiencesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExperiencesListQuery, GetExperiencesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExperiencesListQuery, GetExperiencesListQueryVariables>(GetExperiencesListDocument, options);
        }
export function useGetExperiencesListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExperiencesListQuery, GetExperiencesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExperiencesListQuery, GetExperiencesListQueryVariables>(GetExperiencesListDocument, options);
        }
export type GetExperiencesListQueryHookResult = ReturnType<typeof useGetExperiencesListQuery>;
export type GetExperiencesListLazyQueryHookResult = ReturnType<typeof useGetExperiencesListLazyQuery>;
export type GetExperiencesListSuspenseQueryHookResult = ReturnType<typeof useGetExperiencesListSuspenseQuery>;
export type GetExperiencesListQueryResult = Apollo.QueryResult<GetExperiencesListQuery, GetExperiencesListQueryVariables>;
export const GetProjectsListDocument = gql`
    query GetProjectsList {
  projectList {
    id
    title
    github
    descriptionFR
    descriptionEN
    contentDisplay
    typeDisplay
    skills {
      id
      name
      image
      categoryId
    }
  }
}
    `;

/**
 * __useGetProjectsListQuery__
 *
 * To run a query within a React component, call `useGetProjectsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProjectsListQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectsListQuery, GetProjectsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProjectsListQuery, GetProjectsListQueryVariables>(GetProjectsListDocument, options);
      }
export function useGetProjectsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsListQuery, GetProjectsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProjectsListQuery, GetProjectsListQueryVariables>(GetProjectsListDocument, options);
        }
export function useGetProjectsListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProjectsListQuery, GetProjectsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProjectsListQuery, GetProjectsListQueryVariables>(GetProjectsListDocument, options);
        }
export type GetProjectsListQueryHookResult = ReturnType<typeof useGetProjectsListQuery>;
export type GetProjectsListLazyQueryHookResult = ReturnType<typeof useGetProjectsListLazyQuery>;
export type GetProjectsListSuspenseQueryHookResult = ReturnType<typeof useGetProjectsListSuspenseQuery>;
export type GetProjectsListQueryResult = Apollo.QueryResult<GetProjectsListQuery, GetProjectsListQueryVariables>;
export const GetSkillsListDocument = gql`
    query GetSkillsList {
  skillList {
    id
    categoryFR
    categoryEN
    skills {
      name
      image
    }
  }
}
    `;

/**
 * __useGetSkillsListQuery__
 *
 * To run a query within a React component, call `useGetSkillsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSkillsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSkillsListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSkillsListQuery(baseOptions?: Apollo.QueryHookOptions<GetSkillsListQuery, GetSkillsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSkillsListQuery, GetSkillsListQueryVariables>(GetSkillsListDocument, options);
      }
export function useGetSkillsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSkillsListQuery, GetSkillsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSkillsListQuery, GetSkillsListQueryVariables>(GetSkillsListDocument, options);
        }
export function useGetSkillsListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSkillsListQuery, GetSkillsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSkillsListQuery, GetSkillsListQueryVariables>(GetSkillsListDocument, options);
        }
export type GetSkillsListQueryHookResult = ReturnType<typeof useGetSkillsListQuery>;
export type GetSkillsListLazyQueryHookResult = ReturnType<typeof useGetSkillsListLazyQuery>;
export type GetSkillsListSuspenseQueryHookResult = ReturnType<typeof useGetSkillsListSuspenseQuery>;
export type GetSkillsListQueryResult = Apollo.QueryResult<GetSkillsListQuery, GetSkillsListQueryVariables>;