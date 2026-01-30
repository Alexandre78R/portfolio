import React, { ReactElement, useState } from "react";
import SignatureTable, { SignatureRow } from "../../components/Signature/SignatureTable";
import SignatureEditModal from "../../components/Signature/SignatureEditModal";
import SignatureDeleteDialog from "../../components/Signature/SignatureDeleteDialog";
import { useGetSignaturesListQuery, GetSignaturesListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

const SignaturesList = (): ReactElement => {
  const { data, loading, error, refetch } = useGetSignaturesListQuery<GetSignaturesListQuery>({
    fetchPolicy: "cache-and-network",
  });

  const { translations }: { translations: Lang } = useLang();

  const [editSignature, setEditSignature]: [SignatureRow | null, React.Dispatch<React.SetStateAction<SignatureRow | null>>] = useState<SignatureRow | null>(null);
  const [deleteSignatureId, setDeleteSignatureId]: [number | null, React.Dispatch<React.SetStateAction<number | null>>] = useState<number | null>(null);    
  
  if (loading) return <LoadingCustom />;

  if (error || !data?.listAllSignatures?.signatures) {
    return (
      <TextAdmin type="p" className="p-4 text-primary">
        {translations.messageAdminSignatureListNotFound}
      </TextAdmin>
    );
  }

  const signatures: SignatureRow[] = (data.listAllSignatures.signatures as any[])
    .filter((signature): signature is NonNullable<typeof signature> => !!signature)
    .map((signature) => ({
      id: Number(signature.id),
      name: signature.name,
      description: signature.description,
    }));

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminSignatureListTitle}
      </TextAdmin>

      <SignatureTable
        signatures={signatures}
        translations={translations}
        onEdit={(signature) => setEditSignature(signature)}
        onDelete={(id) => setDeleteSignatureId(id)}
      />

      {/* EDIT */}
      <SignatureEditModal
        signature={editSignature}
        onClose={() => setEditSignature(null)}
        onRefresh={refetch}
      />

      {/* DELETE */}
      <SignatureDeleteDialog
        signatureId={deleteSignatureId}
        onClose={() => setDeleteSignatureId(null)}
        onRefresh={refetch}
      />
    </div>
  );
};

export default SignaturesList;
