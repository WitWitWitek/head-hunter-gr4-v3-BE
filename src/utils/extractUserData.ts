import { User } from 'src/user/entities/user.entity';

export const extractUserData = (
  user: User,
): {
  email: string;
  username: string | null;
  github: string | null;
} => {
  if (user.student) {
    const firstName = user?.student?.profile?.firstName ?? null;
    const lastName = user?.student?.profile?.lastName ?? null;
    return {
      email: user.email,
      username: firstName && lastName ? firstName + ' ' + lastName : null,
      github: user?.student?.profile?.githubUsername ?? null,
    };
  } else if (user.hr) {
    return {
      email: user.email,
      username: user.hr.fullName ?? null,
      github: null,
    };
  } else {
    return {
      email: user.email,
      username: null,
      github: null,
    };
  }
};
