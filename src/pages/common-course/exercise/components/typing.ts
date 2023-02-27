import { API } from '@/common/entity/typings';

export type IProps = {
  onSubmit?: (values: API.ExerciseListParams) => void;
  onCancel: (flag?: boolean, values?: API.ExerciseListParams) => void;
  sceneList: API.SceneListRecord[];
  graphData?: any;
  //create
  courseId?: number;
  createModalVisible?: boolean;
  //update
  updateModalVisible?: boolean;
  values?: Partial<API.ExerciseListParams>;
}