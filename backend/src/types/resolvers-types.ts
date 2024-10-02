import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type Query = {
  __typename?: 'Query';
  contact: Scalars['String']['output'];
  generateCaptcha: CaptchaResponse;
};

export type ValidationResponse = {
  __typename?: 'ValidationResponse';
  isValid: Scalars['Boolean']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CaptchaImage: ResolverTypeWrapper<CaptchaImage>;
  CaptchaResponse: ResolverTypeWrapper<CaptchaResponse>;
  ChallengeTypeTranslation: ResolverTypeWrapper<ChallengeTypeTranslation>;
  ContactFrom: ContactFrom;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  MessageType: ResolverTypeWrapper<MessageType>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ValidationResponse: ResolverTypeWrapper<ValidationResponse>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CaptchaImage: CaptchaImage;
  CaptchaResponse: CaptchaResponse;
  ChallengeTypeTranslation: ChallengeTypeTranslation;
  ContactFrom: ContactFrom;
  Float: Scalars['Float']['output'];
  MessageType: MessageType;
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  ValidationResponse: ValidationResponse;
}>;

export type CaptchaImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['CaptchaImage'] = ResolversParentTypes['CaptchaImage']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  typeEN?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  typeFR?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CaptchaResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CaptchaResponse'] = ResolversParentTypes['CaptchaResponse']> = ResolversObject<{
  challengeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  challengeTypeTranslation?: Resolver<ResolversTypes['ChallengeTypeTranslation'], ParentType, ContextType>;
  expirationTime?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['CaptchaImage']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChallengeTypeTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChallengeTypeTranslation'] = ResolversParentTypes['ChallengeTypeTranslation']> = ResolversObject<{
  typeEN?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  typeFR?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MessageTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageType'] = ResolversParentTypes['MessageType']> = ResolversObject<{
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  clearCaptcha?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationClearCaptchaArgs, 'idCaptcha'>>;
  sendContact?: Resolver<ResolversTypes['MessageType'], ParentType, ContextType, RequireFields<MutationSendContactArgs, 'data'>>;
  validateCaptcha?: Resolver<ResolversTypes['ValidationResponse'], ParentType, ContextType, RequireFields<MutationValidateCaptchaArgs, 'challengeType' | 'idCaptcha' | 'selectedIndices'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  contact?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generateCaptcha?: Resolver<ResolversTypes['CaptchaResponse'], ParentType, ContextType>;
}>;

export type ValidationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ValidationResponse'] = ResolversParentTypes['ValidationResponse']> = ResolversObject<{
  isValid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CaptchaImage?: CaptchaImageResolvers<ContextType>;
  CaptchaResponse?: CaptchaResponseResolvers<ContextType>;
  ChallengeTypeTranslation?: ChallengeTypeTranslationResolvers<ContextType>;
  MessageType?: MessageTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ValidationResponse?: ValidationResponseResolvers<ContextType>;
}>;

