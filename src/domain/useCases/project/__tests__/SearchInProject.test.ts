import 'jest';
import 'reflect-metadata';
import {ProjectState} from "../../../states/ProjectState";
import {SearchInProject} from '../SearchInProject';

let useCase: SearchInProject;
let projectState: ProjectState;
let search: string;

beforeEach(() => {
    projectState = new ProjectState();
    useCase = new SearchInProject(projectState);
    search = 'foo';
});

describe('SearchInProject', () => {
    it('searches files in current project', () => {

        return useCase.execute(search)
            .then(() => {
                expect(projectState.projectSearchText).toBe(search);
            });
    });
});
