import { Button } from '@/components/atoms';
import { UserNoProfile } from '@/components/atoms/icons';
import handleToast from '@/utils/toast-util';
import axios from 'axios';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import styles from './card-profile.module.scss';
import { useUi } from '@/contexts/ui.context';
import useAuth from '@/components/hooks/use-auth';
import { gray } from '@/styles/colors';

export default function ProfilCard({ className, imgUrl, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageUrl, setProfilePictureUrl] = useState(imgUrl);

  useEffect(() => {
    if (imgUrl) {
      setProfilePictureUrl(imgUrl); // Reset profile image if imgUrl changes
    }
  }, [imgUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePictureUrl(URL.createObjectURL(file)); // Using URL.createObjectURL for preview
    setIsEditing(true);
    if (onUpdate) {
      onUpdate(file); // Pass the file back to the parent component
    }
  };

  const handleSaveClick = () => {
    // Handle save logic here (e.g., uploading the file)
  };

  const handleImageLoad = () => {
    console.log('Image has been loaded');
  };

  const getBase64Image = (base64String) => {
    if (base64String.startsWith('data:image')) {
      return base64String; // If it's already a base64 image, return it as is
    } else {
      return `data:image/jpeg;base64,${base64String}`; // Add prefix for JPEG base64 image
    }
  };

  return (
    <div className={clsx(styles.card, className)}>
      
      {profileImageUrl ? (
        <img
          className={styles.img_card}
          src={getBase64Image(profileImageUrl)} // Ensure it's a valid base64 image
          alt="Profile"
          loading="lazy"
          onLoad={handleImageLoad} // Add onLoad event here
        />
      ) : (
        <UserNoProfile color="#8686865c" alt="No Profile" />
      )}
      {isEditing && (
        <Button
          variant="noOutline"
          className={styles.card__action__save}
          onClick={handleSaveClick}
        >
          Save
        </Button>
      )}
      <input type="file" className={styles.input_img} onChange={handleFileChange} />
    </div>
  );
}

ProfilCard.propTypes = {
  className: PropTypes.string,
  imgUrl: PropTypes.string,
  onUpdate: PropTypes.func.isRequired, // Expecting onUpdate function as prop
};