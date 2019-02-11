export { Auth as AuthTemplate } from './templates/Auth';
export { Error as ErrorTemplate } from './templates/Error';
export { Master as MasterTemplate } from './templates/Master';

export { SignIn as AuthSignin } from './auth/SignIn';
export {
    PasswordRequest as AuthPasswordRequest,
} from './auth/passwords/Request';
export { PasswordReset as AuthPasswordReset } from './auth/passwords/Reset';

export { Home } from './Home';
export { NotFound as ErrorNotFound } from './errors/NotFound';

export { List as UserList } from './users/List';
export { Create as UserCreate } from './users/Create';
export { Edit as UserEdit } from './users/Edit';
