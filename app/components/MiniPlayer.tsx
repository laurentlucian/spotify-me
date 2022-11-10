import {
  Button,
  Flex,
  HStack,
  Image,
  Progress,
  Stack,
  Text,
  useColorModeValue,
  useInterval,
} from '@chakra-ui/react';
import type { Profile } from '@prisma/client';
import { Link, Links, useNavigate, useTransition } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import explicitImage from '~/assets/explicit-solid.svg';
import type { Playback } from '~/routes';

type PlayerProps = {
  user: Profile;
  playback?: Playback;
};

const MiniPlayer = ({ user, playback }: PlayerProps) => {
  const [hover, setHover] = useState<boolean>(false);

  const bg = useColorModeValue('music.50', 'music.900');
  const color = useColorModeValue('music.900', 'music.50');
  const duration = playback?.item?.duration_ms ?? 0;
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const refreshed = useRef(false);
  const percentage = duration ? (current / duration) * 100 : 0;

  const transition = useTransition();

  const artist =
    playback?.item?.type === 'track'
      ? playback?.item.album?.artists[0].name
      : playback?.item?.show.name;
  const image =
    playback?.item?.type === 'track'
      ? playback?.item.album?.images[0].url
      : playback?.item?.images[0].url;

  // reset seek bar on new song/props
  useEffect(() => {
    const progress = playback?.progress_ms ?? 0;
    setCurrent(progress);
    refreshed.current = false;
  }, [playback?.progress_ms]);

  // simulating a seek bar tick
  useInterval(
    () => {
      if (!duration) return null;
      // ref prevents from refreshing again before new data has hydrated; will loop otherwise
      if (current > duration && !refreshed.current) {
        navigate('.', { replace: true });
        refreshed.current = true;
      }
      setCurrent((prev) => prev + 1000);
    },
    playback ? 1000 : null,
  );

  const isLoading =
    transition.state === 'loading' && transition.location.pathname.includes(user.userId);

  return (
    <Stack w={[363, '100%']} bg={bg} spacing={0} borderRadius={5}>
      <Button
        as={Link}
        display="flex"
        flexDirection="column"
        to={`/${user.userId}`}
        variant="ghost"
        h={hover ? '205px' : '65px'}
        pr={0}
        transition="width 0.5s, height 0.5s"
        onMouseLeave={() => setHover(false)}
      >
        <HStack spacing={3} w="100%">
          <Image boxSize="50px" borderRadius="100%" src={user.image} />
          <Text fontWeight="bold" fontSize={['15px', '20px']}>
            {user.name.split(' ').splice(0, 1)}
          </Text>
          {isLoading && (
            <>
              <div className="la-line-scale-pulse-out la-dark">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <Links />
            </>
          )}
          {playback && (
            <HStack w="100%" spacing={2} justify="end">
              <Stack spacing={1} h="100%" justify="end">
                <Text
                  noOfLines={[1]}
                  maxW={{ base: '110px', md: '300px', xl: 'unset' }}
                  fontSize={{ base: 'smaller', md: 'sm' }}
                >
                  {playback.item?.name}
                </Text>
                <Flex>
                  {playback?.item?.explicit && <Image mr={1} src={explicitImage} w="19px" />}
                  <Text
                    opacity={0.8}
                    noOfLines={[1]}
                    maxW={{ base: '110px', md: '300px', xl: 'unset' }}
                    fontSize={{ base: 'smaller', md: 'xs' }}
                  >
                    {artist}
                  </Text>
                </Flex>

                {/* {active && (
                <HStack>
                  {party.length && (
                    <AvatarGroup size="xs" spacing={-2} max={5}>
                      {party.map((u) => {
                        return <Avatar key={u.userId} name={u.userName} src={u.userImage} />;
                      })}
                    </AvatarGroup>
                  )}
                </HStack>
              )} */}
              </Stack>
              <Image
                src={image}
                m={0}
                boxSize={hover ? '200px' : '60px'}
                borderRadius={2}
                onMouseEnter={() => setHover(true)}
                transition="width 0.5s, height 0.5s"
              />
            </HStack>
          )}
        </HStack>
      </Button>
      {playback && (
        <Progress
          sx={{
            backgroundColor: bg,
            '> div': {
              backgroundColor: color,
            },
          }}
          borderBottomLeftRadius="10px"
          borderBottomRightRadius="10px"
          h="2px"
          value={percentage}
        />
      )}
    </Stack>
  );
};
export default MiniPlayer;
