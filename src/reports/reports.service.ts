import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return await this.repo.save(report);
  }

  async findOne(id: number) {
    if (!id) return null;
    return await this.repo.findOne(id);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOne(id);

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return await this.repo.save(report);
  }

  createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = estimateDto;

    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN - 5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN - 5 AND 5', { lat })
      .andWhere('year - :year BETWEEN - 3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawMany();
  }
}
