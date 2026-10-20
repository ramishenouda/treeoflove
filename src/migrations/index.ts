import * as migration_20261019_200821_initial from './20261019_200821_initial';
import * as migration_20261020_170635_about_image from './20261020_170635_about_image';

export const migrations = [
  {
    up: migration_20261019_200821_initial.up,
    down: migration_20261019_200821_initial.down,
    name: '20261019_200821_initial',
  },
  {
    up: migration_20261020_170635_about_image.up,
    down: migration_20261020_170635_about_image.down,
    name: '20261020_170635_about_image'
  },
];
