import {SearchInProject} from '../../../../domain/useCases/project/SearchInProject';
import {container} from '../../container';

const useCase: SearchInProject = container.get(SearchInProject);

export function searchInProject(text: string): Promise<void> {
    return useCase.execute(text);
}