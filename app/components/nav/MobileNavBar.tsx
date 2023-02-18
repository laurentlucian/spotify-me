import { Link, useLocation, useSubmit } from '@remix-run/react';
import { useEffect, useState } from 'react';

import { Box, IconButton, Image, useColorModeValue } from '@chakra-ui/react';

import { Home2, MusicPlaylist, Profile2User, SearchNormal1 } from 'iconsax-react';

import { useDrawerTrack } from '~/hooks/useDrawer';
import useIsMobile from '~/hooks/useIsMobile';
import { useMobileKeyboard } from '~/hooks/useMobileKeyboardCheck';
import useSessionUser from '~/hooks/useSessionUser';

const MobileNavBar = () => {
  const [active, setActive] = useState<number>();
  const isMobile = useIsMobile();
  const submit = useSubmit();
  const track = useDrawerTrack();
  const { pathname } = useLocation();
  const currentUser = useSessionUser();
  const profile = currentUser?.userId;
  const { show } = useMobileKeyboard();
  const hideButton = track !== null || pathname.includes('/settings') || !show ? true : false;

  const bg = useColorModeValue('music.200', 'music.500');
  const color = useColorModeValue('music.500', 'music.200');

  useEffect(() => {
    const pathnames = ['home', 'friends', 'sessions', 'explore', `${profile}`];
    const index = pathnames.findIndex((pathname) => pathname === pathname.split('/')[1]);
    if (index !== -1) {
      setActive(index);
    }
  }, [pathname, profile]);

  const profileIcon = (
    <Image
      src={currentUser ? currentUser?.image : '/favicon-32x32.png'}
      borderRadius="full"
      boxSize="30px"
    />
  );

  const onClickHome = () => {
    setActive(0);
  };
  const onClickFriends = () => {
    setActive(1);
  };
  const onClickSessions = () => {
    setActive(2);
  };
  const onClickExplore = () => {
    setActive(3);
  };
  const onClickUser = () => {
    if (!currentUser)
      submit(null, {
        action: '/auth/spotify?returnTo=' + pathname,
        method: 'post',
        replace: true,
      });
    setActive(4);
  };

  return (
    <>
      {isMobile && (
        <Box
          pos="fixed"
          bg={bg}
          w="100vw"
          h="90px"
          borderRadius="20px"
          borderBottomRadius={0}
          color={color}
          aria-label="search song"
          bottom={hideButton ? '-100px' : '0%'}
          display="flex"
          justifyContent="space-around"
          transition="bottom 0.25s ease-out"
          overflow="hidden"
          zIndex={9}
        >
          <Link to="/home" prefetch="render" onClick={onClickHome}>
            <IconButton
              aria-label="home"
              icon={<Home2 variant={active === 0 ? 'Bold' : 'Outline'} />}
              variant="mobileNav"
              bg={bg}
              color={color}
              opacity={active === 0 ? 1 : 0.4}
              pt="12px"
            />
          </Link>
          <Link to="/friends" prefetch="render" onClick={onClickFriends}>
            <IconButton
              aria-label="friends"
              icon={<Profile2User variant={active === 1 ? 'Bold' : 'Outline'} />}
              variant="mobileNav"
              bg={bg}
              color={color}
              opacity={active === 1 ? 1 : 0.4}
              pt="12px"
            />
          </Link>
          <Link to="/sessions" prefetch="render" onClick={onClickSessions}>
            <IconButton
              aria-label="sessions"
              icon={<MusicPlaylist variant={active === 2 ? 'Bold' : 'Outline'} />}
              variant="mobileNav"
              bg={bg}
              color={color}
              opacity={active === 2 ? 1 : 0.4}
              pt="12px"
            />
          </Link>
          <Link to="/explore" prefetch="render" onClick={onClickExplore}>
            <IconButton
              aria-label="search"
              icon={<SearchNormal1 variant={active === 3 ? 'Bold' : 'Outline'} />}
              variant="mobileNav"
              bg={bg}
              color={color}
              opacity={active === 3 ? 1 : 0.4}
              pt="12px"
            />
          </Link>
          <Link to={`${profile}`} prefetch="render" onClick={onClickUser}>
            <IconButton
              aria-label="profile"
              icon={profileIcon}
              variant="mobileNav"
              opacity={active === 4 ? 1 : 0.4}
              pt="12px"
            />
          </Link>
        </Box>
      )}
    </>
  );
};

export default MobileNavBar;
