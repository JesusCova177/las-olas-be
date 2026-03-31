import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { EmailType } from '../enums';

export class MailDto {
  @IsString()
  @Length(2, 120)
  readonly name: string;

  @IsString()
  @Length(2, 120)
  readonly lastname: string;

  @IsEnum(EmailType)
  readonly type: EmailType;

  @IsString()
  @IsEmail()
  readonly email: string;
}
