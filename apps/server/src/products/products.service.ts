import { Injectable } from '@nestjs/common';
import type { Prisma } from '@voguify/database';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public catalog: published only. Admin passes includeUnpublished=true. */
  findAll(includeUnpublished = false) {
    return this.prisma.product.findMany({
      where: includeUnpublished ? undefined : { published: true },
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

  update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
