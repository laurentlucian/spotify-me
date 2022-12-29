import type { LikedSongs, RecentSongs } from '@prisma/client';
import { minutesToMs } from '~/lib/utils';
import { getAllUsers } from '~/services/auth.server';
import { prisma } from '~/services/db.server';
import { Queue } from '~/services/scheduler/queue.server';
import { spotifyApi } from '~/services/spotify.server';

export const userQ = Queue<{ userId: string }>(
  'update_tracks',
  async (job) => {
    const { userId } = job.data;
    console.log('userQ -> pending job starting...', userId);
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      include: { user: true },
    });

    const { spotify } = await spotifyApi(userId);

    if (!profile || !profile.user || !spotify) {
      console.log(`userQ ${userId} removed -> user not found`);
      const jobKey = job.repeatJobKey;
      if (jobKey) {
        await userQ.removeRepeatableByKey(jobKey);
      }
      return null;
    }

    console.log('userQ -> adding liked tracks to db', userId);
    const {
      body: { items: liked },
    } = await spotify.getMySavedTracks();
    for (const { track, added_at } of liked) {
      const song: Omit<LikedSongs, 'id'> = {
        trackId: track.id,
        likedAt: new Date(added_at),
        userId: userId,
        name: track.name,
        uri: track.uri,
        albumName: track.album.name,
        albumUri: track.album.uri,
        artist: track.artists[0].name,
        artistUri: track.artists[0].uri,
        image: track.album.images[0].url,
        explicit: track.explicit,
        action: 'liked',
      };

      await prisma.likedSongs.upsert({
        where: {
          trackId_userId: {
            trackId: track.id,
            userId: userId,
          },
        },
        update: song,
        create: song,
      });
    }

    console.log('userQ -> adding recent tracks to db', userId);
    const {
      body: { items: recent },
    } = await spotify.getMyRecentlyPlayedTracks({ limit: 50 });
    for (const { track, played_at } of recent) {
      const song: Omit<RecentSongs, 'id'> = {
        trackId: track.id,
        playedAt: new Date(played_at),
        userId: userId,
        name: track.name,
        uri: track.uri,
        albumName: track.album.name,
        albumUri: track.album.uri,
        artist: track.artists[0].name,
        artistUri: track.artists[0].uri,
        image: track.album.images[0].url,
        explicit: track.explicit,
        action: 'played',
      };

      await prisma.recentSongs.upsert({
        where: {
          playedAt_userId: {
            playedAt: song.playedAt,
            userId: userId,
          },
        },
        update: song,
        create: song,
      });
    }

    console.log('userQ -> completed', userId);
  },
  {
    limiter: {
      max: 2,
      duration: minutesToMs(0.5),
    },
  },
);

declare global {
  var __didRegisterLikedQ: boolean | undefined;
}

export const addUsersToQueue = async () => {
  console.log('addUsersToQueue -> starting...');
  // To ensure this function only runs once per environment,
  // we use a global variable to keep track if it has run
  if (global.__didRegisterLikedQ) {
    // and stop if it did.

    console.log(
      'addUsersToQueue -> already registered, repeating jobs:',
      (await userQ.getRepeatableJobs()).map((j) => [
        j.name,

        j.next,
        new Date(j.next).toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        }),
      ]),
    );

    return;
  }

  const users = await getAllUsers();
  console.log(
    'addUsersToQueue -> users..',
    users.map((u) => u.userId),
    users.length,
  );

  await userQ.obliterate({ force: true }); // https://github.com/taskforcesh/bullmq/issues/430

  // https: github.com/OptimalBits/bull/issues/1731#issuecomment-639074663
  // bulkAll doesn't support repeateable jobs
  for (const user of users) {
    await userQ.add(
      user.userId,
      { userId: user.userId },
      {
        // a job with duplicate id will not be added
        jobId: user.userId,
        repeat: { every: minutesToMs(60) },
        backoff: {
          type: 'exponential',
          delay: minutesToMs(1),
        },
      },
    );
  }

  // repeateableJobs are started with delay, so run these manually at startup
  await userQ.addBulk(
    users.map((user) => ({
      name: 'update_liked',
      data: {
        userId: user.userId,
      },
    })),
  );

  console.log(
    'addUsersToQueue -> non repeateable jobs created (only at startup):',
    await userQ.getJobCounts(),
  );

  console.log('addUsersToQueue -> done');
  global.__didRegisterLikedQ = true;
};