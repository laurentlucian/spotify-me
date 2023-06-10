import { Box, Image } from '@chakra-ui/react';

import { useFullscreen } from '~/components/fullscreen/Fullscreen';
import FullscreenPlayback from '~/components/fullscreen/playback/FullscreenPlayback';
import FullscreenTrack from '~/components/fullscreen/track/FullscreenTrack';
import type { ProfileWithPlayback } from '~/components/tiles/TilesPlayback';
import type { ProfileWithInfo } from '~/lib/types/types';

const TileUserImage = ({ size = '50px', user }: { size?: string; user: ProfileWithInfo }) => {
  const { components, onOpen } = useFullscreen();

  const isFullscreen = components.length > 0; //

  return (
    <Box
      pos="relative"
      w={size}
      h={size}
      overflow="hidden"
      border={user.playback ? '1.5px solid' : undefined}
      cursor={user.playback && !isFullscreen ? 'pointer' : undefined}
      borderColor="white"
      borderRadius="50%"
      onClick={(e) => {
        if (user.playback && !isFullscreen) {
          e.preventDefault();
          onOpen(<FullscreenPlayback user={user as ProfileWithPlayback} />);
        }
      }}
    >
      {user.playback && (
        <Box
          pos="absolute"
          top={0}
          right={0}
          left={0}
          bottom={0}
          borderRadius="50%"
          border="2px solid black"
        />
      )}
      <Image
        src={user.image}
        onClick={(e) => {
          if (user.playback) {
            e.preventDefault();
            onOpen(<FullscreenTrack track={user.playback.track} originUserId={user.userId} />);
          }
        }}
      />
    </Box>
  );
};

export default TileUserImage;