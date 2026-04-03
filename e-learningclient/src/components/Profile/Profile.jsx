import {
  Avatar, Box, Button, Container, Grid, Heading, HStack,
  Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Text, VStack,
  useDisclosure, Badge,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { FaPlay, FaBookOpen, FaStar, FaCheckCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromPlaylist, updateProfilePicture } from '../../redux/actions/profile';
import { loadUser } from '../../redux/actions/user';
import { fileUploadCss } from '../Auth/Register';
import { STATIC_COURSES, COURSE_IMAGES, formatINR } from '../Courses/Courses';

const Profile = ({ user }) => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector(state => state.profile);

  const removeFromPlaylistHandler = async id => {
    await dispatch(removeFromPlaylist(id));
    dispatch(loadUser());
  };

  const changeImageSubmitHandler = async (e, image) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('file', image);
    await dispatch(updateProfilePicture(myForm));
    dispatch(loadUser());
  };

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: 'clearError' }); }
    if (message) { toast.success(message); dispatch({ type: 'clearMessage' }); }
  }, [dispatch, error, message]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  if (!user) return null;

  // Build purchased courses — match playlist IDs against static catalog
  const purchasedCourses = (user?.playlist || []).map(p => {
    const found = STATIC_COURSES.find(c => c._id === p.course);
    return found ? { ...found, playlistData: p } : {
      _id: p.course,
      title: p.title || 'Course',
      poster: { url: p.poster },
      category: 'Course',
      playlistData: p,
    };
  });

  return (
    <Box bg="#f7f7f9" minH="95vh" py="10">
      <Container maxW="container.lg">
        {/* Profile card */}
        <Box bg="white" border="1px solid" borderColor="gray.100" borderRadius="20px"
          overflow="hidden" boxShadow="0 4px 20px rgba(0,0,0,0.05)" mb="6"
        >
          <Box h="100px" bgGradient="linear(135deg, #0a0a1e 0%, #1a1a2e 50%, #0f3460 100%)" position="relative">
            <Box position="absolute" bottom="-40px" left="8" w="80px" h="80px"
              borderRadius="18px" border="3px solid white" overflow="hidden"
              boxShadow="0 4px 20px rgba(0,0,0,0.15)"
            >
              <Avatar src={user?.avatar?.url} name={user?.name} boxSize="full" borderRadius="0" />
            </Box>
          </Box>

          <Box pt="12" px="8" pb="6">
            <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap="3">
              <Box>
                <Heading fontFamily="'Syne', sans-serif" fontSize="xl" fontWeight="800"
                  color="gray.900" letterSpacing="-0.02em"
                >
                  {user.name}
                </Heading>
                <Text fontSize="13px" color="gray.500" mt="0.5">{user.email}</Text>
                <HStack mt="2" spacing="2">
                  <Box px="3" py="1" borderRadius="8px" fontSize="11px" fontWeight="700"
                    fontFamily="'Syne', sans-serif" textTransform="uppercase" letterSpacing="0.06em"
                    bg={user.role === 'admin' ? '#fff7ed' : '#eef2ff'}
                    color={user.role === 'admin' ? '#ea580c' : '#4f46e5'}
                  >
                    {user.role}
                  </Box>
                  <Box px="3" py="1" borderRadius="8px" fontSize="11px" fontWeight="700"
                    fontFamily="'Syne', sans-serif" textTransform="uppercase" letterSpacing="0.06em"
                    bg={purchasedCourses.length > 0 ? '#f0fdf4' : '#f7f7f9'}
                    color={purchasedCourses.length > 0 ? '#16a34a' : '#9ca3af'}
                  >
                    {purchasedCourses.length > 0 ? `${purchasedCourses.length} Course${purchasedCourses.length > 1 ? 's' : ''} Owned` : 'No Courses Yet'}
                  </Box>
                </HStack>
              </Box>

              <HStack spacing="2" flexWrap="wrap">
                <Button onClick={onOpen} variant="outline" borderColor="gray.200" color="gray.600"
                  fontFamily="'Syne', sans-serif" fontWeight="600" fontSize="13px"
                  borderRadius="10px" h="36px" _hover={{ borderColor: '#7c5cfc', color: '#7c5cfc' }}
                >
                  Change Photo
                </Button>
                <Link to="/updateprofile">
                  <Button variant="outline" borderColor="gray.200" color="gray.600"
                    fontFamily="'Syne', sans-serif" fontWeight="600" fontSize="13px"
                    borderRadius="10px" h="36px" _hover={{ borderColor: '#7c5cfc', color: '#7c5cfc' }}
                  >
                    Edit Profile
                  </Button>
                </Link>
                <Link to="/changepassword">
                  <Button variant="outline" borderColor="gray.200" color="gray.600"
                    fontFamily="'Syne', sans-serif" fontWeight="600" fontSize="13px"
                    borderRadius="10px" h="36px" _hover={{ borderColor: '#7c5cfc', color: '#7c5cfc' }}
                  >
                    Change Password
                  </Button>
                </Link>
              </HStack>
            </HStack>

            <Grid templateColumns={['1fr', 'repeat(3, 1fr)']} gap="3" mt="6">
              <Box bg="gray.50" borderRadius="12px" p="4" border="1px solid" borderColor="gray.100">
                <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="1">Member Since</Text>
                <Text fontSize="14px" fontWeight="600" color="gray.700">{new Date(user?.createdAt).toISOString().split("T")[0]}</Text>
              </Box>
              <Box bg="gray.50" borderRadius="12px" p="4" border="1px solid" borderColor="gray.100">
                <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="1">Courses Purchased</Text>
                <Text fontSize="14px" fontWeight="600" color="gray.700">{purchasedCourses.length} course{purchasedCourses.length !== 1 ? 's' : ''}</Text>
              </Box>
              <Box bg="gray.50" borderRadius="12px" p="4" border="1px solid" borderColor="gray.100">
                <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="1">Total Spent</Text>
                <Text fontSize="14px" fontWeight="600" color="gray.700">
                  {purchasedCourses.reduce((sum, c) => sum + (c.price || 0), 0) > 0
                    ? `$${purchasedCourses.reduce((sum, c) => sum + (c.price || 0), 0)} (${formatINR(purchasedCourses.reduce((sum, c) => sum + (c.price || 0), 0))})`
                    : '—'}
                </Text>
              </Box>
            </Grid>
          </Box>
        </Box>

        {/* My Courses Section */}
        {purchasedCourses.length > 0 ? (
          <Box bg="white" border="1px solid" borderColor="gray.100" borderRadius="20px"
            p="6" boxShadow="0 4px 20px rgba(0,0,0,0.04)" mb="6"
          >
            <HStack justify="space-between" align="center" mb="5">
              <Heading fontFamily="'Syne', sans-serif" fontSize="18px" fontWeight="700" color="gray.800">
                My Courses ({purchasedCourses.length})
              </Heading>
              <Link to="/courses">
                <Button size="sm" variant="outline" borderColor="gray.200" borderRadius="8px"
                  fontFamily="'Syne', sans-serif" fontWeight="600" fontSize="12px"
                  _hover={{ borderColor: '#7c5cfc', color: '#7c5cfc' }}
                >
                  Browse More Courses
                </Button>
              </Link>
            </HStack>

            <Box display="grid" gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap="4">
              {purchasedCourses.map((course) => (
                <Box key={course._id} bg="white" border="1px solid" borderColor="green.100"
                  borderRadius="16px" overflow="hidden" transition="all 0.2s"
                  boxShadow="0 2px 10px rgba(22,163,74,0.06)"
                  _hover={{ boxShadow: '0 8px 24px rgba(22,163,74,0.12)', transform: 'translateY(-3px)' }}
                >
                  <Box position="relative">
                    <Image
                      src={course.poster?.url || COURSE_IMAGES[course.category] || COURSE_IMAGES.default}
                      w="full" h="140px" objectFit="cover"
                      fallbackSrc={COURSE_IMAGES.default}
                    />
                    <Box position="absolute" top="2" right="2" bg="green.500" color="white"
                      px="2" py="1" borderRadius="6px" fontSize="10px" fontWeight="700"
                      display="flex" alignItems="center" gap="1"
                    >
                      <FaCheckCircle size="8px" /> OWNED
                    </Box>
                    {course.category && (
                      <Box position="absolute" top="2" left="2"
                        bg="rgba(0,0,0,0.65)" color="white"
                        px="2" py="1" borderRadius="6px" fontSize="10px" fontWeight="600"
                      >
                        {course.category}
                      </Box>
                    )}
                  </Box>
                  <Box p="4">
                    <Text fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="14px"
                      color="gray.900" mb="1" noOfLines={2} lineHeight="1.3"
                    >
                      {course.title}
                    </Text>
                    {course.createdBy && (
                      <Text fontSize="12px" color="gray.500" mb="2">
                        by <Box as="span" fontWeight="600" color="gray.600">{course.createdBy}</Box>
                      </Text>
                    )}
                    {course.rating && (
                      <HStack spacing="1" mb="3">
                        <FaStar color="#f59e0b" size="11px" />
                        <Text fontSize="12px" fontWeight="600" color="gray.700">{course.rating}</Text>
                        {course.numOfVideos && (
                          <Text fontSize="12px" color="gray.500">· {course.numOfVideos} lessons</Text>
                        )}
                      </HStack>
                    )}
                    <HStack spacing="2">
                      <Link to={`/course/${course._id}`} style={{ flex: 1 }}>
                        <Button w="full" h="34px" bg="#0a0a1e" color="white"
                          fontFamily="'Syne', sans-serif" fontWeight="600" fontSize="12px"
                          borderRadius="8px" leftIcon={<FaPlay size="9px" />}
                          _hover={{ bg: '#1a1a2e' }}
                        >
                          Continue
                        </Button>
                      </Link>
                      <Button isLoading={loading} h="34px" w="34px" p="0" bg="red.50"
                        color="red.400" borderRadius="8px"
                        onClick={() => removeFromPlaylistHandler(course._id)}
                        _hover={{ bg: 'red.500', color: 'white' }} transition="all 0.2s"
                      >
                        <RiDeleteBin7Fill size="12px" />
                      </Button>
                    </HStack>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Box bg="white" border="1px solid" borderColor="gray.100" borderRadius="20px"
            p="10" boxShadow="0 4px 20px rgba(0,0,0,0.04)" mb="6" textAlign="center"
          >
            <Box fontSize="48px" mb="4">📚</Box>
            <Heading fontFamily="'Syne', sans-serif" fontSize="lg" fontWeight="700" color="gray.700" mb="2">
              No Courses Yet
            </Heading>
            <Text fontSize="14px" color="gray.500" mb="5">
              Browse our catalog and buy a course for just $6–$10. Learn at your own pace.
            </Text>
            <Link to="/courses">
              <Button h="44px" px="8" bg="#0a0a1e" color="white"
                fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="14px"
                borderRadius="12px" _hover={{ bg: '#1a1a2e' }}
              >
                Browse Courses →
              </Button>
            </Link>
          </Box>
        )}

        <ChangePhotoBox
          changeImageSubmitHandler={changeImageSubmitHandler}
          isOpen={isOpen}
          onClose={onClose}
          loading={loading}
        />
      </Container>
    </Box>
  );
};

export default Profile;

function ChangePhotoBox({ isOpen, onClose, changeImageSubmitHandler, loading }) {
  const [image, setImage] = useState('');
  const [imagePrev, setImagePrev] = useState('');

  const changeImage = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { setImagePrev(reader.result); setImage(file); };
  };

  const closeHandler = () => { onClose(); setImagePrev(''); setImage(''); };

  return (
    <Modal isOpen={isOpen} onClose={closeHandler} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="20px" border="1px solid" borderColor="gray.100" boxShadow="0 24px 80px rgba(0,0,0,0.12)">
        <ModalHeader fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="18px" color="gray.900" pb="0">
          Update Photo
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt="4">
          <form onSubmit={e => changeImageSubmitHandler(e, image)} id="photo-form">
            <VStack spacing="5">
              {imagePrev && <Avatar src={imagePrev} boxSize="24" borderRadius="16px" />}
              <Input type="file"
                css={{ '&::file-selector-button': { ...fileUploadCss, color: '#7c5cfc' } }}
                onChange={changeImage} borderRadius="10px" border="1.5px solid"
                borderColor="gray.200" h="46px"
              />
              <Button isLoading={loading} w="full" h="46px" bg="#7c5cfc" color="white" type="submit"
                fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="14px"
                borderRadius="10px" _hover={{ bg: '#6344e0' }} transition="all 0.2s"
              >
                Update Photo →
              </Button>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter pt="2">
          <Button onClick={closeHandler} variant="ghost" borderRadius="10px"
            fontFamily="'Syne', sans-serif" fontWeight="600" fontSize="13px" color="gray.500"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
