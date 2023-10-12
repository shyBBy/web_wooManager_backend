import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLastChangeDto } from './dto/create-last-changes.dto';
import { LastChangeEntity } from './entities/lastChange.entity';
import { v4 as uuid } from 'uuid';
import { createResponse } from '../utils/createResponse';
import { GetPaginatedListOfAllLastChangesResponse } from 'types';
import { currentDate } from '../utils/currentDate';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}

  async createChange(createLastChangeDto: CreateLastChangeDto) {
    const { title, description } = createLastChangeDto;

    try {
      const change = new LastChangeEntity();
      change.id = uuid();
      change.title = title;
      change.description = description;
      change.addedByUser = 'Administrator';
      change.addedDate = currentDate();
      await change.save();
      return createResponse(true, 'Pomyślnie dodano nową zmianę', 200);
    } catch (e) {
      throw new HttpException(
        {
          message: `Coś poszło nie tak, spróbuj później.`,
          isSuccess: false,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getAllPaginatedChanges(
    page = 1,
    sort: string,
    order: 'ASC' | 'DESC',
  ): Promise<GetPaginatedListOfAllLastChangesResponse> {
    const maxOnPage = 5;
    const filterValues = {};
    if (typeof sort === 'undefined') {
      try {
        const [lastChanges, totalEntitiesCount] =
          await LastChangeEntity.findAndCount({
            where: filterValues,
            skip: maxOnPage * (page - 1),
            take: maxOnPage,
          });
        const pagesCount = Math.ceil(totalEntitiesCount / maxOnPage);
        if (!lastChanges.length) {
          return {
            lastChanges: [],
            pagesCount: 0,
            resultsCount: 0,
          };
        }
        return {
          lastChanges,
          pagesCount,
          resultsCount: totalEntitiesCount,
        };
      } catch (e) {
        console.log(e);
        throw new HttpException(
          {
            message: `Cos poszlo nie tak, spróbuj raz jeszcze.`,
            isSuccess: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
