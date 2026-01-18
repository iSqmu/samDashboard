export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  due_hour?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  due_hour: string;
  updated_at?: string;
}

export interface NewTaskProps {
  onClose: () => void;
  onSubmit: (task: any) => void;
}
