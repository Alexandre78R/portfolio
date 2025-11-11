import React, { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react";
import ModalCustom from "@/components/ModalCustom/ModalCustom";
import TextAdmin from "../Text/TextAdmin";
import InputField from "@/components/InputField/InputField";
import ButtonCustom from "@/components/Button/Button";
import LoadingCustom from "@/components/Loading/LoadingCustom";
import { X } from "lucide-react";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import CustomToast from "@/components/ToastCustom/CustomToast";
import {
  useUpdateUserMutation,
  useGetUserByIdQuery,
  GetUsersListQuery,
  Role,
} from "@/types/graphql";
import { UserRow } from "./UserTable";
import SelectField from "../Input/SelectField";
import { SelectOption, UserRole, getUserRoleOptions, mapRoleToUserRole } from "../../Pages/Users/user.type";

interface UserEditModalProps {
  user: UserRow | null;
  onClose: () => void;
  onRefresh: () => Promise<void | import("@apollo/client").ApolloQueryResult<GetUsersListQuery>>;
}

const UserEditModal = ({
  user,
  onClose,
  onRefresh,
}: UserEditModalProps): ReactElement | null => {
  const { translations }: { translations: Lang } = useLang();
  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } = CustomToast();

  const [form, setForm] = useState<{
    firstname: string;
    lastname: string;
    email: string;
    role: UserRole;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [updateUserMutation] = useUpdateUserMutation();

  const { data: userData, loading: userLoading } = useGetUserByIdQuery({
    variables: { id: Number(user?.id) },
    skip: !user?.id,
    fetchPolicy: "network-only",
  });

  const USER_ROLE_OPTIONS: SelectOption<UserRole>[] = getUserRoleOptions(translations);

  useEffect(() => {
    if (userData?.userById?.user) {
      const u = userData.userById.user;
      setForm({
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        role: mapRoleToUserRole(u.role),
      });
    } else if (!user) {
      setForm(null);
    }
  }, [userData, user]);

  if (!user) return null;

  if (userLoading || !form) {
    return (
      <ModalCustom open onClose={onClose} width="500px">
        <LoadingCustom />
      </ModalCustom>
    );
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form || !user) return;

    setLoading(true);
    try {
      const { data } = await updateUserMutation({
        variables: {
          id: Number(user.id),
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          role: form.role,
        },
      });

      if (data?.updateUser?.code === 200) {
        showAlert("success", translations.messageAdminUserEditSave);
        await onRefresh();
        onClose();
      } else {
        showAlert("error", translations.messageAdminUserEditError);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Erreur serveur !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalCustom open onClose={onClose} width="500px">
      <div className="mb-4 flex items-center justify-between">
        <TextAdmin type="h2">{translations.messageAdminUserEditTitle}</TextAdmin>
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField id="user-firstname" label="Prénom" name="firstname" value={form.firstname} onChange={handleChange} />
        <InputField id="user-lastname" label="Nom" name="lastname" value={form.lastname} onChange={handleChange} />
        <InputField id="user-email" label="Email" name="email" value={form.email} onChange={handleChange} />

        <SelectField
          id="user-role"
          label={translations.messageAdminUserColumnRole}
          name="role"
          value={form.role}
          options={USER_ROLE_OPTIONS}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 pt-4">
          <ButtonCustom text={translations.messageAdminUserEditCancel} onClick={onClose} disable={loading} />
          <ButtonCustom text={translations.messageAdminUserEditSuccess} type="submit" disable={loading} />
        </div>
      </form>
    </ModalCustom>
  );
};

export default UserEditModal;
