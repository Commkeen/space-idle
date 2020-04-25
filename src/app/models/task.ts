import { TaskDefinition } from '../staticData/taskDefinitions';

export class Task {
  public definition: TaskDefinition;
  public name: string;
  public progress: number;
  public needed: number;
}

export class SurveyTask extends Task {
  public planetId: number;
  public regionId: number;
}

export class ResearchTask extends Task {
  public discipline: string;
}

export class FeatureTask extends Task {
  public planetId: number;
  public regionId: number;
  public featureId: number;

}
