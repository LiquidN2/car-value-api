import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Controller('reports')
export class ReportsController {
  @Get()
  @UseGuards(AuthGuard)
  listReports() {
    return 'List reports';
  }
}
