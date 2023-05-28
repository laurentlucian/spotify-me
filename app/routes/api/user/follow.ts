import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { typedjson } from 'remix-typedjson';
import invariant from 'tiny-invariant';

import { getSpotifyClient } from '~/services/spotify.server';

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const userId = body.get('userId');
  const currentUserId = body.get('currentUserId');
  const isFollowing = body.get('isFollowing');

  if (
    typeof userId !== 'string' ||
    typeof currentUserId !== 'string' ||
    typeof isFollowing !== 'string'
  ) {
    return typedjson('Bad Request');
  }
  const { spotify } = await getSpotifyClient(currentUserId);
  invariant(spotify, 'Spotify API Error');
  
  if (isFollowing === 'true') {
    await spotify.unfollowUsers([userId]);
  } else if (isFollowing === 'false') {
    await spotify.followUsers([userId]);
  }
  return null;
};

export const loader = () => {
  throw json({}, { status: 404 });
};
