import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box bg="#0a0a1e" minH="90vh" display="flex" alignItems="center">
      <Container maxW="container.sm">
        <VStack spacing="6" textAlign="center">
          {/* Big 404 */}
          <Box position="relative">
            <Heading
              fontFamily="'Syne', sans-serif"
              fontSize={['80px', '140px']}
              fontWeight="800"
              color="transparent"
              sx={{ WebkitTextStroke: '2px rgba(255,255,255,0.08)' }}
              lineHeight="1"
              letterSpacing="-0.05em"
              userSelect="none"
            >
              404
            </Heading>
            <Box
              position="absolute"
              inset="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={['48px', '72px']}>🔍</Text>
            </Box>
          </Box>

          <VStack spacing="3">
            <Heading
              fontFamily="'Syne', sans-serif"
              fontSize={['xl', '2xl']}
              fontWeight="800"
              color="white"
              letterSpacing="-0.02em"
            >
              Page Not Found
            </Heading>
            <Text fontSize="14px" color="rgba(255,255,255,0.4)" maxW="sm" lineHeight="1.7">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </Text>
          </VStack>

          <Box
            h="1px"
            w="48px"
            bgGradient="linear(to-r, #ff5f3a, #7c5cfc)"
            borderRadius="full"
          />

          <VStack spacing="3">
            <Link to="/">
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
                _hover={{
                  bg: '#e04a27',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 24px rgba(255,95,58,0.35)',
                }}
                transition="all 0.2s"
              >
                Back to Home →
              </Button>
            </Link>
            <Link to="/courses">
              <Button
                h="36px"
                variant="ghost"
                color="rgba(255,255,255,0.35)"
                fontFamily="'Syne', sans-serif"
                fontWeight="500"
                fontSize="13px"
                borderRadius="8px"
                _hover={{ color: 'white', bg: 'rgba(255,255,255,0.06)' }}
              >
                Browse Courses
              </Button>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFound;