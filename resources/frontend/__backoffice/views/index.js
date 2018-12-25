import AuthTemplate from './templates/Auth';
import ErrorTemplate from './templates/Error';
import MasterTemplate from './templates/Master';

import AuthSignin from './auth/SignIn';
import Home from './Home';
import ErrorNotFound from './errors/NotFound';

import UserIndex from './users/Index';
import UserCreate from './users/Create';
import UserEdit from './users/Edit';

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
    Create: UserCreate,
    Edit: UserEdit,
};

export { Home };
