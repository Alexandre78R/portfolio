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
  DateTimeISO: { input: any; output: any; }
};

export type BackupFileInfo = {
  __typename?: 'BackupFileInfo';
  createdAt: Scalars['DateTimeISO']['output'];
  fileName: Scalars['String']['output'];
  modifiedAt: Scalars['DateTimeISO']['output'];
  sizeBytes: Scalars['Int']['output'];
};

export type BackupFilesResponse = {
  __typename?: 'BackupFilesResponse';
  code: Scalars['Int']['output'];
  files?: Maybe<Array<BackupFileInfo>>;
  message: Scalars['String']['output'];
};

export type BackupResponse = {
  __typename?: 'BackupResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  path: Scalars['String']['output'];
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

export type CategoryResponse = {
  __typename?: 'CategoryResponse';
  categories?: Maybe<Array<Skill>>;
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
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

export type CreateCategoryInput = {
  categoryEN: Scalars['String']['input'];
  categoryFR: Scalars['String']['input'];
};

export type CreateEducationInput = {
  diplomaLevelEN: Scalars['String']['input'];
  diplomaLevelFR: Scalars['String']['input'];
  endDateEN: Scalars['String']['input'];
  endDateFR: Scalars['String']['input'];
  location: Scalars['String']['input'];
  month: Scalars['Int']['input'];
  school: Scalars['String']['input'];
  startDateEN: Scalars['String']['input'];
  startDateFR: Scalars['String']['input'];
  titleEN: Scalars['String']['input'];
  titleFR: Scalars['String']['input'];
  typeEN: Scalars['String']['input'];
  typeFR: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};

export type CreateExperienceInput = {
  business: Scalars['String']['input'];
  employmentContractEN: Scalars['String']['input'];
  employmentContractFR: Scalars['String']['input'];
  endDateEN: Scalars['String']['input'];
  endDateFR: Scalars['String']['input'];
  jobEN: Scalars['String']['input'];
  jobFR: Scalars['String']['input'];
  month: Scalars['Float']['input'];
  startDateEN: Scalars['String']['input'];
  startDateFR: Scalars['String']['input'];
  typeEN: Scalars['String']['input'];
  typeFR: Scalars['String']['input'];
};

export type CreateProjectInput = {
  contentDisplay: Scalars['String']['input'];
  descriptionEN: Scalars['String']['input'];
  descriptionFR: Scalars['String']['input'];
  github?: InputMaybe<Scalars['String']['input']>;
  skillIds: Array<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
  typeDisplay: Scalars['String']['input'];
};

export type CreateSkillInput = {
  categoryId: Scalars['Int']['input'];
  image: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export type Education = {
  __typename?: 'Education';
  diplomaLevelEN: Scalars['String']['output'];
  diplomaLevelFR: Scalars['String']['output'];
  endDateEN: Scalars['String']['output'];
  endDateFR: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  month?: Maybe<Scalars['Int']['output']>;
  school: Scalars['String']['output'];
  startDateEN: Scalars['String']['output'];
  startDateFR: Scalars['String']['output'];
  titleEN: Scalars['String']['output'];
  titleFR: Scalars['String']['output'];
  typeEN: Scalars['String']['output'];
  typeFR: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type EducationResponse = {
  __typename?: 'EducationResponse';
  code: Scalars['Int']['output'];
  education?: Maybe<Education>;
  message: Scalars['String']['output'];
};

export type EducationsResponse = {
  __typename?: 'EducationsResponse';
  code: Scalars['Int']['output'];
  educations?: Maybe<Array<Education>>;
  message: Scalars['String']['output'];
};

export type Experience = {
  __typename?: 'Experience';
  business: Scalars['String']['output'];
  employmentContractEN: Scalars['String']['output'];
  employmentContractFR: Scalars['String']['output'];
  endDateEN: Scalars['String']['output'];
  endDateFR: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  jobEN: Scalars['String']['output'];
  jobFR: Scalars['String']['output'];
  month: Scalars['Float']['output'];
  startDateEN: Scalars['String']['output'];
  startDateFR: Scalars['String']['output'];
  typeEN: Scalars['String']['output'];
  typeFR: Scalars['String']['output'];
};

export type ExperienceResponse = {
  __typename?: 'ExperienceResponse';
  code: Scalars['Int']['output'];
  experience?: Maybe<Experience>;
  message: Scalars['String']['output'];
};

export type ExperiencesResponse = {
  __typename?: 'ExperiencesResponse';
  code: Scalars['Int']['output'];
  experiences?: Maybe<Array<Experience>>;
  message: Scalars['String']['output'];
};

export type GlobalStats = {
  __typename?: 'GlobalStats';
  totalEducations: Scalars['Int']['output'];
  totalExperiences: Scalars['Int']['output'];
  totalProjects: Scalars['Int']['output'];
  totalSkills: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
  usersByRoleAdmin: Scalars['Int']['output'];
  usersByRoleEditor: Scalars['Int']['output'];
  usersByRoleView: Scalars['Int']['output'];
};

export type GlobalStatsResponse = {
  __typename?: 'GlobalStatsResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  stats?: Maybe<GlobalStats>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type MessageType = {
  __typename?: 'MessageType';
  label: Scalars['String']['output'];
  message: Scalars['String']['output'];
  status: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Response;
  clearCaptcha: Scalars['Boolean']['output'];
  createCategory: CategoryResponse;
  createEducation: EducationResponse;
  createExperience: ExperienceResponse;
  createProject: ProjectResponse;
  createSkill: SubItemResponse;
  deleteBackupFile: Response;
  deleteCategory: CategoryResponse;
  deleteEducation: EducationResponse;
  deleteExperience: ExperienceResponse;
  deleteProject: Response;
  deleteSkill: SubItemResponse;
  generateDatabaseBackup: BackupResponse;
  login: LoginResponse;
  logout: Response;
  registerUser: UserResponse;
  sendContact: MessageType;
  updateCategory: CategoryResponse;
  updateEducation: EducationResponse;
  updateExperience: ExperienceResponse;
  updateProject: ProjectResponse;
  updateSkill: SubItemResponse;
  validateCaptcha: ValidationResponse;
};


export type MutationChangePasswordArgs = {
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationClearCaptchaArgs = {
  idCaptcha: Scalars['String']['input'];
};


export type MutationCreateCategoryArgs = {
  data: CreateCategoryInput;
};


export type MutationCreateEducationArgs = {
  data: CreateEducationInput;
};


export type MutationCreateExperienceArgs = {
  data: CreateExperienceInput;
};


export type MutationCreateProjectArgs = {
  data: CreateProjectInput;
};


export type MutationCreateSkillArgs = {
  data: CreateSkillInput;
};


export type MutationDeleteBackupFileArgs = {
  fileName: Scalars['String']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteEducationArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteExperienceArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteSkillArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRegisterUserArgs = {
  data: CreateUserInput;
};


export type MutationSendContactArgs = {
  data: ContactFrom;
};


export type MutationUpdateCategoryArgs = {
  data: UpdateCategoryInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateEducationArgs = {
  data: UpdateEducationInput;
};


export type MutationUpdateExperienceArgs = {
  data: UpdateExperienceInput;
};


export type MutationUpdateProjectArgs = {
  data: UpdateProjectInput;
};


export type MutationUpdateSkillArgs = {
  data: UpdateSkillInput;
  id: Scalars['Int']['input'];
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

export type ProjectResponse = {
  __typename?: 'ProjectResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  project?: Maybe<Project>;
};

export type ProjectsResponse = {
  __typename?: 'ProjectsResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
};

export type Query = {
  __typename?: 'Query';
  educationById: EducationResponse;
  educationList: EducationsResponse;
  experienceById: ExperienceResponse;
  experienceList: ExperiencesResponse;
  generateCaptcha: CaptchaResponse;
  getAverageSkillsPerProject: Scalars['Float']['output'];
  getGlobalStats: GlobalStatsResponse;
  getTopUsedSkills: TopSkillsResponse;
  getUsersRoleDistribution: UserRolePercent;
  listBackupFiles: BackupFilesResponse;
  me?: Maybe<User>;
  projectById: ProjectResponse;
  projectList: ProjectsResponse;
  skillList: CategoryResponse;
  userList: UsersResponse;
};


export type QueryEducationByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryExperienceByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProjectByIdArgs = {
  id: Scalars['Int']['input'];
};

export type Response = {
  __typename?: 'Response';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

/** User roles */
export enum Role {
  Admin = 'admin',
  Editor = 'editor',
  View = 'view'
}

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

export type SubItemResponse = {
  __typename?: 'SubItemResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  subItems?: Maybe<Array<SkillSubItem>>;
};

export type TopSkillUsage = {
  __typename?: 'TopSkillUsage';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  usageCount: Scalars['Int']['output'];
};

export type TopSkillsResponse = {
  __typename?: 'TopSkillsResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  skills: Array<TopSkillUsage>;
};

export type UpdateCategoryInput = {
  categoryEN?: InputMaybe<Scalars['String']['input']>;
  categoryFR?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEducationInput = {
  diplomaLevelEN?: InputMaybe<Scalars['String']['input']>;
  diplomaLevelFR?: InputMaybe<Scalars['String']['input']>;
  endDateEN?: InputMaybe<Scalars['String']['input']>;
  endDateFR?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  school?: InputMaybe<Scalars['String']['input']>;
  startDateEN?: InputMaybe<Scalars['String']['input']>;
  startDateFR?: InputMaybe<Scalars['String']['input']>;
  titleEN?: InputMaybe<Scalars['String']['input']>;
  titleFR?: InputMaybe<Scalars['String']['input']>;
  typeEN?: InputMaybe<Scalars['String']['input']>;
  typeFR?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateExperienceInput = {
  business?: InputMaybe<Scalars['String']['input']>;
  employmentContractEN?: InputMaybe<Scalars['String']['input']>;
  employmentContractFR?: InputMaybe<Scalars['String']['input']>;
  endDateEN?: InputMaybe<Scalars['String']['input']>;
  endDateFR?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  jobEN?: InputMaybe<Scalars['String']['input']>;
  jobFR?: InputMaybe<Scalars['String']['input']>;
  month?: InputMaybe<Scalars['Float']['input']>;
  startDateEN?: InputMaybe<Scalars['String']['input']>;
  startDateFR?: InputMaybe<Scalars['String']['input']>;
  typeEN?: InputMaybe<Scalars['String']['input']>;
  typeFR?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  contentDisplay?: InputMaybe<Scalars['String']['input']>;
  descriptionEN?: InputMaybe<Scalars['String']['input']>;
  descriptionFR?: InputMaybe<Scalars['String']['input']>;
  github?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  skillIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  typeDisplay?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSkillInput = {
  categoryId: Scalars['Int']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  firstname: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPasswordChange: Scalars['Boolean']['output'];
  lastname: Scalars['String']['output'];
  role: Role;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type UserRolePercent = {
  __typename?: 'UserRolePercent';
  admin: Scalars['Float']['output'];
  code: Scalars['Int']['output'];
  editor: Scalars['Float']['output'];
  message: Scalars['String']['output'];
  view: Scalars['Float']['output'];
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  users?: Maybe<Array<User>>;
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

export type MutationMutationVariables = Exact<{
  data: LoginInput;
}>;


export type MutationMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token?: string | null, message: string, code: number } };

export type GetGlobalStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalStatsQuery = { __typename?: 'Query', getAverageSkillsPerProject: number, getGlobalStats: { __typename?: 'GlobalStatsResponse', code: number, message: string, stats?: { __typename?: 'GlobalStats', totalUsers: number, totalProjects: number, totalSkills: number, totalEducations: number, totalExperiences: number, usersByRoleAdmin: number, usersByRoleEditor: number, usersByRoleView: number } | null }, getUsersRoleDistribution: { __typename?: 'UserRolePercent', admin: number, editor: number, view: number, message: string, code: number }, getTopUsedSkills: { __typename?: 'TopSkillsResponse', code: number, message: string, skills: Array<{ __typename?: 'TopSkillUsage', id: number, name: string, usageCount: number }> } };

export type GenerateCaptchaQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateCaptchaQuery = { __typename?: 'Query', generateCaptcha: { __typename?: 'CaptchaResponse', id: string, challengeType: string, images: Array<{ __typename?: 'CaptchaImage', typeEN: string, typeFR: string, url: string, id: string }>, challengeTypeTranslation: { __typename?: 'ChallengeTypeTranslation', typeEN: string, typeFR: string } } };

export type GetEducationsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEducationsListQuery = { __typename?: 'Query', educationList: { __typename?: 'EducationsResponse', message: string, code: number, educations?: Array<{ __typename?: 'Education', diplomaLevelEN: string, diplomaLevelFR: string, endDateEN: string, endDateFR: string, id: string, location: string, month?: number | null, school: string, startDateEN: string, startDateFR: string, titleEN: string, titleFR: string, typeEN: string, typeFR: string, year: number }> | null } };

export type GetExperiencesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExperiencesListQuery = { __typename?: 'Query', experienceList: { __typename?: 'ExperiencesResponse', message: string, code: number, experiences?: Array<{ __typename?: 'Experience', employmentContractEN: string, business: string, employmentContractFR: string, endDateEN: string, endDateFR: string, jobEN: string, id: string, jobFR: string, month: number, startDateEN: string, startDateFR: string, typeEN: string, typeFR: string }> | null } };

export type GetProjectsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsListQuery = { __typename?: 'Query', projectList: { __typename?: 'ProjectsResponse', message: string, code: number, projects?: Array<{ __typename?: 'Project', contentDisplay: string, descriptionEN: string, descriptionFR: string, github?: string | null, id: string, title: string, typeDisplay: string, skills: Array<{ __typename?: 'SkillSubItem', categoryId: number, id: string, image: string, name: string }> }> | null } };

export type GetSkillsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSkillsListQuery = { __typename?: 'Query', skillList: { __typename?: 'CategoryResponse', code: number, message: string, categories?: Array<{ __typename?: 'Skill', categoryFR: string, id: string, categoryEN: string, skills: Array<{ __typename?: 'SkillSubItem', categoryId: number, id: string, image: string, name: string }> }> | null } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', role: Role, lastname: string, isPasswordChange: boolean, id: string, firstname: string, email: string } | null };


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
export const MutationDocument = gql`
    mutation Mutation($data: LoginInput!) {
  login(data: $data) {
    token
    message
    code
  }
}
    `;
export type MutationMutationFn = Apollo.MutationFunction<MutationMutation, MutationMutationVariables>;

/**
 * __useMutationMutation__
 *
 * To run a mutation, you first call `useMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mutationMutation, { data, loading, error }] = useMutationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useMutationMutation(baseOptions?: Apollo.MutationHookOptions<MutationMutation, MutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MutationMutation, MutationMutationVariables>(MutationDocument, options);
      }
export type MutationMutationHookResult = ReturnType<typeof useMutationMutation>;
export type MutationMutationResult = Apollo.MutationResult<MutationMutation>;
export type MutationMutationOptions = Apollo.BaseMutationOptions<MutationMutation, MutationMutationVariables>;
export const GetGlobalStatsDocument = gql`
    query GetGlobalStats {
  getGlobalStats {
    code
    message
    stats {
      totalUsers
      totalProjects
      totalSkills
      totalEducations
      totalExperiences
      usersByRoleAdmin
      usersByRoleEditor
      usersByRoleView
    }
  }
  getAverageSkillsPerProject
  getUsersRoleDistribution {
    admin
    editor
    view
    message
    code
  }
  getTopUsedSkills {
    code
    message
    skills {
      id
      name
      usageCount
    }
  }
}
    `;

/**
 * __useGetGlobalStatsQuery__
 *
 * To run a query within a React component, call `useGetGlobalStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGlobalStatsQuery(baseOptions?: Apollo.QueryHookOptions<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>(GetGlobalStatsDocument, options);
      }
export function useGetGlobalStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>(GetGlobalStatsDocument, options);
        }
export function useGetGlobalStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>(GetGlobalStatsDocument, options);
        }
export type GetGlobalStatsQueryHookResult = ReturnType<typeof useGetGlobalStatsQuery>;
export type GetGlobalStatsLazyQueryHookResult = ReturnType<typeof useGetGlobalStatsLazyQuery>;
export type GetGlobalStatsSuspenseQueryHookResult = ReturnType<typeof useGetGlobalStatsSuspenseQuery>;
export type GetGlobalStatsQueryResult = Apollo.QueryResult<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>;
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
    message
    code
    educations {
      diplomaLevelEN
      diplomaLevelFR
      endDateEN
      endDateFR
      id
      location
      month
      school
      startDateEN
      startDateFR
      titleEN
      titleFR
      typeEN
      typeFR
      year
    }
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
    message
    code
    experiences {
      employmentContractEN
      business
      employmentContractFR
      endDateEN
      endDateFR
      jobEN
      id
      jobFR
      month
      startDateEN
      startDateFR
      typeEN
      typeFR
    }
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
    message
    code
    projects {
      contentDisplay
      descriptionEN
      descriptionFR
      github
      id
      skills {
        categoryId
        id
        image
        name
      }
      title
      typeDisplay
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
    categories {
      categoryFR
      id
      skills {
        categoryId
        id
        image
        name
      }
      categoryEN
    }
    code
    message
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
export const GetMeDocument = gql`
    query GetMe {
  me {
    role
    lastname
    isPasswordChange
    id
    firstname
    email
  }
}
    `;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeSuspenseQueryHookResult = ReturnType<typeof useGetMeSuspenseQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;