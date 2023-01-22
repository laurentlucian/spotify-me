import { Stack } from '@chakra-ui/react';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import type { LoaderArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { prisma } from '~/services/db.server';
import type { Activity } from '~/lib/types/types';
import Tiles from '~/components/tiles/Tiles';
import useSessionUser from '~/hooks/useSessionUser';
import ActivityTile from '~/components/ActivityTile';

const Index = () => {
  const currentUser = useSessionUser();
  const { activity } = useTypedLoaderData<typeof loader>();

  return (
    <Stack pb="50px" pt={{ base: 4, md: 0 }} spacing={{ base: 4, md: 10 }}>
      <Stack>
        <Tiles spacing="15px" autoScroll={currentUser?.settings?.autoscroll ?? true}>
          {activity.map((item) => {
            return <ActivityTile key={item.id} activity={item} />;
          })}
        </Tiles>
      </Stack>
      <Outlet />
    </Stack>
  );
};

export const loader = async ({ request }: LoaderArgs) => {
  // const session = await authenticator.isAuthenticated(request);
  // const currentUser = session?.user ?? null;
  // const users = await getAllUsers(!!currentUser);

  const liked = prisma.likedSongs
    .findMany({
      take: 20,
      orderBy: { likedAt: 'desc' },
      include: {
        user: true,
        track: {
          include: { liked: { select: { user: true } }, recent: { select: { user: true } } },
        },
      },
    })
    .then((data) => data.map((data) => ({ ...data, createdAt: data.likedAt })));

  const queued = prisma.queue.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      track: {
        include: { liked: { select: { user: true } }, recent: { select: { user: true } } },
      },
      owner: { select: { user: true, accessToken: false } },
    },
  });

  const songs = await Promise.all([liked, queued]);

  const activity = songs
    .flat()
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) return b.createdAt.getTime() - a.createdAt.getTime();
      return 0;
    })
    .slice(0, 20) as Activity[];

  return typedjson({ activity });
};

export default Index;

export { CatchBoundary } from '~/components/error/CatchBoundary';
export { ErrorBoundary } from '~/components/error/ErrorBoundary';