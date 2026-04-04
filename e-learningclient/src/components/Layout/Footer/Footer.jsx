import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import {
  TiSocialYoutubeCircular,
  TiSocialInstagramCircular,
} from 'react-icons/ti';
import { DiGithub } from 'react-icons/di';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Courses', url: '/courses' },
  { label: 'AI Recommendations', url: '/recommend' },
  { label: 'Pricing', url: '/subscribe' },
  { label: 'About', url: '/about' },
  { label: 'Contact', url: '/contact' },
];

const Footer = () => {
  return (
    <Box
      bg="#0a0a1e"
      borderTop="1px solid rgba(255,255,255,0.06)"
      py="10"
      px={['4', '8']}
    >
      <Container maxW="container.xl">
        <Stack
          direction={['column', 'row']}
          justify="space-between"
          align={['center', 'flex-start']}
          spacing={['8', '0']}
          mb="8"
        >
          {/* Brand */}
          <VStack align={['center', 'flex-start']} spacing="3">
            <HStack spacing="2">
              <Box w="8px" h="8px" borderRadius="full" bg="#ff5f3a" flexShrink="0" />
              <Text
                fontFamily="'Syne', sans-serif"
                fontWeight="800"
                fontSize="18px"
                color="white"
                letterSpacing="-0.02em"
              >
                EduFlow
              </Text>
            </HStack>
            <Text
              fontSize="13px"
              color="rgba(255,255,255,0.35)"
              maxW="240px"
              textAlign={['center', 'left']}
              lineHeight="1.6"
            >
              Expert-led courses from $6–$10. No subscription. Buy once, learn forever.
            </Text>
          </VStack>

          {/* Links */}
          <VStack align={['center', 'flex-start']} spacing="2">
            <Text
              fontSize="11px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="rgba(255,255,255,0.25)"
              mb="1"
            >
              Quick Links
            </Text>
            {footerLinks.map(({ label, url }) => (
              <Link key={url} to={url}>
                <Text
                  fontSize="13px"
                  color="rgba(255,255,255,0.45)"
                  _hover={{ color: 'white' }}
                  transition="color 0.15s"
                >
                  {label}
                </Text>
              </Link>
            ))}
          </VStack>

          {/* Social */}
          <VStack align={['center', 'flex-start']} spacing="3">
            <Text
              fontSize="11px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="rgba(255,255,255,0.25)"
            >
              Follow Us
            </Text>
            <HStack spacing="2">
              {[
                {
                  href: 'https://youtube.com',
                  Icon: FaYoutube,
                  label: 'YouTube',
                },
                {
                  href: 'https://instagram.com',
                  Icon: FaInstagram,
                  label: 'Instagram',
                },
                {
                  href: 'https://github.com',
                  Icon: FaGithub,
                  label: 'GitHub',
                },
              ].map(({ href, Icon, label }) => (
                <Box
                  key={label}
                  as="a"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  w="38px"
                  h="38px"
                  borderRadius="10px"
                  bg="rgba(255,255,255,0.06)"
                  border="1px solid rgba(255,255,255,0.08)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="rgba(255,255,255,0.5)"
                  fontSize="20px"
                  _hover={{
                    bg: 'rgba(255,255,255,0.12)',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}
                  transition="all 0.2s"
                >
                  <Icon />
                </Box>
              ))}
            </HStack>
          </VStack>
        </Stack>

        {/* Bottom bar */}
        <Box
          borderTop="1px solid rgba(255,255,255,0.06)"
          pt="6"
          display="flex"
          flexDirection={['column', 'row']}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <Text fontSize="12px" color="rgba(255,255,255,0.25)">
            © {new Date().getFullYear()} EduFlow. All rights reserved.
          </Text>
          <HStack spacing="4">
            <Text fontSize="12px" color="rgba(255,255,255,0.2)" cursor="pointer" _hover={{ color: 'rgba(255,255,255,0.5)' }}>
              Privacy Policy
            </Text>
            <Text fontSize="12px" color="rgba(255,255,255,0.2)" cursor="pointer" _hover={{ color: 'rgba(255,255,255,0.5)' }}>
              Terms of Service
            </Text>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;