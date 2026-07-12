import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { Prisma } from '@voguify/database';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  // Public catalog is published-only; the admin dashboard passes ?all=1.
  @Get()
  findAll(@Query('all') all?: string) {
    return this.products.findAll(all === '1' || all === 'true');
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.products.findOne(idOrSlug);
  }

  // Admin dashboard: create / edit / delete. (Authorization is enforced in the
  // Next.js server actions that call these.)
  @Post()
  create(@Body() data: Prisma.ProductCreateInput) {
    return this.products.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ProductUpdateInput) {
    return this.products.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.products.remove(id);
  }
}
