import clsx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Heading, Image } from '@/components/atoms';
import {
  Add,
  Close,
  Discuter,
  IconAI,
  IcRegenrate,
  Upload,
  UserNoProfile,
} from '@/components/atoms/icons';
import Card from '@/components/molecules/card/card-layout';
import Navbar from '@/components/molecules/navbar/navbar';
import SideBar from '@/components/molecules/sidebar/sidebar';
import { useUi } from '@/contexts/ui.context';
import { gray } from '@/styles/colors';
import { ROUTE_SOUTENANCE } from '@/utils/consts';

import styles from './dashboard.module.scss';
import {
  getDropdawonIdList,
  getGenerateSummary,
  getPPTgenerated,
  postGeneratePPT,
  postGenerateSummary,
} from '@/service/apiServices';
import { getDocumentId } from '@/service/dashboardService';
import { saveOpportunity, getOpportunities, clearOpportunities } from './indexedDB';

export default function DashboardScreen() {
  const { sidebaropen } = useUi();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedExpertiseArea, setSelectedExpertiseArea] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedId, setSelectedId] = useState('');
  const [ids, setIds] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSelect, setShowSelect] = useState(false); // État pour gérer l'affichage de la sélection
  const [activeButton, setActiveButton] = useState(null);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const indexOfLastOpportunity = currentPage * itemsPerPage;
  const indexOfFirstOpportunity = indexOfLastOpportunity - itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(
    indexOfFirstOpportunity,
    indexOfLastOpportunity,
  );
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const storedOpportunities = await getOpportunities();
        setOpportunities(storedOpportunities);
      } catch (error) {
        console.error(error);
      }
    };

    loadOpportunities();
  }, []);

  useEffect(() => {
    setFilteredOpportunities(opportunities); // Mettez à jour les opportunités filtrées lorsque les opportunités changent
  }, [opportunities]);

  const handleClearStorage = async () => {
    try {
      await clearOpportunities(); // Vider les opportunités dans IndexedDB
      setOpportunities([]); // Réinitialiser l'état local
      setFilteredOpportunities([]); // Réinitialiser les opportunités filtrées
      console.log("Opportunités supprimées d'IndexedDB");
    } catch (error) {
      console.error('Error clearing opportunities from IndexedDB:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayPaginationButtons = () => {
    const pages = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? styles.active : styles.pageButton}
          >
            {i}
          </button>,
        );
      }
    } else {
      if (currentPage > 2) {
        pages.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className={currentPage === 1 ? styles.active : styles.pageButton}
          >
            1
          </button>,
        );
        pages.push(
          <span key="ellipsis-start" className={styles.ellipsis}>
            ...
          </span>,
        );
      }
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 2);
        i++
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? styles.active : styles.pageButton}
          >
            {i}
          </button>,
        );
      }
      if (currentPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className={styles.ellipsis}>
            ...
          </span>,
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? styles.active : styles.pageButton}
        >
          {totalPages}
        </button>,
      );
    }
    return pages;
  };
  const handleFilterChange = (expertiseArea, searchTerm, typeOfProject) => {
    let filtered = opportunities;

    if (expertiseArea) {
      filtered = filtered.filter(
        (opportunity) => opportunity.opportunityDetails.expertiseArea === expertiseArea,
      );
    }

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter((opportunity) =>
        opportunity.opportunityDetails.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtrer par type de projet
    if (typeOfProject) {
      console.log('opportunity', filtered);
      filtered = filtered.filter(
        (opportunity) => opportunity.opportunityDetails.typeOfValue === typeOfProject,
      );
    }

    setFilteredOpportunities(filtered);
    setCurrentPage(1); // Réinitialiser la pagination
  };

  const handleSaveOpportunities = async (opportunitiesToSave) => {
    try {
      for (const opportunity of opportunitiesToSave) {
        await saveOpportunity(opportunity);
      }
      // Vous pouvez mettre à jour l'état ici, mais seulement si vous avez ajouté de nouvelles opportunités
      // Cela devrait être fait dans le contexte où vous ajoutez une nouvelle opportunité, pas dans cet effet
    } catch (error) {
      console.error('Error saving opportunities to IndexedDB:', error);
    }
  };
  // Fonction pour gérer le clic sur une opportunité
  const handleOpportunityClick = (opportunity) => {
    // Vérifiez si l'opportunité est définie
    if (!opportunity) {
      console.error('Aucune opportunité sélectionnée');
      return; // Sortir de la fonction si aucune opportunité n'est fournie
    }

    navigate(ROUTE_SOUTENANCE, {
      state: {
        opportunities,
        selectedOpportunity: opportunity,
      },
    });
  };
  useEffect(() => {
    const fetchIds = async () => {
      setLoadingProgress(0);
      setLoadingComplete(false);

      try {
        const response = await getDropdawonIdList(page, limit);

        // Simuler le chargement des IDs
        const totalSteps = 100; // Total de 100% pour la progression
        const stepTime = 50; // Temps en ms pour chaque étape (ajustez selon vos besoins)

        for (let i = 0; i <= totalSteps; i++) {
          setTimeout(() => {
            setLoadingProgress(i);
            if (i === totalSteps) {
              setLoadingComplete(true);
            }
          }, i * stepTime);
        }

        setIds(
          response
            .filter((opportunityDetails) => opportunityDetails.hasDocument)
            .map((opportunityDetails) => {
              const message = { [`${opportunityDetails.opportunityDetails.id}`]: '' };
              opportunityDetails.hasDocument
                ? (message[`${opportunityDetails.opportunityDetails.id}`] = 'avec document')
                : (message[`${opportunityDetails.opportunityDetails.id}`] = 'sans document');
              return message;
            }),
        );
      } catch (error) {
        console.error('Error fetching IDs:', error);
      }
    };

    fetchIds();
  }, []);

  const handleButtonClick = (buttonName) => {
    if (buttonName === 'BoondManager') {
      setShowSelect((prev) => !prev); // Alterner l'affichage de la sélection
    }
    setActiveButton(buttonName); // Mettre à jour le bouton actif
  };
  const getProgressText = (progressValue) => {
    if (progressValue <= 10) {
      return 'Démarrage de la génération... Veuillez patienter pendant que nous initialisons le processus.';
    } else if (progressValue <= 20) {
      return "Récupération de la sélection... Nous collectons les données de l'opportunité sélectionnée.";
    } else if (progressValue <= 30) {
      return 'Analyse des données sélectionnées... Vérification des informations nécessaires.';
    } else if (progressValue <= 40) {
      return 'Génération du résumé... Nous traitons les données pour créer le résumé.';
    } else if (progressValue <= 50) {
      return 'Génération en cours... Veuillez patienter pendant que nous finalisons le résumé.';
    } else if (progressValue <= 60) {
      return "Finalisation du résumé... Préparation des résultats pour l'étape suivante.";
    } else if (progressValue <= 70) {
      return 'Création de la présentation... Nous générons le document de présentation.';
    } else if (progressValue <= 80) {
      return 'Finalisation de la présentation... Préparation des fichiers finaux.';
    } else if (progressValue <= 90) {
      return 'Vérification des résultats... Assurons-nous que tout est prêt pour le téléchargement.';
    } else if (progressValue <= 100) {
      return 'Finalisation... Votre résumé et votre présentation sont presque prêts.';
    } else {
      return 'Prêt à télécharger... Cliquez sur le bouton pour récupérer vos fichiers.';
    }
  };
  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      setProgressValue(10);
      const response = await getDropdawonIdList(page, limit);
      setProgressValue(20);
      const selectedOpportunity = response.find(
        (opportunity) => opportunity.opportunityDetails.id === selectedId,
      );
      setProgressValue(30);
      if (selectedOpportunity.hasDocument) {
        const documentId = getDocumentId(selectedOpportunity);
        setProgressValue(40);
        let opportunityToSave;

        // Boucle pour traiter l'opportunité jusqu'à ce que les attributs requis soient présents
        do {
          const getSummary = await getGenerateSummary(documentId);
          setProgressValue(50);
          let postSummary = null;
          let summaryId = getSummary ? getSummary.file[0].summary.summary_id : false;
          setProgressValue(60);

          if (!getSummary) {
            postSummary = await postGenerateSummary(documentId);
            selectedOpportunity.resumeData = postSummary.file;
            summaryId = documentId;
            setProgressValue(70);
          } else {
            selectedOpportunity.resumeData = getSummary.file;
          }

          if (summaryId) {
            let getPPTGenerator = await getPPTgenerated(summaryId);
            setProgressValue(80);
            let postPPTGenerator = null;

            if (getPPTGenerator.status !== 'SUCCESS') {
              postPPTGenerator = await postGeneratePPT(documentId);
              setProgressValue(90);
              getPPTGenerator = await getPPTgenerated(postPPTGenerator.summary_id);
            }

            if (getPPTGenerator.status === 'SUCCESS') {
              selectedOpportunity.pptResponse = getPPTGenerator;
            } else {
              console.log('erreur de recuperation de ', getPPTGenerator);
            }
          }
          setProgressValue(100);

          // Créer une copie de selectedOpportunity avec tous les attributs
          opportunityToSave = {
            ...selectedOpportunity,
            id: selectedOpportunity.opportunityDetails.id,
            resumeData: selectedOpportunity.resumeData,
            pptResponse: selectedOpportunity.pptResponse,
          };
          console.log('opportunityToSave', opportunityToSave);
          // Sauvegarder l'opportunité sélectionnée dans IndexedDB
          await handleSaveOpportunities([opportunityToSave]); // Notez que nous passons un tableau

          // Mettez à jour l'état local ici
          setOpportunities((prevOpportunities) => {
            const exists = prevOpportunities.some(
              (op) => op.opportunityDetails.id === opportunityToSave.opportunityDetails.id,
            );

            if (!exists) {
              return [...prevOpportunities, opportunityToSave]; // Ajoutez la nouvelle opportunité
            }

            return prevOpportunities; // Ne rien faire si l'opportunité existe déjà
          });
        } while (
          !opportunityToSave ||
          !opportunityToSave.opportunityDetails ||
          !opportunityToSave.resumeData ||
          !opportunityToSave.pptResponse ||
          !opportunityToSave.pptResponse.data ||
          !opportunityToSave.pptResponse.message ||
          opportunityToSave.pptResponse.status !== 'SUCCESS'
        );

        // Rediriger vers SoutenanceScreen avec les résultats
        navigate(ROUTE_SOUTENANCE, {
          state: {
            opportunities,
            selectedOpportunity: opportunityToSave,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching opportunity:', error);
    }

    setIsProcessing(false);
    setIsPopupOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={styles.container_soutenance}>
      {isPopupOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupdash}>
            <button onClick={() => setIsPopupOpen(false)} className={styles.closeButton}>
              <Close className={styles.closeButton} />
            </button>
            {!isProcessing ? (
              <div>
                <Card
                  body={
                    <div className={styles.cardy}>
                      <p>
                        <UserNoProfile
                          color="#8686865c"
                          alt="No Profile"
                          className={styles.avatarmsg}
                        />
                        Hello ! How can I assist you ?
                      </p>
                    </div>
                  }
                />
                <div className={styles.footerButtons}>
                  <Button onClick={() => handleButtonClick('BoondManager')} disabled={selectedId}>
                    BoondManager
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!selectedId}
                    className={styles.disabledButton}
                  >
                    <Upload className={styles.duscicon} />
                    Upload
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={!selectedId}
                    className={styles.disabledButton}
                  >
                    <Discuter className={styles.duscicon} />
                    Discuter
                  </Button>
                </div>
                {showSelect && (
                  <div>
                    <div className={styles.progressBarContainer}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progress}
                          style={{
                            width: `${loadingProgress}%`,
                            backgroundColor: 'blue',
                          }} // Ajustez la couleur selon vos besoins
                        />
                      </div>
                      <span className={styles.progressText}>{loadingProgress}%</span>
                    </div>

                    {loadingComplete && (
                      <div className={styles.selectContainer}>
                        <p>IDs chargés ! Sélectionnez un ID :</p>
                        <select
                          className={styles.select}
                          value={selectedId}
                          onChange={(e) => setSelectedId(e.target.value)}
                        >
                          <option value="">Sélectionnez un ID</option>
                          {ids.map((obj) => {
                            const [id, message] = Object.entries(obj)[0];
                            return (
                              <option key={id} value={id}>
                                {id} {message}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}
                    <Button onClick={handleGenerate} disabled={!selectedId}>
                      Générer
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.progressBarContainer}>
                <div className={styles.popup}>
                  <button onClick={() => setIsPopupOpen(false)} className={styles.closeButton}>
                    <Close className={styles.closeButton} />
                  </button>
                  <p className={styles.subtitle}>{getProgressText(progressValue)}</p>
                  <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progress}
                        style={{
                          background: `linear-gradient(90deg, red ${progressValue}%, yellow)`,
                          width: `${progressValue}%`,
                        }}
                      />
                    </div>
                    <span className={styles.progressText}>{progressValue}% terminé</span>
                  </div>
                  <div className={styles.progressBarContainer}>
                    <div className={styles.iconContainer}>
                      <IcRegenrate className={`${styles.spiner_logoo} ${styles.spinner}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <SideBar />
      <div
        className={clsx(
          styles.mainContent,
          sidebaropen ? styles.mainContentWithSidebarOpen : styles.mainContentWithSidebarClosed,
        )}
      >
        <div className={styles.heading}>
          <Heading as="h2" bold color={gray}>
            Tous les soutenances
          </Heading>
          <button onClick={handleClearStorage} className={styles.clearButton}>
            Vider les données
          </button>
          <Button
            className={styles.button}
            variant="noOutline"
            onClick={() => setIsPopupOpen(true)}
          >
            <Add className={styles.add} />
            <label className={styles.label}> Créer </label>
            <IconAI className={styles.aiicon} />
          </Button>
        </div>
        {opportunities.length > 0 && (
          <Navbar opportunities={opportunities} onFilterChange={handleFilterChange} />
        )}
        <div className={styles.cardContainer}>
          {currentOpportunities.length > 0 ? (
            currentOpportunities.map((opportunity) => {
              const manager = opportunity.includedResources?.find(
                (resource) => resource.resourceTypeOfValue && resource.resourceTypeOfValue !== '',
              );
              const fullName = manager
                ? `${manager.attributes.lastName} ${manager.attributes.firstName}`
                : 'Manager non trouvé';
              const profilePictureUrl = manager.thumbnail;
              let profilePicture = (
                <UserNoProfile color="#8686865c" alt="No Profile" className={styles.avatar_icon} />
              );

              if (profilePictureUrl) {
                // Déterminez le type d'image
                let imageType = 'jpeg'; // Type par défaut

                // Exemple : vérifiez le format à partir de l'URL ou d'une autre source
                if (profilePictureUrl.startsWith('data:image/png')) {
                  imageType = 'png';
                } else if (profilePictureUrl.startsWith('data:image/gif')) {
                  imageType = 'gif';
                } else if (profilePictureUrl.startsWith('data:image/jpeg')) {
                  imageType = 'jpeg';
                }

                // Créez la chaîne base64 avec le type d'image approprié
                profilePicture = (
                  <img
                    className={styles.avatarParticipant}
                    src={`data:image/${imageType};base64,${profilePictureUrl}`}
                    alt="Profile"
                  />
                );
              }
              /* const profilePictureUrl = opportunity.imgUrl;

              {profilePictureUrl ? (
                <img className={styles.img_card} src={profilePictureUrl} alt=" " />
              ) : (
                <>{!profilePictureUrl && <UserNoProfile color="#8686865c" alt="No Profile" />}</>
              )} */
              return (
                <div className={styles.card_resume} key={opportunity.id}>
                  <Link className={styles.card_link}>
                    <Card
                      className={styles.custom_card}
                      body={
                        <div className={styles.cardBody}>
                          <h3>{opportunity.opportunityDetails.title}</h3>

                          {/* <p>
                            <strong>Expertise Area:</strong>{' '}
                            {opportunity.opportunityDetails.expertiseArea}
                          </p> */}

                          {/*  <p>
                            <strong>Updated Date:</strong>{' '}
                            {opportunity.opportunityDetails.updateDate || 'N/A'}
                          </p> */}
                        </div>
                      }
                    />
                  </Link>
                  <div className={styles.profile_link}>
                    <button type="button" className={styles.avatar_logo}>
                      {profilePicture}
                    </button>

                    {/* Conteneur pour centrer le nom et la date */}
                    <div className={styles.textContainer}>
                      <p className={styles.opportunity_creator_name}>{fullName}</p>
                      <p className={styles.creationDate}>
                        {opportunity.opportunityDetails.creationDate
                          ? formatDate(opportunity.opportunityDetails.creationDate)
                          : 'N/A'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpportunityClick(opportunity)} // Passer l'opportunité ici
                      className={styles.spiner}
                    >
                      <IcRegenrate className={styles.avatar_icon} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.container_blank}>
              <Image
                // className={styles.under_cons_image}
                src="/images/nodefense.png"
                alt="Under Construction"
                size="x-large"
              />
              <div className={styles.textContainer}>
                <h1>Pas de soutenances trouvés</h1>
                <p>Cliquez sur créer pour créer une soutenance</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.pagination}>
          <button
            className={styles.arrowButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {'<'}
          </button>
          {displayPaginationButtons()}
          <button
            className={styles.arrowButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}
