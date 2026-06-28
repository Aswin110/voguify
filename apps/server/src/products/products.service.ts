import { Injectable } from '@nestjs/common';
import type { Prisma } from '@voguify/database';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(idOrSlug: string) {
    return this.prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
  }

  create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }
}
