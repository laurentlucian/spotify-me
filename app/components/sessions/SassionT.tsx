import { Link, type SubmitFunction, useLocation } from '@remix-run/react';
import type { DataFunctionArgs } from '@remix-run/server-runtime';
import { forwardRef, useRef } from 'react';
import { Check, AlertCircle } from 'react-feather';

import { Flex, HStack, IconButton, Image, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import type { ChakraProps } from '@chakra-ui/react';

import type { Profile } from '@prisma/client';
import { Send2 } from 'iconsax-react';
import type { TypedFetcherWithComponents, TypedJsonResponse } from 'remix-typedjson';

import explicitImage from '~/assets/explicit-solid.svg';
import { useClickDrag } from '~/hooks/useDrawer';
import type { Track, User } from '~/lib/types/types';
import { timeSince } from '~/lib/utils';

import SpotifyLogo from '../icons/SpotifyLogo';
import Waver from '../icons/Waver';
import Tooltip from '../Tooltip';

type TileProps = Track & {
  createdAt?: Date;
  // will show header (profile above tile) if createdAt is defined
  createdBy?: Profile | null;
  currentUser?: User | null;
  currentUserId?: string | undefined;
  fetcher?: TypedFetcherWithComponents<
    ({ params, request }: DataFunctionArgs) => Promise<TypedJsonResponse<string>>
  >;
  fetcherRec?: TypedFetcherWithComponents<
    ({ params, request }: DataFunctionArgs) => Promise<TypedJsonResponse<string>>
  >;
  id?: string;
  inDrawer?: boolean;
  isQueuing?: boolean;
  isRecommending?: boolean;
  list?: boolean;

  playlist?: Boolean;
  submit?: SubmitFunction;
} & ChakraProps;

const SessionT = forwardRef<HTMLDivElement, TileProps>(
  (
    {
      albumName,
      albumUri,
      artist,
      artistUri,
      createdAt,
      createdBy,
      currentUser,
      currentUserId,
      explicit,
      fetcher,
      fetcherRec,
      id,
      image,
      inDrawer,
      isQueuing,
      isRecommending,
      link,
      list,
      name,
      // playlist,
      preview_url,
      submit,
      trackId,
      uri,
      ...props
    },
    ref,
  ) => {
    const { pathname, search } = useLocation();
    const { onClick, onMouseDown, onMouseMove } = useClickDrag();
    const color = useColorModeValue(`${inDrawer ? 'music.200' : 'music.800'}`, 'music.200');
    const track = {
      albumName,
      albumUri,
      artist,
      artistUri,
      duration: 0,
      explicit,
      id: trackId,
      image,
      link,
      name,
      preview_url,
      uri,
    };
    const clickedRef = useRef<string>();
    const handleSendButton = () => {
      if (!currentUser && submit) {
        // @todo figure out a better way to require authentication on click;
        // after authentication redirect, add to queue isn't successful. user needs to click again
        return submit(null, {
          action: '/auth/spotify?returnTo=' + pathname + search,
          method: 'post',
          replace: true,
        });
      }

      clickedRef.current = trackId;
      const action = isRecommending ? `/${id}/recommend` : `/${id}/add`;

      const fromUserId = currentUser?.userId || currentUserId;
      const sendToUserId = id;

      const queueData = {
        action: 'send',

        fromId: fromUserId ?? '',
        toId: sendToUserId ?? '',
        trackId: trackId ?? '',
      };

      const recommendData = {
        action: 'recommend',
        albumName: track?.albumName ?? '',
        albumUri: track?.albumUri ?? '',
        artist: track?.artist ?? '',
        artistUri: track?.artistUri ?? '',
        comment: '',
        explicit: track?.explicit ? 'true' : '',
        fromId: fromUserId ?? '',
        image: track?.image ?? '',
        link: track?.link ?? '',
        name: track?.name ?? '',
        preview_url: track?.preview_url ?? '',

        toId: sendToUserId ?? '',
        trackId: track?.id ?? '',
        uri: track?.uri ?? '',
      };
      if (fetcher && isQueuing) {
        fetcher.submit(queueData, { action, method: 'post', replace: true });
      }
      if (fetcher && isRecommending) {
        fetcher.submit(recommendData, { action, method: 'post', replace: true });
      }
    };
    const isClicked = clickedRef.current === trackId;
    const isAdding = fetcher
      ? fetcher.submission?.formData.get('trackId') === trackId
      : fetcherRec
      ? fetcherRec.submission?.formData.get('trackId') === trackId
      : null;
    const isDone = fetcher
      ? fetcher.type === 'done' && isClicked
      : fetcherRec
      ? fetcherRec.type === 'done' && isClicked
      : null;
    const isError = fetcher
      ? typeof fetcher.data === 'string' && isClicked
        ? fetcher.data.includes('Error') && isClicked
          ? fetcher.data && isClicked
          : fetcherRec
          ? typeof fetcherRec.data === 'string' && isClicked
            ? fetcherRec.data.includes('Error') && isClicked
              ? fetcherRec.data && isClicked
              : null
            : null
          : null
        : null
      : null;

    const icon = isAdding ? (
      <Waver />
    ) : isDone ? (
      <Check />
    ) : isError ? (
      <AlertCircle />
    ) : (
      <Send2 variant={isQueuing ? 'Outline' : 'Bold'} />
    );
    return (
      <Flex direction="row" ref={ref} {...props}>
        <Flex direction="row">
          {createdAt && (
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
          )}
          <Tooltip label={albumName} placement="top-start">
            <Image
              boxSize={'50px'}
              minW={'50px'}
              minH={'50px'}
              objectFit="cover"
              src={image}
              draggable={false}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onClick={() => onClick(track)}
              cursor="pointer"
            />
          </Tooltip>
        </Flex>
        <Flex justify="space-between">
          <Stack>
            {isQueuing || isRecommending ? (
              <IconButton
                onClick={handleSendButton}
                pos="relative"
                variant="ghost"
                color={color}
                icon={icon}
                _hover={{ color: 'white' }}
                aria-label={isQueuing ? 'add to this friends queue' : 'recommend to this friend'}
              />
            ) : (
              <SpotifyLogo icon mx="5px" white={inDrawer} />
            )}
          </Stack>
        </Flex>
      </Flex>
    );
  },
);

SessionT.displayName = 'Tile';

export default SessionT;