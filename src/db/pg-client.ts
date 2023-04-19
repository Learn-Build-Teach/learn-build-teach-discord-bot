import { Client } from 'pg';

export const getClient = () => {
  return new Client();
};
