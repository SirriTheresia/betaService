import React from "react";
import { IonPage, IonContent, IonButton, IonAlert, IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import { getAuth, signOut, deleteUser } from "firebase/auth";

const SettingsPage: React.FC = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/pages/home"; 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteUser(user);
        window.location.href = "pages/home"; 
      } catch (error) {
        console.error("Account deletion failed:", error);
      }
    }
  };

  const buttonStyle = {
    width: "50%",
    margin: "0 auto", 
  };

  return (
    <IonPage>
      {/* Corrected IonHeader */}
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
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Settings</h2>

        <IonButton style={buttonStyle} color="primary" expand="full" onClick={handleLogout}>
          Logout
        </IonButton>

        <IonAlert
          trigger="delete-account"
          header="Delete Account"
          message="Are you sure? This action is irreversible."
          buttons={[
            { text: "Cancel", role: "cancel" },
            { text: "Delete", handler: handleDeleteAccount },
          ]}
        />

        <IonButton id="delete-account" style={buttonStyle} color="danger" expand="full">
          Delete Account
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
