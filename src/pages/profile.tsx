import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "./fireBase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { useHistory } from "react-router-dom";

interface MediaItem {
  src: string;
  likes: number;
  dislikes: number;
  comments: string[];
}

const ProfilePage: React.FC = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([]);
  const [description, setDescription] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [name, setName] = useState("");
  const history = useHistory();

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedMedia((prevMedia) => [
            ...prevMedia,
            {
              src: reader.result as string,
              likes: 0,
              dislikes: 0,
              comments: [],
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLike = (index: number) => {
    setUploadedMedia((prevMedia) =>
      prevMedia.map((media, i) =>
        i === index ? { ...media, likes: media.likes + 1 } : media
      )
    );
  };

  const handleDislike = (index: number) => {
    setUploadedMedia((prevMedia) =>
      prevMedia.map((media, i) =>
        i === index ? { ...media, dislikes: media.dislikes + 1 } : media
      )
    );
  };

  const handleAddComment = (index: number, comment: string) => {
    setUploadedMedia((prevMedia) =>
      prevMedia.map((media, i) =>
        i === index
          ? { ...media, comments: [...media.comments, comment] }
          : media
      )
    );
  };

  const handleDeleteMedia = (index: number) => {
    setUploadedMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  const createProfile = async () => {
    try {
      if (!name || !selectedSkill || !description) {
        alert("Please complete all required fields before proceeding.");
        return;
      }

      let profilePictureUrl = null;
      if (profilePicture) {
        const profilePicRef = ref(
          storage,
          `profile_pictures/${name}-profile.jpg`
        );
        await uploadString(profilePicRef, profilePicture, "data_url");
        profilePictureUrl = await getDownloadURL(profilePicRef);
      }

      const mediaUrls = await Promise.all(
        uploadedMedia.map(async (media, index) => {
          const mediaRef = ref(storage, `media/${name}-media-${index}`);
          await uploadString(mediaRef, media.src, "data_url");
          const url = await getDownloadURL(mediaRef);
          return { ...media, src: url };
        })
      );

      await addDoc(collection(db, "profiles"), {
        name,
        description,
        skill: selectedSkill,
        profilePicture: profilePictureUrl,
        media: mediaUrls,
        isProvider: true,
      });

      alert("Profile created and saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  const redirectToSignup = () => {
    history.push("/signup");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile Page</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          color="secondary"
          onClick={redirectToSignup}
          style={{
            marginBottom: "20px",
            position: "fixed",
            right: "30px",
            backgroundColor: "#FFFFFF",
            color: "blue",
            zIndex: 10,
          }}
        >
          Not Registered? Sign Up Here
        </IonButton>

        <IonItem lines="none">
          <IonLabel position="stacked">Profile Picture</IonLabel>
          <div
            onClick={() =>
              document.getElementById("profile-picture-input")?.click()
            }
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              overflow: "hidden",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#e0e0e0",
                }}
              />
            )}
          </div>
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            style={{ display: "none" }}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Name</IonLabel>
          <IonInput
            value={name}
            placeholder="Enter your name"
            onIonChange={(e) => setName(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">About Me</IonLabel>
          <IonTextarea
            value={description}
            onIonChange={(e) => setDescription(e.detail.value!)}
            placeholder="Write a brief description about yourself"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Select Your Skill</IonLabel>
          <IonSelect
            value={selectedSkill}
            onIonChange={(e) => setSelectedSkill(e.detail.value)}
          >
            <IonSelectOption value="Plumber">Plumber</IonSelectOption>
            <IonSelectOption value="Electrician">Electrician</IonSelectOption>
            <IonSelectOption value="Mechanic">Mechanic</IonSelectOption>
            <IonSelectOption value="Painter">Painter</IonSelectOption>
            <IonSelectOption value="Carpenter">Carpenter</IonSelectOption>
            <IonSelectOption value="Gardener">Gardener</IonSelectOption>
            <IonSelectOption value="Cleaner">Cleaner</IonSelectOption>
            <IonSelectOption value="Chef">Chef</IonSelectOption>
            <IonSelectOption value="Tutor">Tutor</IonSelectOption>
            <IonSelectOption value="Driver">Driver</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Media to Advertise Skills</IonLabel>
          <IonButton
            expand="block"
            onClick={() =>
              document.getElementById("media-upload-input")?.click()
            }
          >
            Upload Media
          </IonButton>
          <input
            id="media-upload-input"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaUpload}
            style={{ display: "none" }}
          />
        </IonItem>

        <div style={{ marginTop: "20px" }}>
          {uploadedMedia.map((media, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              {media.src.startsWith("data:image") ? (
                <img
                  src={media.src}
                  alt={`Media ${index}`}
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <video controls style={{ width: "100%", height: "auto" }}>
                  <source src={media.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <div style={{ marginTop: "10px" }}>
                <IonButton onClick={() => handleLike(index)}>Like</IonButton>
                <IonButton onClick={() => handleDislike(index)}>
                  Dislike
                </IonButton>
                <IonButton
                  color="danger"
                  onClick={() => handleDeleteMedia(index)}
                >
                  Delete
                </IonButton>
                <IonInput
                  placeholder="Add a comment"
                  onIonChange={(e) => handleAddComment(index, e.detail.value!)}
                  style={{ marginTop: "10px" }}
                />
              </div>
            </div>
          ))}
        </div>

        <IonButton
          expand="block"
          color="primary"
          onClick={createProfile}
          style={{
            position: "fixed",
            bottom: "50px",
            right: "30px",
            backgroundColor: "#FFFFFF",
            color: "blue",
            zIndex: 10,
          }}
        >
          Create Profile
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
