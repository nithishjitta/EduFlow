import {
  Box, Button, Container, Heading, HStack, Icon, Text, VStack, SimpleGrid,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaBookOpen, FaStar, FaShieldAlt, FaInfinity, FaMobileAlt } from 'react-icons/fa';

const perks = [
  { icon: FaPlay,       title: 'Lifetime Access',        desc: 'Pay once, access forever — no expiry' },
  { icon: FaBookOpen,   title: 'All Lectures Included',  desc: 'Every video, every resource in the course' },
  { icon: FaStar,       title: 'Certificate Included',   desc: 'Shareable certificate upon completion' },
  { icon: FaShieldAlt,  title: '7-Day Refund',           desc: 'Not satisfied? Full refund, no questions' },
  { icon: FaInfinity,   title: 'Future Updates Free',    desc: 'Course updates included at no extra cost' },
  { icon: FaMobileAlt,  title: 'Mobile Access',          desc: 'Learn on desktop, tablet, or phone' },
];

const pricePoints = [
  { range: '$6 – $7', label: 'Starter Courses',     desc: 'Great for beginners exploring a new field',     color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', inr: '₹500–₹580' },
  { range: '$8 – $9', label: 'Standard Courses',    desc: 'Comprehensive courses with real-world projects', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', inr: '₹664–₹747', popular: true },
  { range: '$10',     label: 'Premium Courses',     desc: 'Deep dives with mentorship-quality content',    color: '#d97706', bg: '#fffbeb', border: '#fde68a', inr: '₹830' },
];

const Subscribe = () => {
  const navigate = useNavigate();

  return (
    <Box bg="#f7f7f9" minH="100vh">
      {/* Hero */}
      <Box bg="#0a0a1e" py="16" px="8" textAlign="center" position="relative" overflow="hidden"
        _after={{
          content: '""', position: 'absolute', w: '600px', h: '600px',
          background: 'radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 70%)',
          top: '-200px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
        }}
      >
        <Box display="inline-flex" alignItems="center" gap="2" px="4" py="2"
          bg="rgba(124,92,252,0.12)" border="1px solid rgba(124,92,252,0.3)"
          borderRadius="full" fontSize="12px" color="rgba(255,255,255,0.7)"
          fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" mb="5"
        >
          💡 No Subscription — Pay Only For What You Want
        </Box>
        <Heading fontFamily="'Syne', sans-serif" fontSize={['2xl', '4xl']} fontWeight="800"
          color="white" letterSpacing="-0.03em" mb="4"
        >
          Simple, Honest{' '}
          <Box as="span" color="#7c5cfc">Pricing</Box>
        </Heading>
        <Text fontSize={['sm', 'md']} color="rgba(255,255,255,0.5)" maxW="lg" mx="auto" mb="6">
          Every course is priced between $6 and $10. No subscription. No recurring charges. Buy the course you want, own it forever.
        </Text>
        <HStack justify="center" spacing="8" flexWrap="wrap">
          {[{ val: '$6–$10', label: 'Per Course' }, { val: '₹500–₹830', label: 'In Rupees' }, { val: '15+', label: 'Courses' }, { val: '7-Day', label: 'Refund' }].map((s, i) => (
            <Box key={i} textAlign="center">
              <Text fontFamily="'Syne', sans-serif" fontSize="22px" fontWeight="800" color="white">{s.val}</Text>
              <Text fontSize="11px" color="rgba(255,255,255,0.4)" textTransform="uppercase" letterSpacing="0.06em">{s.label}</Text>
            </Box>
          ))}
        </HStack>
      </Box>

      <Container maxW="container.lg" py="16">
        {/* Price Tiers */}
        <Heading fontFamily="'Syne', sans-serif" fontSize="22px" fontWeight="800" color="gray.900"
          letterSpacing="-0.02em" textAlign="center" mb="2"
        >
          Course Price Tiers
        </Heading>
        <Text textAlign="center" color="gray.500" fontSize="14px" mb="8">
          All prices include lifetime access + certificate
        </Text>

        <SimpleGrid columns={[1, 3]} spacing="5" mb="14">
          {pricePoints.map((tier, i) => (
            <Box key={i} bg={tier.bg} border="2px solid" borderColor={tier.popular ? tier.border : 'transparent'}
              borderRadius="20px" p="6" position="relative" transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
            >
              {tier.popular && (
                <Box position="absolute" top="-12px" left="50%" transform="translateX(-50%)"
                  bg="#4f46e5" color="white" px="4" py="1" borderRadius="full"
                  fontSize="11px" fontWeight="700" fontFamily="'Syne', sans-serif"
                  letterSpacing="0.06em" textTransform="uppercase" whiteSpace="nowrap"
                >
                  Most Popular
                </Box>
              )}
              <Text fontFamily="'Syne', sans-serif" fontSize="28px" fontWeight="900" color={tier.color} mb="1">
                {tier.range}
              </Text>
              <Text fontSize="12px" color="gray.500" fontWeight="600" mb="1">{tier.inr}</Text>
              <Text fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="16px" color="gray.800" mb="2">
                {tier.label}
              </Text>
              <Text fontSize="13px" color="gray.600" lineHeight="1.5">{tier.desc}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* What you get */}
        <Heading fontFamily="'Syne', sans-serif" fontSize="22px" fontWeight="800" color="gray.900"
          letterSpacing="-0.02em" textAlign="center" mb="8"
        >
          Every course includes
        </Heading>

        <SimpleGrid columns={[1, 2, 3]} spacing="4" mb="12">
          {perks.map(({ icon, title, desc }, i) => (
            <HStack key={i} spacing="4" p="5" bg="white" border="1px solid" borderColor="gray.100"
              borderRadius="16px" boxShadow="0 2px 10px rgba(0,0,0,0.04)" transition="all 0.2s"
              _hover={{ boxShadow: '0 8px 24px rgba(124,92,252,0.08)', borderColor: 'purple.100', transform: 'translateX(4px)' }}
            >
              <Box w="44px" h="44px" bg="#f0eeff" borderRadius="12px" display="flex"
                alignItems="center" justifyContent="center" flexShrink={0}
              >
                <Icon as={icon} color="#7c5cfc" boxSize="18px" />
              </Box>
              <Box>
                <Text fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="14px" color="gray.900" mb="0.5">{title}</Text>
                <Text fontSize="12px" color="gray.500">{desc}</Text>
              </Box>
            </HStack>
          ))}
        </SimpleGrid>

        {/* CTA */}
        <Box bg="#0a0a1e" borderRadius="24px" p={['8', '12']} textAlign="center" position="relative" overflow="hidden">
          <Box position="absolute" w="300px" h="300px" borderRadius="full"
            bg="rgba(124,92,252,0.15)" top="-100px" left="50%" transform="translateX(-50%)" pointerEvents="none"
          />
          <VStack spacing="4" position="relative" zIndex={1}>
            <Heading fontFamily="'Syne', sans-serif" fontSize={['xl', '2xl']} fontWeight="800"
              color="white" letterSpacing="-0.02em"
            >
              Ready to start learning?
            </Heading>
            <Text color="rgba(255,255,255,0.5)" fontSize="14px" maxW="sm" mx="auto">
              Browse our catalog and pick the course that fits your goals. No subscription, no commitment.
            </Text>
            <HStack spacing="3" flexWrap="wrap" justify="center">
              <Button h="50px" px="8" bg="#7c5cfc" color="white"
                fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="15px" borderRadius="12px"
                _hover={{ bg: '#6344e0', transform: 'translateY(-2px)', boxShadow: '0 12px 30px rgba(124,92,252,0.4)' }}
                transition="all 0.25s" onClick={() => navigate('/courses')}
              >
                Browse Courses →
              </Button>
              <Button h="50px" px="8" variant="outline" borderColor="rgba(255,255,255,0.2)" color="rgba(255,255,255,0.8)"
                fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="15px" borderRadius="12px"
                _hover={{ borderColor: 'white', color: 'white' }} onClick={() => navigate('/recommend')}
              >
                Get AI Recommendations
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Subscribe;
