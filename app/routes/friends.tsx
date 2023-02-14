import type { LoaderArgs } from '@remix-run/node';
import { useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';

import { Divider, HStack, Image, Stack, Text } from '@chakra-ui/react';

import { typedjson, useTypedLoaderData } from 'remix-typedjson';

import PrismaMiniPlayer from '~/components/player/home/PrismaMiniPlayer';
import { useRevalidatorStore } from '~/hooks/useRevalidatorStore';
import useVisibilityChange from '~/hooks/useVisibilityChange';
import { authenticator, getAllUsers } from '~/services/auth.server';

const Friends = () => {
  const { currentUserId, users } = useTypedLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();
  const shouldRevalidate = useRevalidatorStore((state) => state.shouldRevalidate);
  const currentUserData = users.filter((user) => user.userId === currentUserId)[0];
  const otherUsers = users.filter((user) => user.userId !== currentUserId);

  useVisibilityChange((isVisible) => isVisible === true && !shouldRevalidate && revalidate());

  useEffect(() => {
    if (shouldRevalidate) {
      console.log('shouldRevalidate', shouldRevalidate);
      // revalidate();
    }
  }, [shouldRevalidate, revalidate]);

  return (
    <Stack pb="100px" pt={{ base: 4, md: 0 }} spacing={3} w="100%" px={['4px', 0]}>
      {currentUserData && (
        <Stack mt={7}>
          {currentUserData.settings?.miniPlayer && (
            <PrismaMiniPlayer
              key={currentUserData.userId}
              user={currentUserData}
              currentUserId={currentUserId}
            />
          )}
          <HStack>
            <Image boxSize="15px" src="/users.svg" />
            <Text fontSize="sm" fontWeight="400">
              friends
            </Text>
            <Text fontSize="xs" fontWeight="300">
              ~ {otherUsers.length}
            </Text>
          </HStack>
          <Divider bgColor="spotify.green" />
        </Stack>
      )}

      {otherUsers.map((user) => {
        return <PrismaMiniPlayer key={user.userId} user={user} currentUserId={currentUserId} />;
      })}
    </Stack>
  );
};

export const loader = async ({ request }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request);
  const currentUser = session?.user ?? null;
  const users = await getAllUsers(!!currentUser);
  const currentUserId = currentUser?.id;

  return typedjson(
    { currentUserId, now: Date.now(), users },
    {
      headers: { 'Cache-Control': 'private, maxage=10, stale-while-revalidate=0' },
    },
  );
};

export { ErrorBoundary } from '~/components/error/ErrorBoundary';
export { CatchBoundary } from '~/components/error/CatchBoundary';
export default Friends;