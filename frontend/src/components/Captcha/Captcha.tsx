/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import ButtonCustom from '../Button/Button';
import {
  useGenerateCaptchaQuery,
  CaptchaImage
} from '@/types/graphql';
import { CircularProgress } from '@mui/material';

const Captcha: React.FC<{ onValidate: (isValid: boolean) => void }> = ({ onValidate }) => {
  const [images, setImages] = useState<CaptchaImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [challengeType, setChallengeType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const generateCaptcha = useGenerateCaptchaQuery();

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
    console.log("ddckdccd")
    const correctIndices = images
      .map((img, idx) => img.type === challengeType ? idx : -1)
      .filter(idx => idx !== -1);

    // Validate that the selectedIndices are correct
    const isCorrect = correctIndices.length === selectedImages.length && 
    selectedImages.every(index => correctIndices.includes(index));
    console.log("isCorrect", isCorrect)
    // try {
    //   const { data } = await validateCaptcha({
    //     variables: { selectedIndices: selectedImages, challengeType },
    //   });

    //   const isCorrect = data.validateCaptcha;
    //   setIsValid(isCorrect);
    //   onValidate(isCorrect);
    // } catch (error) {
    //   console.error("Error validating captcha", error);
    //   setIsValid(false);
    // }
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
          {isValid === false && <p style={{ color: 'red' }}>CAPTCHA incorrect. Réessaie !</p>}
          {isValid === true && <p style={{ color: 'green' }}>CAPTCHA correct !</p>}
        </>
      )}
    </div>
  );
};

export default Captcha;