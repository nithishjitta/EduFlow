import React from 'react';
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export const ColorModeSwitcher = props => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="sm"
      fontSize="md"
      aria-label={`Switch to ${text} mode`}
      variant="ghost"
      color="current"
      zIndex={'overlay'}
      position={'fixed'}
      top="5"
      right={'5'}
      borderRadius="10px"
      border="1px solid"
      borderColor="whiteAlpha.200"
      _hover={{ bg: 'whiteAlpha.100' }}
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      {...props}
    />
  );
};