import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUseCases } from '../../application/auth/auth.use-cases';
import { AuthResponseDto, LoginDto, SignUpDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthUseCases,
    private readonly jwt: JwtService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    const user = await this.auth.signUp({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email.asString,
    });
    return { accessToken: token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.auth.login({
      email: dto.email,
      password: dto.password,
    });
    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email.asString,
    });
    return { accessToken: token };
  }
}
