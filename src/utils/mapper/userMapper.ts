import { User } from '@prisma/client'
import { Educator, Learner } from '../../interfaces/user'

export const toResponseByEntity = (user: User) => {
    if (user.type === 'Educator') {
        const educator: Educator = { ...user };

        return educator;
    } else {
        const learner: Learner = { ...user };

        return learner;
    }
}