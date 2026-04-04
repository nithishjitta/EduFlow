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
        label: 'YouTube',
        color: '#FF0000',
        svg: (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        ),
      },
      {
        href: 'https://instagram.com',
        label: 'Instagram',
        color: '#E1306C',
        svg: (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
        ),
      },
      {
        href: 'https://github.com',
        label: 'GitHub',
        color: '#fff',
        svg: (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        ),
      },
    ].map(({ href, label, color, svg }) => (
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
        transition="all 0.2s"
        _hover={{
          bg: 'rgba(255,255,255,0.12)',
          color: color,
          borderColor: 'rgba(255,255,255,0.2)',
        }}
      >
        {svg}
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