import {injectable} from 'inversify';
import {ProjectState} from '../../states/ProjectState';
import {SchemaFile} from "../../states/objects/fileTree/SchemaFile";

@injectable()
export class ExportRewards {

    constructor(
        private projectState: ProjectState,
    ) {
    }

    execute(projectFile: string): Promise<void> {
        console.log(projectFile);
        if (!this.projectState.hasProject) {
            console.warn("Cant export rewards, no project selected")
            return Promise.resolve();
        }

        let rewards: string[] = [];

        this.projectState.project.schemaTree.forEachFile((file: SchemaFile) => {
            if (file.isReward) {
                rewards.push(file.basename);
            }
        });

        if(rewards.length === 0) {
            console.warn("Cant export rewards, no file marked as reward")
            return Promise.resolve();
        }

        console.log(rewards);

        return Promise.resolve();
    }
}
