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

export type AboutMe = {
  __typename?: 'AboutMe';
  descriptionEN: Scalars['String']['output'];
  descriptionFR: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isVisible: Scalars['Boolean']['output'];
  titleEN: Scalars['String']['output'];
  titleFR: Scalars['String']['output'];
};

export type AboutMeResponse = {
  __typename?: 'AboutMeResponse';
  aboutMe?: Maybe<AboutMe>;
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type AboutMesResponse = {
  __typename?: 'AboutMesResponse';
  aboutMes?: Maybe<Array<AboutMe>>;
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
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

export type CreateAboutMeInput = {
  descriptionEN: Scalars['String']['input'];
  descriptionFR: Scalars['String']['input'];
  isVisible?: InputMaybe<Scalars['Boolean']['input']>;
  titleEN: Scalars['String']['input'];
  titleFR: Scalars['String']['input'];
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
  image?: InputMaybe<Scalars['String']['input']>;
  skillIds: Array<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
  typeDisplay: Scalars['String']['input'];
  video?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSignatureInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
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
  lang: Scalars['String']['input'];
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

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
  lang: Scalars['String']['input'];
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

export type MessageResponse = {
  __typename?: 'MessageResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
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
  createAboutMe: AboutMeResponse;
  createCategory: CategoryResponse;
  createEducation: EducationResponse;
  createExperience: ExperienceResponse;
  createProject: ProjectResponse;
  createSignature: SignatureResponse;
  createSkill: SubItemResponse;
  createSocial: SocialResponse;
  createTheme: ThemeResponse;
  createTranslation: TranslationsResponse;
  deleteAboutMe: AboutMeResponse;
  deleteBackupFile: Response;
  deleteCategory: CategoryResponse;
  deleteEducation: EducationResponse;
  deleteExperience: ExperienceResponse;
  deleteProject: Response;
  deleteProjectMedia: ProjectResponse;
  deleteSignature: SignatureResponse;
  deleteSkill: SubItemResponse;
  deleteSocial: SocialResponse;
  deleteTheme: Response;
  deleteTranslation: TranslationsResponse;
  deleteUser: Response;
  forgotPassword: Response;
  generateDatabaseBackup: BackupResponse;
  login: LoginResponse;
  logout: Response;
  registerUser: UserResponse;
  sendContact: MessageType;
  sendMessage: MessageResponse;
  updateAboutMe: AboutMeResponse;
  updateCategory: CategoryResponse;
  updateEducation: EducationResponse;
  updateExperience: ExperienceResponse;
  updateProject: ProjectResponse;
  updateSignature: SignatureResponse;
  updateSkill: SubItemResponse;
  updateSocial: SocialResponse;
  updateTheme: ThemeResponse;
  updateUser: UserResponse;
  uploadCV: UploadResponse;
  uploadProjectMedia: ProjectResponse;
  upsertTranslation: TranslationsResponse;
  validateCaptcha: ValidationResponse;
};


export type MutationChangePasswordArgs = {
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationClearCaptchaArgs = {
  idCaptcha: Scalars['String']['input'];
};


export type MutationCreateAboutMeArgs = {
  data: CreateAboutMeInput;
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


export type MutationCreateSignatureArgs = {
  data: CreateSignatureInput;
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


export type MutationCreateTranslationArgs = {
  key: Scalars['String']['input'];
  lang?: Scalars['String']['input'];
  value: Scalars['String']['input'];
};


export type MutationDeleteAboutMeArgs = {
  id: Scalars['Int']['input'];
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


export type MutationDeleteSignatureArgs = {
  id: Scalars['Int']['input'];
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


export type MutationDeleteTranslationArgs = {
  key: Scalars['String']['input'];
  lang?: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationForgotPasswordArgs = {
  data: ForgotPasswordInput;
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


export type MutationSendMessageArgs = {
  content: Scalars['String']['input'];
  recipients: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};


export type MutationUpdateAboutMeArgs = {
  data: UpdateAboutMeInput;
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


export type MutationUpdateSignatureArgs = {
  data: UpdateSignatureInput;
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


export type MutationUpsertTranslationArgs = {
  key: Scalars['String']['input'];
  lang?: Scalars['String']['input'];
  value: Scalars['String']['input'];
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
  image?: Maybe<Scalars['String']['output']>;
  skills: Array<SkillSubItem>;
  title: Scalars['String']['output'];
  typeDisplay: Scalars['String']['output'];
  video?: Maybe<Scalars['String']['output']>;
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
  educationListPagination: EducationsResponse;
  generateCaptcha: CaptchaResponse;
  getAboutMe: AboutMeResponse;
  getAboutMeById: AboutMeResponse;
  getAverageSkillsPerProject: Scalars['Float']['output'];
  getEducationById: EducationResponse;
  getExperienceById: ExperienceResponse;
  getGlobalStats: GlobalStatsResponse;
  getProjectById: ProjectResponse;
  getSignatureById: SignatureResponse;
  getSkillById: SubItemResponse;
  getSkillCategoryById: CategoryResponse;
  getSocialById: SocialResponse;
  getThemeById: ThemeResponse;
  getTopUsedSkills: TopSkillsResponse;
  getTranslations: TranslationsResponse;
  getUserById: UserResponse;
  getUsersRoleDistribution: UserRolePercent;
  listAboutMe: AboutMesResponse;
  listAllSignatures: SignaturesResponse;
  listBackupFiles: BackupFilesResponse;
  listEducations: EducationsResponse;
  listExperiences: ExperiencesResponse;
  listProjects: ProjectsResponse;
  listSignatures: SignaturesResponse;
  listSkillCategories: CategoryResponse;
  listSocials: Array<Social>;
  listThemes: ThemesResponse;
  listTranslationsPaginated: TranslationsPaginationResponse;
  listUsers: UsersResponse;
  me?: Maybe<User>;
  searchSkillCategories: CategoryResponse;
};


export type QueryEducationListPaginationArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAboutMeByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetEducationByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetExperienceByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetProjectByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSignatureByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSkillByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSkillCategoryByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSocialByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetThemeByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetTranslationsArgs = {
  lang?: Scalars['String']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryListSignaturesArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListTranslationsPaginatedArgs = {
  lang?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Float']['input'];
  page?: Scalars['Float']['input'];
  searchTerm?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchSkillCategoriesArgs = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
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

export type Signature = {
  __typename?: 'Signature';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SignatureResponse = {
  __typename?: 'SignatureResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  signature?: Maybe<Signature>;
};

export type SignaturesResponse = {
  __typename?: 'SignaturesResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  signatures?: Maybe<Array<Signature>>;
  total?: Maybe<Scalars['Int']['output']>;
};

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

export type TranslationEntry = {
  __typename?: 'TranslationEntry';
  key: Scalars['String']['output'];
  lang: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type TranslationKeyValue = {
  __typename?: 'TranslationKeyValue';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type TranslationsPaginationResponse = {
  __typename?: 'TranslationsPaginationResponse';
  code: Scalars['Int']['output'];
  limit?: Maybe<Scalars['Int']['output']>;
  message: Scalars['String']['output'];
  page?: Maybe<Scalars['Int']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
  translations?: Maybe<Array<TranslationEntry>>;
};

export type TranslationsResponse = {
  __typename?: 'TranslationsResponse';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success?: Maybe<Scalars['Boolean']['output']>;
  translations?: Maybe<Array<TranslationKeyValue>>;
};

export type UpdateAboutMeInput = {
  descriptionEN?: InputMaybe<Scalars['String']['input']>;
  descriptionFR?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isVisible?: InputMaybe<Scalars['Boolean']['input']>;
  titleEN?: InputMaybe<Scalars['String']['input']>;
  titleFR?: InputMaybe<Scalars['String']['input']>;
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
  image?: InputMaybe<Scalars['String']['input']>;
  skillIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  typeDisplay?: InputMaybe<Scalars['String']['input']>;
  video?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSignatureInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
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

export type CreateAboutMeMutationVariables = Exact<{
  data: CreateAboutMeInput;
}>;


export type CreateAboutMeMutation = { __typename?: 'Mutation', createAboutMe: { __typename?: 'AboutMeResponse', code: number, message: string, aboutMe?: { __typename?: 'AboutMe', id: string, titleEN: string, titleFR: string, descriptionEN: string, descriptionFR: string, isVisible: boolean } | null } };

export type UpdateAboutMeMutationVariables = Exact<{
  data: UpdateAboutMeInput;
}>;


export type UpdateAboutMeMutation = { __typename?: 'Mutation', updateAboutMe: { __typename?: 'AboutMeResponse', code: number, message: string, aboutMe?: { __typename?: 'AboutMe', id: string, titleEN: string, titleFR: string, descriptionEN: string, descriptionFR: string, isVisible: boolean } | null } };

export type DeleteAboutMeMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteAboutMeMutation = { __typename?: 'Mutation', deleteAboutMe: { __typename?: 'AboutMeResponse', code: number, message: string } };

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

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'Response', message: string, code: number } };

export type SendMessageMutationVariables = Exact<{
  subject: Scalars['String']['input'];
  content: Scalars['String']['input'];
  recipients: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'MessageResponse', code: number, message: string } };

export type CreateProjectMutationVariables = Exact<{
  data: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'ProjectResponse', code: number, message: string, project?: { __typename?: 'Project', id: string, title: string, descriptionFR: string, descriptionEN: string, typeDisplay: string, contentDisplay: string, github?: string | null, image?: string | null, video?: string | null, skills: Array<{ __typename?: 'SkillSubItem', id: string, name: string, image: string }> } | null } };

export type UpdateProjectMutationVariables = Exact<{
  data: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: { __typename?: 'ProjectResponse', code: number, message: string, project?: { __typename?: 'Project', id: string, title: string, descriptionFR: string, descriptionEN: string, typeDisplay: string, contentDisplay: string, github?: string | null, image?: string | null, video?: string | null, skills: Array<{ __typename?: 'SkillSubItem', id: string, name: string, image: string }> } | null } };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: { __typename?: 'Response', code: number, message: string } };

export type UploadProjectMediaMutationVariables = Exact<{
  projectId: Scalars['Int']['input'];
  file: Scalars['Upload']['input'];
}>;


export type UploadProjectMediaMutation = { __typename?: 'Mutation', uploadProjectMedia: { __typename?: 'ProjectResponse', code: number, message: string, project?: { __typename?: 'Project', id: string, typeDisplay: string, contentDisplay: string, image?: string | null, video?: string | null } | null } };

export type CreateSignatureMutationVariables = Exact<{
  data: CreateSignatureInput;
}>;


export type CreateSignatureMutation = { __typename?: 'Mutation', createSignature: { __typename?: 'SignatureResponse', code: number, message: string, signature?: { __typename?: 'Signature', id: string, name: string, description: string } | null } };

export type UpdateSignatureMutationVariables = Exact<{
  data: UpdateSignatureInput;
}>;


export type UpdateSignatureMutation = { __typename?: 'Mutation', updateSignature: { __typename?: 'SignatureResponse', code: number, message: string, signature?: { __typename?: 'Signature', id: string, name: string, description: string } | null } };

export type DeleteSignatureMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteSignatureMutation = { __typename?: 'Mutation', deleteSignature: { __typename?: 'SignatureResponse', code: number, message: string } };

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

export type UpsertTranslationMutationVariables = Exact<{
  key: Scalars['String']['input'];
  lang?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
}>;


export type UpsertTranslationMutation = { __typename?: 'Mutation', upsertTranslation: { __typename?: 'TranslationsResponse', code: number, success?: boolean | null, message: string, translations?: Array<{ __typename?: 'TranslationKeyValue', key: string, value: string }> | null } };

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

export type ChangePasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'Response', message: string, code: number } };

export type ForgotPasswordMutationVariables = Exact<{
  data: ForgotPasswordInput;
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'Response', message: string, code: number } };

export type GetAboutMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAboutMeQuery = { __typename?: 'Query', getAboutMe: { __typename?: 'AboutMeResponse', message: string, code: number, aboutMe?: { __typename?: 'AboutMe', id: string, titleEN: string, titleFR: string, descriptionEN: string, descriptionFR: string, isVisible: boolean } | null } };

export type GetAboutMeByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetAboutMeByIdQuery = { __typename?: 'Query', getAboutMeById: { __typename?: 'AboutMeResponse', message: string, code: number, aboutMe?: { __typename?: 'AboutMe', id: string, titleEN: string, titleFR: string, descriptionEN: string, descriptionFR: string, isVisible: boolean } | null } };

export type ListAboutMeQueryVariables = Exact<{ [key: string]: never; }>;


export type ListAboutMeQuery = { __typename?: 'Query', listAboutMe: { __typename?: 'AboutMesResponse', code: number, message: string, aboutMes?: Array<{ __typename?: 'AboutMe', id: string, titleEN: string, titleFR: string, descriptionEN: string, descriptionFR: string, isVisible: boolean }> | null } };

export type GetGlobalStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalStatsQuery = { __typename?: 'Query', getAverageSkillsPerProject: number, getGlobalStats: { __typename?: 'GlobalStatsResponse', code: number, message: string, stats?: { __typename?: 'GlobalStats', totalUsers: number, totalProjects: number, totalSkills: number, totalEducations: number, totalExperiences: number, usersByRoleAdmin: number, usersByRoleEditor: number, usersByRoleView: number } | null }, getUsersRoleDistribution: { __typename?: 'UserRolePercent', admin: number, editor: number, view: number, message: string, code: number }, getTopUsedSkills: { __typename?: 'TopSkillsResponse', code: number, message: string, skills: Array<{ __typename?: 'TopSkillUsage', id: number, name: string, usageCount: number }> } };

export type GetBackupsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBackupsListQuery = { __typename?: 'Query', listBackupFiles: { __typename?: 'BackupFilesResponse', message: string, code: number, files: Array<{ __typename?: 'BackupFileInfo', sizeBytes: number, modifiedAt: any, fileName: string, createdAt: any }> } };

export type GenerateCaptchaQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateCaptchaQuery = { __typename?: 'Query', generateCaptcha: { __typename?: 'CaptchaResponse', id: string, challengeType: string, images: Array<{ __typename?: 'CaptchaImage', typeEN: string, typeFR: string, url: string, id: string }>, challengeTypeTranslation: { __typename?: 'ChallengeTypeTranslation', typeEN: string, typeFR: string } } };

export type CvQueryVariables = Exact<{ [key: string]: never; }>;


export type CvQuery = { __typename?: 'Query', cvUrl: string };

export type GetEducationsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEducationsListQuery = { __typename?: 'Query', listEducations: { __typename?: 'EducationsResponse', message: string, code: number, educations?: Array<{ __typename?: 'Education', diplomaLevelEN: string, diplomaLevelFR: string, endDateEN: string, endDateFR: string, id: string, location: string, month?: number | null, school: string, startDateEN: string, startDateFR: string, titleEN: string, titleFR: string, typeEN: string, typeFR: string, year: number }> | null } };

export type GetEducationByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetEducationByIdQuery = { __typename?: 'Query', getEducationById: { __typename?: 'EducationResponse', code: number, education?: { __typename?: 'Education', id: string, school: string, location: string, diplomaLevelFR: string, diplomaLevelEN: string, titleFR: string, titleEN: string, typeFR: string, typeEN: string, startDateFR: string, startDateEN: string, endDateFR: string, endDateEN: string, month?: number | null, year: number } | null } };

export type GetExperiencesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExperiencesListQuery = { __typename?: 'Query', listExperiences: { __typename?: 'ExperiencesResponse', message: string, code: number, experiences?: Array<{ __typename?: 'Experience', employmentContractEN: string, business: string, employmentContractFR: string, endDateEN: string, endDateFR: string, jobEN: string, id: string, jobFR: string, month: number, startDateEN: string, startDateFR: string, typeEN: string, typeFR: string }> | null } };

export type GetExperienceByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetExperienceByIdQuery = { __typename?: 'Query', getExperienceById: { __typename?: 'ExperienceResponse', code: number, message: string, experience?: { __typename?: 'Experience', id: string, jobFR: string, jobEN: string, business: string, typeFR: string, typeEN: string, employmentContractFR: string, employmentContractEN: string, startDateFR: string, startDateEN: string, endDateFR: string, endDateEN: string, month: number } | null } };

export type GetProjectsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsListQuery = { __typename?: 'Query', listProjects: { __typename?: 'ProjectsResponse', message: string, code: number, projects?: Array<{ __typename?: 'Project', contentDisplay: string, descriptionEN: string, descriptionFR: string, github?: string | null, id: string, image?: string | null, video?: string | null, title: string, typeDisplay: string, skills: Array<{ __typename?: 'SkillSubItem', categoryId?: number | null, id: string, image: string, name: string }> }> | null } };

export type GetSignaturesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSignaturesListQuery = { __typename?: 'Query', listAllSignatures: { __typename?: 'SignaturesResponse', code: number, message: string, signatures?: Array<{ __typename?: 'Signature', id: string, name: string, description: string }> | null } };

export type GetSignatureByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetSignatureByIdQuery = { __typename?: 'Query', getSignatureById: { __typename?: 'SignatureResponse', code: number, message: string, signature?: { __typename?: 'Signature', id: string, name: string, description: string } | null } };

export type GetSkillsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSkillsListQuery = { __typename?: 'Query', listSkillCategories: { __typename?: 'CategoryResponse', code: number, message: string, categories?: Array<{ __typename?: 'SkillCategoryWithSkillsDTO', categoryFR: string, id: string, categoryEN: string, skills: Array<{ __typename?: 'SkillSubItem', categoryId?: number | null, id: string, image: string, name: string }> }> | null } };

export type SearchSkillsQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchSkillsQuery = { __typename?: 'Query', searchSkillCategories: { __typename?: 'CategoryResponse', code: number, message: string, categories?: Array<{ __typename?: 'SkillCategoryWithSkillsDTO', categoryFR: string, id: string, categoryEN: string, skills: Array<{ __typename?: 'SkillSubItem', categoryId?: number | null, id: string, image: string, name: string }> }> | null } };

export type GetSkillCategoryByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetSkillCategoryByIdQuery = { __typename?: 'Query', getSkillCategoryById: { __typename?: 'CategoryResponse', code: number, message: string, categories?: Array<{ __typename?: 'SkillCategoryWithSkillsDTO', id: string, categoryEN: string, categoryFR: string, skills: Array<{ __typename?: 'SkillSubItem', id: string, name: string, image: string, categoryId?: number | null }> }> | null } };

export type GetSkillByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetSkillByIdQuery = { __typename?: 'Query', getSkillById: { __typename?: 'SubItemResponse', code: number, message: string, subItems?: Array<{ __typename?: 'SkillSubItem', id: string, name: string, image: string, categoryId?: number | null }> | null } };

export type GetSocialsListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSocialsListQuery = { __typename?: 'Query', listSocials: Array<{ __typename?: 'Social', id: string, title: string, url: string, tab: number }> };

export type GetSocialByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetSocialByIdQuery = { __typename?: 'Query', getSocialById: { __typename?: 'SocialResponse', code: number, message: string, social?: { __typename?: 'Social', id: string, title: string, url: string, tab: number } | null } };

export type GetThemesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetThemesListQuery = { __typename?: 'Query', listThemes: { __typename?: 'ThemesResponse', message: string, code: number, themes?: Array<{ __typename?: 'Theme', body: string, admin: string, error: string, footer: string, grey: string, id: string, info: string, name: string, nameFR: string, nameEN: string, placeholder: string, primary: string, scrollHandle: string, scrollHandleHover: string, secondary: string, success: string, text100: string, text200: string, text300: string, textButton: string, textDefault: string, visible: boolean, warn: string }> | null } };

export type GetThemeByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetThemeByIdQuery = { __typename?: 'Query', getThemeById: { __typename?: 'ThemeResponse', message: string, code: number, theme?: { __typename?: 'Theme', id: string, name: string, nameEN: string, nameFR: string, visible: boolean, body: string, scrollHandle: string, scrollHandleHover: string, primary: string, secondary: string, success: string, error: string, warn: string, info: string, grey: string, placeholder: string, footer: string, admin: string, textDefault: string, text100: string, text200: string, text300: string, textButton: string } | null } };

export type GetTranslationsQueryVariables = Exact<{
  lang?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTranslationsQuery = { __typename?: 'Query', getTranslations: { __typename?: 'TranslationsResponse', code: number, success?: boolean | null, message: string, translations?: Array<{ __typename?: 'TranslationKeyValue', key: string, value: string }> | null } };

export type ListTranslationsPaginatedQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  lang?: InputMaybe<Scalars['String']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListTranslationsPaginatedQuery = { __typename?: 'Query', listTranslationsPaginated: { __typename?: 'TranslationsPaginationResponse', code: number, success?: boolean | null, message: string, total?: number | null, page?: number | null, limit?: number | null, translations?: Array<{ __typename?: 'TranslationEntry', key: string, lang: string, value: string }> | null } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', role: Role, lastname: string, isPasswordChange: boolean, id: string, firstname: string, email: string } | null };

export type GetUsersListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersListQuery = { __typename?: 'Query', listUsers: { __typename?: 'UsersResponse', message: string, code: number, users?: Array<{ __typename?: 'User', id: string, firstname: string, lastname: string, email: string, role: Role, isPasswordChange: boolean }> | null } };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById: { __typename?: 'UserResponse', message: string, code: number, user?: { __typename?: 'User', id: string, firstname: string, lastname: string, email: string, role: Role, isPasswordChange: boolean } | null } };


export const CreateAboutMeDocument = gql`
    mutation CreateAboutMe($data: CreateAboutMeInput!) {
  createAboutMe(data: $data) {
    aboutMe {
      id
      titleEN
      titleFR
      descriptionEN
      descriptionFR
      isVisible
    }
    code
    message
  }
}
    `;
export type CreateAboutMeMutationFn = Apollo.MutationFunction<CreateAboutMeMutation, CreateAboutMeMutationVariables>;

/**
 * __useCreateAboutMeMutation__
 *
 * To run a mutation, you first call `useCreateAboutMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAboutMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAboutMeMutation, { data, loading, error }] = useCreateAboutMeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateAboutMeMutation(baseOptions?: Apollo.MutationHookOptions<CreateAboutMeMutation, CreateAboutMeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAboutMeMutation, CreateAboutMeMutationVariables>(CreateAboutMeDocument, options);
      }
export type CreateAboutMeMutationHookResult = ReturnType<typeof useCreateAboutMeMutation>;
export type CreateAboutMeMutationResult = Apollo.MutationResult<CreateAboutMeMutation>;
export type CreateAboutMeMutationOptions = Apollo.BaseMutationOptions<CreateAboutMeMutation, CreateAboutMeMutationVariables>;
export const UpdateAboutMeDocument = gql`
    mutation UpdateAboutMe($data: UpdateAboutMeInput!) {
  updateAboutMe(data: $data) {
    aboutMe {
      id
      titleEN
      titleFR
      descriptionEN
      descriptionFR
      isVisible
    }
    code
    message
  }
}
    `;
export type UpdateAboutMeMutationFn = Apollo.MutationFunction<UpdateAboutMeMutation, UpdateAboutMeMutationVariables>;

/**
 * __useUpdateAboutMeMutation__
 *
 * To run a mutation, you first call `useUpdateAboutMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAboutMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAboutMeMutation, { data, loading, error }] = useUpdateAboutMeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateAboutMeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAboutMeMutation, UpdateAboutMeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAboutMeMutation, UpdateAboutMeMutationVariables>(UpdateAboutMeDocument, options);
      }
export type UpdateAboutMeMutationHookResult = ReturnType<typeof useUpdateAboutMeMutation>;
export type UpdateAboutMeMutationResult = Apollo.MutationResult<UpdateAboutMeMutation>;
export type UpdateAboutMeMutationOptions = Apollo.BaseMutationOptions<UpdateAboutMeMutation, UpdateAboutMeMutationVariables>;
export const DeleteAboutMeDocument = gql`
    mutation DeleteAboutMe($id: Int!) {
  deleteAboutMe(id: $id) {
    code
    message
  }
}
    `;
export type DeleteAboutMeMutationFn = Apollo.MutationFunction<DeleteAboutMeMutation, DeleteAboutMeMutationVariables>;

/**
 * __useDeleteAboutMeMutation__
 *
 * To run a mutation, you first call `useDeleteAboutMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAboutMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAboutMeMutation, { data, loading, error }] = useDeleteAboutMeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAboutMeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAboutMeMutation, DeleteAboutMeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAboutMeMutation, DeleteAboutMeMutationVariables>(DeleteAboutMeDocument, options);
      }
export type DeleteAboutMeMutationHookResult = ReturnType<typeof useDeleteAboutMeMutation>;
export type DeleteAboutMeMutationResult = Apollo.MutationResult<DeleteAboutMeMutation>;
export type DeleteAboutMeMutationOptions = Apollo.BaseMutationOptions<DeleteAboutMeMutation, DeleteAboutMeMutationVariables>;
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
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    message
    code
  }
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($subject: String!, $content: String!, $recipients: String!) {
  sendMessage(subject: $subject, content: $content, recipients: $recipients) {
    code
    message
  }
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      subject: // value for 'subject'
 *      content: // value for 'content'
 *      recipients: // value for 'recipients'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($data: CreateProjectInput!) {
  createProject(data: $data) {
    code
    message
    project {
      id
      title
      descriptionFR
      descriptionEN
      typeDisplay
      contentDisplay
      github
      image
      video
      skills {
        id
        name
        image
      }
    }
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($data: UpdateProjectInput!) {
  updateProject(data: $data) {
    code
    message
    project {
      id
      title
      descriptionFR
      descriptionEN
      typeDisplay
      contentDisplay
      github
      image
      video
      skills {
        id
        name
        image
      }
    }
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($id: Int!) {
  deleteProject(id: $id) {
    code
    message
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const UploadProjectMediaDocument = gql`
    mutation UploadProjectMedia($projectId: Int!, $file: Upload!) {
  uploadProjectMedia(projectId: $projectId, file: $file) {
    code
    message
    project {
      id
      typeDisplay
      contentDisplay
      image
      video
    }
  }
}
    `;
export type UploadProjectMediaMutationFn = Apollo.MutationFunction<UploadProjectMediaMutation, UploadProjectMediaMutationVariables>;

/**
 * __useUploadProjectMediaMutation__
 *
 * To run a mutation, you first call `useUploadProjectMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProjectMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProjectMediaMutation, { data, loading, error }] = useUploadProjectMediaMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadProjectMediaMutation(baseOptions?: Apollo.MutationHookOptions<UploadProjectMediaMutation, UploadProjectMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProjectMediaMutation, UploadProjectMediaMutationVariables>(UploadProjectMediaDocument, options);
      }
export type UploadProjectMediaMutationHookResult = ReturnType<typeof useUploadProjectMediaMutation>;
export type UploadProjectMediaMutationResult = Apollo.MutationResult<UploadProjectMediaMutation>;
export type UploadProjectMediaMutationOptions = Apollo.BaseMutationOptions<UploadProjectMediaMutation, UploadProjectMediaMutationVariables>;
export const CreateSignatureDocument = gql`
    mutation CreateSignature($data: CreateSignatureInput!) {
  createSignature(data: $data) {
    signature {
      id
      name
      description
    }
    code
    message
  }
}
    `;
export type CreateSignatureMutationFn = Apollo.MutationFunction<CreateSignatureMutation, CreateSignatureMutationVariables>;

/**
 * __useCreateSignatureMutation__
 *
 * To run a mutation, you first call `useCreateSignatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSignatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSignatureMutation, { data, loading, error }] = useCreateSignatureMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSignatureMutation(baseOptions?: Apollo.MutationHookOptions<CreateSignatureMutation, CreateSignatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSignatureMutation, CreateSignatureMutationVariables>(CreateSignatureDocument, options);
      }
export type CreateSignatureMutationHookResult = ReturnType<typeof useCreateSignatureMutation>;
export type CreateSignatureMutationResult = Apollo.MutationResult<CreateSignatureMutation>;
export type CreateSignatureMutationOptions = Apollo.BaseMutationOptions<CreateSignatureMutation, CreateSignatureMutationVariables>;
export const UpdateSignatureDocument = gql`
    mutation UpdateSignature($data: UpdateSignatureInput!) {
  updateSignature(data: $data) {
    signature {
      id
      name
      description
    }
    code
    message
  }
}
    `;
export type UpdateSignatureMutationFn = Apollo.MutationFunction<UpdateSignatureMutation, UpdateSignatureMutationVariables>;

/**
 * __useUpdateSignatureMutation__
 *
 * To run a mutation, you first call `useUpdateSignatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSignatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSignatureMutation, { data, loading, error }] = useUpdateSignatureMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSignatureMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSignatureMutation, UpdateSignatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSignatureMutation, UpdateSignatureMutationVariables>(UpdateSignatureDocument, options);
      }
export type UpdateSignatureMutationHookResult = ReturnType<typeof useUpdateSignatureMutation>;
export type UpdateSignatureMutationResult = Apollo.MutationResult<UpdateSignatureMutation>;
export type UpdateSignatureMutationOptions = Apollo.BaseMutationOptions<UpdateSignatureMutation, UpdateSignatureMutationVariables>;
export const DeleteSignatureDocument = gql`
    mutation DeleteSignature($id: Int!) {
  deleteSignature(id: $id) {
    code
    message
  }
}
    `;
export type DeleteSignatureMutationFn = Apollo.MutationFunction<DeleteSignatureMutation, DeleteSignatureMutationVariables>;

/**
 * __useDeleteSignatureMutation__
 *
 * To run a mutation, you first call `useDeleteSignatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSignatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSignatureMutation, { data, loading, error }] = useDeleteSignatureMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSignatureMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSignatureMutation, DeleteSignatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSignatureMutation, DeleteSignatureMutationVariables>(DeleteSignatureDocument, options);
      }
export type DeleteSignatureMutationHookResult = ReturnType<typeof useDeleteSignatureMutation>;
export type DeleteSignatureMutationResult = Apollo.MutationResult<DeleteSignatureMutation>;
export type DeleteSignatureMutationOptions = Apollo.BaseMutationOptions<DeleteSignatureMutation, DeleteSignatureMutationVariables>;
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
export const UpsertTranslationDocument = gql`
    mutation UpsertTranslation($key: String!, $lang: String = "fr", $value: String!) {
  upsertTranslation(key: $key, lang: $lang, value: $value) {
    code
    success
    message
    translations {
      key
      value
    }
  }
}
    `;
export type UpsertTranslationMutationFn = Apollo.MutationFunction<UpsertTranslationMutation, UpsertTranslationMutationVariables>;

/**
 * __useUpsertTranslationMutation__
 *
 * To run a mutation, you first call `useUpsertTranslationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertTranslationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertTranslationMutation, { data, loading, error }] = useUpsertTranslationMutation({
 *   variables: {
 *      key: // value for 'key'
 *      lang: // value for 'lang'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpsertTranslationMutation(baseOptions?: Apollo.MutationHookOptions<UpsertTranslationMutation, UpsertTranslationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertTranslationMutation, UpsertTranslationMutationVariables>(UpsertTranslationDocument, options);
      }
export type UpsertTranslationMutationHookResult = ReturnType<typeof useUpsertTranslationMutation>;
export type UpsertTranslationMutationResult = Apollo.MutationResult<UpsertTranslationMutation>;
export type UpsertTranslationMutationOptions = Apollo.BaseMutationOptions<UpsertTranslationMutation, UpsertTranslationMutationVariables>;
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
export const ChangePasswordDocument = gql`
    mutation ChangePassword($email: String!, $newPassword: String!) {
  changePassword(email: $email, newPassword: $newPassword) {
    message
    code
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($data: ForgotPasswordInput!) {
  forgotPassword(data: $data) {
    message
    code
  }
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const GetAboutMeDocument = gql`
    query GetAboutMe {
  getAboutMe {
    aboutMe {
      id
      titleEN
      titleFR
      descriptionEN
      descriptionFR
      isVisible
    }
    message
    code
  }
}
    `;

/**
 * __useGetAboutMeQuery__
 *
 * To run a query within a React component, call `useGetAboutMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAboutMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAboutMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAboutMeQuery(baseOptions?: Apollo.QueryHookOptions<GetAboutMeQuery, GetAboutMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAboutMeQuery, GetAboutMeQueryVariables>(GetAboutMeDocument, options);
      }
export function useGetAboutMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAboutMeQuery, GetAboutMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAboutMeQuery, GetAboutMeQueryVariables>(GetAboutMeDocument, options);
        }
// @ts-ignore
export function useGetAboutMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAboutMeQuery, GetAboutMeQueryVariables>): Apollo.UseSuspenseQueryResult<GetAboutMeQuery, GetAboutMeQueryVariables>;
export function useGetAboutMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAboutMeQuery, GetAboutMeQueryVariables>): Apollo.UseSuspenseQueryResult<GetAboutMeQuery | undefined, GetAboutMeQueryVariables>;
export function useGetAboutMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAboutMeQuery, GetAboutMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAboutMeQuery, GetAboutMeQueryVariables>(GetAboutMeDocument, options);
        }
export type GetAboutMeQueryHookResult = ReturnType<typeof useGetAboutMeQuery>;
export type GetAboutMeLazyQueryHookResult = ReturnType<typeof useGetAboutMeLazyQuery>;
export type GetAboutMeSuspenseQueryHookResult = ReturnType<typeof useGetAboutMeSuspenseQuery>;
export type GetAboutMeQueryResult = Apollo.QueryResult<GetAboutMeQuery, GetAboutMeQueryVariables>;
export const GetAboutMeByIdDocument = gql`
    query GetAboutMeById($id: Int!) {
  getAboutMeById(id: $id) {
    aboutMe {
      id
      titleEN
      titleFR
      descriptionEN
      descriptionFR
      isVisible
    }
    message
    code
  }
}
    `;

/**
 * __useGetAboutMeByIdQuery__
 *
 * To run a query within a React component, call `useGetAboutMeByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAboutMeByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAboutMeByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAboutMeByIdQuery(baseOptions: Apollo.QueryHookOptions<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables> & ({ variables: GetAboutMeByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>(GetAboutMeByIdDocument, options);
      }
export function useGetAboutMeByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>(GetAboutMeByIdDocument, options);
        }
// @ts-ignore
export function useGetAboutMeByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>;
export function useGetAboutMeByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetAboutMeByIdQuery | undefined, GetAboutMeByIdQueryVariables>;
export function useGetAboutMeByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>(GetAboutMeByIdDocument, options);
        }
export type GetAboutMeByIdQueryHookResult = ReturnType<typeof useGetAboutMeByIdQuery>;
export type GetAboutMeByIdLazyQueryHookResult = ReturnType<typeof useGetAboutMeByIdLazyQuery>;
export type GetAboutMeByIdSuspenseQueryHookResult = ReturnType<typeof useGetAboutMeByIdSuspenseQuery>;
export type GetAboutMeByIdQueryResult = Apollo.QueryResult<GetAboutMeByIdQuery, GetAboutMeByIdQueryVariables>;
export const ListAboutMeDocument = gql`
    query ListAboutMe {
  listAboutMe {
    aboutMes {
      id
      titleEN
      titleFR
      descriptionEN
      descriptionFR
      isVisible
    }
    code
    message
  }
}
    `;

/**
 * __useListAboutMeQuery__
 *
 * To run a query within a React component, call `useListAboutMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useListAboutMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListAboutMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useListAboutMeQuery(baseOptions?: Apollo.QueryHookOptions<ListAboutMeQuery, ListAboutMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListAboutMeQuery, ListAboutMeQueryVariables>(ListAboutMeDocument, options);
      }
export function useListAboutMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListAboutMeQuery, ListAboutMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListAboutMeQuery, ListAboutMeQueryVariables>(ListAboutMeDocument, options);
        }
// @ts-ignore
export function useListAboutMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListAboutMeQuery, ListAboutMeQueryVariables>): Apollo.UseSuspenseQueryResult<ListAboutMeQuery, ListAboutMeQueryVariables>;
export function useListAboutMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListAboutMeQuery, ListAboutMeQueryVariables>): Apollo.UseSuspenseQueryResult<ListAboutMeQuery | undefined, ListAboutMeQueryVariables>;
export function useListAboutMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListAboutMeQuery, ListAboutMeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListAboutMeQuery, ListAboutMeQueryVariables>(ListAboutMeDocument, options);
        }
export type ListAboutMeQueryHookResult = ReturnType<typeof useListAboutMeQuery>;
export type ListAboutMeLazyQueryHookResult = ReturnType<typeof useListAboutMeLazyQuery>;
export type ListAboutMeSuspenseQueryHookResult = ReturnType<typeof useListAboutMeSuspenseQuery>;
export type ListAboutMeQueryResult = Apollo.QueryResult<ListAboutMeQuery, ListAboutMeQueryVariables>;
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
  listEducations {
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
  getEducationById(id: $id) {
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
  listExperiences {
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
  getExperienceById(id: $id) {
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
  listProjects {
    message
    code
    projects {
      contentDisplay
      descriptionEN
      descriptionFR
      github
      id
      image
      video
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
export const GetSignaturesListDocument = gql`
    query GetSignaturesList {
  listAllSignatures {
    signatures {
      id
      name
      description
    }
    code
    message
  }
}
    `;

/**
 * __useGetSignaturesListQuery__
 *
 * To run a query within a React component, call `useGetSignaturesListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSignaturesListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSignaturesListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSignaturesListQuery(baseOptions?: Apollo.QueryHookOptions<GetSignaturesListQuery, GetSignaturesListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSignaturesListQuery, GetSignaturesListQueryVariables>(GetSignaturesListDocument, options);
      }
export function useGetSignaturesListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSignaturesListQuery, GetSignaturesListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSignaturesListQuery, GetSignaturesListQueryVariables>(GetSignaturesListDocument, options);
        }
// @ts-ignore
export function useGetSignaturesListSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSignaturesListQuery, GetSignaturesListQueryVariables>): Apollo.UseSuspenseQueryResult<GetSignaturesListQuery, GetSignaturesListQueryVariables>;
export function useGetSignaturesListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSignaturesListQuery, GetSignaturesListQueryVariables>): Apollo.UseSuspenseQueryResult<GetSignaturesListQuery | undefined, GetSignaturesListQueryVariables>;
export function useGetSignaturesListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSignaturesListQuery, GetSignaturesListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSignaturesListQuery, GetSignaturesListQueryVariables>(GetSignaturesListDocument, options);
        }
export type GetSignaturesListQueryHookResult = ReturnType<typeof useGetSignaturesListQuery>;
export type GetSignaturesListLazyQueryHookResult = ReturnType<typeof useGetSignaturesListLazyQuery>;
export type GetSignaturesListSuspenseQueryHookResult = ReturnType<typeof useGetSignaturesListSuspenseQuery>;
export type GetSignaturesListQueryResult = Apollo.QueryResult<GetSignaturesListQuery, GetSignaturesListQueryVariables>;
export const GetSignatureByIdDocument = gql`
    query GetSignatureById($id: Int!) {
  getSignatureById(id: $id) {
    signature {
      id
      name
      description
    }
    code
    message
  }
}
    `;

/**
 * __useGetSignatureByIdQuery__
 *
 * To run a query within a React component, call `useGetSignatureByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSignatureByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSignatureByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSignatureByIdQuery(baseOptions: Apollo.QueryHookOptions<GetSignatureByIdQuery, GetSignatureByIdQueryVariables> & ({ variables: GetSignatureByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>(GetSignatureByIdDocument, options);
      }
export function useGetSignatureByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>(GetSignatureByIdDocument, options);
        }
// @ts-ignore
export function useGetSignatureByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>;
export function useGetSignatureByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetSignatureByIdQuery | undefined, GetSignatureByIdQueryVariables>;
export function useGetSignatureByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>(GetSignatureByIdDocument, options);
        }
export type GetSignatureByIdQueryHookResult = ReturnType<typeof useGetSignatureByIdQuery>;
export type GetSignatureByIdLazyQueryHookResult = ReturnType<typeof useGetSignatureByIdLazyQuery>;
export type GetSignatureByIdSuspenseQueryHookResult = ReturnType<typeof useGetSignatureByIdSuspenseQuery>;
export type GetSignatureByIdQueryResult = Apollo.QueryResult<GetSignatureByIdQuery, GetSignatureByIdQueryVariables>;
export const GetSkillsListDocument = gql`
    query GetSkillsList {
  listSkillCategories {
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
export const SearchSkillsDocument = gql`
    query SearchSkills($searchTerm: String) {
  searchSkillCategories(searchTerm: $searchTerm) {
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
 * __useSearchSkillsQuery__
 *
 * To run a query within a React component, call `useSearchSkillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSkillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSkillsQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useSearchSkillsQuery(baseOptions?: Apollo.QueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSkillsQuery, SearchSkillsQueryVariables>(SearchSkillsDocument, options);
      }
export function useSearchSkillsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSkillsQuery, SearchSkillsQueryVariables>(SearchSkillsDocument, options);
        }
// @ts-ignore
export function useSearchSkillsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>): Apollo.UseSuspenseQueryResult<SearchSkillsQuery, SearchSkillsQueryVariables>;
export function useSearchSkillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>): Apollo.UseSuspenseQueryResult<SearchSkillsQuery | undefined, SearchSkillsQueryVariables>;
export function useSearchSkillsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchSkillsQuery, SearchSkillsQueryVariables>(SearchSkillsDocument, options);
        }
export type SearchSkillsQueryHookResult = ReturnType<typeof useSearchSkillsQuery>;
export type SearchSkillsLazyQueryHookResult = ReturnType<typeof useSearchSkillsLazyQuery>;
export type SearchSkillsSuspenseQueryHookResult = ReturnType<typeof useSearchSkillsSuspenseQuery>;
export type SearchSkillsQueryResult = Apollo.QueryResult<SearchSkillsQuery, SearchSkillsQueryVariables>;
export const GetSkillCategoryByIdDocument = gql`
    query GetSkillCategoryById($id: Int!) {
  getSkillCategoryById(id: $id) {
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
  getSkillById(id: $id) {
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
  listSocials {
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
  getSocialById(id: $id) {
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
export const GetTranslationsDocument = gql`
    query GetTranslations($lang: String = "fr") {
  getTranslations(lang: $lang) {
    code
    success
    message
    translations {
      key
      value
    }
  }
}
    `;

/**
 * __useGetTranslationsQuery__
 *
 * To run a query within a React component, call `useGetTranslationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTranslationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTranslationsQuery({
 *   variables: {
 *      lang: // value for 'lang'
 *   },
 * });
 */
export function useGetTranslationsQuery(baseOptions?: Apollo.QueryHookOptions<GetTranslationsQuery, GetTranslationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTranslationsQuery, GetTranslationsQueryVariables>(GetTranslationsDocument, options);
      }
export function useGetTranslationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTranslationsQuery, GetTranslationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTranslationsQuery, GetTranslationsQueryVariables>(GetTranslationsDocument, options);
        }
// @ts-ignore
export function useGetTranslationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTranslationsQuery, GetTranslationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetTranslationsQuery, GetTranslationsQueryVariables>;
export function useGetTranslationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTranslationsQuery, GetTranslationsQueryVariables>): Apollo.UseSuspenseQueryResult<GetTranslationsQuery | undefined, GetTranslationsQueryVariables>;
export function useGetTranslationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTranslationsQuery, GetTranslationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTranslationsQuery, GetTranslationsQueryVariables>(GetTranslationsDocument, options);
        }
export type GetTranslationsQueryHookResult = ReturnType<typeof useGetTranslationsQuery>;
export type GetTranslationsLazyQueryHookResult = ReturnType<typeof useGetTranslationsLazyQuery>;
export type GetTranslationsSuspenseQueryHookResult = ReturnType<typeof useGetTranslationsSuspenseQuery>;
export type GetTranslationsQueryResult = Apollo.QueryResult<GetTranslationsQuery, GetTranslationsQueryVariables>;
export const ListTranslationsPaginatedDocument = gql`
    query ListTranslationsPaginated($page: Float = 1, $limit: Float = 20, $lang: String, $searchTerm: String) {
  listTranslationsPaginated(
    page: $page
    limit: $limit
    lang: $lang
    searchTerm: $searchTerm
  ) {
    code
    success
    message
    translations {
      key
      lang
      value
    }
    total
    page
    limit
  }
}
    `;

/**
 * __useListTranslationsPaginatedQuery__
 *
 * To run a query within a React component, call `useListTranslationsPaginatedQuery` and pass it any options that fit your needs.
 * When your component renders, `useListTranslationsPaginatedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListTranslationsPaginatedQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *      lang: // value for 'lang'
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useListTranslationsPaginatedQuery(baseOptions?: Apollo.QueryHookOptions<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>(ListTranslationsPaginatedDocument, options);
      }
export function useListTranslationsPaginatedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>(ListTranslationsPaginatedDocument, options);
        }
// @ts-ignore
export function useListTranslationsPaginatedSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>): Apollo.UseSuspenseQueryResult<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>;
export function useListTranslationsPaginatedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>): Apollo.UseSuspenseQueryResult<ListTranslationsPaginatedQuery | undefined, ListTranslationsPaginatedQueryVariables>;
export function useListTranslationsPaginatedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>(ListTranslationsPaginatedDocument, options);
        }
export type ListTranslationsPaginatedQueryHookResult = ReturnType<typeof useListTranslationsPaginatedQuery>;
export type ListTranslationsPaginatedLazyQueryHookResult = ReturnType<typeof useListTranslationsPaginatedLazyQuery>;
export type ListTranslationsPaginatedSuspenseQueryHookResult = ReturnType<typeof useListTranslationsPaginatedSuspenseQuery>;
export type ListTranslationsPaginatedQueryResult = Apollo.QueryResult<ListTranslationsPaginatedQuery, ListTranslationsPaginatedQueryVariables>;
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
  listUsers {
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
  getUserById(id: $id) {
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