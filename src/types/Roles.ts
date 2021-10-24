import { registerEnumType } from 'type-graphql';

enum Role {
  ADMIN = 'ADMIN',
  AUTH_USER = 'AUTH_USER',
  PASSAGER = 'PASSAGER'
}

registerEnumType(Role, {
  name: 'Roles',
  description: 'User Roles',
  valuesConfig: {
    ADMIN: {
      description: 'Admin User'
    },
    AUTH_USER: {
      description: 'Authenticated User'
    },
    PASSAGER: {
      description: 'Unauthenticated User'
    }
  }
});

export default Role;
