import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Prisma } from '@voguify/database';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAll() {
    return this.products.findAll();
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.products.findOne(idOrSlug);
  }

  // Used by the (future) admin dashboard to add products.
  @Post()
  create(@Body() data: Prisma.ProductCreateInput) {
    return this.products.create(data);
  }
}
