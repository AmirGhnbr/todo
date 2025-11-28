export interface CreateTodoCommand {
  title: string;
  description?: string | null;
  ownerId: string;
  categoryId?: string | null;
}
