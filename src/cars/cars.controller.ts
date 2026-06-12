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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CarsService } from './cars.service';
import { CarResponseDto } from './dto/car-response.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @HttpCode(201)
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateCarDto,
    @CurrentUser() user: { id: number },
  ): Promise<CarResponseDto> {
    return this.carsService.create(dto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: { id: number },
  ): Promise<CarResponseDto[]> {
    return this.carsService.findAll(user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCarDto,
    @CurrentUser() user: { id: number },
  ): Promise<CarResponseDto> {
    const car = await this.carsService.update(+id, dto, user.id);
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: number },
  ): Promise<void> {
    const result = await this.carsService.remove(+id, user.id);
    if (!result) {
      throw new NotFoundException('Car not found');
    }
  }
}
