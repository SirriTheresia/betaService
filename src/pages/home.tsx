import React, { useState } from 'react';
import { IonContent, IonButton, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './HomePage.css';
const HomePage: React.FC = () => {
  const [step, setStep] = useState(0);
  const history = useHistory();

  // Welcome messages
  const messages = [
    "Welcome to BetaService application!",
    "Here you can hire services or advertise your skills.",
    "Let's get started! Please create an account to continue."
  ];

  
  const handleNext = () => {
    if (step < messages.length - 1) {
      setStep(step + 1);
    } else {
      history.push('/signup'); 
    }
  };

  return (
    <IonPage>
      <IonContent className="home-content">
        <div className="background-video-container">
          <h2 className='header-text'>{messages[step]}</h2>
          <video className="background-video" autoPlay loop controls muted width={'50px'} height={'10px'}>
            <source src="public/images/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="message-container">
          <IonButton className="next-button" onClick={handleNext}>Next</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
