import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'User name é obrigatório' })
  name: string;

  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;
}
