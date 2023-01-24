import {
  Stack,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  type StackProps,
  Text,
} from '@chakra-ui/react';
import useDrawerBackButton from '~/hooks/useDrawerBackButton';
import { useMouseScroll } from '~/hooks/useMouseScroll';
import { type ReactNode, useRef } from 'react';
import useIsMobile from '~/hooks/useIsMobile';

type TilesProps = {
  title?: string;
  children: ReactNode;
  autoScroll?: boolean;
  Filter?: ReactNode;
  scrollButtons?: boolean;
  show: boolean;
  onClose: () => void;
} & StackProps;

const ExpandedSongs = ({
  title,
  children,
  autoScroll,
  Filter = null,
  scrollButtons,
  show,
  onClose,
  ...ChakraProps
}: TilesProps) => {
  const { scrollRef, props } = useMouseScroll('reverse', autoScroll);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isSmallScreen = useIsMobile();

  useDrawerBackButton(onClose, show);

  return (
    <>
      <Drawer
        size="full"
        isOpen={show}
        onClose={onClose}
        placement="bottom"
        preserveScrollBarGap
        lockFocusAcrossFrames
        finalFocusRef={btnRef}
        variant={isSmallScreen ? 'none' : 'desktop'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader alignSelf="center">
            <Stack direction="row" align="end">
              <Text pl={title === 'Top' ? '115px' : 0} mr={title === 'Top' ? '20px' : 0}>
                {title}
              </Text>
              {Filter}
            </Stack>
          </DrawerHeader>

          <DrawerBody alignSelf="center" ref={scrollRef} {...props}>
            {children}
          </DrawerBody>
          <Button variant="drawer" color="white" onClick={onClose}>
            close
          </Button>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ExpandedSongs;