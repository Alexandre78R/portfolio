/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import ButtonCustom from '../Button/Button';
import {
  useGenerateCaptchaQuery,
  CaptchaImage,
  useValidateCaptchaMutation
} from '@/types/graphql';
import { CircularProgress } from '@mui/material';
import CustomToast from '../ToastCustom/CustomToast';
import { useLang } from '@/context/Lang/LangContext';

const Captcha: React.FC<{ onValidate: (isValid: boolean) => void }> = ({ onValidate }) => {

  const { showAlert } = CustomToast();
  const { translations } = useLang();

  const [images, setImages] = useState<CaptchaImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [challengeType, setChallengeType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const generateCaptcha = useGenerateCaptchaQuery();
  const [validateCaptcha] = useValidateCaptchaMutation();

  useEffect(() => {
    if (generateCaptcha?.data) {
      setImages(generateCaptcha.data?.generateCaptcha.images);
      setChallengeType(generateCaptcha.data?.generateCaptcha.challengeType);
      setLoading(false);
    }
  }, [generateCaptcha]);

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
        challengeType : challengeType
      },
      onCompleted(data) {
        if (data?.validateCaptcha.isValid) {
          console.log(data?.validateCaptcha.isValid)
          showAlert("success", "yes");
        } else {
          console.log("Oncompleted")
          showAlert("error", "no");
        }
      },
      onError(error) {
        console.log(error);
        let errorMessage: string = translations.messageErrorServerOff;
        showAlert("error", errorMessage);
      },
    });
  };

  return (
    <div>
      <p className="text-text">
        Sélectionne toutes les images de {challengeType === 'cat' ? 'chats' : challengeType === 'dog' ? 'chiens' : 'voitures'} {`pour prouver que tu n'es pas un robot :`}
      </p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {images.map((image, index) => (
              <div
                key={index}
                onClick={() => handleImageClick(index)}
                style={{
                  border: selectedImages.includes(index) ? '4px solid green' : '2px solid #ccc',
                  margin: '10px',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={image.url}
                  alt={`captcha-img-${index}`}
                  style={{ width: '100px', height: '100px' }}
                />
              </div>
            ))}
          </div>
          <ButtonCustom
            onClick={handleSubmit}
            text="vérification"
          />
        </>
      )}
    </div>
  );
};

export default Captcha;