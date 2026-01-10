import { ApplicationStackParamList } from '../navigation/navigation';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ApplicationStackParamList {}
  }
}
