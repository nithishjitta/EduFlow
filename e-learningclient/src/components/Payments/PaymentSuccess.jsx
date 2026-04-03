import { Box, Button, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../redux/store';
import { useSelector } from 'react-redux';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useSelector(state => state.user);
  const verified = useRef(false);

  useEffect(() => {
    // Only call once, Spring Boot expects session_id as @RequestParam in query string
    if (sessionId && user && !verified.current) {
      verified.current = true;
      axios.post(
        `${server}/verifystripe?session_id=${encodeURIComponent(sessionId)}`,
        {},
        { withCredentials: true }
      ).catch(err => console.error('Verify stripe error:', err));
    }
  }, [sessionId, user]);

  return (
    <Box bg="#f7f7f9" minH="90vh" display="flex" alignItems="center" py="10">
      <Container maxW="container.sm">
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          borderRadius="24px"
          overflow="hidden"
          boxShadow="0 24px 80px rgba(0,0,0,0.08)"
          textAlign="center"
        >
          <Box h="4px" bgGradient="linear(to-r, #00c9a7, #7c5cfc)" />

          <Box p={['8', '12']}>
            <Box
              w="80px" h="80px" borderRadius="22px" bg="#f0fdf4"
              border="1px solid" borderColor="green.100"
              display="flex" alignItems="center" justifyContent="center"
              mx="auto" mb="6" fontSize="36px"
            >
              ✅
            </Box>

            <Heading
              fontFamily="'Syne', sans-serif" fontSize={['2xl', '3xl']}
              fontWeight="800" color="gray.900" letterSpacing="-0.03em" mb="3"
            >
              Payment Successful!
            </Heading>

            <Text fontSize="14px" color="gray.500" lineHeight="1.7" maxW="sm" mx="auto" mb="6">
              Congratulations! You&apos;re now a{' '}
              <Box as="span" fontWeight="700" color="#7c5cfc">Pro Member</Box>{' '}
              with full access to all premium courses and features.
            </Text>

            <HStack justify="center" spacing="3" flexWrap="wrap" mb="8">
              {['⚡ Unlimited Access', '📜 Certificates', '🌍 Community'].map((p, i) => (
                <Box key={i} px="4" py="2" bg="gray.50" borderRadius="10px"
                  border="1px solid" borderColor="gray.100"
                  fontSize="13px" fontWeight="600" color="gray.700"
                >
                  {p}
                </Box>
              ))}
            </HStack>

            {sessionId && (
              <Box bg="gray.50" borderRadius="12px" p="4" mb="6"
                border="1px solid" borderColor="gray.100"
              >
                <Text fontSize="11px" fontWeight="700" textTransform="uppercase"
                  letterSpacing="0.08em" color="gray.400" mb="1"
                >
                  Order Reference
                </Text>
                <Text fontSize="12px" color="gray.600" fontFamily="monospace" noOfLines={1}>
                  {sessionId}
                </Text>
              </Box>
            )}

            <VStack spacing="3">
              <Link to="/profile" style={{ width: '100%' }}>
                <Button w="full" h="46px" bg="#7c5cfc" color="white"
                  fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="14px"
                  letterSpacing="0.03em" borderRadius="10px"
                  _hover={{ bg: '#6344e0', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(124,92,252,0.35)' }}
                  transition="all 0.2s"
                >
                  Go to Profile →
                </Button>
              </Link>
              <Link to="/courses" style={{ width: '100%' }}>
                <Button w="full" h="46px" variant="outline" borderColor="gray.200"
                  color="gray.600" fontFamily="'Syne', sans-serif" fontWeight="600"
                  fontSize="14px" borderRadius="10px"
                  _hover={{ borderColor: 'gray.400', color: 'gray.800' }}
                  transition="all 0.2s"
                >
                  Start Learning
                </Button>
              </Link>
            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;
