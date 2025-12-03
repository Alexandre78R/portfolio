export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  searchSkills: CategoryResponse;
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


export type QuerySearchSkillsArgs = {
  searchTerm?: InputMaybe<Scalars['String']['input']>;
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
