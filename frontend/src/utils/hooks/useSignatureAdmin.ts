import {
  useQuery,
  useMutation,
  QueryResult,
  MutationTuple,
  ApolloError,
} from "@apollo/client";
import {
  GetSignaturesListQuery,
  GetSignaturesListQueryVariables,
  CreateSignatureMutation,
  CreateSignatureMutationVariables,
  UpdateSignatureMutation,
  UpdateSignatureMutationVariables,
  DeleteSignatureMutation,
  DeleteSignatureMutationVariables,
} from "@/types/graphql";
import { GET_SIGNATURES_LIST } from "@/requetes/queries/signatures.queries";
import {
  CREATE_SIGNATURE,
  UPDATE_SIGNATURE,
  DELETE_SIGNATURE,
} from "@/requetes/mutations/signatures.mutations";

export interface SignatureAdminResult {
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<{ data: GetSignaturesListQuery }>;
  data: GetSignaturesListQuery | undefined;
  signatures: Array<{ id: string; name: string; description: string }>;
}

interface SignatureMutationResult {
  mutate: (
    variables:
      | CreateSignatureMutationVariables
      | UpdateSignatureMutationVariables
      | DeleteSignatureMutationVariables
  ) => Promise<{ data?: CreateSignatureMutation | UpdateSignatureMutation | DeleteSignatureMutation }>;
  loading: boolean;
  error: ApolloError | undefined;
}

export const useListSignaturesAdmin = (): SignatureAdminResult => {
  const { data, loading, error, refetch } = useQuery<
    GetSignaturesListQuery,
    GetSignaturesListQueryVariables
  >(GET_SIGNATURES_LIST, {
    fetchPolicy: "cache-and-network",
  });

  const signatures = data?.listAllSignatures?.signatures?.filter((s): s is NonNullable<typeof s> => s !== null) ?? [];

  return {
    data,
    signatures,
    loading,
    error,
    refetch: async () => {
      const result = await refetch();
      return result;
    },
  };
};

export const useCreateSignatureAdmin = (): [
  (variables: CreateSignatureMutationVariables) => Promise<{
    data?: CreateSignatureMutation;
  }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [createSignature, { loading, error }] = useMutation<
    CreateSignatureMutation,
    CreateSignatureMutationVariables
  >(CREATE_SIGNATURE);

  return [
    async (variables: CreateSignatureMutationVariables) => {
      try {
        const result = await createSignature({ variables });
        // Ensure data is undefined if null
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Create signature error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useUpdateSignatureAdmin = (): [
  (variables: UpdateSignatureMutationVariables) => Promise<{
    data?: UpdateSignatureMutation;
  }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [updateSignature, { loading, error }] = useMutation<
    UpdateSignatureMutation,
    UpdateSignatureMutationVariables
  >(UPDATE_SIGNATURE);

  return [
    async (variables: UpdateSignatureMutationVariables) => {
      try {
        const result = await updateSignature({ variables });
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Update signature error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};

export const useDeleteSignatureAdmin = (): [
  (variables: DeleteSignatureMutationVariables) => Promise<{
    data?: DeleteSignatureMutation;
  }>,
  { loading: boolean; error: ApolloError | undefined }
] => {
  const [deleteSignature, { loading, error }] = useMutation<
    DeleteSignatureMutation,
    DeleteSignatureMutationVariables
  >(DELETE_SIGNATURE);

  return [
    async (variables: DeleteSignatureMutationVariables) => {
      try {
        const result = await deleteSignature({ variables });
        return { data: result.data ?? undefined };
      } catch (err: unknown) {
        if (err instanceof Error) console.error("Delete signature error:", err.message);
        throw err;
      }
    },
    { loading, error },
  ];
};
