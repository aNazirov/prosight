import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  getStatus(): { status: string; timestamp: number } {
    return {
      status: 'ok',
      timestamp: Date.now(),
    };
  }

  async getStatusV2(): Promise<{
    status: string;
    message: string;
    timestamp: number;
  }> {
    try {
      await this.dataSource.query('SELECT 1;');

      return {
        status: 'ok',
        message: 'All services are healthy',
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: (error as Error).message,
        timestamp: Date.now(),
      };
    }
  }
}
