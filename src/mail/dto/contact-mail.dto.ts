import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  // IsPhoneNumber,
  IsString,
  Length,
  Max,
  Min,
  NotEquals,
  ValidateIf,
} from 'class-validator';
import { EmailType } from 'src/common/enums';
import { MailDto } from 'src/common/dto/mail.dto';

export class ContactMailDto extends MailDto {
  // <-- MOVED TO INHERIT FROM MAIL.DTO -->
  // @IsString()
  // @Length(2, 120)
  // readonly name: string;

  // @IsString()
  // @Length(2, 120)
  // readonly lastname: string;

  // @IsString()
  // @IsEmail()
  // readonly email: string;

  // @IsEnum(EmailType)
  // readonly type: EmailType;
  // <-------------------------->

  // TODO: To check if works correctly.
  @IsEnum(EmailType)
  @NotEquals(EmailType.NewReservation)
  readonly type: EmailType;

  /** VALIDACIONES DE TIPO MIXTO */
  @ValidateIf(
    (dto: ContactMailDto) => dto.type === EmailType.Contact,
    // || (dto.type === EmailType.ContactWeb && dto.phone && dto.phone !== ''),
  )
  @IsString()
  // @IsPhoneNumber() // Validar `phone` si el tipo de email es Contact o NewClient.
  readonly phone: string;

  /** VALIDACIONES SI ES SUGERENCIA */
  @ValidateIf(
    (dto: ContactMailDto) =>
      dto.type === EmailType.Suggestion || dto.type === EmailType.ContactWeb,
  )
  @IsString()
  @Length(4, 512)
  readonly message: string;

  @ValidateIf((dto: ContactMailDto) => dto.type === EmailType.Suggestion)
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  readonly calification: number;

  // /** Campos Extras */
  // // @ValidateIf((dto: ContactMailDto) => dto.type === EmailType.Contact)
  // @IsOptional()
  // @IsEnum(Alianzas)
  // readonly alianza: Alianzas;
}
