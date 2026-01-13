import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DishesService } from './dishes.service';

@ApiTags('dishes')
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}
}

