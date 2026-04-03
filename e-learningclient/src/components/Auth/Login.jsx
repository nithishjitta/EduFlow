import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/user';

const perks = [
  { icon: '🎥', text: 'Access 300+ expert video courses' },
  { icon: '📜', text: 'Earn verified certificates' },
  { icon: '⚡', text: 'Learn at your own pace' },
  { icon: '🌍', text: 'Join 12,000+ students worldwide' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Container maxW="container.xl" minH="90vh" display="flex" alignItems="center" py="10">
      <Box
        w="full"
        display="grid"
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 24px 80px rgba(0,0,0,0.10)"
        border="1px solid"
        borderColor="gray.100"
      >
        {/* Left Panel */}
        <Box
          bg="#0a0a1e"
          p={['8', '12']}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          minH="540px"
          position="relative"
          overflow="hidden"
          _after={{
            content: '""',
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(124,92,252,0.2) 0%, transparent 70%)',
            bottom: '-100px',
            right: '-100px',
            pointerEvents: 'none',
          }}
        >
          <Box>
            <HStack mb="10">
              <Box w="8px" h="8px" borderRadius="full" bg="#ff5f3a" />
              <Text fontFamily="'Syne', sans-serif" fontWeight="800" fontSize="lg" color="white">
                EduFlow
              </Text>
            </HStack>
            <Heading
              fontFamily="'Syne', sans-serif"
              fontSize={['3xl', '4xl']}
              fontWeight="800"
              color="white"
              lineHeight="1.1"
              letterSpacing="-0.03em"
              mb="6"
            >
              Welcome back<br />to{' '}
              <Box as="span" color="#ff5f3a">learning.</Box>
            </Heading>
            <Text color="whiteAlpha.600" fontSize="sm" lineHeight="1.8" maxW="sm">
              Pick up where you left off. Your courses, progress and certificates are waiting.
            </Text>
          </Box>

          <VStack spacing="4" align="stretch" zIndex="1">
            {perks.map((p, i) => (
              <HStack key={i} spacing="4">
                <Box
                  w="36px"
                  h="36px"
                  bg="whiteAlpha.100"
                  borderRadius="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="16px"
                  flexShrink="0"
                >
                  {p.icon}
                </Box>
                <Text color="whiteAlpha.700" fontSize="sm">{p.text}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Right Form */}
        <Box bg="white" p={['8', '12']} display="flex" flexDirection="column" justifyContent="center">
          <Heading
            fontFamily="'Syne', sans-serif"
            fontSize="2xl"
            fontWeight="800"
            color="gray.900"
            letterSpacing="-0.02em"
            mb="1"
          >
            Sign In
          </Heading>
          <Text fontSize="sm" color="gray.500" mb="8">
            Good to see you again. Ready to continue?
          </Text>

          <form onSubmit={submitHandler} style={{ width: '100%' }}>
            <VStack spacing="5">
              <Box w="full">
                <FormLabel
                  fontSize="11px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  color="gray.600"
                  mb="2"
                >
                  Email Address
                </FormLabel>
                <Input
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  focusBorderColor="violet.500"
                  borderRadius="10px"
                  border="1.5px solid"
                  borderColor="gray.200"
                  fontSize="14px"
                  h="46px"
                  _hover={{ borderColor: 'gray.300' }}
                />
              </Box>

              <Box w="full">
                <FormLabel
                  fontSize="11px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  color="gray.600"
                  mb="2"
                >
                  Password
                </FormLabel>
                <Input
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  focusBorderColor="violet.500"
                  borderRadius="10px"
                  border="1.5px solid"
                  borderColor="gray.200"
                  fontSize="14px"
                  h="46px"
                  _hover={{ borderColor: 'gray.300' }}
                />
              </Box>

              <Box w="full" textAlign="right" mt="-2">
                <Link to="/forgetpassword">
                  <Button
                    variant="link"
                    fontSize="12px"
                    color="violet.500"
                    fontWeight="600"
                    fontFamily="'DM Sans', sans-serif"
                  >
                    Forgot password?
                  </Button>
                </Link>
              </Box>

              <Button
                type="submit"
                w="full"
                h="46px"
                bg="#0a0a1e"
                color="white"
                fontFamily="'Syne', sans-serif"
                fontWeight="700"
                fontSize="14px"
                letterSpacing="0.03em"
                borderRadius="10px"
                _hover={{ bg: '#1a1a2e', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                transition="all 0.2s"
              >
                Sign In →
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" mt="6" fontSize="13px" color="gray.500">
            Don&apos;t have an account?{' '}
            <Link to="/register">
              <Button variant="link" color="violet.500" fontWeight="700" fontSize="13px">
                Create one free
              </Button>
            </Link>
          </Text>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;