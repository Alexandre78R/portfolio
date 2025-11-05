import { ChangeEvent, ReactElement, useState } from "react";
import { useUploadCvMutation } from "@/types/graphql";
import CustomToast from "@/components/ToastCustom/CustomToast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";

const formatBytes = (bytes: number): string => {
  if (!bytes) return "0 B";
  const k: number = 1024;
  const sizes: string[] = ["B", "KB", "MB", "GB"];
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const CVUpdate = (): JSX.Element => {

  const [uploadCv] = useUploadCvMutation();

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const { translations }: { translations: Lang } = useLang();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenDialog = (file: File, event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedFile(file);
    setFileEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
    setSelectedFile(null);
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) return;

    setLoading(true);

    try {

      const { data } = await uploadCv({ variables: { file: selectedFile } });

      const resultCode: number = data?.uploadCV?.code ?? 500;
      const resultMessage: string = data?.uploadCV?.message ?? "Upload failed";

      if (resultCode === 200) {
        showAlert("success", translations.messagePageCvUploadSuccess);
        setSelectedFile(null);
      } else {
        showAlert("error", resultMessage);
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      showAlert("error", translations.messagePageCvUploadError || errMsg);
    } finally {
      if (fileEvent) {
        const input = fileEvent.target as HTMLInputElement;
        input.value = "";
        setFileEvent(null);
      }
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;
    handleOpenDialog(file, event);
  };

  return (
    <div className="flex flex-col">
      <p className="text-primary text-lg font-semibold">{translations.messagePageCvTitle}</p>
      <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">

      <ButtonCustom
        text={translations.messagePageCvButtonSelectFile}
        onClick={() => document.getElementById("cv-input")?.click()}
        disable={loading}
      />

      <input
        type="file"
        id="cv-input"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {selectedFile && (
        <div className="p-2 border border-gray-300 rounded-md">
          <p className="text-sm font-mono">File: {selectedFile.name}</p>
          <p className="text-xs text-gray-500">Size: {formatBytes(selectedFile.size)}</p>
        </div>
      )}

      {loading && <p>{translations.messagePageCvUploading}</p>}

      <ConfirmDialog
        open={openDialog}
        title={translations.messagePageCvConfirmTitle}
        description={translations.messagePageCvConfirmDescription}
        confirmLabel={translations.messagePageCvConfirmButtonYes}
        cancelLabel={translations.messagePageCvConfirmButtonNo}
        onConfirm={handleUpload}
        onCancel={handleCloseDialog}
      />
    </div>
  </div>
  );
};

export default CVUpdate;