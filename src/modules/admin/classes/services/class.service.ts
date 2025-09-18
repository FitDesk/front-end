import { fitdeskApi } from '@/core/api/fitdeskApi';
import type { Class, CreateClassDTO, UpdateClassDTO } from '../types/class';

export class ClassService {
  private static readonly ENDPOINT = '/classes';

  static async getAll(): Promise<Class[]> {
    const { data } = await fitdeskApi.get<Class[]>(this.ENDPOINT);
    return data;
  }

  static async getById(id: string): Promise<Class> {
    const { data } = await fitdeskApi.get<Class>(`${this.ENDPOINT}/${id}`);
    return data;
  }

  static async create(classData: CreateClassDTO): Promise<Class> {
    const { data } = await fitdeskApi.post<Class>(this.ENDPOINT, classData);
    return data;
  }

  static async update({ id, ...updateData }: UpdateClassDTO): Promise<Class> {
    const { data } = await fitdeskApi.patch<Class>(`${this.ENDPOINT}/${id}`, updateData);
    return data;
  }

  static async delete(id: string): Promise<void> {
    await fitdeskApi.delete(`${this.ENDPOINT}/${id}`);
  }

  
  static async getTrainers(): Promise<{ id: string; name: string }[]> {
    const { data } = await fitdeskApi.get<{ id: string; name: string }[]>('/trainers');
    return data;
  }
}
