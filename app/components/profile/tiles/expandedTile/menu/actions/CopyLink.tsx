import { useState } from 'react';

import { Button } from '@chakra-ui/react';

import { Link2, Link21 } from 'iconsax-react';

const CopyLink = ({ link }: { link: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  }

  return (
    <Button
      leftIcon={mouseDown ? <Link2 /> : <Link21 />}
      onClick={handleClick}
      variant="ghost"
      w={['100vw', '100%']}
      color="music.200"
      _hover={{ color: 'white' }}
      justifyContent="left"
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
      onMouseLeave={() => setIsCopied(false)}
    >
      {isCopied ? 'Copied!' : 'Copy Link'}
    </Button>
  );
};

export default CopyLink;