import { HStack, Text } from '@chakra-ui/react';

import { useTypedLoaderData } from 'remix-typedjson';

import type { loader } from '~/routes/explore/index';

import Tile from '../Tile';
import TileImage from '../TileImage';
import TileInfo from '../TileInfo';

const Top = () => {
  const { top } = useTypedLoaderData<typeof loader>();
  const layoutKey = 'ExploreTop';
  return (
    <>
      <HStack align="center">
        <Text>Top</Text>
        <Text fontSize={['9px', '10px']} opacity={0.6} pt="2px">
          7d
        </Text>
      </HStack>
      {top.map((track, index) => {
        return (
          <Tile
            key={track.id}
            list
            image={
              <TileImage
                src={track.image}
                index={index}
                layoutKey={layoutKey}
                track={track}
                tracks={top}
                size={'40px'}
              />
            }
            info={<TileInfo index={index} layoutKey={layoutKey} track={track} tracks={top} />}
          />
        );
      })}
    </>
  );
};

export default Top;
