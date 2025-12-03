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
  Upload: { input: any; output: any; }
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
  files: Array<BackupFileInfo>;
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
  categories?: Maybe<Array<SkillCategoryWithSkillsDto>>;
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
  skillIds?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  image: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateSocialInput = {
  tab: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type CreateThemeInput = {
  admin: Scalars['String']['input'];
  body: Scalars['String']['input'];
  error: Scalars['String']['input'];
  footer: Scalars['String']['input'];
  grey: Scalars['String']['input'];
  info: Scalars['String']['input'];
  name: Scalars['String']['input'];
  nameEN: Scalars['String']['input'];
  nameFR: Scalars['String']['input'];
  placeholder: Scalars['String']['input'];
  primary: Scalars['String']['input'];
  scrollHandle: Scalars['String']['input'];
  scrollHandleHover: Scalars['String']['input'];
  secondary: Scalars['String']['input'];
  success: Scalars['String']['input'];
  text100: Scalars['String']['input'];
  text200: Scalars['String']['input'];
  text300: Scalars['String']['input'];
  textButton: Scalars['String']['input'];
  textDefault: Scalars['String']['input'];
  visible?: Scalars['Boolean']['input'];
  warn: Scalars['String']['input'];
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
  createSocial: SocialResponse;
  createTheme: ThemeResponse;
  deleteBackupFile: Response;
  deleteCategory: CategoryResponse;
  deleteEducation: EducationResponse;
  deleteExperience: ExperienceResponse;
  deleteProject: Response;
  deleteProjectMedia: ProjectResponse;
  deleteSkill: SubItemResponse;
  deleteSocial: SocialResponse;
  deleteTheme: Response;
  deleteUser: Response;
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
  updateSocial: SocialResponse;
  updateTheme: ThemeResponse;
  updateUser: UserResponse;
  uploadCV: UploadResponse;
  uploadProjectMedia: ProjectResponse;
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


export type MutationCreateSocialArgs = {
  data: CreateSocialInput;
};


export type MutationCreateThemeArgs = {
  data: CreateThemeInput;
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


export type MutationDeleteProjectMediaArgs = {
  projectId: Scalars['Int']['input'];
};


export type MutationDeleteSkillArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteSocialArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteThemeArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteUserArgs = {
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


export type MutationUpdateSocialArgs = {
  data: UpdateSocialInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateThemeArgs = {
  data: UpdateThemeInput;
};


export type MutationUpdateUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  lastname?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUploadCvArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationUploadProjectMediaArgs = {
  file: Scalars['Upload']['input'];
  projectId: Scalars['Int']['input'];
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
  cvUrl: Scalars['String']['output'];
  educationById: EducationResponse;
  educationList: EducationsResponse;
  educationListPagination: EducationsResponse;
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
  skillById: SubItemResponse;
  skillCategoryById: CategoryResponse;
  skillList: CategoryResponse;
  socialById: SocialResponse;
  socialList: Array<Social>;
  themeById: ThemeResponse;
  themeList: ThemesResponse;
  userById: UserResponse;
  userList: UsersResponse;
};


export type QueryEducationByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryEducationListPaginationArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExperienceByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProjectByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySkillByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySkillCategoryByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySocialByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryThemeByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserByIdArgs = {
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

export type SkillCategoryWithSkillsDto = {
  __typename?: 'SkillCategoryWithSkillsDTO';
  categoryEN: Scalars['String']['output'];
  categoryFR: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  skills: Array<SkillSubItem>;
};

export type SkillSubItem = {
  __typename?: 'SkillSubItem';
  categoryId?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Social = {
  __typename?: 'Social';
  id: Scalars['ID']['output'];
  tab: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type SocialResponse = {
  __typename?: 'SocialResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  social?: Maybe<Social>;
};

export type SubItemResponse = {
  __typename?: 'SubItemResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  subItems?: Maybe<Array<SkillSubItem>>;
};

export type Theme = {
  __typename?: 'Theme';
  admin: Scalars['String']['output'];
  body: Scalars['String']['output'];
  error: Scalars['String']['output'];
  footer: Scalars['String']['output'];
  grey: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  info: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nameEN: Scalars['String']['output'];
  nameFR: Scalars['String']['output'];
  placeholder: Scalars['String']['output'];
  primary: Scalars['String']['output'];
  scrollHandle: Scalars['String']['output'];
  scrollHandleHover: Scalars['String']['output'];
  secondary: Scalars['String']['output'];
  success: Scalars['String']['output'];
  text100: Scalars['String']['output'];
  text200: Scalars['String']['output'];
  text300: Scalars['String']['output'];
  textButton: Scalars['String']['output'];
  textDefault: Scalars['String']['output'];
  visible: Scalars['Boolean']['output'];
  warn: Scalars['String']['output'];
};

export type ThemeResponse = {
  __typename?: 'ThemeResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  theme?: Maybe<Theme>;
};

export type ThemesResponse = {
  __typename?: 'ThemesResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  themes?: Maybe<Array<Theme>>;
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
  skillIds?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSocialInput = {
  tab?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateThemeInput = {
  admin?: InputMaybe<Scalars['String']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  error?: InputMaybe<Scalars['String']['input']>;
  footer?: InputMaybe<Scalars['String']['input']>;
  grey?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  info?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nameEN?: InputMaybe<Scalars['String']['input']>;
  nameFR?: InputMaybe<Scalars['String']['input']>;
  placeholder?: InputMaybe<Scalars['String']['input']>;
  primary?: InputMaybe<Scalars['String']['input']>;
  scrollHandle?: InputMaybe<Scalars['String']['input']>;
  scrollHandleHover?: InputMaybe<Scalars['String']['input']>;
  secondary?: InputMaybe<Scalars['String']['input']>;
  success?: InputMaybe<Scalars['String']['input']>;
  text100?: InputMaybe<Scalars['String']['input']>;
  text200?: InputMaybe<Scalars['String']['input']>;
  text300?: InputMaybe<Scalars['String']['input']>;
  textButton?: InputMaybe<Scalars['String']['input']>;
  textDefault?: InputMaybe<Scalars['String']['input']>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
  warn?: InputMaybe<Scalars['String']['input']>;
};

export type UploadResponse = {
  __typename?: 'UploadResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
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

export type GenerateDatabaseBackupMutationVariables = Exact<{ [key: string]: never; }>;


export type GenerateDatabaseBackupMutation = { __typename?: 'Mutation', generateDatabaseBackup: { __typename?: 'BackupResponse', path: string, message: string, code: number } };

export type DeleteBackupFileMutationVariables = Exact<{
  fileName: Scalars['String']['input'];
}>;


export type DeleteBackupFileMutation = { __typename?: 'Mutation', deleteBackupFile: { __typename?: 'Response', code: number, message: string } };

export type UploadCvMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type UploadCvMutation = { __typename?: 'Mutation', uploadCV: { __typename?: 'UploadResponse', code: number, message: string, url?: string | null } };

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

export type CreateEducationMutationVariables = Exact<{
  data: CreateEducationInput;
}>;


export type CreateEducationMutation = { __typename?: 'Mutation', createEducation: { __typename?: 'EducationResponse', code: number, education?: { __typename?: 'Education', id: string, school: string, location: string, diplomaLevelFR: string, diplomaLevelEN: string, titleFR: string, titleEN: string, typeFR: string, typeEN: string, startDateFR: string, startDateEN: string, endDateFR: string, endDateEN: string, month?: number | null, year: number } | null } };

export type UpdateEducationMutationVariables = Exact<{
  data: UpdateEducationInput;
}>;


export type UpdateEducationMutation = { __typename?: 'Mutation', updateEducation: { __typename?: 'EducationResponse', message: string, code: number, education?: { __typename?: 'Education', id: string, school: string, location: string, diplomaLevelFR: string, diplomaLevelEN: string, titleFR: string, titleEN: string, typeFR: string, typeEN: string, startDateFR: string, startDateEN: string, endDateFR: string, endDateEN: string, month?: number | null, year: number } | null } };

export type DeleteEducationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteEducationMutation = { __typename?: 'Mutation', deleteEducation: { __typename?: 'EducationResponse', message: string, code: number } };

export type CreateExperienceMutationVariables = Exact<{
  data: CreateExperienceInput;
}>;


export type CreateExperienceMutation = { __typename?: 'Mutation', createExperience: { __typename?: 'ExperienceResponse', code: number, message: string, experience?: { __typename?: 'Experience', id: string, jobFR: string, jobEN: string, business: string, typeFR: string, typeEN: string, employmentContractFR: string, employmentContractEN: string, startDateFR: string, startDateEN: string, endDateFR: string, endDateEN: string, month: number } | null } };

export type UpdateExperienceMutationVariables = Exact<{
  data: UpdateExperienceInput;
}>;


export type UpdateExperienceMutation = { __typename?: 'Mutation', updateExperience: { __typename?: 'ExperienceResponse', code: number, message: string, experience?: { __typename?: 'Experience', id: string, jobFR: string, jobEN: string, business: string, typeFR: string, typeEN: string, employmentContractFR: string, employmentContractEN: string, startDateFR: string, startDateEN: string, endDateFR: string, endDateEN: string, month: number } | null } };

export type DeleteExperienceMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteExperienceMutation = { __typename?: 'Mutation', deleteExperience: { __typename?: 'ExperienceResponse', code: number, message: string } };

export type MutationMutationVariables = Exact<{
  data: LoginInput;
}>;


export type MutationMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token?: string | null, message: string, code: number } };

export type CreateSkillCategoryMutationVariables = Exact<{
  data: CreateCategoryInput;
}>;


export type CreateSkillCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'CategoryResponse', code: number, message: string, categories?: Array<{ __typename?: 'SkillCategoryWithSkillsDTO', id: string, categoryFR: string, categoryEN: string, skills: Array<{ __typename?: 'SkillSubItem', categoryId?: number | null, id: string, image: string, name: string }> }> | null } };

export type UpdateSkillCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateCategoryInput;
}>;


export type UpdateSkillCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'CategoryResponse', code: number, message: string, categories?: Array<{ __typename?: 'SkillCategoryWithSkillsDTO', id: string, categoryEN: string, categoryFR: string, skills: Array<{ __typename?: 'SkillSubItem', id: string, name: string, image: string, categoryId?: number | null }> }> | null } };

export type DeleteSkillCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteSkillCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'CategoryResponse', code: number, message: string } };

export type CreateSkillMutationVariables = Exact<{
  data: CreateSkillInput;
}>;


export type CreateSkillMutation = { __typename?: 'Mutation', createSkill: { __typename?: 'SubItemResponse', message: string, code: number, subItems?: Array<{ __typename?: 'SkillSubItem', name: string, image: string, id: string, categoryId?: number | null }> | null } };

export type UpdateSkillMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateSkillInput;
}>;


export type UpdateSkillMutation = { __typename?: 'Mutation', updateSkill: { __typename?: 'SubItemResponse', message: string, code: number, subItems?: Array<{ __typename?: 'SkillSubItem', name: string, image: string, id: string, categoryId?: number | null }> | null } };

export type DeleteSkillMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteSkillMutation = { __typename?: 'Mutation', deleteSkill: { __typename?: 'SubItemResponse', message: string, code: number, subItems?: Array<{ __typename?: 'SkillSubItem', name: string, image: string, id: string, categoryId?: number | null }> | null } };

export type CreateSocialMutationVariables = Exact<{
  data: CreateSocialInput;
}>;


export type CreateSocialMutation = { __typename?: 'Mutation', createSocial: { __typename?: 'SocialResponse', code: number, message: string, social?: { __typename?: 'Social', id: string, title: string, url: string, tab: number } | null } };

export type UpdateSocialMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateSocialInput;
}>;


export type UpdateSocialMutation = { __typename?: 'Mutation', updateSocial: { __typename?: 'SocialResponse', code: number, message: string, social?: { __typename?: 'Social', id: string, title: string, url: string, tab: number } | null } };

export type DeleteSocialMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteSocialMutation = { __typename?: 'Mutation', deleteSocial: { __typename?: 'SocialResponse', code: number, message: string } };

export type CreateThemeMutationVariables = Exact<{
  data: CreateThemeInput;
}>;


export type CreateThemeMutation = { __typename?: 'Mutation', createTheme: { __typename?: 'ThemeResponse', code: number, message: string, theme?: { __typename?: 'Theme', admin: string, body: string, error: string, footer: string, grey: string, id: string, info: string, name: string, nameEN: string, nameFR: string, placeholder: string, primary: string, scrollHandle: string, scrollHandleHover: string, secondary: string, success: string, text100: string, text200: string, text300: string, textButton: string, textDefault: string, visible: boolean, warn: string } | null } };

export type UpdateThemeMutationVariables = Exact<{
  data: UpdateThemeInput;
}>;


export type UpdateThemeMutation = { __typename?: 'Mutation', updateTheme: { __typename?: 'ThemeResponse', message: string, code: number, theme?: { __typename?: 'Theme', admin: string, body: string, error: string, footer: string, grey: string, id: string, info: string, name: string, nameEN: string, nameFR: string, placeholder: string, primary: string, scrollHandle: string, scrollHandleHover: string, secondary: string, success: string, text100: string, text200: string, text300: string, textButton: string, textDefault: string, visible: boolean, warn: string } | null } };

export type DeleteThemeMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteThemeMutation = { __typename?: 'Mutation', deleteTheme: { __typename?: 'Response', code: number, message: string } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'Response', message: string, code: number } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserResponse', message: string, code: number, user?: { __typename?: 'User', id: string, firstname: string, lastname: string, email: string, role: Role, isPasswordChange: boolean } | null } };

export type CreateUserMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserResponse', message: string, code: number, user?: { __typename?: 'User', id: string, firstname: string, lastname: string, email: string, role: Role, isPasswordChange: boolean } | null } };

export type GetGlobalStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalStatsQuery = { __typename?: 'Query', getAverageSkillsPerProject: number, getGlobalStats: { __typename?: 'GlobalStatsResponse', code: number, message: string, stats?: { __typename?: 'GlobalStats', totalUsers: number, totalProjects: number, totalSkills: number, totalEducations: number, totalExperiences: number, usersByRoleAdmin: number, usersByRoleEditor: number, usersByRoleView: number } | null }, getUsersRoleDistribution: { __typename?: 'UserRolePercent', admin: number, editor: number, view: number, message: string, code: number }, getTopUsedSkills: { __typename?: 'TopSkillsResponse', code: number, message: string, skills: Array<{ __typename?: 'TopSkillUsage', id: number, name: string, usageCount: number }> } };

export type GetBackupsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBackupsListQuery = { __typename?: 'Query', listBackupFiles: { __typename?: 'BackupFilesResponse', message: string, code: number, files: Array<{ __typename?: 'BackupFileInfo', sizeBytes: number, modifiedAt: any, fileName: string, createdAt: any }> } };

export type GenerateCaptchaQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateCaptchaQuery = { __typename?: 'Query', generateCaptcha: { __typename?: 'CaptchaResponse', id: string, challengeType: string, images: Array<{ __typename?: 'CaptchaImage', typeEN: string, typeFR: string, url: string, id: string }>, challengeTypeTranslation: { __typename?: 'ChallengeTypeTranslation', typeEN: string, typeFR: string } } };

export type CvQueryVariables = Exact<{ [key: string]: never; }>;


export type CvQuery = { __typename?: 'Query', cvUrl: string };

export type GetEducationsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEducationsListQuery = { __typename?: 'Query', educationList: { __typename?: 'EducationsResponse', message: string, code: number, educations?: Array<{ __typename?: 'Education', diplomaLevelEN: string, diplomaLevelFR: string, endDateEN: string, endDateFR: string, id: string, location: string, month?: number | null, school: string, startDateEN: string, startDateFR: string, titleEN: string, titleFR: string, typeEN: string, typeFR: string, year: number }> | null } };

export type GetEducationByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetEducationByIdQuery = { __typename?: 'Query', educationById: { __typename?: 'EducationResponse', code: number, education?: { __typename?: 'Education', id: string, school: string, location: string, diplomaLevelFR: string, diplomaLevelEN: string, titleFR: string, titleEN: string, typeFR: string, typeEN: string, startDateFR: string, startDateEN: string, endDateFR: string, endDateEN: string, month?: number | null, year: number } | null } };

export type GetExperiencesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExperiencesListQuery = { __typename?: 'Query', experienceList: { __typename?: 'ExperiencesResponse', message: string, code: number, experiences?: Array<{ __typename?: 'Experience', employmentContractEN: string, business: string, employmentContractFR: string, endDateEN: string, endDateFR: string, jobEN: string, id: string, jobFR: string, month: number, startDateEN: string, startDateFR: string, typeEN: string, typeFR: string }> | null } };

export type GetExperienceByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetExperienceByIdQuery = { __typename?: 'Query', experienceById: { __typename?: 'ExperienceResponse', code: number, message: string, experience?: { __typename?: 'Experience', id: string, jobFR: string, jobEN: string, business: string, typeFR: string, typeEN: string, employmentContractFR: string, employmentContractEN: string, startDateFR: string, startDateEN: string, endDateFR: string, endDateEN: string, month: number } | null } };

export type GetProjectsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsListQuery = { __typename?: 'Query', projectList: { __typename?: 'ProjectsResponse', message: string, code: number, projects?: Array<{ __typename?: 'Project', contentDisplay: string, descriptionEN: string, descriptionFR: string, github?: string | null, id: string, title: string, typeDisplay: string, skills: Array<{ __typename?: 'SkillSubItem', categoryId?: number | null, id: string, image: string, name: string }> }> | null } };

export type GetSkillsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSkillsListQuery = { __typename?: 'Query', skillList: { __typename?: 'CategoryResponse', code: number, message: string, categories?: Array<{ __typename?: 'SkillCategoryWithSkillsDTO', categoryFR: string, id: string, categoryEN: string, skills: Array<{ __typename?: 'SkillSubItem', categoryId?: number | null, id: string, image: string, name: string }> }> | null } };

export type GetSkillCategoryByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetSkillCategoryByIdQuery = { __typename?: 'Query', skillCategoryById: { __typename?: 'CategoryResponse', code: number, message: string, categories?: Array<{ __typename?: 'SkillCategoryWithSkillsDTO', id: string, categoryEN: string, categoryFR: string, skills: Array<{ __typename?: 'SkillSubItem', id: string, name: string, image: string, categoryId?: number | null }> }> | null } };

export type GetSkillByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetSkillByIdQuery = { __typename?: 'Query', skillById: { __typename?: 'SubItemResponse', code: number, message: string, subItems?: Array<{ __typename?: 'SkillSubItem', id: string, name: string, image: string, categoryId?: number | null }> | null } };

export type GetSocialsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSocialsListQuery = { __typename?: 'Query', socialList: Array<{ __typename?: 'Social', id: string, title: string, url: string, tab: number }> };

export type GetSocialByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetSocialByIdQuery = { __typename?: 'Query', socialById: { __typename?: 'SocialResponse', code: number, message: string, social?: { __typename?: 'Social', id: string, title: string, url: string, tab: number } | null } };

export type GetThemesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetThemesListQuery = { __typename?: 'Query', themeList: { __typename?: 'ThemesResponse', message: string, code: number, themes?: Array<{ __typename?: 'Theme', body: string, admin: string, error: string, footer: string, grey: string, id: string, info: string, name: string, nameFR: string, nameEN: string, placeholder: string, primary: string, scrollHandle: string, scrollHandleHover: string, secondary: string, success: string, text100: string, text200: string, text300: string, textButton: string, textDefault: string, visible: boolean, warn: string }> | null } };

export type GetThemeByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetThemeByIdQuery = { __typename?: 'Query', themeById: { __typename?: 'ThemeResponse', message: string, code: number, theme?: { __typename?: 'Theme', id: string, name: string, nameEN: string, nameFR: string, visible: boolean, body: string, scrollHandle: string, scrollHandleHover: string, primary: string, secondary: string, success: string, error: string, warn: string, info: string, grey: string, placeholder: string, footer: string, admin: string, textDefault: string, text100: string, text200: string, text300: string, textButton: string } | null } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', role: Role, lastname: string, isPasswordChange: boolean, id: string, firstname: string, email: string } | null };

export type GetUsersListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersListQuery = { __typename?: 'Query', userList: { __typename?: 'UsersResponse', message: string, code: number, users?: Array<{ __typename?: 'User', id: string, firstname: string, lastname: string, email: string, role: Role, isPasswordChange: boolean }> | null } };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', userById: { __typename?: 'UserResponse', message: string, code: number, user?: { __typename?: 'User', id: string, firstname: string, lastname: string, email: string, role: Role, isPasswordChange: boolean } | null } };


export const GenerateDatabaseBackupDocument = gql`
    mutation GenerateDatabaseBackup {
  generateDatabaseBackup {
    path
    message
    code
  }
}
    `;
export type GenerateDatabaseBackupMutationFn = Apollo.MutationFunction<GenerateDatabaseBackupMutation, GenerateDatabaseBackupMutationVariables>;

/**
 * __useGenerateDatabaseBackupMutation__
 *
 * To run a mutation, you first call `useGenerateDatabaseBackupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateDatabaseBackupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateDatabaseBackupMutation, { data, loading, error }] = useGenerateDatabaseBackupMutation({
 *   variables: {
 *   },
 * });
 */
export function useGenerateDatabaseBackupMutation(baseOptions?: Apollo.MutationHookOptions<GenerateDatabaseBackupMutation, GenerateDatabaseBackupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateDatabaseBackupMutation, GenerateDatabaseBackupMutationVariables>(GenerateDatabaseBackupDocument, options);
      }
export type GenerateDatabaseBackupMutationHookResult = ReturnType<typeof useGenerateDatabaseBackupMutation>;
export type GenerateDatabaseBackupMutationResult = Apollo.MutationResult<GenerateDatabaseBackupMutation>;
export type GenerateDatabaseBackupMutationOptions = Apollo.BaseMutationOptions<GenerateDatabaseBackupMutation, GenerateDatabaseBackupMutationVariables>;
export const DeleteBackupFileDocument = gql`
    mutation DeleteBackupFile($fileName: String!) {
  deleteBackupFile(fileName: $fileName) {
    code
    message
  }
}
    `;
export type DeleteBackupFileMutationFn = Apollo.MutationFunction<DeleteBackupFileMutation, DeleteBackupFileMutationVariables>;

/**
 * __useDeleteBackupFileMutation__
 *
 * To run a mutation, you first call `useDeleteBackupFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBackupFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBackupFileMutation, { data, loading, error }] = useDeleteBackupFileMutation({
 *   variables: {
 *      fileName: // value for 'fileName'
 *   },
 * });
 */
export function useDeleteBackupFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBackupFileMutation, DeleteBackupFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBackupFileMutation, DeleteBackupFileMutationVariables>(DeleteBackupFileDocument, options);
      }
export type DeleteBackupFileMutationHookResult = ReturnType<typeof useDeleteBackupFileMutation>;
export type DeleteBackupFileMutationResult = Apollo.MutationResult<DeleteBackupFileMutation>;
export type DeleteBackupFileMutationOptions = Apollo.BaseMutationOptions<DeleteBackupFileMutation, DeleteBackupFileMutationVariables>;
export const UploadCvDocument = gql`
    mutation UploadCV($file: Upload!) {
  uploadCV(file: $file) {
    code
    message
    url
  }
}
    `;
export type UploadCvMutationFn = Apollo.MutationFunction<UploadCvMutation, UploadCvMutationVariables>;

/**
 * __useUploadCvMutation__
 *
 * To run a mutation, you first call `useUploadCvMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadCvMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadCvMutation, { data, loading, error }] = useUploadCvMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadCvMutation(baseOptions?: Apollo.MutationHookOptions<UploadCvMutation, UploadCvMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadCvMutation, UploadCvMutationVariables>(UploadCvDocument, options);
      }
export type UploadCvMutationHookResult = ReturnType<typeof useUploadCvMutation>;
export type UploadCvMutationResult = Apollo.MutationResult<UploadCvMutation>;
export type UploadCvMutationOptions = Apollo.BaseMutationOptions<UploadCvMutation, UploadCvMutationVariables>;
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
export const CreateEducationDocument = gql`
    mutation CreateEducation($data: CreateEducationInput!) {
  createEducation(data: $data) {
    education {
      id
      school
      location
      diplomaLevelFR
      diplomaLevelEN
      titleFR
      titleEN
      typeFR
      typeEN
      startDateFR
      startDateEN
      endDateFR
      endDateEN
      month
      year
    }
    code
  }
}
    `;
export type CreateEducationMutationFn = Apollo.MutationFunction<CreateEducationMutation, CreateEducationMutationVariables>;

/**
 * __useCreateEducationMutation__
 *
 * To run a mutation, you first call `useCreateEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEducationMutation, { data, loading, error }] = useCreateEducationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateEducationMutation(baseOptions?: Apollo.MutationHookOptions<CreateEducationMutation, CreateEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEducationMutation, CreateEducationMutationVariables>(CreateEducationDocument, options);
      }
export type CreateEducationMutationHookResult = ReturnType<typeof useCreateEducationMutation>;
export type CreateEducationMutationResult = Apollo.MutationResult<CreateEducationMutation>;
export type CreateEducationMutationOptions = Apollo.BaseMutationOptions<CreateEducationMutation, CreateEducationMutationVariables>;
export const UpdateEducationDocument = gql`
    mutation UpdateEducation($data: UpdateEducationInput!) {
  updateEducation(data: $data) {
    education {
      id
      school
      location
      diplomaLevelFR
      diplomaLevelEN
      titleFR
      titleEN
      typeFR
      typeEN
      startDateFR
      startDateEN
      endDateFR
      endDateEN
      month
      year
    }
    message
    code
  }
}
    `;
export type UpdateEducationMutationFn = Apollo.MutationFunction<UpdateEducationMutation, UpdateEducationMutationVariables>;

/**
 * __useUpdateEducationMutation__
 *
 * To run a mutation, you first call `useUpdateEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEducationMutation, { data, loading, error }] = useUpdateEducationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateEducationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEducationMutation, UpdateEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEducationMutation, UpdateEducationMutationVariables>(UpdateEducationDocument, options);
      }
export type UpdateEducationMutationHookResult = ReturnType<typeof useUpdateEducationMutation>;
export type UpdateEducationMutationResult = Apollo.MutationResult<UpdateEducationMutation>;
export type UpdateEducationMutationOptions = Apollo.BaseMutationOptions<UpdateEducationMutation, UpdateEducationMutationVariables>;
export const DeleteEducationDocument = gql`
    mutation DeleteEducation($id: Int!) {
  deleteEducation(id: $id) {
    message
    code
  }
}
    `;
export type DeleteEducationMutationFn = Apollo.MutationFunction<DeleteEducationMutation, DeleteEducationMutationVariables>;

/**
 * __useDeleteEducationMutation__
 *
 * To run a mutation, you first call `useDeleteEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEducationMutation, { data, loading, error }] = useDeleteEducationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEducationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEducationMutation, DeleteEducationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEducationMutation, DeleteEducationMutationVariables>(DeleteEducationDocument, options);
      }
export type DeleteEducationMutationHookResult = ReturnType<typeof useDeleteEducationMutation>;
export type DeleteEducationMutationResult = Apollo.MutationResult<DeleteEducationMutation>;
export type DeleteEducationMutationOptions = Apollo.BaseMutationOptions<DeleteEducationMutation, DeleteEducationMutationVariables>;
export const CreateExperienceDocument = gql`
    mutation CreateExperience($data: CreateExperienceInput!) {
  createExperience(data: $data) {
    code
    message
    experience {
      id
      jobFR
      jobEN
      business
      typeFR
      typeEN
      employmentContractFR
      employmentContractEN
      startDateFR
      startDateEN
      endDateFR
      endDateEN
      month
    }
  }
}
    `;
export type CreateExperienceMutationFn = Apollo.MutationFunction<CreateExperienceMutation, CreateExperienceMutationVariables>;

/**
 * __useCreateExperienceMutation__
 *
 * To run a mutation, you first call `useCreateExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createExperienceMutation, { data, loading, error }] = useCreateExperienceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateExperienceMutation(baseOptions?: Apollo.MutationHookOptions<CreateExperienceMutation, CreateExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateExperienceMutation, CreateExperienceMutationVariables>(CreateExperienceDocument, options);
      }
export type CreateExperienceMutationHookResult = ReturnType<typeof useCreateExperienceMutation>;
export type CreateExperienceMutationResult = Apollo.MutationResult<CreateExperienceMutation>;
export type CreateExperienceMutationOptions = Apollo.BaseMutationOptions<CreateExperienceMutation, CreateExperienceMutationVariables>;
export const UpdateExperienceDocument = gql`
    mutation UpdateExperience($data: UpdateExperienceInput!) {
  updateExperience(data: $data) {
    code
    message
    experience {
      id
      jobFR
      jobEN
      business
      typeFR
      typeEN
      employmentContractFR
      employmentContractEN
      startDateFR
      startDateEN
      endDateFR
      endDateEN
      month
    }
  }
}
    `;
export type UpdateExperienceMutationFn = Apollo.MutationFunction<UpdateExperienceMutation, UpdateExperienceMutationVariables>;

/**
 * __useUpdateExperienceMutation__
 *
 * To run a mutation, you first call `useUpdateExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExperienceMutation, { data, loading, error }] = useUpdateExperienceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateExperienceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExperienceMutation, UpdateExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExperienceMutation, UpdateExperienceMutationVariables>(UpdateExperienceDocument, options);
      }
export type UpdateExperienceMutationHookResult = ReturnType<typeof useUpdateExperienceMutation>;
export type UpdateExperienceMutationResult = Apollo.MutationResult<UpdateExperienceMutation>;
export type UpdateExperienceMutationOptions = Apollo.BaseMutationOptions<UpdateExperienceMutation, UpdateExperienceMutationVariables>;
export const DeleteExperienceDocument = gql`
    mutation DeleteExperience($id: Int!) {
  deleteExperience(id: $id) {
    code
    message
  }
}
    `;
export type DeleteExperienceMutationFn = Apollo.MutationFunction<DeleteExperienceMutation, DeleteExperienceMutationVariables>;

/**
 * __useDeleteExperienceMutation__
 *
 * To run a mutation, you first call `useDeleteExperienceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExperienceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExperienceMutation, { data, loading, error }] = useDeleteExperienceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteExperienceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExperienceMutation, DeleteExperienceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteExperienceMutation, DeleteExperienceMutationVariables>(DeleteExperienceDocument, options);
      }
export type DeleteExperienceMutationHookResult = ReturnType<typeof useDeleteExperienceMutation>;
export type DeleteExperienceMutationResult = Apollo.MutationResult<DeleteExperienceMutation>;
export type DeleteExperienceMutationOptions = Apollo.BaseMutationOptions<DeleteExperienceMutation, DeleteExperienceMutationVariables>;
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
export const CreateSkillCategoryDocument = gql`
    mutation CreateSkillCategory($data: CreateCategoryInput!) {
  createCategory(data: $data) {
    categories {
      skills {
        categoryId
        id
        image
        name
      }
      id
      categoryFR
      categoryEN
    }
    code
    message
  }
}
    `;
export type CreateSkillCategoryMutationFn = Apollo.MutationFunction<CreateSkillCategoryMutation, CreateSkillCategoryMutationVariables>;

/**
 * __useCreateSkillCategoryMutation__
 *
 * To run a mutation, you first call `useCreateSkillCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSkillCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSkillCategoryMutation, { data, loading, error }] = useCreateSkillCategoryMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSkillCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateSkillCategoryMutation, CreateSkillCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSkillCategoryMutation, CreateSkillCategoryMutationVariables>(CreateSkillCategoryDocument, options);
      }
export type CreateSkillCategoryMutationHookResult = ReturnType<typeof useCreateSkillCategoryMutation>;
export type CreateSkillCategoryMutationResult = Apollo.MutationResult<CreateSkillCategoryMutation>;
export type CreateSkillCategoryMutationOptions = Apollo.BaseMutationOptions<CreateSkillCategoryMutation, CreateSkillCategoryMutationVariables>;
export const UpdateSkillCategoryDocument = gql`
    mutation UpdateSkillCategory($id: Int!, $data: UpdateCategoryInput!) {
  updateCategory(id: $id, data: $data) {
    categories {
      id
      categoryEN
      categoryFR
      skills {
        id
        name
        image
        categoryId
      }
    }
    code
    message
  }
}
    `;
export type UpdateSkillCategoryMutationFn = Apollo.MutationFunction<UpdateSkillCategoryMutation, UpdateSkillCategoryMutationVariables>;

/**
 * __useUpdateSkillCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateSkillCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSkillCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSkillCategoryMutation, { data, loading, error }] = useUpdateSkillCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSkillCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSkillCategoryMutation, UpdateSkillCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSkillCategoryMutation, UpdateSkillCategoryMutationVariables>(UpdateSkillCategoryDocument, options);
      }
export type UpdateSkillCategoryMutationHookResult = ReturnType<typeof useUpdateSkillCategoryMutation>;
export type UpdateSkillCategoryMutationResult = Apollo.MutationResult<UpdateSkillCategoryMutation>;
export type UpdateSkillCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateSkillCategoryMutation, UpdateSkillCategoryMutationVariables>;
export const DeleteSkillCategoryDocument = gql`
    mutation DeleteSkillCategory($id: Int!) {
  deleteCategory(id: $id) {
    code
    message
  }
}
    `;
export type DeleteSkillCategoryMutationFn = Apollo.MutationFunction<DeleteSkillCategoryMutation, DeleteSkillCategoryMutationVariables>;

/**
 * __useDeleteSkillCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteSkillCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSkillCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSkillCategoryMutation, { data, loading, error }] = useDeleteSkillCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSkillCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSkillCategoryMutation, DeleteSkillCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSkillCategoryMutation, DeleteSkillCategoryMutationVariables>(DeleteSkillCategoryDocument, options);
      }
export type DeleteSkillCategoryMutationHookResult = ReturnType<typeof useDeleteSkillCategoryMutation>;
export type DeleteSkillCategoryMutationResult = Apollo.MutationResult<DeleteSkillCategoryMutation>;
export type DeleteSkillCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteSkillCategoryMutation, DeleteSkillCategoryMutationVariables>;
export const CreateSkillDocument = gql`
    mutation CreateSkill($data: CreateSkillInput!) {
  createSkill(data: $data) {
    subItems {
      name
      image
      id
      categoryId
    }
    message
    code
  }
}
    `;
export type CreateSkillMutationFn = Apollo.MutationFunction<CreateSkillMutation, CreateSkillMutationVariables>;

/**
 * __useCreateSkillMutation__
 *
 * To run a mutation, you first call `useCreateSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSkillMutation, { data, loading, error }] = useCreateSkillMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSkillMutation(baseOptions?: Apollo.MutationHookOptions<CreateSkillMutation, CreateSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSkillMutation, CreateSkillMutationVariables>(CreateSkillDocument, options);
      }
export type CreateSkillMutationHookResult = ReturnType<typeof useCreateSkillMutation>;
export type CreateSkillMutationResult = Apollo.MutationResult<CreateSkillMutation>;
export type CreateSkillMutationOptions = Apollo.BaseMutationOptions<CreateSkillMutation, CreateSkillMutationVariables>;
export const UpdateSkillDocument = gql`
    mutation UpdateSkill($id: Int!, $data: UpdateSkillInput!) {
  updateSkill(id: $id, data: $data) {
    subItems {
      name
      image
      id
      categoryId
    }
    message
    code
  }
}
    `;
export type UpdateSkillMutationFn = Apollo.MutationFunction<UpdateSkillMutation, UpdateSkillMutationVariables>;

/**
 * __useUpdateSkillMutation__
 *
 * To run a mutation, you first call `useUpdateSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSkillMutation, { data, loading, error }] = useUpdateSkillMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSkillMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSkillMutation, UpdateSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSkillMutation, UpdateSkillMutationVariables>(UpdateSkillDocument, options);
      }
export type UpdateSkillMutationHookResult = ReturnType<typeof useUpdateSkillMutation>;
export type UpdateSkillMutationResult = Apollo.MutationResult<UpdateSkillMutation>;
export type UpdateSkillMutationOptions = Apollo.BaseMutationOptions<UpdateSkillMutation, UpdateSkillMutationVariables>;
export const DeleteSkillDocument = gql`
    mutation DeleteSkill($id: Int!) {
  deleteSkill(id: $id) {
    subItems {
      name
      image
      id
      categoryId
    }
    message
    code
  }
}
    `;
export type DeleteSkillMutationFn = Apollo.MutationFunction<DeleteSkillMutation, DeleteSkillMutationVariables>;

/**
 * __useDeleteSkillMutation__
 *
 * To run a mutation, you first call `useDeleteSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSkillMutation, { data, loading, error }] = useDeleteSkillMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSkillMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSkillMutation, DeleteSkillMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSkillMutation, DeleteSkillMutationVariables>(DeleteSkillDocument, options);
      }
export type DeleteSkillMutationHookResult = ReturnType<typeof useDeleteSkillMutation>;
export type DeleteSkillMutationResult = Apollo.MutationResult<DeleteSkillMutation>;
export type DeleteSkillMutationOptions = Apollo.BaseMutationOptions<DeleteSkillMutation, DeleteSkillMutationVariables>;
export const CreateSocialDocument = gql`
    mutation CreateSocial($data: CreateSocialInput!) {
  createSocial(data: $data) {
    social {
      id
      title
      url
      tab
    }
    code
    message
  }
}
    `;
export type CreateSocialMutationFn = Apollo.MutationFunction<CreateSocialMutation, CreateSocialMutationVariables>;

/**
 * __useCreateSocialMutation__
 *
 * To run a mutation, you first call `useCreateSocialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSocialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSocialMutation, { data, loading, error }] = useCreateSocialMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSocialMutation(baseOptions?: Apollo.MutationHookOptions<CreateSocialMutation, CreateSocialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSocialMutation, CreateSocialMutationVariables>(CreateSocialDocument, options);
      }
export type CreateSocialMutationHookResult = ReturnType<typeof useCreateSocialMutation>;
export type CreateSocialMutationResult = Apollo.MutationResult<CreateSocialMutation>;
export type CreateSocialMutationOptions = Apollo.BaseMutationOptions<CreateSocialMutation, CreateSocialMutationVariables>;
export const UpdateSocialDocument = gql`
    mutation UpdateSocial($id: Int!, $data: UpdateSocialInput!) {
  updateSocial(id: $id, data: $data) {
    social {
      id
      title
      url
      tab
    }
    code
    message
  }
}
    `;
export type UpdateSocialMutationFn = Apollo.MutationFunction<UpdateSocialMutation, UpdateSocialMutationVariables>;

/**
 * __useUpdateSocialMutation__
 *
 * To run a mutation, you first call `useUpdateSocialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSocialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSocialMutation, { data, loading, error }] = useUpdateSocialMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSocialMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSocialMutation, UpdateSocialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSocialMutation, UpdateSocialMutationVariables>(UpdateSocialDocument, options);
      }
export type UpdateSocialMutationHookResult = ReturnType<typeof useUpdateSocialMutation>;
export type UpdateSocialMutationResult = Apollo.MutationResult<UpdateSocialMutation>;
export type UpdateSocialMutationOptions = Apollo.BaseMutationOptions<UpdateSocialMutation, UpdateSocialMutationVariables>;
export const DeleteSocialDocument = gql`
    mutation DeleteSocial($id: Int!) {
  deleteSocial(id: $id) {
    code
    message
  }
}
    `;
export type DeleteSocialMutationFn = Apollo.MutationFunction<DeleteSocialMutation, DeleteSocialMutationVariables>;

/**
 * __useDeleteSocialMutation__
 *
 * To run a mutation, you first call `useDeleteSocialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSocialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSocialMutation, { data, loading, error }] = useDeleteSocialMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSocialMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSocialMutation, DeleteSocialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSocialMutation, DeleteSocialMutationVariables>(DeleteSocialDocument, options);
      }
export type DeleteSocialMutationHookResult = ReturnType<typeof useDeleteSocialMutation>;
export type DeleteSocialMutationResult = Apollo.MutationResult<DeleteSocialMutation>;
export type DeleteSocialMutationOptions = Apollo.BaseMutationOptions<DeleteSocialMutation, DeleteSocialMutationVariables>;
export const CreateThemeDocument = gql`
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
export type CreateThemeMutationFn = Apollo.MutationFunction<CreateThemeMutation, CreateThemeMutationVariables>;

/**
 * __useCreateThemeMutation__
 *
 * To run a mutation, you first call `useCreateThemeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThemeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThemeMutation, { data, loading, error }] = useCreateThemeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateThemeMutation(baseOptions?: Apollo.MutationHookOptions<CreateThemeMutation, CreateThemeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThemeMutation, CreateThemeMutationVariables>(CreateThemeDocument, options);
      }
export type CreateThemeMutationHookResult = ReturnType<typeof useCreateThemeMutation>;
export type CreateThemeMutationResult = Apollo.MutationResult<CreateThemeMutation>;
export type CreateThemeMutationOptions = Apollo.BaseMutationOptions<CreateThemeMutation, CreateThemeMutationVariables>;
export const UpdateThemeDocument = gql`
    mutation UpdateTheme($data: UpdateThemeInput!) {
  updateTheme(data: $data) {
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
    message
    code
  }
}
    `;
export type UpdateThemeMutationFn = Apollo.MutationFunction<UpdateThemeMutation, UpdateThemeMutationVariables>;

/**
 * __useUpdateThemeMutation__
 *
 * To run a mutation, you first call `useUpdateThemeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateThemeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateThemeMutation, { data, loading, error }] = useUpdateThemeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateThemeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateThemeMutation, UpdateThemeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateThemeMutation, UpdateThemeMutationVariables>(UpdateThemeDocument, options);
      }
export type UpdateThemeMutationHookResult = ReturnType<typeof useUpdateThemeMutation>;
export type UpdateThemeMutationResult = Apollo.MutationResult<UpdateThemeMutation>;
export type UpdateThemeMutationOptions = Apollo.BaseMutationOptions<UpdateThemeMutation, UpdateThemeMutationVariables>;
export const DeleteThemeDocument = gql`
    mutation DeleteTheme($id: Int!) {
  deleteTheme(id: $id) {
    code
    message
  }
}
    `;
export type DeleteThemeMutationFn = Apollo.MutationFunction<DeleteThemeMutation, DeleteThemeMutationVariables>;

/**
 * __useDeleteThemeMutation__
 *
 * To run a mutation, you first call `useDeleteThemeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteThemeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteThemeMutation, { data, loading, error }] = useDeleteThemeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteThemeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteThemeMutation, DeleteThemeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteThemeMutation, DeleteThemeMutationVariables>(DeleteThemeDocument, options);
      }
export type DeleteThemeMutationHookResult = ReturnType<typeof useDeleteThemeMutation>;
export type DeleteThemeMutationResult = Apollo.MutationResult<DeleteThemeMutation>;
export type DeleteThemeMutationOptions = Apollo.BaseMutationOptions<DeleteThemeMutation, DeleteThemeMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: Int!) {
  deleteUser(id: $id) {
    message
    code
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: Int!, $firstname: String, $lastname: String, $email: String, $role: String) {
  updateUser(
    id: $id
    firstname: $firstname
    lastname: $lastname
    email: $email
    role: $role
  ) {
    user {
      id
      firstname
      lastname
      email
      role
      isPasswordChange
    }
    message
    code
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      firstname: // value for 'firstname'
 *      lastname: // value for 'lastname'
 *      email: // value for 'email'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserInput!) {
  registerUser(data: $data) {
    user {
      id
      firstname
      lastname
      email
      role
      isPasswordChange
    }
    message
    code
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
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
// @ts-ignore
export function useGetGlobalStatsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>): Apollo.UseSuspenseQueryResult<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>;
export function useGetGlobalStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>): Apollo.UseSuspenseQueryResult<GetGlobalStatsQuery | undefined, GetGlobalStatsQueryVariables>;
export function useGetGlobalStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>(GetGlobalStatsDocument, options);
        }
export type GetGlobalStatsQueryHookResult = ReturnType<typeof useGetGlobalStatsQuery>;
export type GetGlobalStatsLazyQueryHookResult = ReturnType<typeof useGetGlobalStatsLazyQuery>;
export type GetGlobalStatsSuspenseQueryHookResult = ReturnType<typeof useGetGlobalStatsSuspenseQuery>;
export type GetGlobalStatsQueryResult = Apollo.QueryResult<GetGlobalStatsQuery, GetGlobalStatsQueryVariables>;
export const GetBackupsListDocument = gql`
    query GetBackupsList {
  listBackupFiles {
    files {
      sizeBytes
      modifiedAt
      fileName
      createdAt
    }
    message
    code
  }
}
    `;

/**
 * __useGetBackupsListQuery__
 *
 * To run a query within a React component, call `useGetBackupsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBackupsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBackupsListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBackupsListQuery(baseOptions?: Apollo.QueryHookOptions<GetBackupsListQuery, GetBackupsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBackupsListQuery, GetBackupsListQueryVariables>(GetBackupsListDocument, options);
      }
export function useGetBackupsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBackupsListQuery, GetBackupsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBackupsListQuery, GetBackupsListQueryVariables>(GetBackupsListDocument, options);
        }
// @ts-ignore
export function useGetBackupsListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBackupsListQuery, GetBackupsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetBackupsListQuery, GetBackupsListQueryVariables>;
export function useGetBackupsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBackupsListQuery, GetBackupsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetBackupsListQuery | undefined, GetBackupsListQueryVariables>;
export function useGetBackupsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBackupsListQuery, GetBackupsListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBackupsListQuery, GetBackupsListQueryVariables>(GetBackupsListDocument, options);
        }
export type GetBackupsListQueryHookResult = ReturnType<typeof useGetBackupsListQuery>;
export type GetBackupsListLazyQueryHookResult = ReturnType<typeof useGetBackupsListLazyQuery>;
export type GetBackupsListSuspenseQueryHookResult = ReturnType<typeof useGetBackupsListSuspenseQuery>;
export type GetBackupsListQueryResult = Apollo.QueryResult<GetBackupsListQuery, GetBackupsListQueryVariables>;
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
// @ts-ignore
export function useGenerateCaptchaSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>): Apollo.UseSuspenseQueryResult<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>;
export function useGenerateCaptchaSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>): Apollo.UseSuspenseQueryResult<GenerateCaptchaQuery | undefined, GenerateCaptchaQueryVariables>;
export function useGenerateCaptchaSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>(GenerateCaptchaDocument, options);
        }
export type GenerateCaptchaQueryHookResult = ReturnType<typeof useGenerateCaptchaQuery>;
export type GenerateCaptchaLazyQueryHookResult = ReturnType<typeof useGenerateCaptchaLazyQuery>;
export type GenerateCaptchaSuspenseQueryHookResult = ReturnType<typeof useGenerateCaptchaSuspenseQuery>;
export type GenerateCaptchaQueryResult = Apollo.QueryResult<GenerateCaptchaQuery, GenerateCaptchaQueryVariables>;
export const CvDocument = gql`
    query CV {
  cvUrl
}
    `;

/**
 * __useCvQuery__
 *
 * To run a query within a React component, call `useCvQuery` and pass it any options that fit your needs.
 * When your component renders, `useCvQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCvQuery({
 *   variables: {
 *   },
 * });
 */
export function useCvQuery(baseOptions?: Apollo.QueryHookOptions<CvQuery, CvQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CvQuery, CvQueryVariables>(CvDocument, options);
      }
export function useCvLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CvQuery, CvQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CvQuery, CvQueryVariables>(CvDocument, options);
        }
// @ts-ignore
export function useCvSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CvQuery, CvQueryVariables>): Apollo.UseSuspenseQueryResult<CvQuery, CvQueryVariables>;
export function useCvSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CvQuery, CvQueryVariables>): Apollo.UseSuspenseQueryResult<CvQuery | undefined, CvQueryVariables>;
export function useCvSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CvQuery, CvQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CvQuery, CvQueryVariables>(CvDocument, options);
        }
export type CvQueryHookResult = ReturnType<typeof useCvQuery>;
export type CvLazyQueryHookResult = ReturnType<typeof useCvLazyQuery>;
export type CvSuspenseQueryHookResult = ReturnType<typeof useCvSuspenseQuery>;
export type CvQueryResult = Apollo.QueryResult<CvQuery, CvQueryVariables>;
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
// @ts-ignore
export function useGetEducationsListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEducationsListQuery, GetEducationsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetEducationsListQuery, GetEducationsListQueryVariables>;
export function useGetEducationsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEducationsListQuery, GetEducationsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetEducationsListQuery | undefined, GetEducationsListQueryVariables>;
export function useGetEducationsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEducationsListQuery, GetEducationsListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEducationsListQuery, GetEducationsListQueryVariables>(GetEducationsListDocument, options);
        }
export type GetEducationsListQueryHookResult = ReturnType<typeof useGetEducationsListQuery>;
export type GetEducationsListLazyQueryHookResult = ReturnType<typeof useGetEducationsListLazyQuery>;
export type GetEducationsListSuspenseQueryHookResult = ReturnType<typeof useGetEducationsListSuspenseQuery>;
export type GetEducationsListQueryResult = Apollo.QueryResult<GetEducationsListQuery, GetEducationsListQueryVariables>;
export const GetEducationByIdDocument = gql`
    query GetEducationById($id: Int!) {
  educationById(id: $id) {
    education {
      id
      school
      location
      diplomaLevelFR
      diplomaLevelEN
      titleFR
      titleEN
      typeFR
      typeEN
      startDateFR
      startDateEN
      endDateFR
      endDateEN
      month
      year
    }
    code
  }
}
    `;

/**
 * __useGetEducationByIdQuery__
 *
 * To run a query within a React component, call `useGetEducationByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEducationByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEducationByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEducationByIdQuery(baseOptions: Apollo.QueryHookOptions<GetEducationByIdQuery, GetEducationByIdQueryVariables> & ({ variables: GetEducationByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetEducationByIdQuery, GetEducationByIdQueryVariables>(GetEducationByIdDocument, options);
      }
export function useGetEducationByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEducationByIdQuery, GetEducationByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetEducationByIdQuery, GetEducationByIdQueryVariables>(GetEducationByIdDocument, options);
        }
// @ts-ignore
export function useGetEducationByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetEducationByIdQuery, GetEducationByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetEducationByIdQuery, GetEducationByIdQueryVariables>;
export function useGetEducationByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEducationByIdQuery, GetEducationByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetEducationByIdQuery | undefined, GetEducationByIdQueryVariables>;
export function useGetEducationByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetEducationByIdQuery, GetEducationByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetEducationByIdQuery, GetEducationByIdQueryVariables>(GetEducationByIdDocument, options);
        }
export type GetEducationByIdQueryHookResult = ReturnType<typeof useGetEducationByIdQuery>;
export type GetEducationByIdLazyQueryHookResult = ReturnType<typeof useGetEducationByIdLazyQuery>;
export type GetEducationByIdSuspenseQueryHookResult = ReturnType<typeof useGetEducationByIdSuspenseQuery>;
export type GetEducationByIdQueryResult = Apollo.QueryResult<GetEducationByIdQuery, GetEducationByIdQueryVariables>;
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
// @ts-ignore
export function useGetExperiencesListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExperiencesListQuery, GetExperiencesListQueryVariables>): Apollo.UseSuspenseQueryResult<GetExperiencesListQuery, GetExperiencesListQueryVariables>;
export function useGetExperiencesListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExperiencesListQuery, GetExperiencesListQueryVariables>): Apollo.UseSuspenseQueryResult<GetExperiencesListQuery | undefined, GetExperiencesListQueryVariables>;
export function useGetExperiencesListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExperiencesListQuery, GetExperiencesListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExperiencesListQuery, GetExperiencesListQueryVariables>(GetExperiencesListDocument, options);
        }
export type GetExperiencesListQueryHookResult = ReturnType<typeof useGetExperiencesListQuery>;
export type GetExperiencesListLazyQueryHookResult = ReturnType<typeof useGetExperiencesListLazyQuery>;
export type GetExperiencesListSuspenseQueryHookResult = ReturnType<typeof useGetExperiencesListSuspenseQuery>;
export type GetExperiencesListQueryResult = Apollo.QueryResult<GetExperiencesListQuery, GetExperiencesListQueryVariables>;
export const GetExperienceByIdDocument = gql`
    query GetExperienceById($id: Int!) {
  experienceById(id: $id) {
    code
    message
    experience {
      id
      jobFR
      jobEN
      business
      typeFR
      typeEN
      employmentContractFR
      employmentContractEN
      startDateFR
      startDateEN
      endDateFR
      endDateEN
      month
    }
  }
}
    `;

/**
 * __useGetExperienceByIdQuery__
 *
 * To run a query within a React component, call `useGetExperienceByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExperienceByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExperienceByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetExperienceByIdQuery(baseOptions: Apollo.QueryHookOptions<GetExperienceByIdQuery, GetExperienceByIdQueryVariables> & ({ variables: GetExperienceByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>(GetExperienceByIdDocument, options);
      }
export function useGetExperienceByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>(GetExperienceByIdDocument, options);
        }
// @ts-ignore
export function useGetExperienceByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>;
export function useGetExperienceByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetExperienceByIdQuery | undefined, GetExperienceByIdQueryVariables>;
export function useGetExperienceByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>(GetExperienceByIdDocument, options);
        }
export type GetExperienceByIdQueryHookResult = ReturnType<typeof useGetExperienceByIdQuery>;
export type GetExperienceByIdLazyQueryHookResult = ReturnType<typeof useGetExperienceByIdLazyQuery>;
export type GetExperienceByIdSuspenseQueryHookResult = ReturnType<typeof useGetExperienceByIdSuspenseQuery>;
export type GetExperienceByIdQueryResult = Apollo.QueryResult<GetExperienceByIdQuery, GetExperienceByIdQueryVariables>;
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
// @ts-ignore
export function useGetProjectsListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProjectsListQuery, GetProjectsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetProjectsListQuery, GetProjectsListQueryVariables>;
export function useGetProjectsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectsListQuery, GetProjectsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetProjectsListQuery | undefined, GetProjectsListQueryVariables>;
export function useGetProjectsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProjectsListQuery, GetProjectsListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
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
// @ts-ignore
export function useGetSkillsListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSkillsListQuery, GetSkillsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetSkillsListQuery, GetSkillsListQueryVariables>;
export function useGetSkillsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSkillsListQuery, GetSkillsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetSkillsListQuery | undefined, GetSkillsListQueryVariables>;
export function useGetSkillsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSkillsListQuery, GetSkillsListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSkillsListQuery, GetSkillsListQueryVariables>(GetSkillsListDocument, options);
        }
export type GetSkillsListQueryHookResult = ReturnType<typeof useGetSkillsListQuery>;
export type GetSkillsListLazyQueryHookResult = ReturnType<typeof useGetSkillsListLazyQuery>;
export type GetSkillsListSuspenseQueryHookResult = ReturnType<typeof useGetSkillsListSuspenseQuery>;
export type GetSkillsListQueryResult = Apollo.QueryResult<GetSkillsListQuery, GetSkillsListQueryVariables>;
export const GetSkillCategoryByIdDocument = gql`
    query GetSkillCategoryById($id: Int!) {
  skillCategoryById(id: $id) {
    code
    message
    categories {
      id
      categoryEN
      categoryFR
      skills {
        id
        name
        image
        categoryId
      }
    }
  }
}
    `;

/**
 * __useGetSkillCategoryByIdQuery__
 *
 * To run a query within a React component, call `useGetSkillCategoryByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSkillCategoryByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSkillCategoryByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSkillCategoryByIdQuery(baseOptions: Apollo.QueryHookOptions<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables> & ({ variables: GetSkillCategoryByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>(GetSkillCategoryByIdDocument, options);
      }
export function useGetSkillCategoryByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>(GetSkillCategoryByIdDocument, options);
        }
// @ts-ignore
export function useGetSkillCategoryByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>;
export function useGetSkillCategoryByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetSkillCategoryByIdQuery | undefined, GetSkillCategoryByIdQueryVariables>;
export function useGetSkillCategoryByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>(GetSkillCategoryByIdDocument, options);
        }
export type GetSkillCategoryByIdQueryHookResult = ReturnType<typeof useGetSkillCategoryByIdQuery>;
export type GetSkillCategoryByIdLazyQueryHookResult = ReturnType<typeof useGetSkillCategoryByIdLazyQuery>;
export type GetSkillCategoryByIdSuspenseQueryHookResult = ReturnType<typeof useGetSkillCategoryByIdSuspenseQuery>;
export type GetSkillCategoryByIdQueryResult = Apollo.QueryResult<GetSkillCategoryByIdQuery, GetSkillCategoryByIdQueryVariables>;
export const GetSkillByIdDocument = gql`
    query GetSkillById($id: Int!) {
  skillById(id: $id) {
    code
    message
    subItems {
      id
      name
      image
      categoryId
    }
  }
}
    `;

/**
 * __useGetSkillByIdQuery__
 *
 * To run a query within a React component, call `useGetSkillByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSkillByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSkillByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSkillByIdQuery(baseOptions: Apollo.QueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables> & ({ variables: GetSkillByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSkillByIdQuery, GetSkillByIdQueryVariables>(GetSkillByIdDocument, options);
      }
export function useGetSkillByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSkillByIdQuery, GetSkillByIdQueryVariables>(GetSkillByIdDocument, options);
        }
// @ts-ignore
export function useGetSkillByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetSkillByIdQuery, GetSkillByIdQueryVariables>;
export function useGetSkillByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetSkillByIdQuery | undefined, GetSkillByIdQueryVariables>;
export function useGetSkillByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSkillByIdQuery, GetSkillByIdQueryVariables>(GetSkillByIdDocument, options);
        }
export type GetSkillByIdQueryHookResult = ReturnType<typeof useGetSkillByIdQuery>;
export type GetSkillByIdLazyQueryHookResult = ReturnType<typeof useGetSkillByIdLazyQuery>;
export type GetSkillByIdSuspenseQueryHookResult = ReturnType<typeof useGetSkillByIdSuspenseQuery>;
export type GetSkillByIdQueryResult = Apollo.QueryResult<GetSkillByIdQuery, GetSkillByIdQueryVariables>;
export const GetSocialsListDocument = gql`
    query GetSocialsList {
  socialList {
    id
    title
    url
    tab
  }
}
    `;

/**
 * __useGetSocialsListQuery__
 *
 * To run a query within a React component, call `useGetSocialsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSocialsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSocialsListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSocialsListQuery(baseOptions?: Apollo.QueryHookOptions<GetSocialsListQuery, GetSocialsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSocialsListQuery, GetSocialsListQueryVariables>(GetSocialsListDocument, options);
      }
export function useGetSocialsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSocialsListQuery, GetSocialsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSocialsListQuery, GetSocialsListQueryVariables>(GetSocialsListDocument, options);
        }
// @ts-ignore
export function useGetSocialsListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSocialsListQuery, GetSocialsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetSocialsListQuery, GetSocialsListQueryVariables>;
export function useGetSocialsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSocialsListQuery, GetSocialsListQueryVariables>): Apollo.UseSuspenseQueryResult<GetSocialsListQuery | undefined, GetSocialsListQueryVariables>;
export function useGetSocialsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSocialsListQuery, GetSocialsListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSocialsListQuery, GetSocialsListQueryVariables>(GetSocialsListDocument, options);
        }
export type GetSocialsListQueryHookResult = ReturnType<typeof useGetSocialsListQuery>;
export type GetSocialsListLazyQueryHookResult = ReturnType<typeof useGetSocialsListLazyQuery>;
export type GetSocialsListSuspenseQueryHookResult = ReturnType<typeof useGetSocialsListSuspenseQuery>;
export type GetSocialsListQueryResult = Apollo.QueryResult<GetSocialsListQuery, GetSocialsListQueryVariables>;
export const GetSocialByIdDocument = gql`
    query GetSocialById($id: Int!) {
  socialById(id: $id) {
    social {
      id
      title
      url
      tab
    }
    code
    message
  }
}
    `;

/**
 * __useGetSocialByIdQuery__
 *
 * To run a query within a React component, call `useGetSocialByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSocialByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSocialByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSocialByIdQuery(baseOptions: Apollo.QueryHookOptions<GetSocialByIdQuery, GetSocialByIdQueryVariables> & ({ variables: GetSocialByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSocialByIdQuery, GetSocialByIdQueryVariables>(GetSocialByIdDocument, options);
      }
export function useGetSocialByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSocialByIdQuery, GetSocialByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSocialByIdQuery, GetSocialByIdQueryVariables>(GetSocialByIdDocument, options);
        }
// @ts-ignore
export function useGetSocialByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSocialByIdQuery, GetSocialByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetSocialByIdQuery, GetSocialByIdQueryVariables>;
export function useGetSocialByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSocialByIdQuery, GetSocialByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetSocialByIdQuery | undefined, GetSocialByIdQueryVariables>;
export function useGetSocialByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSocialByIdQuery, GetSocialByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSocialByIdQuery, GetSocialByIdQueryVariables>(GetSocialByIdDocument, options);
        }
export type GetSocialByIdQueryHookResult = ReturnType<typeof useGetSocialByIdQuery>;
export type GetSocialByIdLazyQueryHookResult = ReturnType<typeof useGetSocialByIdLazyQuery>;
export type GetSocialByIdSuspenseQueryHookResult = ReturnType<typeof useGetSocialByIdSuspenseQuery>;
export type GetSocialByIdQueryResult = Apollo.QueryResult<GetSocialByIdQuery, GetSocialByIdQueryVariables>;
export const GetThemesListDocument = gql`
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

/**
 * __useGetThemesListQuery__
 *
 * To run a query within a React component, call `useGetThemesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThemesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThemesListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetThemesListQuery(baseOptions?: Apollo.QueryHookOptions<GetThemesListQuery, GetThemesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThemesListQuery, GetThemesListQueryVariables>(GetThemesListDocument, options);
      }
export function useGetThemesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThemesListQuery, GetThemesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThemesListQuery, GetThemesListQueryVariables>(GetThemesListDocument, options);
        }
// @ts-ignore
export function useGetThemesListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetThemesListQuery, GetThemesListQueryVariables>): Apollo.UseSuspenseQueryResult<GetThemesListQuery, GetThemesListQueryVariables>;
export function useGetThemesListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetThemesListQuery, GetThemesListQueryVariables>): Apollo.UseSuspenseQueryResult<GetThemesListQuery | undefined, GetThemesListQueryVariables>;
export function useGetThemesListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetThemesListQuery, GetThemesListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetThemesListQuery, GetThemesListQueryVariables>(GetThemesListDocument, options);
        }
export type GetThemesListQueryHookResult = ReturnType<typeof useGetThemesListQuery>;
export type GetThemesListLazyQueryHookResult = ReturnType<typeof useGetThemesListLazyQuery>;
export type GetThemesListSuspenseQueryHookResult = ReturnType<typeof useGetThemesListSuspenseQuery>;
export type GetThemesListQueryResult = Apollo.QueryResult<GetThemesListQuery, GetThemesListQueryVariables>;
export const GetThemeByIdDocument = gql`
    query GetThemeById($id: Int!) {
  themeById(id: $id) {
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

/**
 * __useGetThemeByIdQuery__
 *
 * To run a query within a React component, call `useGetThemeByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetThemeByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetThemeByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetThemeByIdQuery(baseOptions: Apollo.QueryHookOptions<GetThemeByIdQuery, GetThemeByIdQueryVariables> & ({ variables: GetThemeByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetThemeByIdQuery, GetThemeByIdQueryVariables>(GetThemeByIdDocument, options);
      }
export function useGetThemeByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetThemeByIdQuery, GetThemeByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetThemeByIdQuery, GetThemeByIdQueryVariables>(GetThemeByIdDocument, options);
        }
// @ts-ignore
export function useGetThemeByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetThemeByIdQuery, GetThemeByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetThemeByIdQuery, GetThemeByIdQueryVariables>;
export function useGetThemeByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetThemeByIdQuery, GetThemeByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetThemeByIdQuery | undefined, GetThemeByIdQueryVariables>;
export function useGetThemeByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetThemeByIdQuery, GetThemeByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetThemeByIdQuery, GetThemeByIdQueryVariables>(GetThemeByIdDocument, options);
        }
export type GetThemeByIdQueryHookResult = ReturnType<typeof useGetThemeByIdQuery>;
export type GetThemeByIdLazyQueryHookResult = ReturnType<typeof useGetThemeByIdLazyQuery>;
export type GetThemeByIdSuspenseQueryHookResult = ReturnType<typeof useGetThemeByIdSuspenseQuery>;
export type GetThemeByIdQueryResult = Apollo.QueryResult<GetThemeByIdQuery, GetThemeByIdQueryVariables>;
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
// @ts-ignore
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>): Apollo.UseSuspenseQueryResult<GetMeQuery, GetMeQueryVariables>;
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>): Apollo.UseSuspenseQueryResult<GetMeQuery | undefined, GetMeQueryVariables>;
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeSuspenseQueryHookResult = ReturnType<typeof useGetMeSuspenseQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;
export const GetUsersListDocument = gql`
    query GetUsersList {
  userList {
    users {
      id
      firstname
      lastname
      email
      role
      isPasswordChange
    }
    message
    code
  }
}
    `;

/**
 * __useGetUsersListQuery__
 *
 * To run a query within a React component, call `useGetUsersListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersListQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersListQuery, GetUsersListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersListQuery, GetUsersListQueryVariables>(GetUsersListDocument, options);
      }
export function useGetUsersListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersListQuery, GetUsersListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersListQuery, GetUsersListQueryVariables>(GetUsersListDocument, options);
        }
// @ts-ignore
export function useGetUsersListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUsersListQuery, GetUsersListQueryVariables>): Apollo.UseSuspenseQueryResult<GetUsersListQuery, GetUsersListQueryVariables>;
export function useGetUsersListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersListQuery, GetUsersListQueryVariables>): Apollo.UseSuspenseQueryResult<GetUsersListQuery | undefined, GetUsersListQueryVariables>;
export function useGetUsersListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersListQuery, GetUsersListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersListQuery, GetUsersListQueryVariables>(GetUsersListDocument, options);
        }
export type GetUsersListQueryHookResult = ReturnType<typeof useGetUsersListQuery>;
export type GetUsersListLazyQueryHookResult = ReturnType<typeof useGetUsersListLazyQuery>;
export type GetUsersListSuspenseQueryHookResult = ReturnType<typeof useGetUsersListSuspenseQuery>;
export type GetUsersListQueryResult = Apollo.QueryResult<GetUsersListQuery, GetUsersListQueryVariables>;
export const GetUserByIdDocument = gql`
    query GetUserById($id: Int!) {
  userById(id: $id) {
    user {
      id
      firstname
      lastname
      email
      role
      isPasswordChange
    }
    message
    code
  }
}
    `;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables> & ({ variables: GetUserByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
// @ts-ignore
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserByIdQuery | undefined, GetUserByIdQueryVariables>;
export function useGetUserByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdSuspenseQueryHookResult = ReturnType<typeof useGetUserByIdSuspenseQuery>;
export type GetUserByIdQueryResult = Apollo.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;