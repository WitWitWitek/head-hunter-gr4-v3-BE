import { User } from 'src/user/entities/user.entity';

export const extractUserData = (
  user: User,
): {
  email: string;
  username: string | null;
  github: string | null;
} => {
  if (user.student) {
    return {
      email: user.email,
      username:
        user.student.profile.firstName + ' ' + user.student.profile.lastName,
      github: user.student.profile.githubUsername,
    };
  } else if (user.hr) {
    return {
      email: user.email,
      username: user.hr.fullName,
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
