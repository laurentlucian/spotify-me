import { Stack, Flex, Text } from '@chakra-ui/react';

import SpotifyLogo from '~/lib/icons/SpotifyLogo';
import type { TrackWithInfo } from '~/lib/types/types';
import { timeSince } from '~/lib/utils';

import TilePlaybackTracksImage from '../tile/playback/inactive/TilePlaybackTracksImage';
import Tiles from '../tiles/Tiles';
import ActivityInfo from './shared/ActivityInfo';

const ActivityPlayback = ({ activity }: { activity: any }) => {
  if (!activity.user || !activity.tracks?.length) return null;
  const isMoreThan4Tracks = activity.tracks.length >= 4;

  const tracks = [] as TrackWithInfo[][];
  if (isMoreThan4Tracks) {
    for (let i = 0; i < activity.tracks.length; i += 4) {
      tracks.push(activity.tracks.slice(i, i + 4));
    }
  }

  return (
    <Stack alignSelf="center">
      <ActivityInfo activity={activity} />
      <Flex pb="5px" w="100%">
        <Stack spacing="5px" w="100%">
          {isMoreThan4Tracks ? (
            <Tiles maxW="640px">
              {tracks.map((t, index) => (
                <TilePlaybackTracksImage
                  key={index}
                  tracks={t}
                  fullscreen={{ originUserId: activity.user.userId }}
                  image={{ maxW: ['190px', '225px', '320px'] }}
                  flexShrink={0}
                  maxW="640px"
                />
              ))}
            </Tiles>
          ) : (
            <TilePlaybackTracksImage
              tracks={activity.tracks}
              fullscreen={{ originUserId: activity.user.userId }}
              flexShrink={0}
              image={{ flexShrink: 0 }}
              maxW="640px"
            />
          )}

          {activity.createdAt && (
            <Text fontSize={['8px', '9px']} opacity={0.6} w="100%">
              {timeSince(activity.createdAt)}
            </Text>
          )}
          <SpotifyLogo icon w="21px" h="21px" />
        </Stack>
      </Flex>
    </Stack>
  );
};

export default ActivityPlayback;