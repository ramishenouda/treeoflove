import * as migration_20261019_200821_initial from './20261019_200821_initial';

export const migrations = [
  {
    up: migration_20261019_200821_initial.up,
    down: migration_20261019_200821_initial.down,
    name: '20261019_200821_initial'
  },
];
