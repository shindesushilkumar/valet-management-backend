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

  async create(
    dto: CreateCarDto,
    user: { id: number; role: string },
  ): Promise<CarResponseDto> {
    if (user.role === 'driver') {
      throw new Error('Forbidden');
    }
    const car = this.carsRepository.create({
      make: dto.make.trim(),
      model: dto.model.trim(),
      registrationNumber: dto.registrationNumber.trim(),
      color: dto.color.trim(),
      user: { id: user.id } as User,
    });
    const savedCar = await this.carsRepository.save(car);
    const carWithUser = await this.carsRepository.findOne({
      where: { id: savedCar.id },
      relations: { user: true },
    });
    return this.toResponse(carWithUser!);
  }

  async findAll(user: { id: number; role: string }): Promise<CarResponseDto[]> {
    if (user.role === 'admin') {
      const cars = await this.carsRepository.find({
        relations: { user: true },
      });
      return cars.map((car) => this.toResponse(car));
    }
    const cars = await this.carsRepository.find({
      where: { user: { id: user.id } },
      relations: { user: true },
    });
    return cars.map((car) => this.toResponse(car));
  }

  async update(
    id: number,
    dto: UpdateCarDto,
    user: { id: number; role: string },
  ): Promise<CarResponseDto | null> {
    if (user.role === 'driver') {
      throw new Error('Forbidden');
    }
    const car = await this.carsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!car) {
      return null;
    }
    if (user.role !== 'admin' && car.user.id !== user.id) {
      return null;
    }
    if (dto.make !== undefined) {
      car.make = dto.make.trim();
    }
    if (dto.model !== undefined) {
      car.model = dto.model.trim();
    }
    if (dto.registrationNumber !== undefined) {
      car.registrationNumber = dto.registrationNumber.trim();
    }
    if (dto.color !== undefined) {
      car.color = dto.color.trim();
    }
    await this.carsRepository.save(car);
    return this.toResponse(car);
  }

  async remove(
    id: number,
    user: { id: number; role: string },
  ): Promise<boolean> {
    if (user.role === 'driver') {
      throw new Error('Forbidden');
    }
    const car = await this.carsRepository.findOne({
      where: { id },
    });
    if (!car) {
      return false;
    }
    if (user.role !== 'admin' && car.user.id !== user.id) {
      return false;
    }
    await this.carsRepository.softDelete(id);
    return true;
  }

  private toResponse(car: Car): CarResponseDto {
    return {
      id: car.id,
      make: car.make,
      model: car.model,
      registrationNumber: car.registrationNumber,
      color: car.color,
      userId: car.user.id,
      createdAt: car.createdAt,
      updatedAt: car.updatedAt,
    };
  }
}
