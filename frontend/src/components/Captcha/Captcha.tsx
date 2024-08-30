/* eslint-disable @next/next/no-img-element */
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

  const generateCaptcha = useGenerateCaptchaQuery();
  const [validateCaptcha] = useValidateCaptchaMutation();
  const [clearCaptcha] = useClearCaptchaMutation();

  useEffect(() => {
    if (generateCaptcha?.data) {
      setImages(generateCaptcha.data?.generateCaptcha.images);
      setChallengeType(generateCaptcha.data?.generateCaptcha.challengeType);
      setIdCaptcha(generateCaptcha.data?.generateCaptcha?.id);
      setLoading(false);
    }
  }, [generateCaptcha]);

  const regenerateCaptcha = () => {
    setLoading(true);
    clearCaptcha({
      variables: {
        idCaptcha :idCaptcha,
      },
      onCompleted(_) {
        generateCaptcha.refetch().then(response => {
          if (response.data) {
            setImages(response.data.generateCaptcha.images);
            setChallengeType(response.data.generateCaptcha.challengeType);
            setIdCaptcha(response.data.generateCaptcha.id);
            setSelectedImages([]);
            setLoading(false);
          }
        }).catch(error => {
          console.log("Error during captcha regeneration:", error);
          let errorMessage: string = translations.messageErrorServerOff;
          if (error.message === "Captcha not found!") {
            errorMessage = translations.messageErrorFormatEmail;
          }
          showAlert("error", errorMessage);
          setLoading(false);
        });
      },
      onError(error) {
        console.log(error);
        let errorMessage: string = translations.messageErrorServerOff;
        showAlert("error", errorMessage);
      },
    })
  };

  const handleImageClick = (index: number) => {
    if (selectedImages.includes(index)) {
      setSelectedImages(selectedImages.filter((i) => i !== index));
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };

  const handleSubmit = async () => {
    validateCaptcha({
      variables: {
        selectedIndices: selectedImages,
        challengeType : challengeType,
        idCaptcha :idCaptcha,
      },
      onCompleted(data) {
        if (data?.validateCaptcha.isValid) {
          showAlert("success", "yes");
        } else {
          showAlert("error", "no");
        }
      },
      onError(error) {
        console.log(error);
        let errorMessage: string = translations.messageErrorServerOff;
        showAlert("error", errorMessage);
        regenerateCaptcha();
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
                    <CardMedia
                      component="img"
                      alt={`captcha-img-${index}`}
                      image={image.url}
                      style={{ width: '100px', height: '100px' }}
                    />
                  </CardActionArea>
                </Card>
                {selectedImages.includes(index) && (
                  <IconButton
                    className="absolute top-0 right-0"
                    style={{  width: '10px', height: '10px', color: 'green', backgroundColor: 'white', transform: 'scale(1)', opacity: 1 }}
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
              className='text-text cursor-pointer m-2 hover:text-secondary'
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Captcha;