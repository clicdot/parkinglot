import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { SpacesEntity } from '../models/spaces.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(SpacesEntity)
    private readonly repository: Repository<SpacesEntity>
  ) {}

  async getSpaces(): Promise<SpacesEntity[]> {
    const data = await this.repository.find();
    data.map((i) => {
      i.spaces = JSON.parse(i.spaces);
      return i;
    });
    return data;
  }

  async getSpace(building: string, unit: number) {
    const data = await this.repository.find();
    data.map((i) => {
      i.spaces = JSON.parse(i.spaces);
      return i;
    });

    const u: any = this.traverse(data, building, unit);

    if (u) {
      await this.repository.update(
        {
          id: u.id
        },
        u
      );

      const updated = await this.repository.find();
      updated.map((i) => {
        i.spaces = JSON.parse(i.spaces);
        return i;
      });

      return updated;
    } else {
      return new Promise((resolve, reject) => {
        try {
          reject(new BadRequestException('Parking lots full!'));
        } catch (error) {
          reject(error.message);
        }
      });
    }
  }

  async update(body) {
    body.map((i) => {
      i.spaces = JSON.stringify(i.spaces);
      return i;
    });

    for (let x = 0; x < body.length; x++) {
      await this.repository.update(
        {
          id: body[x].id
        },
        body[x]
      );
    }
    const data = await this.repository.find();
    data.map((i) => {
      i.spaces = JSON.parse(i.spaces);
      return i;
    });
    return data;
  }

  traverse(data, bldg, unit) {
    const traverse = unit % 2 ? 'left' : 'right';
    const n = bldg.charCodeAt(0) - 65;
    const arr = data.map((i) => {
      return i.spaces;
    });
    const sequence = this.getSequence(n);
    let found = false;
    let foundSpace = {
      spaces: null,
      bldg: null
    };
    //
    for (let x = 0; x < sequence.length; x++) {
      if (!found) {
        found = this[traverse](arr[sequence[x]]);
        foundSpace = {
          spaces: found,
          bldg: (sequence[x] + 10).toString(36).toUpperCase()
        };
      }
    }

    const nData = data.find((i) => i.building === foundSpace.bldg);
    nData.spaces = JSON.stringify(nData.spaces);

    return foundSpace.spaces ? nData : foundSpace.spaces;
  }

  // Gets first empty spot from left side
  left(array) {
    let found = false;
    let x = 0;

    do {
      const key: any = Object.keys(array[x]);
      if (!found && array[x][key] === 0) {
        array[x][key] = 1;
        found = true;
      }
      x++;
    } while (x < array.length);

    return found ? array : found;
  }

  // Gets first empty spot from right side
  right(array) {
    let found = false;
    let x = array.length - 1;

    do {
      const key: any = Object.keys(array[x]);
      if (!found && array[x][key] === 0) {
        array[x][key] = 1;
        found = true;
      }
      x--;
    } while (x >= 0);
    return found ? array : found;
  }

  getSequence(target) {
    let alternate = true;
    let x = 0;
    let y = 1;
    let z = target;
    let seq = [];
    do {
      if (alternate) {
        z = z - y;
        z > -1 ? seq.push(z) : null;
      } else {
        z = z + y;
        z < 6 ? seq.push(z) : null;
      }
      y++;
      alternate = !alternate;
      x++;
    } while (x < 12);
    seq = [target, ...seq.filter((x, i) => i === seq.indexOf(x))];
    return seq;
  }
}
