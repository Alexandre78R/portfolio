import { ChangeEvent, ReactElement, useState } from "react";
import { useUploadCVAdmin } from "@/utils/hooks";
import CustomToast from "@/components/ToastCustom/CustomToast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import ButtonCustom from "@/components/Button/Button";
import { useLang } from "@/context/Lang/LangContext";
import Lang from "@/lang/typeLang";
import TextAdmin from "../../components/Text/TextAdmin";

const formatBytes: (bytes: number) => string = (bytes: number): string => {
  if (!bytes) return "0 B";
  const k: number = 1024;
  const sizes: string[] = ["B", "KB", "MB", "GB"];
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const CVUpdate: React.FC = (): JSX.Element => {

  const { uploadCV, loading } = useUploadCVAdmin();

  const { showAlert }: { showAlert: (type: "success" | "error", message: string) => void } =
    CustomToast();

  const { translations }: { translations: Lang } = useLang();

  const [selectedFile, setSelectedFile]: [File | null, React.Dispatch<React.SetStateAction<File | null>>] = useState<File | null>(null);
  const [fileEvent, setFileEvent]: [ChangeEvent<HTMLInputElement> | null, React.Dispatch<React.SetStateAction<ChangeEvent<HTMLInputElement> | null>>] = useState<ChangeEvent<HTMLInputElement> | null>(null);
  const [openDialog, setOpenDialog]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const handleOpenDialog: (file: File, event: ChangeEvent<HTMLInputElement>) => void = (file: File, event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedFile(file);
    setFileEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog: () => void = (): void => {
    setOpenDialog(false);
    setSelectedFile(null);
  };

  const handleUpload: () => Promise<void> = async (): Promise<void> => {
    if (!selectedFile) return;

    setUploadLoading(true);

    try {

      const response = await uploadCV(selectedFile);

      const resultCode: number = response.data?.uploadCV?.code ?? 500;
      const resultMessage: string = response.data?.uploadCV?.message ?? "Upload failed";

      if (resultCode === 200) {
        showAlert("success", translations.messagePageCvUploadSuccess);
        setSelectedFile(null);
      } else {
        showAlert("error", resultMessage);
      }
    } catch (error: unknown) {
      const errMsg: string = error instanceof Error ? error.message : "Unknown error";
      showAlert("error", translations.messagePageCvUploadError || errMsg);
    } finally {
      if (fileEvent) {
        const input: HTMLInputElement = fileEvent.target as HTMLInputElement;
        input.value = "";
        setFileEvent(null);
      }
      setUploadLoading(false);
      setOpenDialog(false);
    }
  };

  const handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void = (event: ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = event.target.files?.[0];
    if (!file) return;
    handleOpenDialog(file, event);
  };

  return (
    <div className="flex flex-col">
      <TextAdmin type="p" className="text-primary text-lg font-semibold">{translations.messagePageCvTitle}</TextAdmin>
      <div className="bg-body p-6 shadow-lg mt-[1%] text-center sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">

      <ButtonCustom
        text={translations.messagePageCvButtonSelectFile}
        onClick={() => document.getElementById("cv-input")?.click()}
        disable={uploadLoading}
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

      {uploadLoading && <p>{translations.messagePageCvUploading}</p>}

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