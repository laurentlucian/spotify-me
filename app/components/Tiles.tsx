import type { ReactNode } from 'react';
import type { ChakraProps, StackProps } from '@chakra-ui/react';
import { HStack, Heading } from '@chakra-ui/react';
import { useHorizontalScroll } from '~/hooks/useHorizontalScroll';
import ScrollButtons from './tiles/ScrollButtons';

type TilesProps = {
  title?: string;
  children: ReactNode;
  autoScroll?: boolean;
  Filter?: ReactNode;
  scrollButtons?: boolean;
} & StackProps;

const Tiles = ({
  title,
  children,
  autoScroll,
  Filter = null,
  scrollButtons,
  ...chakraProps
}: TilesProps) => {
  const { scrollRef, props } = useHorizontalScroll('reverse', autoScroll);

  return (
    <>
      <HStack spacing={5} align="center">
        {title && <Heading fontSize={['xs', 'sm']}>{title}</Heading>}

        {Filter}

        {scrollButtons && <ScrollButtons scrollRef={scrollRef} />}
      </HStack>
      <HStack
        ref={scrollRef}
        className="scrollbar"
        overflow="auto"
        align="flex-start"
        pb={2}
        {...props}
        {...chakraProps}
      >
        {children}
      </HStack>
    </>
  );
};

export default Tiles;
