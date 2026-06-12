import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { User } from '../users/user.entity';
import { CarResponseDto } from './dto/car-response.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
  ) {}

  async create(dto: CreateCarDto, userId: number): Promise<CarResponseDto> {
    const car = this.carsRepository.create({
      carNumber: dto.carNumber.trim(),
      user: { id: userId } as User,
    });
    const savedCar = await this.carsRepository.save(car);
    const carWithUser = await this.carsRepository.findOne({
      where: { id: savedCar.id },
      relations: { user: true },
    });
    return this.toResponse(carWithUser!);
  }

  async findAll(userId: number): Promise<CarResponseDto[]> {
    const cars = await this.carsRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    return cars.map((car) => this.toResponse(car));
  }

  async update(
    id: number,
    dto: UpdateCarDto,
    userId: number,
  ): Promise<CarResponseDto | null> {
    const car = await this.carsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { user: true },
    });
    if (!car) {
      return null;
    }
    if (dto.carNumber !== undefined) {
      car.carNumber = dto.carNumber.trim();
    }
    await this.carsRepository.save(car);
    return this.toResponse(car);
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const car = await this.carsRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!car) {
      return false;
    }
    await this.carsRepository.softDelete(id);
    return true;
  }

  private toResponse(car: Car): CarResponseDto {
    return {
      id: car.id,
      carNumber: car.carNumber,
      userId: car.user.id,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
    };
  }
}
