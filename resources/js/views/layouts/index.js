import loadable from '@loadable/component';

export { default as Auth } from './Auth';
export const Error = loadable(() => import('./Error'));
