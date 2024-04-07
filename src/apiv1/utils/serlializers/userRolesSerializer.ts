import { BadRequestError } from "routing-controllers";
import { Role } from "../../interfaces/role";
import { RoleService } from "../../roles/role.service";
import { Prisma } from "@prisma/client";
import { UserService } from "../../user/user.service";
import { IUser } from "../../interfaces/IUser";

export async function serializeUserRoles(userId: string, roles: string[]): Promise<Prisma.UserRoleCreateWithoutUserInput[]> {
    const roleService:RoleService = new RoleService();
    const userService:UserService = new UserService();

    const newRoles:Prisma.UserRoleCreateWithoutUserInput[] = [];
    for (const roleId of roles) {
        const user:Partial<IUser | null> = await userService.findByCuid(userId);
        const role:Role | null = await roleService.findById(roleId);
        if (role) {
            if (user) {
                const newRole:Prisma.UserRoleCreateWithoutUserInput = {role: {connect: { id: role?.id }}, assignedBy: user.id}
                newRoles.push(newRole);
            }

            else throw new BadRequestError('user not found');
        }

        else throw new BadRequestError('role not found');
    };

    return newRoles
}