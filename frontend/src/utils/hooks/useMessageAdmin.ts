import { useGetSignaturesListQuery, useSendMessageMutation, SendMessageMutation, SendMessageMutationVariables, GetSignaturesListQuery } from '@/types/graphql';
import { FetchResult } from '@apollo/client';

export interface SignatureData {
  id: number | string;
  name: string;
  description: string;
}

export interface UseListSignaturesAdminReturn {
  signatures: SignatureData[];
  loading: boolean;
  error: any;
}

export interface UseSendMessageAdminReturn {
  sendMessage: (variables: SendMessageMutationVariables) => Promise<FetchResult<SendMessageMutation>>;
  loading: boolean;
}

export const useListSignaturesAdmin = (): UseListSignaturesAdminReturn => {
  const { data, loading, error } = useGetSignaturesListQuery({
    fetchPolicy: 'cache-and-network',
  });

  const signatures: SignatureData[] = data?.listAllSignatures?.signatures
    ? (data.listAllSignatures.signatures as any[])
        .filter((sig): sig is NonNullable<typeof sig> => !!sig)
        .map((sig) => ({
          id: Number(sig.id),
          name: sig.name,
          description: sig.description,
        }))
    : [];

  return {
    signatures,
    loading,
    error,
  };
};

export const useSendMessageAdmin = (): UseSendMessageAdminReturn => {
  const [sendMessageMutation, { loading }] = useSendMessageMutation();

  const sendMessage = async (variables: SendMessageMutationVariables): Promise<FetchResult<SendMessageMutation>> => {
    return await sendMessageMutation({
      variables,
    });
  };

  return {
    sendMessage,
    loading,
  };
};
