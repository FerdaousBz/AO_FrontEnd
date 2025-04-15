import React, { useEffect, useState } from "react";
import { Button, Heading, Input, Label, Title } from "@/components/atoms";

import styles from './profile.module.scss';
import { gray } from "@/styles/colors";
import SideBar from "@/components/molecules/sidebar/sidebar";
import { useUi } from "@/contexts/ui.context";
import clsx from "clsx";
import Card from "@/components/molecules/card/card-layout";
import Dropzone from "@/components/molecules/card-profile/card-profile";
import { CardProfil } from "@/components/molecules/card-profile";
import { changePassword, getUserDetails, updateUserProfile } from "@/service/auth";
import handleToast from "@/utils/toast-util";
import useAuth from "@/components/hooks/use-auth";
import { ERROR, IDLE, SUCCESS } from "@/utils/consts";


export default function ProfileScreen() {
  const { sidebaropen } = useUi();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [status, setStatus] = useState(IDLE);
  const [editedDetails, setEditedDetails] = useState({ username: '', password: '' });
  const {profileImageUrl, user} = useAuth();
  //const profileImageUrlToUse = profileImageUrl || user?.profileImageUrl;  
  const { accessToken, email } = useAuth();

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const userData = await getUserDetails(email);

  //       setUserDetails(userData);
  //       setStatus(SUCCESS);
  //     } catch (error) {
  //       console.error('Error fetching user details:', error);
  //       setStatus(ERROR);
  //     }
  //   };

  //   fetchUserDetails();
  // }, [email]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails(email);
  
        // Extract specific details from `included`
        const includedData = response.included || [];
        const resource = includedData.find(item => item.type === 'resource');
        const agency = includedData.find(item => item.type === 'agency');
        const pole = includedData.find(item => item.type === 'pole');
  
        const userDetailsMapped = {
          title: response.title || '',
          agencyName: agency?.attributes.name || '',
          mainManager: `${resource?.attributes.firstName || ''} ${resource?.attributes.lastName || ''}`.trim(),
          poleName: pole?.attributes.name || '',
          username: response.username,
          email: response.email,
          thumbnail: response.thumbnail,
       
        };
  
        setUserDetails(userDetailsMapped);
        setStatus(SUCCESS);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setStatus(ERROR);
      }
    };
  
    fetchUserDetails();
  }, [email]);
  
  return (
  <div className={styles.form}>
    <SideBar />
    <div className={clsx(styles.mainContent, sidebaropen ? styles.mainContentWithSidebarOpen : styles.mainContentWithSidebarClosed)}>
      <div className={styles.heading}>
        <Heading as="h2" bold color={gray}>
          Manage Profile 
        </Heading>
      </div>
      <div className={styles.cardsWrapper}>
        <div className={styles.cardContainer}>
          <Card
            header={<Label className={styles.label_style}>Profile Details</Label>}
            body={
              <div>
              <CardProfil
                  className={styles.form__card}
                  imgUrl={userDetails?.thumbnail}// Use profileImageUrl from userDetails
                  // onUpdate={handleImageChange} // Pass handleImageChange to CardProfil
                  />
                    <div className={styles.details}>
                      <p>
                        <Label>Title: </Label> {userDetails?.title || ''}
                      </p>
                      <p>
                        <Label>Main Manager: </Label> {userDetails?.mainManager || ''}
                      </p>
                      <p>
                        <Label>Pole: </Label> {userDetails?.poleName || ''}
                      </p>
                      <p>
                        <Label>Agency: </Label> {userDetails?.agencyName || ''}
                      </p>
                    </div>
                <div className={styles.emailInput}>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={userDetails?.username} 
                  readOnly
                  style={{ color: 'gray', backgroundColor: '#f5f5f5' }} // Gray color
                />
                <Label>Email</Label>
                <Input
                  type="text"
                  value={userDetails?.email}
                  readOnly
                  style={{ color: 'gray', backgroundColor: '#f5f5f5' }} // Gray color
                />

                </div>
              </div>
            }
            footer={
              <div className={styles.footerButtons}>
                <Button>Cancel</Button>
                  <Button >Save Changes</Button>
              </div>
            }
            headerClass={styles.profileCardHeader}
            bodyClass={styles.profileCardBody}
          />
        </div>
        <div className={styles.cardContainer_Pass}>
          <Card
            header={<Label className={styles.label_style}>Update Password</Label>}
            body={
              <div className={styles.cardBody}>
                <div className={styles.passInput}>
                {/* <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  placeholder="Entre Password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                /> */}
                <Label>New Password</Label>
                <Input
                  type="password"
                  // value={newPassword}
                  placeholder="Entre New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  // value={confirmPassword}
                  placeholder="Entre New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                  {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                  {successMessage && <div className={styles.success}>{successMessage}</div>}
                 </div>
              </div>
            }
            footer={
              <div className={styles.footerButtons}>
                <Button >Update Password</Button>
              </div>
            }
            headerClass={styles.profileCardHeader}
            bodyClass={styles.profileCardBody}
          />
        </div>
      </div>
    </div>
  </div>
);

}