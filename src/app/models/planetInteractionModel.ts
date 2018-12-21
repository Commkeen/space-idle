import { ResourceCollection } from './resource';

export class PlanetInteractionModel {
    planetInstanceId: number;
    structures: Structure[];
    localResources: ResourceCollection;
}

export class Structure {
    name: string;
    amount: number;
    canBuild: boolean;
}

export class FeatureInteraction {
    featureInstanceId: number;
    discovered: boolean;
    surveyed: boolean;
    exploited: boolean;
}
