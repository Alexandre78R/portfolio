import React, { ReactElement, useState } from "react";
import SocialTable, { SocialRow } from "../../components/Social/SocialTable";
import SocialEditModal from "../../components/Social/SocialEditModal";
import SocialDeleteDialog from "../../components/Social/SocialDeleteDialog";
import { useGetSocialsListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

const SocialsList = (): ReactElement => {
  const { data, loading, error, refetch } = useGetSocialsListQuery({
    fetchPolicy: "cache-and-network",
  });

  console.log("SocialsList data:", data);
  const { translations }: { translations: Lang } = useLang();

  const [editSocial, setEditSocial] = useState<SocialRow | null>(null);
  const [deleteSocialId, setDeleteSocialId] = useState<number | null>(null);

  if (loading) return <LoadingCustom />;

  if (error || !data?.socialList) {
    return (
      <p className="p-4 text-primary">
        {translations.messageAdminSocialListNotFound}
      </p>
    );
  }

  const socials: SocialRow[] = (data.socialList as any[])
    .filter((social): social is NonNullable<typeof social> => !!social)
    .map((social) => ({
      id: Number(social.id),
      title: social.title,
      url: social.url,
      tab: social.tab,
    }));

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">
        {translations.messageAdminSocialListTitle}
      </TextAdmin>

      <SocialTable
        socials={socials}
        translations={translations}
        onEdit={(social) => setEditSocial(social)}
        onDelete={(id) => setDeleteSocialId(id)}
      />

      {/* EDIT */}
      <SocialEditModal
        social={editSocial}
        onClose={() => setEditSocial(null)}
        onRefresh={refetch}
      />

      {/* DELETE */}
      <SocialDeleteDialog
        socialId={deleteSocialId}
        onClose={() => setDeleteSocialId(null)}
        onRefresh={refetch}
      />
    </div>
  );
};

export default SocialsList;
