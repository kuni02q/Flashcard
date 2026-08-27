export interface UpdateGroupRequest {
  name: string;
  description: string | null;
  visibility: 'PRIVATE' | 'PUBLIC';
}
