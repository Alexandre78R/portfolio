import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  useGenerateCaptchaQuery,
  CaptchaImage,
  useValidateCaptchaMutation,
  useClearCaptchaMutation,
} from "@/types/graphql";
import { useLang } from "@/context/Lang/LangContext";
import CustomToast from "../ToastCustom/CustomToast";
import ButtonCustom from "../Button/Button";
import LoadingCustom from "../Loading/LoadingCustom";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
  bgcolor: "var(--body-color)",
  borderRadius: "16px",
};

type Props = {
  open: boolean;
  onClose: () => void;
  onValidate: (isValid: boolean) => void;
  authorizeGenerateCaptcha: boolean;
  setAuthorizeGenerateCaptcha: React.Dispatch<React.SetStateAction<boolean>>;
};

const CaptchaModal: React.FC<Props> = ({
  open,
  onClose,
  onValidate,
  authorizeGenerateCaptcha,
  setAuthorizeGenerateCaptcha,
}) => {
  const { showAlert } = CustomToast();
  const { translations } = useLang();

  const [images, setImages] = useState<CaptchaImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [challengeType, setChallengeType] = useState<string>("");
  const [idCaptcha, setIdCaptcha] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [checkrefresh, setCheckRefresh] = useState<boolean>(false);
  const generateCaptcha = useGenerateCaptchaQuery();
  const [validateCaptcha] = useValidateCaptchaMutation();
  const [clearCaptcha] = useClearCaptchaMutation();

  const getErrorMessage = (error: Error): string => {
    console.log("error", error);
    console.log("eorror message", error.message);
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

  const preloadImages = (imageUrls: string[]): Promise<void[]> => {
    return Promise.all(
      imageUrls.map((url) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );
  };

  useEffect(() => {
    if (open && authorizeGenerateCaptcha && !checkrefresh) {
      setLoading(true);
      setCheckRefresh(true);
      generateCaptcha
        .refetch()
        .then((response) => {
          if (response.data) {
            const imageUrls = response.data.generateCaptcha.images.map(
              (img) => img.url
            );
            preloadImages(imageUrls).then(() => {
              setImages(response.data.generateCaptcha.images);
              setChallengeType(response.data.generateCaptcha.challengeType);
              setIdCaptcha(response.data.generateCaptcha.id);
              setSelectedImages([]);
              setLoading(false);
              setAuthorizeGenerateCaptcha(false); // Assurer que CAPTCHA ne soit généré qu'une fois
            });
          }
        })
        .catch((error) => {
          showAlert("error", getErrorMessage(error));
          setLoading(false);
          setCheckRefresh(false);
          console.log("error", error);
          console.log("errror message", error.message);
        });
    }
  }, [open, authorizeGenerateCaptcha, checkrefresh]);

  const regenerateCaptcha = () => {
    if (refreshing) return;
    setCheckRefresh(true);
    setRefreshing(true);
    setLoading(true);
    setAuthorizeGenerateCaptcha(true);
    clearCaptcha({
      variables: { idCaptcha },
      onCompleted: () => {
        generateCaptcha
          .refetch()
          .then((response) => {
            if (response.data) {
              const imageUrls = response.data.generateCaptcha.images.map(
                (img) => img.url
              );
              preloadImages(imageUrls).then(() => {
                setImages(response.data.generateCaptcha.images);
                setChallengeType(response.data.generateCaptcha.challengeType);
                setIdCaptcha(response.data.generateCaptcha.id);
                setSelectedImages([]);
                setLoading(false);
                setRefreshing(false);
              });
            }
          })
          .catch((error) => {
            showAlert("error", getErrorMessage(error));
            setLoading(false);
            setRefreshing(false);
          });
      },
      onError: (error) => {
        showAlert("error", getErrorMessage(error));
        setLoading(false);
        setRefreshing(false);
      },
    });
  };

  const handleImageClick = (index: number) => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = async () => {
    const toto = {
      selectedIndices: selectedImages,
      challengeType,
      idCaptcha,
    };
    validateCaptcha({
      variables: {
        selectedIndices: selectedImages,
        challengeType,
        idCaptcha,
      },
      onCompleted(data) {
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
      onError(error) {
        showAlert("error", getErrorMessage(error));
        onValidate(false);
      },
    });
  };

  const generateCategoryName = (): string => {
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
                  {translations.messageInfoFirstCaptcha}{" "}
                  {generateCategoryName()} {translations.messageInfoLastCaptcha}
                </p>
              </div>
            </div>
            <div className="flex justify-center flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Card
                    onClick={() => handleImageClick(index)}
                    className={`m-2 cursor-pointer`}
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
                      }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center m-2">
              <ButtonCustom onClick={handleSubmit} text="vérification" />
              <IconButton
                onClick={regenerateCaptcha}
                className={`text-text cursor-pointer m-2 hover:text-secondary ${
                  refreshing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                sx={{ pointerEvents: refreshing ? "none" : "auto" }}
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
