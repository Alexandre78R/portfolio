import React, { ReactElement, useState, useEffect } from "react";
import {
  Modal,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  useGenerateCaptchaQuery,
  GenerateCaptchaQuery,
  CaptchaImage,
  useValidateCaptchaMutation,
  useClearCaptchaMutation,
} from "@/types/graphql";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "../ToastCustom/CustomToast";
import ButtonCustom from "../Button/Button";
import LoadingCustom from "../Loading/LoadingCustom";
import Lang from "@/lang/typeLang";

const modalStyle: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
  bgcolor: "var(--body-color)",
  borderRadius: "16px",
};

export type ContactProps = {
  open: boolean;
  onClose: () => void;
  onValidate: (isValid: boolean) => void;
  authorizeGenerateCaptcha: boolean;
  setAuthorizeGenerateCaptcha: React.Dispatch<React.SetStateAction<boolean>>;
};

const CaptchaModal: React.FC<ContactProps> = ({
  open,
  onClose,
  onValidate,
  authorizeGenerateCaptcha,
  setAuthorizeGenerateCaptcha,
}): ReactElement => {
  const { showAlert } = CustomToast();
  const { translations }: { translations: Lang } = useLang();

  const [images, setImages]: [CaptchaImage[], React.Dispatch<React.SetStateAction<CaptchaImage[]>>] = useState<CaptchaImage[]>([]);
  const [selectedImages, setSelectedImages]: [number[], React.Dispatch<React.SetStateAction<number[]>>] = useState<number[]>([]);
  const [challengeType, setChallengeType]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [idCaptcha, setIdCaptcha]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);
  const [refreshing, setRefreshing]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [checkrefresh, setCheckRefresh]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

  const generateCaptcha = useGenerateCaptchaQuery<GenerateCaptchaQuery>();
  const [validateCaptcha] = useValidateCaptchaMutation();
  const [clearCaptcha] = useClearCaptchaMutation();

  const getErrorMessage: (error: Error) => string = (error: Error): string => {
    switch (error.message) {
      case "Expired captcha!":
        return translations.messageErrorCaptchaExpired;
      case "Captcha not found!":
        return translations.messageErrorCaptchaNotFound;
      case "Captcha not clear!":
        return translations.messageErrorCaptchaNotClear;
      default:
        return translations.messageErrorServerOff;
    }
  };

  const preloadImages: (imageUrls: string[]) => Promise<void[]> = (imageUrls: string[]): Promise<void[]> =>
    Promise.all(
      imageUrls.map(
        (url) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
      )
    );

  useEffect(() => {
    if (open && authorizeGenerateCaptcha && !checkrefresh) {
      setLoading(true);
      setCheckRefresh(true);
      generateCaptcha
        .refetch()
        .then((response) => {
          const captcha = response.data?.generateCaptcha;
          if (captcha) {
            const imageUrls: string[] = captcha.images.map((img) => img.url);
            preloadImages(imageUrls).then(() => {
              setImages(captcha.images);
              setChallengeType(captcha.challengeType);
              setIdCaptcha(captcha.id);
              setSelectedImages([]);
              setLoading(false);
              setAuthorizeGenerateCaptcha(false);
            });
          }
        })
        .catch((error: Error) => {
          showAlert("error", getErrorMessage(error));
          setLoading(false);
          setCheckRefresh(false);
        });
    }
  }, [open, authorizeGenerateCaptcha, checkrefresh, generateCaptcha, showAlert, setAuthorizeGenerateCaptcha]);

  const regenerateCaptcha: () => void = (): void => {
    if (refreshing) return;
    setCheckRefresh(true);
    setRefreshing(true);
    setLoading(true);
    setAuthorizeGenerateCaptcha(true);

    clearCaptcha({
      variables: { idCaptcha },
      onCompleted: () => {
        generateCaptcha.refetch()
          .then((response) => {
            const captcha = response.data?.generateCaptcha;
            if (captcha) {
              const imageUrls: string[] = captcha.images.map((img) => img.url);
              preloadImages(imageUrls).then(() => {
                setImages(captcha.images);
                setChallengeType(captcha.challengeType);
                setIdCaptcha(captcha.id);
                setSelectedImages([]);
                setLoading(false);
                setRefreshing(false);
              });
            }
          })
          .catch((error: Error) => {
            showAlert("error", getErrorMessage(error));
            setLoading(false);
            setRefreshing(false);
          });
      },
      onError: (error: Error) => {
        showAlert("error", getErrorMessage(error));
        setLoading(false);
        setRefreshing(false);
      },
    });
  };

  const handleImageClick: (index: number) => void = (index: number): void => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit: () => Promise<void> = async (): Promise<void> => {
    validateCaptcha({
      variables: { selectedIndices: selectedImages, challengeType, idCaptcha },
      onCompleted: (data: { validateCaptcha: { isValid: boolean } }) => {
        if (data?.validateCaptcha.isValid) {
          showAlert("success", translations.messageSuccessCaptcha);
          setImages([]);
          setChallengeType("");
          setSelectedImages([]);
          setIdCaptcha("");
          setLoading(true);
          onValidate(true);
          onClose();
        } else {
          showAlert("error", translations.messageErrorCaptchaIncorrect);
        }
      },
      onError: (error: Error) => {
        showAlert("error", getErrorMessage(error));
        onValidate(false);
      },
    });
  };

  const generateCategoryName: () => string = (): string => {
    switch (challengeType) {
      case "cat":
        return translations.messageInfoCategoryCatCaptcha;
      case "dog":
        return translations.messageInfoCategoryDogCaptcha;
      case "car":
        return translations.messageInfoCategoryCarCaptcha;
      default:
        return "...";
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {loading ? (
          <LoadingCustom />
        ) : (
          <>
            <div className="flex justify-center">
              <div className="bg-body p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                <p className="text-text">
                  {translations.messageInfoFirstCaptcha} {generateCategoryName()}{" "}
                  {translations.messageInfoLastCaptcha}
                </p>
              </div>
            </div>
            <div className="flex justify-center flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Card
                    onClick={() => handleImageClick(index)}
                    className="m-2 cursor-pointer"
                    sx={{
                      border: selectedImages.includes(index)
                        ? "4px solid var(--success-color)"
                        : "4px solid var(--text-color)",
                    }}
                  >
                    <CardActionArea>
                      {refreshing ? (
                        <LoadingCustom />
                      ) : (
                        <CardMedia
                          component="img"
                          alt={`captcha-img-${index}`}
                          image={image.url}
                          onError={() =>
                            setImages((prev) =>
                              prev.map((img, i) =>
                                i === index ? { ...img, url: "" } : img
                              )
                            )
                          }
                          sx={{ width: 100, height: 100 }}
                        />
                      )}
                    </CardActionArea>
                  </Card>
                  {selectedImages.includes(index) && (
                    <IconButton
                      className="absolute top-0 right-0"
                      sx={{
                        width: 24,
                        height: 24,
                        color: "green",
                        backgroundColor: "white",
                        top: 8,
                        right: 8,
                        boxShadow: 2,
                        zIndex: 2,
                        p: 0,
                        "&:hover": { backgroundColor: "white" },
                        position: "absolute",
                      }}
                    >
                      <CheckCircleIcon sx={{ width: 24, height: 24 }} />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center m-2">
              <ButtonCustom
                onClick={handleSubmit}
                text="vérification"
                data-testid="Contact-validate-button"
              />
              <IconButton
                onClick={regenerateCaptcha}
                disabled={refreshing}
                aria-label="refresh captcha"
                data-testid="Contact-refresh-button"
                sx={{
                  color: "var(--primary-color)",
                  cursor: refreshing ? "not-allowed" : "pointer",
                  m: 2,
                  opacity: refreshing ? 0.5 : 1,
                  "&:hover": { color: "var(--secondary-color)" },
                  pointerEvents: refreshing ? "none" : "auto",
                }}
              >
                <RefreshIcon />
              </IconButton>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CaptchaModal;