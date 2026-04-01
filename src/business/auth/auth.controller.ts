import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with predefined user credentials' })
  @ApiOkResponse({
    description: 'JWT access token',
    type: LoginResponseDto,
  })
  login(@Body() payload: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(payload.username, payload.password);
  }
}
