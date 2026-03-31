import {
  IsDateString,
  IsEnum,
  IsInt,
  // IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MailDto } from 'src/common/dto/mail.dto';

import { EmailType, EntityType, ReservationType } from 'src/common/enums';

export class ReserveMailDto extends MailDto {
  @Transform(() => EmailType.NewReservation)
  readonly type: EmailType = EmailType.NewReservation;

  @IsString()
  // @IsPhoneNumber()
  readonly phone: string;

  @IsDateString()
  readonly dateOfBirth: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  readonly numberOfAdults: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  readonly numberOfChildren: number = 0;

  @IsDateString()
  readonly dateOfEntry: string;

  @IsDateString()
  readonly dateOfDeparture: string;

  @IsString()
  readonly city: string;

  @IsString()
  readonly nationality: string;

  @IsEnum(EntityType)
  readonly entityType: EntityType;

  @ValidateIf((dto: ReserveMailDto) => dto.entityType === EntityType.Corporation)
  @Transform(({ value, obj }) =>
    obj.entityType === EntityType.Corporation ? value : null,
  ) // Remove property if entityType is Corp to prevent showing it on the email template.
  @IsString()
  readonly companyName?: string;

  @ValidateIf((dto: ReserveMailDto) => dto.entityType === EntityType.Corporation)
  @Transform(({ value, obj }) =>
    obj.entityType === EntityType.Corporation ? value : null,
  ) // Remove property if entityType is Corp to prevent showing it on the email template.
  @IsString()
  readonly jobTitle?: string;

  /**
   * Propiedades Respectivas al Tipo de Reservación
   */
  @IsEnum(ReservationType)
  readonly reservationType: ReservationType;
}
