import { User } from '../user/user';
import { Category } from '../category/category';

export class Todo {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly owner: User,
    public readonly category: Category | null,
    public readonly completed: boolean,
  ) {}
}
