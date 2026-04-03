import { Box, VStack } from '@chakra-ui/react';
import React from 'react';

const Loader = () => {
  return (
    <VStack
      h="100vh"
      justifyContent="center"
      alignItems="center"
      bg="#0a0a1e"
      spacing="4"
    >
      {/* Animated logo mark */}
      <Box position="relative" w="48px" h="48px">
        {/* Outer ring */}
        <Box
          position="absolute"
          inset="0"
          borderRadius="14px"
          border="2px solid rgba(255,95,58,0.2)"
          animation="pulse 2s ease-in-out infinite"
          sx={{
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.15)', opacity: 0.5 },
            },
          }}
        />
        {/* Inner dot */}
        <Box
          position="absolute"
          inset="0"
          borderRadius="12px"
          bg="#ff5f3a"
          animation="spin 1.4s cubic-bezier(0.68,-0.55,0.265,1.55) infinite"
          sx={{
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg) scale(1)' },
              '50%': { transform: 'rotate(180deg) scale(0.7)' },
              '100%': { transform: 'rotate(360deg) scale(1)' },
            },
          }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box w="6px" h="6px" borderRadius="full" bg="white" />
        </Box>
      </Box>

      {/* Loading bar */}
      <Box
        w="80px"
        h="2px"
        bg="rgba(255,255,255,0.08)"
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          h="full"
          bg="#ff5f3a"
          borderRadius="full"
          animation="load 1.4s ease-in-out infinite"
          sx={{
            '@keyframes load': {
              '0%': { width: '0%', marginLeft: '0%' },
              '50%': { width: '60%', marginLeft: '20%' },
              '100%': { width: '0%', marginLeft: '100%' },
            },
          }}
        />
      </Box>
    </VStack>
  );
};

export default Loader;