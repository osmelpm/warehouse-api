import { hashSync } from 'bcrypt'

const userSeed = [
  {
    name: 'UserAdmin',
    email: 'useradmin@gmail.com',
    img: 'https://randomuser.me/api/portraits/med/men/75.jpg',
    password: hashSync('12345678', 10),
    role: 'admin',
    google: false,
    isDeleted: false,
  },
  {
    name: 'UserBuyer',
    email: 'userbuyer@gmail.com',
    img: 'https://randomuser.me/api/portraits/med/men/65.jpg',
    password: hashSync('12345678', 10),
    role: 'buyer',
    google: false,
    isDeleted: false,
  },
  {
    name: 'UserDeleted',
    email: 'userdeleted@gmail.com',
    img: 'https://randomuser.me/api/portraits/med/men/55.jpg',
    password: hashSync('12345678', 10),
    role: 'buyer',
    google: false,
    isDeleted: true,
  },
]

export default userSeed
