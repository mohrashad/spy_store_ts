import { PrismaClient } from '@prisma/client';
import { BadRequestError, InternalServerError, NotFoundError } from 'routing-controllers';
import { IUser } from '../interfaces/IUser';
import { Service } from 'typedi';
import { SignupDto } from '../auth/dtos';
import { prismaClient } from '../utils/prismaClient';
import { serializeUserRoles } from '../utils/serlializers/userRolesSerializer';

@Service()
export class UserService {
  private prisma: PrismaClient;

  constructor() { this.prisma = prismaClient }

  async findAll(): Promise<IUser[]> {
    const users: IUser[] = await this.prisma.user.findMany({
      select: {
        cuid: true,
        name: true,
        email: true,
        createdAt: true,
        isActive: true,
        roles: { select: { role: { select: { name: true } } } }
      },
    });

    await this.disconnectDatabase();
    return users;
  }

  async findByCuid(id: string): Promise<IUser | null> {
    const user: IUser | null = await this.prisma.user.findUnique({
      where: { cuid: id },
      select: {
        id: true,
        cuid: true,
        name: true,
        email: true,
        createdAt: true,
        isActive: true,
        roles: { select: { role: { select: { name: true } } } }
      },
    });

    await this.disconnectDatabase();
    if (!user) throw new NotFoundError(`User not found`);
    return user;
  }

  async findFirst(where: any): Promise<IUser | null> {
    const user: IUser | null = await this.prisma.user.findFirst({
      where,
      select: {
        id: true,
        cuid: true,
        name: true,
        email: true,
        createdAt: true,
        isActive: true,
        roles: { select: { role: { select: { name: true } } } }
      },
      orderBy: { id: 'asc' }
    });

    await this.disconnectDatabase();
    if (!user) throw new NotFoundError(`User not found`);
    return user;
  }

  async getUserCuidById(id: number): Promise<Partial<IUser | null>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { cuid: true },
    });

    await this.disconnectDatabase();
    if (!user) throw new NotFoundError(`User not found`);
    return user;
  }

  async getByEmail(email: string): Promise<IUser | null> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { email },
      });

      await this.disconnectDatabase();
      return userData;
    } catch (error) {
      await this.disconnectDatabase();
      throw new InternalServerError(`Error: ${error}`);
    }
  }

  async create(createUserDto: SignupDto): Promise<IUser> {
    try {
      // If email is already registered
      if (await this.getByEmail(createUserDto.email)) throw new BadRequestError(`Error: Email is already registered`);
      const newUser = this.prisma.user.create({ data: createUserDto });

      await this.disconnectDatabase();
      return newUser
    } catch (error) {
      await this.disconnectDatabase();
      throw new BadRequestError(`Error: ${error}`);
    }
  }

  async updateUserRoles(id: string, updateUserDto: Partial<IUser>): Promise<IUser> {
    try {
      // console.log(await serializeUserRoles(id , updateUserDto.roles));
      const updatedUser = await this.prisma.user.update({
        where: { cuid: id },
        data: { roles: { create: await serializeUserRoles(id , updateUserDto.roles)} },
      });

      

      await this.disconnectDatabase();
      return updatedUser;
    } catch (error) {
      await this.disconnectDatabase();
      throw new BadRequestError(`Error: ${error}`);
    }
  }

  async delete(cuid: string): Promise<void> {
    try {
      // Verify if exists
      this.findByCuid(cuid);
      await this.prisma.user.update({
        where: { cuid },
        data: { isActive: false },
      });

      await this.disconnectDatabase();
    } catch (error) {
      await this.disconnectDatabase();
      throw new BadRequestError(`Error: ${error}`);
    }
  }

  private disconnectDatabase():void { this.prisma.$disconnect() }
}
