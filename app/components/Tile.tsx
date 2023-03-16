import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { Flex, Image, Stack, Text } from '@chakra-ui/react';
import type { ChakraProps } from '@chakra-ui/react';

import { motion } from 'framer-motion';

import explicitImage from '~/assets/explicit-solid.svg';
import { useClickDrag } from '~/hooks/useDrawer';
import useIsMobile from '~/hooks/useIsMobile';
import type { Track, User } from '~/lib/types/types';

import SpotifyLogo from './icons/SpotifyLogo';

type TileProps = {
  action?: ReactNode;
  // createdAt?: Date;
  // will show header (profile above tile) if createdAt is defined
  // createdBy?: Profile | null;
  currentUser?: User | null;
  currentUserId?: string | undefined;
  image?: ReactNode;
  index?: number;
  layoutKey: string;
  list?: boolean;
  playlist?: Boolean;
  profileId?: string;
  track: Track;
  tracks: Track[];
} & ChakraProps;

const Tile = forwardRef<HTMLDivElement, TileProps>(
  (
    {
      action,
      // createdAt,
      // createdBy,
      image,
      index,
      layoutKey,
      list,
      profileId,
      track,
      tracks,
      ...props
    },
    ref,
  ) => {
    const decodeHtmlEntity = (str?: string) => {
      return str?.replace(/&#x([0-9A-Fa-f]+);/g, (_, dec) => {
        return String.fromCharCode(parseInt(dec, 16));
      });
    };
    const { onClick, onMouseDown, onMouseMove } = useClickDrag();
    const isSmallScreen = useIsMobile();

    return (
      <>
        <Stack
          as={motion.div}
          layoutId={list ? undefined : track.id + layoutKey}
          ref={ref}
          flex={list ? undefined : '0 0 200px'}
          direction={list ? 'row' : undefined}
          {...props}
          maxW={list ? '40px' : '200px'}
        >
          <Flex direction="column">
            {/* {createdAt && (
              <HStack align="center" h="35px">
                {createdBy ? (
                  <Link to={`/${createdBy.userId}`}>
                    <HStack align="center">
                      <Image borderRadius={50} boxSize="25px" mb={1} src={createdBy.image} />
                      <Text fontWeight="semibold" fontSize="13px">
                        {createdBy.name.split(' ')[0]}
                      </Text>
                    </HStack>
                  </Link>
                ) : (
                  <Text fontWeight="semibold" fontSize="13px">
                    Anon
                  </Text>
                )}
                <Text as="span">·</Text>
                <Text fontSize="12px" opacity={0.6}>
                  {timeSince(createdAt ?? null)}
                </Text>
              </HStack>
            )} */}
            {image}
          </Flex>
          <Flex justify="space-between">
            <Stack
              spacing={0}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onClick={() => onClick(track, profileId ?? null, layoutKey, tracks, index ?? 0)}
              cursor="pointer"
              w="175px"
            >
              <Text fontSize="13px" noOfLines={3} whiteSpace="normal" wordBreak="break-word">
                {track.name}
              </Text>
              {track.artist && (
                <Flex align="center">
                  {track.artistUri ? (
                    <Stack>
                      <Stack direction="row">
                        {track.explicit && <Image src={explicitImage} w="19px" mr="-3px" />}
                        <Text fontSize="11px" opacity={0.8} noOfLines={2}>
                          {track.artist}
                        </Text>
                      </Stack>
                      {action ? <SpotifyLogo w="70px" h="21px" white={isSmallScreen} /> : null}
                    </Stack>
                  ) : (
                    <Text fontSize="11px" opacity={0.8} noOfLines={2}>
                      {decodeHtmlEntity(track.artist)}
                    </Text>
                  )}
                </Flex>
              )}
            </Stack>
            <Stack>{action ? action : <SpotifyLogo icon mx="5px" white={isSmallScreen} />}</Stack>
          </Flex>
        </Stack>
      </>
    );
  },
);

Tile.displayName = 'Tile';

export default Tile;
