import { Stack } from '@chakra-ui/react';
import type { Profile } from '@prisma/client';
import { useFetcher, useParams } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import useIsVisible from '~/hooks/useIsVisible';
import Tile from '../Tile';
import Tiles from '../Tiles';

const Playlists = ({
  playlists: initialPlaylists,
  currentUser,
}: {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  currentUser: Profile | null;
}) => {
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const { id } = useParams();

  const fetcher = useFetcher();
  const offsetRef = useRef(0);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const isVisible = useIsVisible(ref);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (isVisible && !hasFetched.current) {
      const newOffset = offsetRef.current + 50;
      offsetRef.current = newOffset;
      fetcher.load(`/${id}/playlists?offset=${newOffset}`);
      hasFetched.current = true;
    }
  }, [isVisible, fetcher, id]);

  useEffect(() => {
    if (fetcher.data) {
      setPlaylists((prev) => [...prev, ...fetcher.data]);
      hasFetched.current = false;
    }
  }, [fetcher.data]);

  useEffect(() => {
    setPlaylists(initialPlaylists);
  }, [initialPlaylists]);

  if (!playlists) return null;

  return (
    <Stack spacing={3}>
      <Tiles title="Playlists" scrollButtons>
        {playlists.map((list, index) => {
          const isLast = index === playlists.length - 1;

          return (
            <Tile
              ref={(ref) => {
                isLast && setRef(ref);
              }}
              playlist
              key={list.id}
              uri={list.uri}
              image={list.images[0]?.url}
              albumUri={list.uri}
              albumName={list.name}
              name={list.name}
              artist={list.description}
              artistUri={null}
              explicit={false}
              user={currentUser}
            />
          );
        })}
      </Tiles>
    </Stack>
  );
};

export default Playlists;