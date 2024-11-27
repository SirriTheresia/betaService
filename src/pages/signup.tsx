import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonRadioGroup,
  IonListHeader,
  IonRadio,
  IonText,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { logoGoogle } from "ionicons/icons";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./signup.css";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Provider" | "Client">("Provider");
  const [error, setError] = useState("");
  const navigate = useHistory();

  const auth = getAuth(); // Firebase Auth instance

  const handleSignup = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User created successfully:", user);
      console.log("Role:", role);

      // Clear form fields and show success message
      setUsername("");
      setEmail("");
      setPassword("");
      setError("Account created successfully. You can now log in.");

      // Optional: Navigate to welcome page
      // navigate.push("/welcome");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already in use. Please log in or use a different email."
        );
      } else {
        console.error("Signup error:", error.message);
        setError(
          error.message || "Failed to create an account. Please try again."
        );
      }
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Sign-In successful:", user);
      console.log("Role:", role);

      // Optional: Navigate to welcome page or show success message
      setError("Google Sign-In successful!");
      // navigate.push("/welcome");
    } catch (error: any) {
      console.error("Google Sign-In error:", error.message);
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
        <IonItem>
          <IonLabel position="floating">Username</IonLabel>
          <IonInput
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>
        <IonListHeader>
          <IonLabel>Register As</IonLabel>
        </IonListHeader>
        <IonRadioGroup
          value={role}
          onIonChange={(e) => setRole(e.detail.value)}
        >
          <IonItem>
            <IonLabel>Provider</IonLabel>
            <IonRadio slot="start" value="Provider" />
          </IonItem>
          <IonItem>
            <IonLabel>Client</IonLabel>
            <IonRadio slot="start" value="Client" />
          </IonItem>
        </IonRadioGroup>
        <IonButton
          style={{
            position: "fixed",
            bottom: "90px",
            right: "30px",
            zIndex: 10,
          }}
          expand="block"
          onClick={handleSignup}
        >
          Sign Up
        </IonButton>

        <IonButton
          style={{
            position: "fixed",
            bottom: "50px",
            right: "30px",
            backgroundColor: "#FFFFFF",
            color: "blue",
            zIndex: 10,
          }}
          expand="block"
          color="medium"
          onClick={handleGoogleSignup}
        >
          <IonIcon
            style={{
              color: "#4285F4",
            }}
            icon={logoGoogle}
            slot="start"
          />
          Sign Up with Google
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SignupPage;
