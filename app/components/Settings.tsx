import { IconButton, keyframes } from '@chakra-ui/react';
import { Setting2 } from 'iconsax-react';
import { motion } from 'framer-motion';
import { useNavigate } from '@remix-run/react';

const Settings = () => {
  const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(359deg); }
`;
  const navigate = useNavigate();

  return (
    <IconButton
      as={motion.div}
      aria-label="settings"
      icon={<Setting2 />}
      variant="ghost"
      onClick={() => navigate(`/settings`)}
      _active={{ boxShadow: 'none' }}
      _hover={{ boxShadow: 'none', opacity: 1, animation: `${spin} 4s infinite linear` }}
      opacity="0.5"
      transition="opacity 2s ease in out"
      cursor="pointer"
    />
  );
};
export default Settings;