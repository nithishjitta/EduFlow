import { Box, Button, Container, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { forgetPassword } from '../../redux/actions/profile';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const { loading, message, error } = useSelector(state => state.profile);
  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(forgetPassword(email));
  };

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: 'clearError' }); }
    if (message) { toast.success(message); dispatch({ type: 'clearMessage' }); }
  }, [dispatch, error, message]);

  return (
    <Container maxW="container.sm" minH="90vh" display="flex" alignItems="center" py="10">
      <Box
        w="full"
        bg="white"
        borderRadius="2xl"
        boxShadow="0 24px 80px rgba(0,0,0,0.08)"
        border="1px solid"
        borderColor="gray.100"
        overflow="hidden"
      >
        {/* Top accent bar */}
        <Box h="4px" bgGradient="linear(to-r, #ff5f3a, #7c5cfc)" />

        <Box p={['8', '12']}>
          <Box
            w="56px"
            h="56px"
            bg="orange.50"
            borderRadius="16px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="24px"
            mb="6"
          >
            🔑
          </Box>

          <Heading
            fontFamily="'Syne', sans-serif"
            fontSize="2xl"
            fontWeight="800"
            color="gray.900"
            letterSpacing="-0.02em"
            mb="2"
          >
            Forgot Password?
          </Heading>
          <Text fontSize="14px" color="gray.500" mb="8" lineHeight="1.7">
            No worries. Enter your email address and we&apos;ll send you a link to reset your password.
          </Text>

          <form onSubmit={submitHandler} style={{ width: '100%' }}>
            <VStack spacing="5">
              <Box w="full">
                <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.600" mb="2">
                  Email Address
                </Text>
                <Input
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  focusBorderColor="#ff5f3a"
                  borderRadius="10px"
                  border="1.5px solid"
                  borderColor="gray.200"
                  fontSize="14px"
                  h="46px"
                  _hover={{ borderColor: 'gray.300' }}
                />
              </Box>

              <Button
                isLoading={loading}
                type="submit"
                w="full"
                h="46px"
                bg="#ff5f3a"
                color="white"
                fontFamily="'Syne', sans-serif"
                fontWeight="700"
                fontSize="14px"
                letterSpacing="0.03em"
                borderRadius="10px"
                _hover={{ bg: '#e04a27', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(255,95,58,0.35)' }}
                transition="all 0.2s"
              >
                Send Reset Link →
              </Button>
            </VStack>
          </form>

          <HStack justify="center" mt="6">
            <Text fontSize="13px" color="gray.500">Remember it?</Text>
            <Button
              variant="link"
              color="#7c5cfc"
              fontWeight="700"
              fontSize="13px"
              as="a"
              href="/login"
            >
              Back to Sign In
            </Button>
          </HStack>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgetPassword;