import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFail = () => {
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
          {/* Top accent */}
          <Box h="4px" bgGradient="linear(to-r, #ff5f3a, #e04a27)" />

          <Box p={['8', '12']}>
            {/* Error icon */}
            <Box
              w="80px"
              h="80px"
              borderRadius="22px"
              bg="#fff5f5"
              border="1px solid"
              borderColor="red.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb="6"
              fontSize="36px"
            >
              ❌
            </Box>

            <Heading
              fontFamily="'Syne', sans-serif"
              fontSize={['2xl', '3xl']}
              fontWeight="800"
              color="gray.900"
              letterSpacing="-0.03em"
              mb="3"
            >
              Payment Failed
            </Heading>

            <Text fontSize="14px" color="gray.500" lineHeight="1.7" maxW="sm" mx="auto" mb="8">
              Something went wrong with your payment. No charges were made. Please try again or contact support if the issue persists.
            </Text>

            {/* Common reasons */}
            <Box
              bg="orange.50"
              border="1px solid"
              borderColor="orange.100"
              borderRadius="14px"
              p="5"
              mb="8"
              textAlign="left"
            >
              <Text fontSize="12px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="orange.600" mb="3">
                Common Reasons
              </Text>
              <VStack spacing="2" align="flex-start">
                {[
                  'Insufficient funds',
                  'Card details incorrect',
                  'Bank declined the transaction',
                  'Network timeout',
                ].map((r, i) => (
                  <Text key={i} fontSize="13px" color="orange.700">
                    • {r}
                  </Text>
                ))}
              </VStack>
            </Box>

            <VStack spacing="3">
              <Link to="/subscribe" style={{ width: '100%' }}>
                <Button
                  w="full"
                  h="46px"
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
                  Try Again →
                </Button>
              </Link>
              <Link to="/contact" style={{ width: '100%' }}>
                <Button
                  w="full"
                  h="46px"
                  variant="outline"
                  borderColor="gray.200"
                  color="gray.600"
                  fontFamily="'Syne', sans-serif"
                  fontWeight="600"
                  fontSize="14px"
                  borderRadius="10px"
                  _hover={{ borderColor: 'gray.400', color: 'gray.800' }}
                  transition="all 0.2s"
                >
                  Contact Support
                </Button>
              </Link>
            </VStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentFail;