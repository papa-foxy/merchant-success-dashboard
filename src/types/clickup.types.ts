export interface ClickUpTask {
    id: string;
    name: string;
    status: {
      status: string;
      color: string;
    };
    date_created: string;
    date_updated: string;
    assignees: Array<{
      id: number;
      username: string;
      email: string;
    }>;
  }
  
  export interface ClickUpListResponse {
    tasks: ClickUpTask[];
  }