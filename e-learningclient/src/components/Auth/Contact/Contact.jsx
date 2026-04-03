import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { contactUs } from '../../../redux/actions/other';
import toast from 'react-hot-toast';

const infoItems = [
  { icon: '📧', label: 'Email', value: 'support@eduflow.com' },
  { icon: '💬', label: 'Live Chat', value: 'Available 9am–6pm IST' },
  { icon: '📍', label: 'Location', value: 'Bangalore, India' },
];

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const { loading, error, message: stateMessage } = useSelector(state => state.other);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(contactUs(name, email, message));
  };

  useEffect(() => {
    if (error) { toast.error(error); dispatch({ type: 'clearError' }); }
    if (stateMessage) { toast.success(stateMessage); dispatch({ type: 'clearMessage' }); }
  }, [dispatch, error, stateMessage]);

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

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'gray.500',
  };

  return (
    <Box bg="#f7f7f9" minH="90vh" py="16">
      <Container maxW="container.lg">
        {/* Header */}
        <Box textAlign="center" mb="14">
          <Heading
            fontFamily="'Syne', sans-serif"
            fontSize={['3xl', '4xl']}
            fontWeight="800"
            color="gray.900"
            letterSpacing="-0.03em"
            mb="3"
          >
            Get in <Box as="span" color="#7c5cfc">Touch</Box>
          </Heading>
          <Text fontSize="15px" color="gray.500" maxW="md" mx="auto">
            Have a question or feedback? We&apos;d love to hear from you.
          </Text>
        </Box>

        <Box display="grid" gridTemplateColumns={['1fr', '1fr', '2fr 1fr']} gap="8">
          {/* Form */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="gray.100"
            borderRadius="20px"
            p={['6', '8', '10']}
            boxShadow="0 4px 20px rgba(0,0,0,0.04)"
          >
            <form onSubmit={submitHandler}>
              <VStack spacing="5">
                <Box w="full">
                  <FormLabel {...labelStyle} htmlFor="name" mb="2">Name</FormLabel>
                  <Input required id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" type="text" {...inputStyle} />
                </Box>
                <Box w="full">
                  <FormLabel {...labelStyle} htmlFor="email" mb="2">Email Address</FormLabel>
                  <Input required id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" {...inputStyle} />
                </Box>
                <Box w="full">
                  <FormLabel {...labelStyle} htmlFor="message" mb="2">Message</FormLabel>
                  <Textarea
                    required
                    id="message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    focusBorderColor="#7c5cfc"
                    borderRadius="10px"
                    border="1.5px solid"
                    borderColor="gray.200"
                    fontSize="14px"
                    rows={5}
                    bg="white"
                    _hover={{ borderColor: 'gray.300' }}
                    resize="none"
                  />
                </Box>

                <Button
                  isLoading={loading}
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
                >
                  Send Message →
                </Button>
              </VStack>
            </form>

            <Box mt="5" pt="5" borderTop="1px solid" borderColor="gray.100">
              <Text fontSize="13px" color="gray.500">
                Looking to request a course?{' '}
                <Link to="/request">
                  <Button variant="link" color="#7c5cfc" fontWeight="700" fontSize="13px">
                    Click here
                  </Button>
                </Link>
              </Text>
            </Box>
          </Box>

          {/* Info */}
          <VStack spacing="4" align="stretch">
            {infoItems.map((item, i) => (
              <Box
                key={i}
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="16px"
                p="5"
                boxShadow="0 2px 10px rgba(0,0,0,0.04)"
              >
                <HStack spacing="3">
                  <Box
                    w="40px"
                    h="40px"
                    bg="#f0eeff"
                    borderRadius="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="18px"
                    flexShrink="0"
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Text fontSize="11px" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" color="gray.400" mb="0.5">
                      {item.label}
                    </Text>
                    <Text fontSize="14px" fontWeight="500" color="gray.800">
                      {item.value}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}

            {/* Quick links box */}
            <Box
              bg="#0a0a1e"
              borderRadius="16px"
              p="5"
              mt="2"
            >
              <Text fontSize="13px" fontWeight="700" fontFamily="'Syne', sans-serif" color="white" mb="3">
                Quick Links
              </Text>
              <VStack spacing="2" align="stretch">
                <Link to="/courses">
                  <Button
                    w="full"
                    variant="ghost"
                    color="whiteAlpha.700"
                    justifyContent="flex-start"
                    fontSize="13px"
                    fontWeight="500"
                    _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                    borderRadius="8px"
                    h="36px"
                  >
                    Browse Courses →
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    w="full"
                    variant="ghost"
                    color="whiteAlpha.700"
                    justifyContent="flex-start"
                    fontSize="13px"
                    fontWeight="500"
                    _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                    borderRadius="8px"
                    h="36px"
                  >
                    About Us →
                  </Button>
                </Link>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;