export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const SortType = {
  DAY: {
    name: 'day',
    disabled: false,
  },
  EVENT: {
    name: 'event',
    disabled: true,
  },
  TIME: {
    name: 'time',
    disabled: false,
  },
  PRICE: {
    name: 'price',
    disabled: false,
  },
  OFFERS: {
    name: 'offers',
    disabled: true,
  },
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export const StatsType = {
  MONEY: 'money',
  TYPE: 'type',
  TIME_SPEND: 'time-spend',
};

export const EndPoints = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
  SYNC: 'sync',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};
