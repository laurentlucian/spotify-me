import { HStack, Image, Progress, Stack, Text } from '@chakra-ui/react';

type Type = {
  name: string | undefined;
  artist: string;
  image: string;
  device: string;
  progress: number;
  type: 'track' | 'episode' | undefined;
};

const Player = ({ name, artist, image, device, type, progress }: Type) => {
  return (
    <Stack w={[363, '100%']} bg="#101010" spacing={0} borderRadius={5}>
      <HStack h={['112']} spacing={2} px="2px" py="2px" justify="space-between">
        {type === 'track' ? (
          <>
            <Stack pl="7px" pt="7px" py={0} spacing={1} h="100%" w="100%">
              <Text>{name}</Text>
              <Text opacity={0.8} fontSize="13px">
                {artist}
              </Text>
              <Text>{device}</Text>
            </Stack>
            <Image src={image} m={0} boxSize={108} borderRadius={2} />
          </>
        ) : (
          <Text>
            {name} - {name}
          </Text>
        )}
      </HStack>
      <Progress
        sx={{
          '> div': {
            backgroundColor: 'white',
          },
        }}
        borderBottomLeftRadius={2}
        borderBottomRightRadius={2}
        size="sm"
        height="2px"
        value={progress}
      />
    </Stack>
  );
};
export default Player;