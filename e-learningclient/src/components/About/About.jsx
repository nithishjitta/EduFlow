import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { RiSecurePaymentFill, RiStarFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import introVideo from '../../assets/videos/intro.mp4';
import termsAndCondition from '../../assets/docs/termsAndCondition';

const stats = [
  { val: '12k+', label: 'Students' },
  { val: '300+', label: 'Courses' },
  { val: '98%', label: 'Satisfaction' },
  { val: '50+', label: 'Instructors' },
];

const Founder = () => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.100"
    borderRadius="20px"
    p={['6', '8']}
    boxShadow="0 4px 20px rgba(0,0,0,0.05)"
    mb="8"
  >
    <Stack direction={['column', 'row']} spacing={['6', '10']} align={['center', 'flex-start']}>
      <Box position="relative" flexShrink="0">
        <Avatar
          src="https://www.thefounder.in/wp-content/uploads/2020/09/192x192.jpg"
          boxSize={['24', '28']}
          border="3px solid"
          borderColor="gray.100"
        />
        <Box
          position="absolute"
          bottom="-2"
          right="-2"
          w="28px"
          h="28px"
          bg="#7c5cfc"
          borderRadius="8px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 2px 8px rgba(124,92,252,0.4)"
        >
          <RiStarFill color="white" size="14px" />
        </Box>
      </Box>

      <VStack align={['center', 'flex-start']} spacing="2">
        <Box
          px="3"
          py="1"
          bg="#f0eeff"
          borderRadius="8px"
          fontSize="11px"
          fontWeight="700"
          color="#7c5cfc"
          textTransform="uppercase"
          letterSpacing="0.08em"
          fontFamily="'Syne', sans-serif"
        >
          Co-Founder
        </Box>
        <Heading
          fontFamily="'Syne', sans-serif"
          fontSize={['lg', '2xl']}
          fontWeight="800"
          color="gray.900"
          letterSpacing="-0.02em"
        >
          Name
        </Heading>
        <Text color="gray.500" fontSize="14px" lineHeight="1.7" textAlign={['center', 'left']} maxW="lg">
          Description and Mission — passionate about making quality education accessible to everyone, everywhere.
        </Text>

      </VStack>
    </Stack>
  </Box>
);

const VideoPlayer = () => (
  <Box
    bg="black"
    borderRadius="20px"
    overflow="hidden"
    border="1px solid"
    borderColor="gray.100"
    boxShadow="0 8px 40px rgba(0,0,0,0.12)"
    mb="8"
  >
    <video
      autoPlay
      loop
      muted
      controls
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
      src={introVideo}
      style={{ width: '100%', display: 'block' }}
    />
  </Box>
);

const TandC = ({ termsAndCondition }) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.100"
    borderRadius="20px"
    p={['6', '8']}
    boxShadow="0 4px 20px rgba(0,0,0,0.04)"
    mb="8"
  >
    <Heading
      fontFamily="'Syne', sans-serif"
      fontSize="18px"
      fontWeight="700"
      color="gray.800"
      letterSpacing="-0.01em"
      mb="4"
    >
      Terms & Conditions
    </Heading>
    <Box
      h="200px"
      overflowY="scroll"
      bg="gray.50"
      borderRadius="12px"
      p="5"
      border="1px solid"
      borderColor="gray.100"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#7c5cfc', borderRadius: '2px' },
      }}
    >
      <Text fontSize="13px" color="gray.600" lineHeight="1.8" fontFamily="'DM Sans', sans-serif">
        {termsAndCondition}
      </Text>
    </Box>
    <Box
      mt="4"
      px="4"
      py="3"
      bg="orange.50"
      borderRadius="10px"
      border="1px solid"
      borderColor="orange.100"
    >
      <Text fontSize="12px" fontWeight="600" color="orange.700">
        ⚠️ Refund only applicable for cancellation within 7 days.
      </Text>
    </Box>
  </Box>
);

const About = () => {
  return (
    <Box bg="#f7f7f9" minH="95vh">
      {/* Hero */}
      <Box
        bg="#0a0a1e"
        py="16"
        px="8"
        textAlign="center"
        position="relative"
        overflow="hidden"
        _after={{
          content: '""',
          position: 'absolute',
          w: '500px',
          h: '500px',
          background: 'radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      >
        <Heading
          fontFamily="'Syne', sans-serif"
          fontSize={['3xl', '5xl']}
          fontWeight="800"
          color="white"
          letterSpacing="-0.03em"
          mb="4"
        >
          About{' '}
          <Box as="span" color="#7c5cfc">EduFlow</Box>
        </Heading>
        <Text fontSize={['sm', 'md']} color="whiteAlpha.600" maxW="lg" mx="auto" mb="8">
          We are a premium video learning platform built to help you grow your skills and career.
        </Text>

        {/* Stats */}
        <HStack
          justify="center"
          spacing={['6', '16']}
          flexWrap="wrap"
          gap="6"
        >
          {stats.map((s, i) => (
            <VStack key={i} spacing="0">
              <Text
                fontFamily="'Syne', sans-serif"
                fontSize={['2xl', '3xl']}
                fontWeight="800"
                color="white"
                letterSpacing="-0.03em"
              >
                {s.val}
              </Text>
              <Text fontSize="12px" color="whiteAlpha.500" textTransform="uppercase" letterSpacing="0.08em">
                {s.label}
              </Text>
            </VStack>
          ))}
        </HStack>
      </Box>

      <Container maxW="container.lg" py="12">
        {/* Mission */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="20px"
          p={['6', '8']}
          boxShadow="0 4px 20px rgba(0,0,0,0.04)"
          mb="8"
        >
          <Stack direction={['column', 'row']} align="center" justify="space-between" spacing="6">
            <VStack align={['center', 'flex-start']} spacing="3">
              <Box
                px="3"
                py="1"
                bg="#f0eeff"
                borderRadius="8px"
                fontSize="11px"
                fontWeight="700"
                color="#7c5cfc"
                textTransform="uppercase"
                letterSpacing="0.08em"
                fontFamily="'Syne', sans-serif"
              >
                Our Mission
              </Box>
              <Heading
                fontFamily="'Syne', sans-serif"
                fontSize={['xl', '2xl']}
                fontWeight="800"
                color="gray.900"
                letterSpacing="-0.02em"
                textAlign={['center', 'left']}
              >
                Learn Without Limits
              </Heading>
              <Text fontSize="14px" color="gray.500" lineHeight="1.7" textAlign={['center', 'left']} maxW="lg">
                We are a video streaming platform with premium courses available for members. Expert instructors, professional content, real-world skills.
              </Text>
            </VStack>
            <Link to="/subscribe">
              <Button
                h="46px"
                px="8"
                bg="#ff5f3a"
                color="white"
                fontFamily="'Syne', sans-serif"
                fontWeight="700"
                fontSize="14px"
                letterSpacing="0.03em"
                borderRadius="10px"
                flexShrink="0"
                _hover={{
                  bg: '#e04a27',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 24px rgba(255,95,58,0.35)',
                }}
                transition="all 0.2s"
              >
                View Our Plans →
              </Button>
            </Link>
          </Stack>
        </Box>


        {/* Video */}
        <Heading
          fontFamily="'Syne', sans-serif"
          fontSize="18px"
          fontWeight="700"
          color="gray.700"
          mb="5"
          letterSpacing="-0.01em"
        >
          Introduction Video
        </Heading>
        <VideoPlayer />

        {/* T&C */}
        <TandC termsAndCondition={termsAndCondition} />

        {/* Payment badge */}
        <Box
          display="inline-flex"
          alignItems="center"
          gap="3"
          px="5"
          py="3"
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="12px"
          boxShadow="0 2px 10px rgba(0,0,0,0.04)"
        >
          <RiSecurePaymentFill color="#16a34a" size="18px" />
          <Text fontSize="13px" fontWeight="600" color="gray.700" textTransform="uppercase" letterSpacing="0.06em">
            Payments secured by Stripe
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default About;