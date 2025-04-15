import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { Button, Heading, Input, Label } from '@/components/atoms';
import {
  Add,
  Chevron,
  Chevronb,
  Chevrond,
  Chevronl,
  Chevront,
  Company,
  Contribution,
  Download,
  GptIcon,
  IconAI,
  PptIcon,
  Reload,
  Send,
  Timer,
  UserNoProfile,
} from '@/components/atoms/icons';
import Card from '@/components/molecules/card/card-layout';
import SideBar from '@/components/molecules/sidebar/sidebar';
import { useUi } from '@/contexts/ui.context';
import { gray } from '@/styles/colors';

import styles from './soutenance.module.scss';
import { sendResumeEmailrefacot } from '@/service/sendEmail';
import Modal from '@/components/molecules/modal/modal';
import { useLocation } from 'react-router-dom';
import handleToast from '@/utils/toast-util';
import { generatePPT } from '@/service/pptService';

export default function SoutenanceScreenNew() {
  const { sidebaropen } = useUi();
  const location = useLocation();
  const [resumeInfo, setResumeInfo] = useState({
    title: '',
    description: '',
  });
  const [opportunityDetails, setOpportunityDetails] = useState({});
  const [participants, setParticipants] = useState([]);
  const [priorityProject, setPriorityProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pptVersion, setPptVersion] = useState(null);
  const [pptUrl, setPptUrl] = useState(null);
  const [pptData, setPptData] = useState(null);
  const { selectedOpportunity, opportunities } = location.state || {};
  const [additionalResourceEmails, setAdditionalResourceEmails] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [emailState, setEmailState] = useState({
    isModalOpen: false,
    email: "",
    additionalEmailInput: "",
    additionalResourceEmails: [],
    success: false,
    error: false,
    loading: false,
  });
  const [fileId, setFileId] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 900; // Longueur maximale du texte affiché avant de tronquer

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    const fetchSoutenanceData = async () => {
      if (!selectedOpportunity) {
        setError('Aucune opportunité sélectionnée.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        handleOpportunityData(selectedOpportunity);
        handleResumeData(selectedOpportunity);
        handleParticipantsData(selectedOpportunity);
        handlePriorityProjectData(selectedOpportunity);

        const document = selectedOpportunity.includedResources.find(
          (resource) => resource.type === 'document',
        );
        setFileId(document ? document.id : null);
        const summaryId = selectedOpportunity.resumeData[0]?.summary?.summary_id;
        console.log('summaryid', summaryId);

        if (summaryId) {
          await fetchPPTVersion(selectedOpportunity.pptResponse);
        }
      } catch (error) {
        setError('Erreur lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSoutenanceData();
  }, selectedOpportunity);

  const handlePPTDownload = () => {
    if (pptUrl) {
      const link = document.createElement('a');
      link.href = pptUrl;
      link.download = 'generated_ppt.pptx';
      link.click();
    } else {
      handleToast('error', 'PPT URL is not available');
    }
  };

  const handleOpportunityData = (data) => {
    console.log("data.opportunityDetails",data.opportunityDetails);
    if (data.opportunityDetails) {
      const {
        reference,
        activityAreas,
        creationDate,
        startDate,
        expertiseArea,
        type,
        updateDate,
        closingDate,
        title,
      } = data.opportunityDetails;
      setOpportunityDetails({
        reference,
        activityAreas,
        creationDate,
        startDate,
        expertiseArea,
        type,
        updateDate,
        closingDate,
        title,
      });
    }
  };
  const handleParticipantsData = (data) => {
    console.log("(data.includedResources",data.includedResources);
    if (data.includedResources) {

      const participantsList = data.includedResources
      
        .filter(({ type }) => ['resource', 'contact'].includes(type))
        .map(({ attributes: { lastName, firstName }, resourceTypeOfValue, additionalEmail, thumbnail }) => ({
          lastName,
          firstName,
          type: resourceTypeOfValue || 'N/A', // Use resourceTypeOfValue in place of type
          email: additionalEmail || 'N/A', // Use 'N/A' if the email is not available
          thumbnail,
        }));

      setParticipants(participantsList);
    }
  };

  const handlePriorityProjectData = (data) => {
    if (data.includedResources) {
      const company = data.includedResources.find(({ type }) => type === 'company');
      const agency = data.includedResources.find(({ type }) => type === 'agency');
      setPriorityProject({
        company: company ? company.attributes.name : 'N/A',
        agency: agency ? agency.attributes.name : 'N/A',
      });
    }
  };
  const handleSendEmail = async () => {
    try {
      const allEmails = [emailState.email, ...emailState.additionalResourceEmails];
  
      // Check for duplicate emails
      const uniqueEmails = new Set(allEmails);
      if (uniqueEmails.size !== allEmails.length) {
        setEmailState((prev) => ({
          ...prev,
          error: "Duplicate email addresses are not allowed.",
          success: '', // Clear success message
        }));
        return; // Stop processing if there are duplicates
      }
  
      // Clear error and success messages, and show loading state
      setEmailState((prev) => ({
        ...prev,
        loading: true,
        error: '', // Clear error message
        success: '', // Clear success message
      }));
  
      console.log("Sending email to:", allEmails);
  
      // Send email via API
      const response = await sendResumeEmailrefacot(
        emailState.email,
        fileId,
        emailState.additionalResourceEmails
      );
  
      console.log("Response:", response);
  
      // If successful, clear additional emails and set success message
      setEmailState((prev) => ({
        ...prev,
        additionalResourceEmails: [],
        success: "Email sent successfully!",
        error: '', // Clear any error message
        loading: false, // End loading state
      }));
    } catch (error) {
      console.error("Error sending email:", error);
  
      let errorMessage = error.response?.data;
  
          // Handle invalid emails and other errors
          if (error.response) {
            const invalidEmails = error.response.data?.invalidEmails;
            if (invalidEmails && invalidEmails.length > 0) {
              // If invalid emails are present, set a specific error message
              errorMessage = `The following email(s) do not exist in BoondManager: ${invalidEmails.join(", ")}. Please update or remove them.`;
            } else if (error.response.data?.message) {
              // Fallback to back-end message if no invalid emails
              errorMessage = error.response.data.message;
            }
          }
  
      // Set the error state with the message
      setEmailState((prev) => ({
        ...prev,
        error: errorMessage,
        success: '', // Clear success message
        loading: false, // End loading state
      }));
    }
  };

  
  const handleAddAdditionalEmail = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      const email = emailState.additionalEmailInput.trim();
  
      if (!email) return;
  
      // Check domain validity
      if (!email.endsWith('@jems-group.com')) {
        setEmailState((prevState) => ({
          ...prevState,
          additionalEmailInput: '', // Clear the invalid input
          error: "Invalid email domain. The domain should end with @jems-group.com.",
          success: '', // Clear success message
        }));
        return;
      }
  
      // Prevent adding the primary email or duplicates
      if (email === emailState.email) {
        handleToast("info", "This is the primary email. It cannot be added again.");
        return;
      }
  
      if (emailState.additionalResourceEmails.includes(email)) {
        handleToast("info", "This email has already been added.");
        return;
      }
  
      // Add valid email and clear error
      setEmailState((prevState) => ({
        ...prevState,
        additionalResourceEmails: [...prevState.additionalResourceEmails, email],
        additionalEmailInput: '', // Clear input zone
        error: '', // Clear error message
        success: '', // Ensure no conflicting messages
      }));
    }
  };
  
  const handleRemoveAdditionalEmail = (email) => {
    setEmailState((prev) => ({
      ...prev,
      additionalResourceEmails: prev.additionalResourceEmails.filter((e) => e !== email),
    }));
  };

  

  
  const handleAddAdditionalEmailFromParticipant = (email) => {
    if (!emailState.additionalResourceEmails.includes(email)) {
      setEmailState((prev) => ({
        ...prev,
        additionalResourceEmails: [...prev.additionalResourceEmails, email],
      }));
    } else {
      handleToast("info", "This email has already been added.");
    }
  };
  
  const toggleModal = () =>
    setEmailState((prevState) => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen,
      error: '', // Clear error messages when closing modal
      success: '', // Clear success messages when closing modal
      additionalEmailInput: '', // Clear input zone
      additionalResourceEmails: [], // Reset additional emails
    }));
  

  const handleResumeData = (data) => {
    if (data.resumeData && data.resumeData[0]?.summary) {
      const { description, title } = data.resumeData[0].summary;
      setResumeInfo({
        title: title || 'No title found for the summary',
        description: description
          ? description.replace(/\*\*/g, '\n')
          : 'Summary is being generated...',
      });
    } else {
      setResumeInfo({
        title: '',
        description: 'No resume data found.',
      });
    }
  };

  const fetchPPTVersion = async (pptResponse) => {
    try {
      console.log('pptResponse', pptResponse);
      console.log('version', pptResponse.data.version);
      if (pptResponse && pptResponse.status === 'SUCCESS') {
        setPptVersion(pptResponse.data.version);
        setPptData(pptResponse.data);
        const pptBlob = base64ToBlob(
          pptResponse.data.pptContent,
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        );
        const url = URL.createObjectURL(pptBlob);
        setPptUrl(url); // Store URL for downloading the PPT

      } else {
        const newPptResponse = await generatePPT({ fileId: fileId });
        if (newPptResponse && newPptResponse.status === 'SUCCESS') {
          setPptVersion(newPptResponse.data.version);
          setPptData(newPptResponse.data);
          const pptBlob = base64ToBlob(
            newPptResponse.data.pptContent,
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          );
          const url = URL.createObjectURL(pptBlob);
          setPptUrl(url); // Store URL for downloading the newly generated PPT
          handleToast('success', 'PPT is Ready to download ');
        } else {
          handleToast('error', 'Failed to generate PPT');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const base64ToBlob = (base64Data, contentType) => {
    const byteCharacters = atob(base64Data); // Decode base64
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  return (
    <div className={styles.container}>
      <SideBar />
      <div
        className={clsx(
          styles.mainContent,
          sidebaropen ? styles.mainContentWithSidebarOpen : styles.mainContentWithSidebarClosed,
        )}
      >
        <div className={styles.heading}>
          <Heading as={'h4'} bold color="gray">
            {opportunityDetails.title || 'Soutenance Details'}
          </Heading>
          <Button className={styles.button} variant="Outline">
            <label className={styles.label}> Chatbot </label>
            <GptIcon className={styles.aiicon} />
          </Button>
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.card_resume}>
            <Card
              header={
                <div className={styles.cardHeader}>
                 <Label className={styles.label_style}>{resumeInfo.title}</Label>
                </div>
            }
              body={
                <div className={styles.cardBody}>
                  <p>
                    {isExpanded
                      ? resumeInfo.description
                      : `${resumeInfo.description.slice(0, maxLength)}...`}
                  </p>
                  {resumeInfo.description.length > maxLength && (
                      <Button onClick={handleToggle} variant='noOutline' className={styles.buttonSeeMore} >
                        {isExpanded ? (
                          <>
                            Voir moins
                            <Chevrond className={styles.chevronOpened} />
                          </>
                        ) : (
                          <>
                            Voir plus
                            <Chevronb className={styles.chevronClosed } />
                          </>
                        )}
                      </Button>
                    )}
                </div>
              }
              footer={
                <div>
                  <Button
                    className={styles.button_item_op}
                    variant="Outline"
                    onClick={toggleModal}
                    disabled={emailState.loading}
                  >
                    Send to Dop
                    <Send className={styles.send} />
                  </Button>
                </div>
              }
            />
        {emailState.isModalOpen && (
          <Modal isOpen={emailState.isModalOpen} onClose={toggleModal}>
            <h4 className={styles.participantsTitle}>Email</h4>
            <div >
            <input
                type="email"
                value={emailState.additionalEmailInput || ''}
                 onChange={(e) =>
                  setEmailState((prev) => ({
                    ...prev,
                    //email: e.target.value,
                    additionalEmailInput: e.target.value,
                  }))
                }
                placeholder="Add additional emails (Press Enter)"
                onKeyDown={handleAddAdditionalEmail}
                className={styles.input__emailInput}
              />
                <Button
                  className={styles.send_email}
                  variant="Outline"
                  onClick={handleSendEmail}
                  disabled={emailState.loading}
                >
                  {emailState.loading ? 'Sending...' : 'Send Email'}
                </Button>
            </div>


            {/* Display Added Emails */}
            <div className={styles.additionalEmailsContainer}>
              {emailState.additionalResourceEmails.map((email, index) => (
                <div key={index} className={styles.emailTag}>
                  {email}
                  <span
                    className={styles.removeEmail}
                    onClick={() => handleRemoveAdditionalEmail(email)}
                  >
                    &times;
                  </span>
                </div>
              ))}
            </div>

      

            {/* Participants */}
            {participants && participants.length > 0 && (
              <div className={styles.participantsContainer}>
                <h4 className={styles.participantsTitle}>Members</h4>
                <ul className={styles.participantList}>
                  {participants.map(({ firstName, lastName, email, type, thumbnail }, index) => (
                    <li
                      key={index}
                      className={styles.participantItem}
                      onClick={() => handleAddAdditionalEmailFromParticipant(email)}
                    >
                      <div className={styles.participantLabel}>
                        <div className={styles.nameWithAvatar}>
                        {thumbnail ? (
                        <img
                           src={`data:image/jpeg;base64,${thumbnail}`}
                          alt="profile"
                          className={styles.avatarIcon}
                        />
                      ) : (
                        <UserNoProfile
                          color="#8686865c"
                          alt="No Profile"
                          className={styles.avatarIcon}
                        />
                      )}
                          <span className={styles.participantName}>
                            {firstName} {lastName}
                          </span>
                        </div>
                        <div className={styles.participantType}>Email: {email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success/Error Messages */}
            {emailState.success && (
              <p className={styles.successMessage}>{emailState.success}</p>
            )}
            {emailState.error && <p className={styles.errorMessage}>{emailState.error}</p>}
          </Modal>
        )}

          </div>
          <div className={styles.card_participant}>
            <Card
              header={
                  <div className={styles.cardHeader}>
                    <Label className={styles.label_style}> Participants</Label>
                    {/* <Label className={clsx(styles.label_seeAll,styles.download)}>See All</Label> */}
                    {/* <span className={clsx(styles.seeAll,styles.headerRight)}>See all </span> */}
                    <Chevronb className={styles.chevronOpened}/>
                 
                </div>
              } 
              body={
                <div>
                  <ul className={styles.list_participant}>
                    {participants.map(({ firstName, lastName, type, thumbnail }, index) => (
                      <li key={index}>
                        <div className={styles.participLable}>
                          {/* Name and Avatar in a flex container */}
                          <div className={styles.nameWithAvatar}>
                          {thumbnail ? (
                              <img
                                src={`data:image/jpeg;base64,${thumbnail}`}
                                alt="profile"
                                className={styles.avatarParticipant}
                              />
                            ) : (
                              <UserNoProfile
                              color="#8686865c"
                              alt="No Profile"
                              className={styles.avatar_icon}
                            />
                            )}
                        
                            <span>
                              {firstName} {lastName}
                            </span>
                          </div>

                          {/* Type below the Name */}
                          <div className={styles.participType}>
                            {type}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
          </div>
          <div className={styles.card_project}>
          <Card
                header={
                  <div className={styles.cardHeader}>
                    <Label className={styles.label_style}> Opportunity Informations</Label>
                    {/* <Label className={styles.label_seeAll}>See all </Label> */}
                    <Chevronb className={styles.chevronOpened}/>
                </div>
                }
                body={
                  <div>
                    {isLoading ? (
                      <p>Loading priority project...</p>
                    ) : error ? (
                      <p>{error}</p>
                    ) : (
                <div>
                  <h3 className={styles.projectTitleHeader}>Project Name</h3>
                  <div className={styles.projectName}>
                    <span className={styles.icon}>
                      <Company className={styles.company}/>
                    </span> {/* Icône de projet */}
                    <span className={styles.projectTitlecom}>{priorityProject.company || 'N/A'}</span>
                    <span className={styles.statuss}>In Progress<Timer className={styles.timer}/>
                    </span>
                  </div>
                  <div className={styles.projectDetails}>
                    <div className={styles.detailRow}>
                        <p ><strong className={styles.projectTitleHeader}>Secteur</strong></p>
                        <p><strong className={styles.projectTitleHeader}>Domaine</strong> </p>
                    </div>
                    <div className={styles.detailRow}>
                        <p>{opportunityDetails.activityAreas || 'N/A'}</p>
                        <p>{opportunityDetails.expertiseArea || 'N/A'}</p>
                    </div>
                   
                    <div className={styles.detailRow}>
                    <p><strong className={styles.projectTitleHeader}>Code:</strong></p>
                    <p><strong className={styles.projectTitleHeader}>Deadline:</strong></p>
                    </div>
                    <div className={styles.detailRow}>
                    <p>{opportunityDetails.reference || 'N/A'}</p>
                    <p>{opportunityDetails.closingDate || 'N/A'}</p>
                  </div>
                </div>
              </div>
              )}
            </div>
                }


              />
         


          </div>

          <div className={styles.card_ppt}>
            <Card
              header={
                <div>
                  <Label className={styles.label_style}>Version PPT</Label>
                  <Download className={styles.download} />
                  
                </div>
              }
              body={
                <div>
                  <div className={styles.ppt_icon_lin}>
                    <div className={styles.versionInfo}>
                      <PptIcon color={'#FFA500'} className={styles.ppt_icon} />
                      <span >Version: {pptVersion}</span>
                      </div>
                    {pptUrl && (
                      <div className={styles.actionsContainer}>
                      <Button icon="iconOnly" variant="Outline" onClick={handlePPTDownload}>
                        <Download className={styles.downloadppt} />                        <a
                          href={pptUrl}
                          download="generated_ppt.pptx"
                          className={styles.downloadLink}
                        ></a>
                      </Button>
                      <Button icon="iconOnly" variant="Outline" >
                      <Reload className={styles.reload} />
                      </Button>
                      </div>
                    )}
                    </div>
                 
                </div>
              }
            />
          </div>
          <div className={styles.card_contribution}>
            <Card
              header={
                <div>
                  <Label className={styles.label_style}>Top Contributors</Label>
                  <Contribution className={styles.contribution} />
                </div>
              }
              body={
                <div>
                  <div className={styles.profile_link}>
                    <UserNoProfile
                      color="#8686865c"
                      alt="No Profile"
                      className={styles.avatar_icon}
                    />
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
