import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CarsService } from './cars.service';
import { CarResponseDto } from './dto/car-response.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @HttpCode(201)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  async create(
    @Body() dto: CreateCarDto,
    @CurrentUser() user: { id: number; role: string },
  ): Promise<CarResponseDto> {
    return this.carsService.create(dto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: { id: number; role: string },
  ): Promise<CarResponseDto[]> {
    return this.carsService.findAll(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCarDto,
    @CurrentUser() user: { id: number; role: string },
  ): Promise<CarResponseDto> {
    const car = await this.carsService.update(+id, dto, user);
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @Roles('owner', 'admin')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number; role: string },
  ): Promise<void> {
    const result = await this.carsService.remove(+id, user);
    if (!result) {
      throw new NotFoundException('Car not found');
    }
  }
}
