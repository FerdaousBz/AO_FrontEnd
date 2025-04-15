import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { Button, Heading, Input, Label } from '@/components/atoms';
import {
  Add,
  Chevron,
  Contribution,
  Download,
  GptIcon,
  IconAI,
  PptIcon,
  Send,
  Timer,
  UserNoProfile,
} from '@/components/atoms/icons';
import Card from '@/components/molecules/card/card-layout';
import SideBar from '@/components/molecules/sidebar/sidebar';
import { useUi } from '@/contexts/ui.context';
import { gray } from '@/styles/colors';

import styles from './soutenance.module.scss';
import { sendResumeEmail } from '@/service/sendEmail';
import Modal from '@/components/molecules/modal/modal';
import { useLocation } from 'react-router-dom';
import { getOppSummary, getOpportunityInformation } from '@/service/opportunitieService';
import handleToast from '@/utils/toast-util';
import { generatePPT, getPPTgenerated } from '@/service/pptService';

export default function SoutenanceScreenNew() {
  const { sidebaropen } = useUi();
  const location = useLocation();
  const [resumeInfo, setResumeInfo] = useState({ title: '', description: ''});
  const [opportunityDetails, setOpportunityDetails] = useState({});
  const [participants, setParticipants] = useState([]);
  const [priorityProject, setPriorityProject] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pptVersion, setPptVersion] = useState(null);
  const [pptUrl, setPptUrl] = useState(null);
  const [pptData, setPptData] = useState(null);
  const {
    selectedOpportunity,
    opportunities,
  } = location.state || {};
  const [emailState, setEmailState] = useState({
    email: '',
    loading: false,
    success: null,
    error: null,
    isModalOpen: false,
  });
  const [fileId, setFileId] = useState(null);

  useEffect(() => {
  const fetchSoutenanceData = async () => {
    if (!selectedOpportunity) {
      setError('Aucune opportunité sélectionnée.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('fetchSoutenanceData.data', selectedOpportunity);
      handleOpportunityData(selectedOpportunity);
      handleResumeData(selectedOpportunity);
      handleParticipantsData(selectedOpportunity);
      handlePriorityProjectData(selectedOpportunity);

      const document = selectedOpportunity.includedResources.find((resource) => resource.type === 'document');
      setFileId(document ? document.id : null);
      const summaryId = selectedOpportunity.resumeData[0]?.summary?.summary_id;
      console.log('summaryid', summaryId);
      if (summaryId) {
        await fetchPPTVersion(selectedOpportunity.pptResponse);
      }
    } catch (error) {
      handleToast('error', 'Erreur lors de la récupération des données');
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
    if (data.includedResources) {
      const participantsList = data.includedResources
        .filter(({ type }) => ['resource', 'contact'].includes(type))
        .map(({ attributes: { lastName, firstName }, type }) => ({
          lastName,
          firstName,
          type,
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
    if (!fileId) {
      handleToast('error', 'Document not found, unable to send email');
      return;
    }
    if (!emailState.email || !emailState.email.trim()) {
      handleToast('error', 'Email cannot be empty');
      return;
    }
    if (!emailState.email.includes('@jems-group')) {
      handleToast('error', "Invalid email domain. The email must belong to '@jems-group'");
      return;
    }
    try {
      const response = await sendResumeEmail(emailState.email, fileId);
      if (response) {
        handleToast('success', 'Resume is sent to DOP');
      } else {
        handleToast('error', 'Error while sending resume');
      }
    } catch (error) {
      handleToast('error', 'Error sending email, please try again');
    }
  };

  const handleEmailChange = (e) =>
    setEmailState((prevState) => ({ ...prevState, email: e.target.value }));
  const toggleModal = () =>
    setEmailState((prevState) => ({ ...prevState, isModalOpen: !prevState.isModalOpen }));

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
      setResumeInfo({ title: '', description: 'No resume data found.' });
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
      handleToast('success', 'PPT is Generated ');
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
              header={<Label className={styles.label_style}>{resumeInfo.title}</Label>}
              body={
                <div className={styles.cardBody}>
                  <p>{resumeInfo.description}</p>
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
                <Input
                  type="email"
                  value={emailState.email}
                  onChange={handleEmailChange}
                  placeholder="Enter recipient's email"
                />
                <Button
                  className={styles.send_email}
                  variant="Outline"
                  onClick={handleSendEmail}
                  disabled={emailState.loading}
                >
                  {emailState.loading ? 'Sending...' : 'Send'}
                </Button>

                {emailState.success && (
                  <p className={styles.successMessage}>{emailState.success}</p>
                )}
                {emailState.error && <p className={styles.errorMessage}>{emailState.error}</p>}
              </Modal>
            )}
          </div>
          <div className={styles.card_participant}>
            <Card
              header={<Label>Participants</Label>}
              body={
                <div>
                  <ul className={styles.list_participant}>
                    {participants.map(({ firstName, lastName, type }, index) => (
                      <li key={index}>
                        <div className={styles.participLable}>
                          {/* Name and Avatar in a flex container */}
                          <div className={styles.nameWithAvatar}>
                            <UserNoProfile
                              color="#8686865c"
                              alt="No Profile"
                              className={styles.avatar_icon}
                            />
                            <span>
                              {firstName} {lastName}
                            </span>
                          </div>

                          {/* Type below the Name */}
                          <div className={styles.participType}>
                            {type === 'resource' ? 'Resource' : 'Contact'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              }
              footer={
                <Button className={styles.button_item_particp} variant="Outline">
                  Add participant
                  <Add className={styles.add} />
                </Button>
              }
            />
          </div>
          <div className={styles.card_project}>
            <Card
              header={
                <div>
                  <Label className={styles.label_style}>Priority Project</Label>
                  <Timer className={styles.timer} />
                  <Chevron className={styles.chevron_opened} />
                </div>
              }
              body={
                isLoading ? (
                  <p>Loading priority project...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  <div>
                    <p>
                      <strong>Company:</strong> {priorityProject.company || 'N/A'}
                    </p>
                    <p>
                      <strong>Reference:</strong>
                      {opportunityDetails.reference}
                    </p>

                    <p>
                      <strong>Activity Area:</strong> {opportunityDetails.activityAreas || 'N/A'}
                    </p>
                    <p>
                      <strong>Expertise Area:</strong>{' '}
                      {opportunityDetails.expertiseArea || 'No expiration date'}
                    </p>
                    <p>
                      <strong>Start Date:</strong> {opportunityDetails.startDate || 'N/A'}
                    </p>
                    <p>
                      <strong>Deadline:</strong> {opportunityDetails.closingDate || 'N/A'}
                    </p>
                  </div>
                )
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
                      <span>Version: {pptVersion}</span>
                    </div>
                    {pptUrl && (
                      <Button icon="iconOnly" variant="Outline" onClick={handlePPTDownload}>
                        <Download className={styles.downloadppt} />
                        <a
                          href={pptUrl}
                          download="generated_ppt.pptx"
                          className={styles.downloadLink}
                        ></a>
                      </Button>
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
