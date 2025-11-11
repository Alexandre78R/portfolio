import React, { useState, ReactElement } from "react";
import { useGetUsersListQuery } from "@/types/graphql";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import TextAdmin from "../../components/Text/TextAdmin";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import UserTable, { UserRow } from "../../components/User/UserTable";
import UserDeleteDialog from "../../components/User/UserDeleteDialog";

const UserList = (): ReactElement => {
  const { data, loading, error, refetch } = useGetUsersListQuery({
    fetchPolicy: "cache-and-network",
  });

  const { translations }: { translations: Lang } = useLang();

  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  if (loading) return <LoadingCustom />;

  if (error || !data?.userList?.users) {
    return (
      <p className="p-4 text-primary">
        {translations.messageAdminUserListNotFound}
      </p>
    );
  }

  const users: UserRow[] = data.userList.users
    .filter((user): user is NonNullable<typeof user> => !!user)
    .map((user) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    }));

  return (
    <div className="space-y-10">
      <TextAdmin type="h1">{translations.messageAdminUserListTitle}</TextAdmin>

      <UserTable
        users={users}
        translations={translations}
        onEdit={(user: UserRow) => setEditUser(user)}
        onDelete={(id: string) => setDeleteUserId(id)}
      />

      {/* DELETE */}
      <UserDeleteDialog
        userId={deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onRefresh={refetch}
      />

    </div>
  );
};

export default UserList;
