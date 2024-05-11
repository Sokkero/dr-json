import {reaction} from 'mobx';
import {ProjectState} from '../../../domain/states/ProjectState';
import {container} from '../container';
import {SchemaFile} from "../../../domain/states/objects/fileTree/SchemaFile";
import {changeSettingRewardDirs} from "../actions/settings/changeSettingRewardDirs";

// remember the reward files, so the states will be the same
// after closing and opening the application again.
const projectState: ProjectState = container.get(ProjectState);

export function rememberRewardFilesState() {
    reaction(
        () => {
            if (!projectState.hasProject) {
                return null;
            }

            let rewards: string[] = [];

            projectState.project.schemaTree.forEachFile((file: SchemaFile) => {
                if (file.isReward) {
                    rewards.push(file.basename);
                }
            });

            return rewards;
        },
        (rewards: string[] | null) => {
            if (rewards != null) {
                changeSettingRewardDirs(rewards);
            }
        },
        {
            delay: 1000,
        },
    );
}

