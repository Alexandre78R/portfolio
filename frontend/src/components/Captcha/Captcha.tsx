import React, { useState, useEffect } from 'react';
import ButtonCustom from '../Button/Button';
import {
  useGenerateCaptchaQuery,
  CaptchaImage,
  useValidateCaptchaMutation,
  useClearCaptchaMutation,
} from '@/types/graphql';
import { Card, CardActionArea, CardMedia, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomToast from '../ToastCustom/CustomToast';
import { useLang } from '@/context/Lang/LangContext';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadingCustom from '../Loading/LoadingCustom';

const Captcha: React.FC<{ onValidate: (isValid: boolean) => void }> = ({ onValidate }) => {
  const { showAlert } = CustomToast();
  const { translations } = useLang();

  const [images, setImages] = useState<CaptchaImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [challengeType, setChallengeType] = useState<string>('');
  const [idCaptcha, setIdCaptcha] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // État pour gérer le rafraîchissement

  const generateCaptcha = useGenerateCaptchaQuery();
  const [validateCaptcha] = useValidateCaptchaMutation();
  const [clearCaptcha] = useClearCaptchaMutation();

  const getErrorMessage = (error: Error): string => {
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
          img.onerror = () => resolve(); // Assurez-vous de résoudre même si une image ne peut pas être chargée
        });
      })
    );
  };

  useEffect(() => {
    if (generateCaptcha?.data && loading) {
      const imageUrls = generateCaptcha.data?.generateCaptcha.images.map(img => img.url);
      setLoading(true);
      preloadImages(imageUrls).then(() => {
        setImages(generateCaptcha.data?.generateCaptcha.images || []);
        setChallengeType(generateCaptcha.data?.generateCaptcha.challengeType || '');
        setIdCaptcha(generateCaptcha.data?.generateCaptcha?.id || '');
        setLoading(false);
      });
    }
  }, [generateCaptcha, loading]);

  const regenerateCaptcha = () => {
    if (refreshing) return; // Ignore les clics si déjà en train de rafraîchir

    setRefreshing(true); // Début du rafraîchissement
    setLoading(true);
    clearCaptcha({
      variables: { idCaptcha },
      onCompleted: () => {
        generateCaptcha.refetch()
          .then(response => {
            if (response.data) {
              const imageUrls = response.data.generateCaptcha.images.map(img => img.url);
              preloadImages(imageUrls).then(() => {
                setImages(response.data.generateCaptcha.images);
                setChallengeType(response.data.generateCaptcha.challengeType);
                setIdCaptcha(response.data.generateCaptcha.id);
                setSelectedImages([]);
                setLoading(false);
                setRefreshing(false); // Fin du rafraîchissement
              });
            }
          })
          .catch(error => {
            console.log("Error during captcha regeneration:", error);
            showAlert("error", getErrorMessage(error));
            setLoading(false);
            setRefreshing(false); // Fin du rafraîchissement même en cas d'erreur
          });
      },
      onError: error => {
        console.log(error);
        showAlert("error", getErrorMessage(error));
        setLoading(false);
        setRefreshing(false); // Fin du rafraîchissement en cas d'erreur
      },
    });
  };

  const handleImageClick = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = async () => {
    validateCaptcha({
      variables: {
        selectedIndices: selectedImages,
        challengeType,
        idCaptcha,
      },
      onCompleted(data) {
        showAlert(data?.validateCaptcha.isValid ? "success" : "error", data?.validateCaptcha.isValid ? "yes" : "no");
      },
      onError(error) {
        console.log(error);
        showAlert("error", getErrorMessage(error));
      },
    });
  };

  return (
    <div>
      {loading ? (
        <LoadingCustom />
      ) : (
        <>
          <div className='m-4'>
            <p className="text-text">
              Sélectionne toutes les images de {challengeType === 'cat' ? 'chats' : challengeType === 'dog' ? 'chiens' : 'voitures'} {`pour prouver que tu n'es pas un robot :`}
            </p>
          </div>
          <div className="flex justify-around flex-wrap">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Card
                  onClick={() => handleImageClick(index)}
                  className={`m-2 cursor-pointer`}
                  style={{
                    border: selectedImages.includes(index) ? '4px solid var(--success-color)' : '4px solid var(--text-color)',
                  }}
                >
                  <CardActionArea>
                    {
                      refreshing ?
                        <LoadingCustom />
                      :                      
                        <CardMedia
                          component="img"
                          alt={`captcha-img-${index}`}
                          image={image.url}
                          onError={() => setImages(prev => prev.map((img, i) => i === index ? { ...img, url: '' } : img))}
                          style={{ width: '100px', height: '100px' }}
                        />
                    }
                  </CardActionArea>
                </Card>
                {selectedImages.includes(index) && (
                  <IconButton
                    className="absolute top-0 right-0"
                    style={{ width: '10px', height: '10px', color: 'green', backgroundColor: 'white', transform: 'scale(1)', opacity: 1 }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <ButtonCustom
              onClick={handleSubmit}
              text="vérification"
            />
            <RefreshIcon
              onClick={regenerateCaptcha}
              className={`text-text cursor-pointer m-2 hover:text-secondary ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`} // Désactiver le bouton lorsqu'on est en train de rafraîchir
              style={{ pointerEvents: refreshing ? 'none' : 'auto' }} // Désactiver les événements de clic si en train de rafraîchir
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Captcha;