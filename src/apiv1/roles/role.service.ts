import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { prismaClient } from "../utils/prismaClient";
import { Role } from "../interfaces/role";

@Service()
export class RoleService {
    private readonly prisma:PrismaClient
    constructor() { this.prisma = prismaClient }

    async find():Promise<Role[]> {
        const roles:any[] = (await this.prisma.role.findMany({
            select: {
                cuid: true,
                name: true,
                description: true
            }
        }))

        await this.disconnectDatabase();
        return roles
    }

    async findById(id:string):Promise<Role | null> {
        const role = await this.prisma.role.findUnique({
            where: { cuid: id },
            select: {
                id: true,
                cuid: true,
                name: true,
                description: true
            }
        });

        return role
    }

    async create(roleData:Role):Promise<Role> {
        const newRole = await this.prisma.role.create({ data: roleData });

        await this.disconnectDatabase();
        return newRole;
    }

    async update(id:string, roleData:Partial<Role>):Promise<Role> {
        const newRole = await this.prisma.role.update({ data: roleData, where: { cuid: id } });

        await this.disconnectDatabase();
        return newRole;
    }

    async delete(id:string):Promise<void> {
        await this.prisma.role.delete({ where: { cuid: id } });
        await this.disconnectDatabase();
    }

    private disconnectDatabase() { this.prisma.$disconnect() }
}