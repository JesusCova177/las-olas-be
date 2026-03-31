import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MailService } from './mail.service';

import { ContactMailDto } from 'src/mail/dto/contact-mail.dto';
import { ReserveMailDto } from './dto/reserve-mail.dto';

@Controller('/')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @HttpCode(204)
  legacyMail(@Body() dto: ContactMailDto) {
    return this.mailService.sendContactMail(dto);
  }

  // @Post('/contact')
  // @HttpCode(204)
  // contactMail(@Body() dto: ContactMailDto) {
  //   return this.mailService.sendContactMail(dto);
  // }

  // @Post('/suggestion')
  // @HttpCode(204)
  // suggestionMail(@Body() dto: ContactMailDto) {
  //   return this.mailService.sendContactMail(dto);
  // }

  @Post('/reserve')
  @HttpCode(204)
  reserveMail(@Body() dto: ReserveMailDto) {
    console.log(dto);
    return this.mailService.sendContactMail(dto);
  }
}
