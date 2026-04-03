import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { getCourseLectures } from '../../redux/actions/course';
import Loader from '../Layout/Loader/Loader';
import { FaPlay, FaCheckCircle, FaLock } from 'react-icons/fa';

const CoursePage = ({ user }) => {
  const [lectureNumber, setLectureNumber] = useState(0);
  const { lectures, loading } = useSelector(state => state.course);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(getCourseLectures(params.id));
  }, [dispatch, params.id]);

  // Check if user has purchased this course (it's in their playlist)
  const hasPurchased = user.role === 'admin' ||
    (user.playlist || []).some(p => p.course === params.id);

  if (!hasPurchased) {
    return <Navigate to="/courses" />;
  }

  return loading ? (
    <Loader />
  ) : (
    <Box minH="100vh" bg="#0a0a0f">
      <Box
        display="grid"
        gridTemplateColumns={['1fr', '1fr', '1fr 320px']}
        minH="calc(100vh - 68px)"
      >
        {/* Video + Info */}
        <Box display="flex" flexDirection="column">
          {lectures && lectures.length > 0 ? (
            <>
              {/* Video Player */}
              <Box bg="black" position="relative">
                <video
                  key={lectures[lectureNumber].video.url}
                  width="100%"
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  src={lectures[lectureNumber].video.url}
                  style={{ aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                />
              </Box>

              {/* Lecture Info */}
              <Box bg="white" flex="1" p={['5', '8']}>
                <HStack spacing="2" mb="4">
                  <Badge
                    px="3"
                    py="1"
                    borderRadius="8px"
                    bg="#eef2ff"
                    color="#4f46e5"
                    fontSize="11px"
                    fontWeight="700"
                    fontFamily="'Syne', sans-serif"
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    Lecture {lectureNumber + 1}
                  </Badge>
                  <Badge
                    px="3"
                    py="1"
                    borderRadius="8px"
                    bg="#f0fdf4"
                    color="#16a34a"
                    fontSize="11px"
                    fontWeight="700"
                    fontFamily="'Syne', sans-serif"
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    {lectures.length} Total
                  </Badge>
                </HStack>

                <Heading
                  fontFamily="'Syne', sans-serif"
                  fontSize={['xl', '2xl']}
                  fontWeight="800"
                  color="gray.900"
                  letterSpacing="-0.02em"
                  mb="4"
                >
                  {lectures[lectureNumber].title}
                </Heading>

                <Box bg="gray.50" p="5" borderRadius="14px" border="1px solid" borderColor="gray.100">
                  <Text fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="2">
                    Description
                  </Text>
                  <Text color="gray.700" fontSize="14px" lineHeight="1.8">
                    {lectures[lectureNumber].description}
                  </Text>
                </Box>

                {/* Navigation buttons */}
                <HStack mt="6" spacing="3">
                  <Button
                    isDisabled={lectureNumber === 0}
                    onClick={() => setLectureNumber(prev => prev - 1)}
                    variant="outline"
                    borderRadius="10px"
                    borderColor="gray.200"
                    fontFamily="'Syne', sans-serif"
                    fontWeight="600"
                    fontSize="13px"
                    color="gray.600"
                    _hover={{ borderColor: 'gray.400' }}
                  >
                    ← Previous
                  </Button>
                  <Button
                    isDisabled={lectureNumber === lectures.length - 1}
                    onClick={() => setLectureNumber(prev => prev + 1)}
                    bg="#0a0a1e"
                    color="white"
                    borderRadius="10px"
                    fontFamily="'Syne', sans-serif"
                    fontWeight="600"
                    fontSize="13px"
                    _hover={{ bg: '#1a1a2e' }}
                  >
                    Next →
                  </Button>
                </HStack>
              </Box>
            </>
          ) : (
            <Container centerContent py="20">
              <VStack spacing="4">
                <Box fontSize="56px">📭</Box>
                <Heading fontFamily="'Syne', sans-serif" color="white">No Lectures Yet</Heading>
                <Text color="whiteAlpha.600">This course doesn&apos;t have any lectures yet.</Text>
              </VStack>
            </Container>
          )}
        </Box>

        {/* Sidebar */}
        <Box
          bg="#12121f"
          borderLeft="1px solid"
          borderColor="whiteAlpha.100"
          display="flex"
          flexDirection="column"
          maxH={['none', 'none', '100vh']}
          position={['static', 'static', 'sticky']}
          top="0"
        >
          {/* Header */}
          <Box
            p="5"
            borderBottom="1px solid"
            borderColor="whiteAlpha.100"
            bg="#0a0a1e"
          >
            <HStack spacing="2" mb="1">
              <Box w="6px" h="6px" borderRadius="full" bg="#ff5f3a" />
              <Text fontFamily="'Syne', sans-serif" fontSize="15px" fontWeight="700" color="white">
                Course Content
              </Text>
            </HStack>
            <Text fontSize="12px" color="whiteAlpha.400">
              {lectures && lectures.length} lectures
            </Text>
          </Box>

          {/* Lecture list */}
          <Box overflowY="auto" flex="1"
            css={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '2px' },
            }}
          >
            {lectures && lectures.map((element, index) => (
              <Box
                key={element._id}
                onClick={() => setLectureNumber(index)}
                cursor="pointer"
                display="flex"
                alignItems="flex-start"
                gap="3"
                px="5"
                py="4"
                borderBottom="1px solid"
                borderColor="whiteAlpha.50"
                borderLeft="3px solid"
                borderLeftColor={lectureNumber === index ? '#ff5f3a' : 'transparent'}
                bg={lectureNumber === index ? 'rgba(255,95,58,0.08)' : 'transparent'}
                transition="all 0.2s"
                _hover={{ bg: 'whiteAlpha.50' }}
              >
                <Box
                  w="28px"
                  h="28px"
                  borderRadius="8px"
                  bg={lectureNumber === index ? 'rgba(255,95,58,0.2)' : 'rgba(255,255,255,0.06)'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink="0"
                  mt="0.5"
                >
                  <Icon
                    as={lectureNumber === index ? FaCheckCircle : FaPlay}
                    color={lectureNumber === index ? '#ff5f3a' : 'whiteAlpha.300'}
                    boxSize="10px"
                  />
                </Box>
                <VStack align="flex-start" spacing="0.5" flex="1">
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    color={lectureNumber === index ? '#ff5f3a' : 'whiteAlpha.300'}
                    textTransform="uppercase"
                    letterSpacing="0.08em"
                    fontFamily="'Syne', sans-serif"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <Text
                    fontSize="13px"
                    color={lectureNumber === index ? 'white' : 'whiteAlpha.500'}
                    fontWeight={lectureNumber === index ? '600' : '400'}
                    lineHeight="1.4"
                    noOfLines={2}
                  >
                    {element.title}
                  </Text>
                </VStack>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CoursePage;