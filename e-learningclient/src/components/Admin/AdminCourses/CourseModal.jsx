import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import { fileUploadCss } from '../../Auth/Register';

const CourseModal = ({
  isOpen,
  onClose,
  id,
  deleteButtonHandler,
  addLectureHandler,
  courseTitle,
  lectures = [],
  loading,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState('');
  const [videoPrev, setVideoPrev] = useState('');

  const changeVideoHandler = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  const handleClose = () => {
    setTitle(''); setDescription(''); setVideo(''); setVideoPrev('');
    onClose();
  };

  const inputStyle = {
    focusBorderColor: '#7c5cfc',
    borderRadius: '10px',
    border: '1.5px solid',
    borderColor: 'gray.200',
    fontSize: '14px',
    h: '46px',
    bg: 'white',
    _hover: { borderColor: 'gray.300' },
  };

  return (
    <Modal isOpen={isOpen} size="full" onClose={handleClose} scrollBehavior="outside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="#f7f7f9" borderRadius="0">
        <ModalHeader
          bg="white"
          borderBottom="1px solid"
          borderColor="gray.100"
          py="4"
          px="8"
        >
          <HStack spacing="3">
            <Box w="8px" h="8px" borderRadius="full" bg="#ff5f3a" />
            <Text fontFamily="'Syne', sans-serif" fontWeight="800" fontSize="lg" color="gray.900">
              {courseTitle}
            </Text>
            <Text fontSize="12px" color="gray.400" fontWeight="400">#{id?.slice(-8)}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton top="4" right="6" />

        <ModalBody p={['4', '8']}>
          <Grid templateColumns={['1fr', '1fr', '2fr 1fr']} gap="6">
            {/* Lectures list */}
            <Box>
              <Heading fontFamily="'Syne', sans-serif" fontSize="18px" fontWeight="700" color="gray.800" mb="5">
                Lectures ({lectures.length})
              </Heading>
              <VStack spacing="3" align="stretch">
                {lectures.map((item, i) => (
                  <VideoCard
                    key={i}
                    title={item.title}
                    description={item.description}
                    num={i + 1}
                    lectureId={item._id}
                    courseId={id}
                    deleteButtonHandler={deleteButtonHandler}
                    loading={loading}
                  />
                ))}
                {lectures.length === 0 && (
                  <Box textAlign="center" py="12" color="gray.400">
                    <Text fontSize="32px" mb="3">📭</Text>
                    <Text fontSize="14px">No lectures yet. Add your first one →</Text>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Add lecture form */}
            <Box>
              <Box
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="20px"
                p="6"
                boxShadow="0 4px 20px rgba(0,0,0,0.04)"
                position="sticky"
                top="20px"
              >
                <Heading fontFamily="'Syne', sans-serif" fontSize="16px" fontWeight="700" color="gray.800" mb="5">
                  Add Lecture
                </Heading>
                <form onSubmit={e => addLectureHandler(e, id, title, description, video)}>
                  <VStack spacing="4">
                    <Box w="full">
                      <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="2">
                        Title
                      </Text>
                      <Input
                        placeholder="Lecture title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        {...inputStyle}
                      />
                    </Box>
                    <Box w="full">
                      <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="2">
                        Description
                      </Text>
                      <Input
                        placeholder="What's covered"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        {...inputStyle}
                      />
                    </Box>
                    <Box w="full">
                      <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="2">
                        Video File
                      </Text>
                      <Input
                        accept="video/mp4"
                        required
                        type="file"
                        focusBorderColor="#7c5cfc"
                        css={{ '&::file-selector-button': { ...fileUploadCss, color: '#7c5cfc' } }}
                        onChange={changeVideoHandler}
                        borderRadius="10px"
                        border="1.5px solid"
                        borderColor="gray.200"
                        h="46px"
                        bg="white"
                      />
                    </Box>

                    {videoPrev && (
                      <Box w="full" borderRadius="12px" overflow="hidden" border="1px solid" borderColor="gray.100">
                        <video controlsList="nodownload" controls src={videoPrev} style={{ width: '100%', borderRadius: '12px' }} />
                      </Box>
                    )}

                    <Button
                      isLoading={loading}
                      w="full"
                      h="46px"
                      bg="#7c5cfc"
                      color="white"
                      type="submit"
                      fontFamily="'Syne', sans-serif"
                      fontWeight="700"
                      fontSize="13px"
                      letterSpacing="0.03em"
                      borderRadius="10px"
                      _hover={{ bg: '#6344e0' }}
                      transition="all 0.2s"
                    >
                      Upload Lecture →
                    </Button>
                  </VStack>
                </form>
              </Box>
            </Box>
          </Grid>
        </ModalBody>

        <ModalFooter bg="white" borderTop="1px solid" borderColor="gray.100">
          <Button
            onClick={handleClose}
            variant="outline"
            borderRadius="10px"
            fontFamily="'Syne', sans-serif"
            fontWeight="600"
            fontSize="13px"
            borderColor="gray.200"
            color="gray.600"
            _hover={{ borderColor: 'gray.400' }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CourseModal;

function VideoCard({ title, description, num, lectureId, courseId, deleteButtonHandler, loading }) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="14px"
      p="5"
      boxShadow="0 2px 10px rgba(0,0,0,0.04)"
      transition="all 0.2s"
      _hover={{ boxShadow: '0 4px 20px rgba(124,92,252,0.1)', borderColor: 'purple.100' }}
    >
      <HStack justify="space-between" align="flex-start">
        <HStack spacing="3" align="flex-start" flex="1">
          <Box
            w="32px"
            h="32px"
            borderRadius="8px"
            bg="#eef2ff"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontFamily="'Syne', sans-serif"
            fontSize="12px"
            fontWeight="800"
            color="#4f46e5"
            flexShrink="0"
          >
            {String(num).padStart(2, '0')}
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="600" color="gray.800" fontFamily="'Syne', sans-serif" mb="1">
              {title}
            </Text>
            <Text fontSize="12px" color="gray.500" lineHeight="1.5" noOfLines={2}>
              {description}
            </Text>
          </Box>
        </HStack>
        <Button
          isLoading={loading}
          size="sm"
          bg="red.50"
          color="red.500"
          borderRadius="8px"
          onClick={() => deleteButtonHandler(courseId, lectureId)}
          _hover={{ bg: 'red.500', color: 'white' }}
          transition="all 0.2s"
          flexShrink="0"
          ml="3"
        >
          <RiDeleteBin7Fill />
        </Button>
      </HStack>
    </Box>
  );
}