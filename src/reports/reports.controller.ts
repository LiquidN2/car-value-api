import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';

import { CreateReportDto } from './dtos/create-report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
// @Serialize(ReportDto)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return await this.reportsService.changeApproval(
      parseInt(id),
      body.approved,
    );
  }

  @Get('/:id')
  async findReport(@Param('id') id: string) {
    const report = await this.reportsService.findOne(parseInt(id));
    if (!report) {
      throw new NotFoundException('report not found');
    }

    return report;
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
