import {injectable} from 'inversify';
import {ProjectState} from '../../states/ProjectState';

@injectable()
export class SearchInProject {

    constructor(
        private projectState: ProjectState,
    ) {
    }

    execute(text: string): Promise<void> {
        this.projectState.setProjectSearchText(text);
        return Promise.resolve();
    }
}