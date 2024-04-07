import { UnauthorizedError, InternalServerError } from 'routing-controllers';
import { generateJWT } from '../utils/GenerateJWT';
import { Service } from 'typedi';
import { SignupDto, LoginDto } from './dtos';
import { compare, hash } from '../utils/Hash';
import { UserService } from '../user/user.service';

@Service()
export class AuthService {
    constructor(private userService: UserService) {}

    async signup(signUpDto: SignupDto) {
        try {
            const { password } = signUpDto;
            
            // Hash password
            const hashedPassword = await hash(password);

            // get super admin id
            const superAdmin = await this.userService.findFirst({ roles: { some: { role: { is: { name: 'admin' } }} } });
            
            // Create new user
            const userRole = { create: {role: { connect: {id: 1} },  assignedBy: superAdmin?.id } }
            const userData = { ...signUpDto, password: hashedPassword, roles: userRole };
            
            delete userData.passwordConfirm;
            const newUser = await this.userService.create(userData);
            // Generate JWT
            const token = await generateJWT(newUser.cuid);
            return { ok : 1, token: `Bearer ${token}` };
        } catch (error:any) {
            throw new InternalServerError(error);
        }
    }
    
    async login(loginDto: LoginDto): Promise<{}> {
        try {
            const { email, password } = loginDto;

            // Find user by email and get their id, email and password
            const user: any = await this.userService.getByEmail(email)

            // User doesn't exist
            if (!user) throw new UnauthorizedError('Invalid credentials');

            // Verify password hash
            const verifyPassword = await compare(password, user.password);
            
            // Wrong password
            if (!verifyPassword) throw new UnauthorizedError('Invalid credentials');

            
            // Generate JWT
            const token = await generateJWT(user.cuid);
            return { ok: 1, token: `Bearer ${token}` };
    } catch (error) {
        throw new InternalServerError(`Error ${error}`);
    }
  }
}
