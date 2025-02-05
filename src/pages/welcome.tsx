import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonItem,
  IonIcon,
  IonText,
  IonButton,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import Menu from "../components/Menu";
import { useHistory } from "react-router-dom";

const backgroundImages = [
  "./images/carpenter.jpg",
  "./images/mechanic.jpg",
  "./images/painter.jpg",
];

const skills = [
  { name: "Plumber", image: "./images/plumbering.jfif" },
  { name: "Electrician", image: "./images/electrictian.jpg" },
  { name: "Carpenter", image: "./images/carpenter.jpg" },
  { name: "Painter", image: "./images/painter.jpg" },
  { name: "Mechanic", image: "./images/mechanic.jpg" },
  { name: "Chef", image: "./images/chef.webp" },
  { name: "Baker", image: "./images/baker.webp" },
  { name: "Hairdresser", image: "./images/hair.webp" },
];

const WelcomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBackground, setCurrentBackground] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(backgroundImages[currentBackground]);

      setCurrentBackground(
        (prevBackground) => (prevBackground + 1) % backgroundImages.length
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (event: CustomEvent) => {
    setSearchTerm(event.detail.value.toLowerCase());
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm)
  );

  const goToSkillDetails = (skillName: string) => {
    history.push(`/providers/${skillName}`);
  };

  return (
    <IonPage>
      <Menu/>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <img
              src="./images/logo.png"
              alt="Logo"
              style={{ height: "40px", marginRight: "8px" }}
            />
            Welcome to BetaService
          </IonTitle>
          {/* <IonButton
            slot="end"
            fill="clear"
            onClick={() => history.push("/signup")}
          >
            Sign Up
          </IonButton> */}
        </IonToolbar>
      </IonHeader>

      <IonContent
        style={{
          backgroundImage: `url(${backgroundImages[currentBackground]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
          height: "100vh",
        }}
      >
        <IonItem>
          <IonIcon icon={searchOutline} slot="start" />
          <IonInput
            placeholder="Search for a skill"
            onIonInput={handleSearch}
          />
        </IonItem>

        <IonGrid>
          <IonRow>
            {filteredSkills.map((skill) => (
              <IonCol key={skill.name} size="3" className="ion-text-center">
                <img
                  src={skill.image}
                  alt={skill.name}
                  style={{ width: "200px", height: "200px" }}
                />
                <IonText
                  color="primary"
                  onClick={() => goToSkillDetails(skill.name)}
                  style={{
                    cursor: "pointer",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  {skill.name}
                </IonText>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;
