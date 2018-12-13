import AuthTemplate from './templates/AuthTemplate';
import ErrorTemplate from './templates/ErrorTemplate';
import MasterTemplate from './templates/MasterTemplate';

import AuthSignin from './auth/SignIn';
import Dashboard from './Dashboard';
import ErrorNotFound from './errors/NotFound';
import UserIndex from './users/Index';

export const Templates = {
    Auth: AuthTemplate,
    Error: ErrorTemplate,
    Master: MasterTemplate,
};

export const Auth = {
    SignIn: AuthSignin,
};

export const Errors = {
    NotFound: ErrorNotFound,
};

export const Users = {
    Index: UserIndex,
};

export { Dashboard };
