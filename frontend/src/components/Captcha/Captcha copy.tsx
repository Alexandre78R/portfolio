import React, { useState, useEffect } from 'react';
import ButtonCustom from '../Button/Button';

interface Image {
  src: string;
  type: 'cat' | 'dog' | 'car';
}

const Captcha: React.FC<{ onValidate: (isValid: boolean) => void }> = ({ onValidate }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [challengeType, setChallengeType] = useState<'cat' | 'dog' | 'car'>('cat');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const getRandomChallenge = (): 'cat' | 'dog' | 'car' => {
    const challenges = ['cat', 'dog', 'car'] as const;
    return challenges[Math.floor(Math.random() * challenges.length)];
  };

  const generateImages = (): Image[] => {
    const allImages: Image[] = [
      { src: '/img/captcha-images/cat1.jpg', type: 'cat' },
      { src: '/img/captcha-images/cat2.jpg', type: 'cat' },
      { src: '/img/captcha-images/cat3.jpg', type: 'cat' },
      { src: '/img/captcha-images/dog1.jpg', type: 'dog' },
      { src: '/img/captcha-images/dog2.jpg', type: 'dog' },
      { src: '/img/captcha-images/dog3.jpg', type: 'dog' },
      { src: '/img/captcha-images/car1.jpg', type: 'car' },
      { src: '/img/captcha-images/car2.jpg', type: 'car' },
      { src: '/img/captcha-images/car3.jpg', type: 'car' },
      { src: '/img/captcha-images/car4.jpg', type: 'car' },
      { src: '/img/captcha-images/car5.jpg', type: 'car' },
      { src: '/img/captcha-images/car6.jpg', type: 'car' },
      { src: '/img/captcha-images/car7.jpg', type: 'car' },
      { src: '/img/captcha-images/car8.jpg', type: 'car' },
    ];
    const getRandomImagesByType = (type: 'cat' | 'dog' | 'car') => {
        return allImages
        .filter(image => image.type === type)
        .sort(() => Math.random() - 0.5) 
        .slice(0, 2);
    };

    const selectedImages = [
        ...getRandomImagesByType('cat'),
        ...getRandomImagesByType('dog'),
        ...getRandomImagesByType('car')
    ];

    return selectedImages.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setImages(generateImages());
    setChallengeType(getRandomChallenge());
  }, []);

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
    console.log("isCorrect",isCorrect)
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
      <p className="text-text">Sélectionne toutes les images de {challengeType === 'cat' ? 'chats' : challengeType === 'dog' ? 'chiens' : 'voitures'} {`pour prouver que tu n'es pas un robot :`}</p>
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
              src={image.src}
              alt={`captcha-img-${index}`}
              style={{ width: '100px', height: '100px' }}
            />
          </div>
        ))}
      </div>
      {/* <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Vérifier</button> */}
      <ButtonCustom
        onClick={handleSubmit}
        text="vérification"
      />
      {isValid === false && <p style={{ color: 'red' }}>CAPTCHA incorrect. Réessaie !</p>}
      {isValid === true && <p style={{ color: 'green' }}>CAPTCHA correct !</p>}
    </div>
  );
};

export default Captcha;