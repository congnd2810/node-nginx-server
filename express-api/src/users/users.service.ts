import { PrismaClient } from "@prisma/client";
import { randUuid } from "@ngneat/falso";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const findAll = async (country: string) => {
  try {
    if (country) {
      const users = await prisma.user.findMany({
        where: { country },
      });
      return users
    }
    const users = await prisma.user.findMany();
    return users;  
  } catch (e) {
    console.log(e)
    return 'fail to get users'
  }
};

export const find = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (e) {
    console.log(e)
    return 'fail to get user'
  }
};

export const create = async (newUser: any) => {
  newUser.id = randUuid()
  newUser.token = ''
  const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(newUser.email);
  if (isEmail) {
    const hashPassword = bcrypt.hashSync(newUser.password, 10)
    newUser.password = hashPassword
  }
  console.log(newUser)
  try {
    await prisma.user.create({
      data: newUser,
    });
    return 'success to create';
  } catch (e) {
    console.log(e)
    return 'fail to create'
  }
};

export const update = async (id: string, userUpdate: any) => {
  try {
    await prisma.user.update({
      where: { id: id },
      data: userUpdate,
    });
    return 'update successful';
  } catch (e) {
    console.log(e)
    return 'failed to update'
  }
};

export const remove = async (id: string) => {
  try {
    await prisma.user.delete({
      where: { id: id },
    });
    return 'delete successful';
  } catch (e) {
    console.log(e)
    return 'failed to delete'
  }
};
