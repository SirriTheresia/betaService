import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./fireBase";

const SkillDetailsPage: React.FC = () => {
  const { skillName } = useParams<{ skillName: string }>(); // Get the skill name from the URL
  const [profiles, setProfiles] = useState<any[]>([]); // State to store the profiles

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Create a reference to the 'profiles' collection
        const profilesRef = collection(db, "profiles");

        // Create a query to filter profiles by the selected skill name
        const q = query(profilesRef, where("skill", "==", skillName));

        // Execute the query and get the documents
        const snapshot = await getDocs(q);

        // Map over the snapshot to create an array of profiles
        const profilesData = snapshot.docs.map((doc) => doc.data());
        setProfiles(profilesData); // Update the state with fetched profiles
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [skillName]); // Refetch when the skill name changes

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{skillName} Profiles</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {profiles.length === 0 ? (
          <p>No profiles found for this skill.</p>
        ) : (
          <IonList>
            {profiles.map((profile, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>{profile.name}</h2>
                  <p>{profile.description}</p>
                  {/* Add any other profile fields you want to display */}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SkillDetailsPage;
