import React, { useState, useRef } from 'react';
import {
  Flex,
  Heading,
  Text,
  Box,
  Card,
  Button,
  Grid,
  Badge,
  Avatar,
  IconButton,
  Tooltip,
} from '@radix-ui/themes';
import {
  FiEdit,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiCreditCard,
  FiBriefcase,
  FiCalendar,
  FiCamera,
  FiLoader // Import loader icon from react-icons
} from 'react-icons/fi';
import { useUserProfile } from '../hooks/useUserProfile';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import EditProfileModal from '../components/EditProfileModal';
import { formatDateTime } from '@/utils/helpers';

const ProfileDetail = ({ label, value, icon: IconComponent }) => (
  <Flex direction="column" gap="1">
    <Flex align="center" gap="2">
      {IconComponent && <IconComponent size={14} className="text-[var(--gray-10)]" />}
      <Text size="1" color="gray">{label}</Text>
    </Flex>
    <Text size="3" weight="medium" color={value ? undefined : 'gray'} style={{ overflowWrap: 'break-word' }}>
      {value || '- Not Set -'}
    </Text>
  </Flex>
);

const ProfilePage = () => {
  const {
      profile,
      isLoading,
      isUpdating,
      isUploading,
      error,
      updateProfile,
      uploadProfilePicture
  } = useUserProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleSaveChanges = async (updateData) => {
    const success = await updateProfile(updateData);
    if (success) handleCloseEditModal();
  };

  const handlePictureButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfilePicture(file);
    }
    if (fileInputRef.current) {
         fileInputRef.current.value = '';
    }
  };

  const isCustomerRole = profile?.roleName?.toUpperCase() === 'CUSTOMER';
  const hasCustomerData = !!profile?.customerId;
  const showCustomerFields = isCustomerRole || hasCustomerData;

  // Buttons are disabled if updating text fields or uploading image
  const isBusy = isUpdating || isUploading;
  // Page-level loading is only for initial fetch
  const showInitialLoading = isLoading && !profile;
  // Show error only if initial fetch fails
  const showInitialError = error && !profile && !isUploading; // Don't show initial error during upload attempt


  if (showInitialLoading) {
    return <LoadingSpinner text="Loading profile..." fullscreen={true} />;
  }

  if (showInitialError) {
    return <ErrorDisplay message={error} />;
  }

  if (!profile) {
    return <ErrorDisplay message="Could not load profile data." />;
  }

  return (
    <>
      <Flex direction="column" gap="5">
        <Flex justify="between" align="center">
          <Flex align="center" gap="3">
            <Box style={{ position: 'relative' }}>
               <Avatar
                 size="5"
                 radius="full"
                 fallback={<FiUser size={30} />}
                 src={profile.profilePictureBase64 || undefined}
                 color="gray"
                 // Add subtle opacity change while uploading
                 style={{ opacity: isUploading ? 0.7 : 1, transition: 'opacity 0.2s ease-in-out' }}
               />
               <Tooltip content="Change profile picture">
                   <IconButton
                       variant="solid"
                       color="gray"
                       radius="full"
                       size="1"
                       onClick={handlePictureButtonClick}
                       // Disable button only when uploading or updating text fields
                       disabled={isBusy}
                       style={{
                           position: 'absolute',
                           bottom: 0,
                           right: 0,
                           cursor: isBusy ? 'not-allowed' : 'pointer',
                       }}
                       aria-label="Change profile picture"
                   >
                       {/* Show loader icon inside button when uploading */}
                       {isUploading ? (
                           <FiLoader size={12} className="animate-spin" />
                       ) : (
                           <FiCamera size={12}/>
                       )}
                   </IconButton>
               </Tooltip>
               <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg, image/gif"
                    // Disable input only when uploading or updating text fields
                    disabled={isBusy}
               />
            </Box>
            <Heading size="7">My Profile</Heading>
          </Flex>
          {/* Disable button only when uploading or updating text fields */}
          <Button onClick={handleOpenEditModal} variant='soft' disabled={isBusy}>
            <FiEdit /> Edit Profile
          </Button>
        </Flex>

        {/* Display upload-specific error */}
        {error && isUploading === false && !showInitialError && (
             <ErrorDisplay message={`Upload failed: ${error}`} />
        )}

        <Card size="3">
          <Grid columns={{ initial: '1', sm: '2', md: '3' }} gapY="5" gapX="6">
            <ProfileDetail label="Full Name" value={profile.fullName} icon={FiUser} />
            <ProfileDetail label="Email Address" value={profile.email} icon={FiMail} />
            <ProfileDetail label="Phone Number" value={profile.phoneNumber} icon={FiPhone} />

            {showCustomerFields && (
              <>
                <ProfileDetail label="Company Name" value={profile.companyName} icon={FiBriefcase} />
                <ProfileDetail label="Contact Person" value={profile.contactPerson} icon={FiCreditCard} />
                <ProfileDetail label="Address" value={profile.address} icon={FiHome} />
              </>
            )}

            <Flex direction="column" gap="1">
              <Flex align="center" gap="2">
                <FiCalendar size={14} className="text-[var(--gray-10)]" />
                <Text size="1" color="gray">User Since</Text>
              </Flex>
              <Text size="3" weight="medium">
                {profile.userCreatedAt ? formatDateTime(profile.userCreatedAt) : '-'}
              </Text>
            </Flex>

            <Flex direction="column" gap="1">
              <Flex align="center" gap="2">
                <Text size="1" color="gray">Role</Text>
              </Flex>
              <Badge color="blue" variant='soft' size="1" style={{ width: 'fit-content' }}>
                {profile.roleName?.replace('_', ' ').toLowerCase() || 'Unknown'}
              </Badge>
            </Flex>
          </Grid>
        </Card>
      </Flex>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        profileData={profile}
        onSave={handleSaveChanges}
        isUpdating={isUpdating}
        isCustomer={showCustomerFields}
      />
    </>
  );
};

export default ProfilePage;