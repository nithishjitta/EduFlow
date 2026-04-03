import {
  Avatar,
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
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../../redux/actions/user';

export const fileUploadCss = {
  cursor: 'pointer',
  marginLeft: '-5%',
  width: '110%',
  border: 'none',
  height: '100%',
  color: '#7c5cfc',
  backgroundColor: 'white',
};

const fileUploadStyle = {
  '&::file-selector-button': fileUploadCss,
};

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [imagePrev, setImagePrev] = useState();
  const [image, setImage] = useState();
  const dispatch = useDispatch();

  const changeImageHandler = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = e => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('name', name);
    myForm.append('email', email);
    myForm.append('password', password);
    myForm.append('file', image);
    dispatch(register(myForm));
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
          bg="linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
          p={['8', '12']}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          minH="580px"
          position="relative"
          overflow="hidden"
          _after={{
            content: '""',
            position: 'absolute',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%)',
            top: '-50px',
            right: '-50px',
            pointerEvents: 'none',
          }}
        >
          <Box>
            <HStack mb="10">
              <Box w="8px" h="8px" borderRadius="full" bg="#00c9a7" />
              <Text fontFamily="'Syne', sans-serif" fontWeight="800" fontSize="lg" color="white">
                EduFlow
              </Text>
            </HStack>
            <Heading
              fontFamily="'Syne', sans-serif"
              fontSize={['2xl', '3xl']}
              fontWeight="800"
              color="white"
              lineHeight="1.1"
              letterSpacing="-0.03em"
              mb="4"
            >
              Start your{' '}
              <Box as="span" color="#00c9a7">learning</Box>
              <br />journey today.
            </Heading>
            <Text color="whiteAlpha.600" fontSize="sm" lineHeight="1.8">
              Join thousands of students already building in-demand skills on EduFlow.
            </Text>
          </Box>

          {/* Testimonial card */}
          <Box
            bg="whiteAlpha.100"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="16px"
            p="5"
            zIndex="1"
          >
            <HStack spacing="3" mb="3">
              <Box
                w="38px"
                h="38px"
                borderRadius="10px"
                bgGradient="linear(135deg, #7c5cfc, #ff5f3a)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontFamily="'Syne', sans-serif"
                fontSize="14px"
                fontWeight="700"
                color="white"
                flexShrink="0"
              >
                R
              </Box>
              <Box>
                <Text fontSize="13px" fontWeight="600" color="white">Rahul joined 2 days ago</Text>
                <Text fontSize="11px" color="whiteAlpha.500">Completed React Bootcamp ✅</Text>
              </Box>
            </HStack>
            <Text fontSize="13px" color="whiteAlpha.700" fontStyle="italic" lineHeight="1.6">
              "Best learning platform I've used. The courses are top-notch and the community is amazing."
            </Text>
          </Box>
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
            Create Account
          </Heading>
          <Text fontSize="sm" color="gray.500" mb="6">
            Free forever. No credit card required.
          </Text>

          <form onSubmit={submitHandler} style={{ width: '100%' }}>
            <VStack spacing="4">
              {/* Avatar upload */}
              <Box display="flex" justifyContent="center" w="full" mb="2">
                <Box position="relative">
                  <Avatar
                    size="xl"
                    src={imagePrev}
                    bg="gray.100"
                    border="3px dashed"
                    borderColor={imagePrev ? 'violet.400' : 'gray.200'}
                  />
                  <Box
                    position="absolute"
                    bottom="-2"
                    right="-2"
                    w="26px"
                    h="26px"
                    bg="#7c5cfc"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="12px"
                    color="white"
                    cursor="pointer"
                    boxShadow="0 2px 8px rgba(124,92,252,0.4)"
                  >
                    +
                  </Box>
                </Box>
              </Box>

              <Box w="full">
                <FormLabel fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.600" mb="2">
                  Full Name
                </FormLabel>
                <Input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  type="text"
                  focusBorderColor="#7c5cfc"
                  borderRadius="10px"
                  border="1.5px solid"
                  borderColor="gray.200"
                  fontSize="14px"
                  h="46px"
                  _hover={{ borderColor: 'gray.300' }}
                />
              </Box>

              <Box w="full">
                <FormLabel fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.600" mb="2">
                  Email Address
                </FormLabel>
                <Input
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  focusBorderColor="#7c5cfc"
                  borderRadius="10px"
                  border="1.5px solid"
                  borderColor="gray.200"
                  fontSize="14px"
                  h="46px"
                  _hover={{ borderColor: 'gray.300' }}
                />
              </Box>

              <Box w="full">
                <FormLabel fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.600" mb="2">
                  Password
                </FormLabel>
                <Input
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  type="password"
                  focusBorderColor="#7c5cfc"
                  borderRadius="10px"
                  border="1.5px solid"
                  borderColor="gray.200"
                  fontSize="14px"
                  h="46px"
                  _hover={{ borderColor: 'gray.300' }}
                />
              </Box>

              <Box w="full">
                <FormLabel fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.600" mb="2">
                  Profile Photo
                </FormLabel>
                <Input
                  accept="image/*"
                  required
                  id="chooseAvatar"
                  type="file"
                  focusBorderColor="#7c5cfc"
                  css={fileUploadStyle}
                  onChange={changeImageHandler}
                  borderRadius="10px"
                  border="1.5px solid"
                  borderColor="gray.200"
                  h="46px"
                />
              </Box>

              <Button
                type="submit"
                w="full"
                h="46px"
                bg="#7c5cfc"
                color="white"
                fontFamily="'Syne', sans-serif"
                fontWeight="700"
                fontSize="14px"
                letterSpacing="0.03em"
                borderRadius="10px"
                _hover={{ bg: '#6344e0', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(124,92,252,0.35)' }}
                transition="all 0.2s"
                mt="2"
              >
                Create Account →
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" mt="5" fontSize="13px" color="gray.500">
            Already have an account?{' '}
            <Link to="/login">
              <Button variant="link" color="#7c5cfc" fontWeight="700" fontSize="13px">
                Sign in
              </Button>
            </Link>
          </Text>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;