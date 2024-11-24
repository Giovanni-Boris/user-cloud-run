import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserResModel {
  @IsNotEmpty()
  id!: number; // ID obligatorio

  @IsString()
  @IsNotEmpty()
  username!: string; // El nombre de usuario debe ser un string no vacío

  @IsString()
  @IsNotEmpty()
  password!: string; // La contraseña debe ser un string no vacío (asegúrate de cifrarla)

  @IsEmail()
  @IsOptional()
  email?: string; // Validación para correos electrónicos válidos, opcional
}
